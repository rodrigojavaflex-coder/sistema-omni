import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user.service';
import { VistoriaService } from '../../services/vistoria.service';
import { AuthService } from '../../services/auth.service';
import {
  IrregularidadeAudioItem,
  IrregularidadeAudioResumo,
  IrregularidadeImagemItem,
  IrregularidadeImagemResumo,
  IrregularidadeResumo,
  VistoriaResumo,
} from '../../models/vistoria.model';
import { Usuario } from '../../models/usuario.model';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { MotoristaAutocompleteComponent } from '../shared/motorista-autocomplete/motorista-autocomplete.component';
import { UsuarioAutocompleteComponent } from '../shared/usuario-autocomplete/usuario-autocomplete.component';

@Component({
  selector: 'app-vistoria-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VeiculoAutocompleteComponent,
    MotoristaAutocompleteComponent,
    UsuarioAutocompleteComponent,
  ],
  templateUrl: './vistoria-list.html',
  styleUrls: ['./vistoria-list.css'],
})
export class VistoriaListComponent implements OnInit {
  private vistoriaService = inject(VistoriaService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  loading = false;
  error = '';
  drawerOpen = false;
  loadingFilters = false;
  usuariosLoaded = false;

  vistorias: VistoriaResumo[] = [];
  filtered: VistoriaResumo[] = [];
  paged: VistoriaResumo[] = [];
  usuarios: Usuario[] = [];
  selectedVistoria: VistoriaResumo | null = null;
  irregularidades: IrregularidadeResumo[] = [];
  imagensPorIrregularidade: Record<string, IrregularidadeImagemItem[]> = {};
  audiosPorIrregularidade: Record<string, IrregularidadeAudioItem[]> = {};
  showImageModal = false;
  selectedImage: { nomeArquivo: string; dadosBase64: string } | null = null;

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'EM_ANDAMENTO', label: 'Em andamento' },
    { value: 'FINALIZADA', label: 'Finalizada' },
    { value: 'CANCELADA', label: 'Cancelada' },
  ];

  currentPage = 1;
  itemsPerPage = 100;
  totalPages = 0;

  filterForm = this.fb.group({
    veiculoId: [''],
    motoristaId: [''],
    status: [''],
    usuarioId: [''],
    dataInicio: [''],
    dataFim: [''],
  });

  ngOnInit(): void {
    this.loadingFilters = true;
    this.loading = true;
    this.loadUsuarios();

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadUsuarios(): void {
    this.fetchUsuariosPage(1, []);
  }

  private fetchUsuariosPage(page: number, acumulado: Usuario[]): void {
    this.userService.getUsers({ page, limit: 100 }).subscribe({
      next: (response) => {
        const data = response?.data ?? [];
        const meta = response?.meta;
        const nextAccum = acumulado.concat(data);
        if (meta?.hasNextPage) {
          this.fetchUsuariosPage(page + 1, nextAccum);
          return;
        }
        this.usuarios = nextAccum;
        this.usuariosLoaded = true;
        this.checkFiltersLoaded();
      },
      error: () => {
        this.usuarios = acumulado;
        this.usuariosLoaded = true;
        this.checkFiltersLoaded();
      },
    });
  }

  private checkFiltersLoaded(): void {
    if (!this.loadingFilters) return;
    if (!this.usuariosLoaded) return;
    this.loadingFilters = false;
    this.loadVistorias();
  }

  private loadVistorias(): void {
    const { status, usuarioId } = this.filterForm.value;
    this.vistoriaService
      .listar({
        status: status || undefined,
        idusuario: usuarioId || undefined,
      })
      .subscribe({
        next: (items) => {
          this.vistorias = items ?? [];
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar vistorias.';
          this.loading = false;
        },
      });
  }

  applyFilters(): void {
    const {
      veiculoId,
      motoristaId,
      status,
      usuarioId,
      dataInicio,
      dataFim,
    } = this.filterForm.value;

    const filtered = (this.vistorias ?? []).filter((vistoria) => {
      const matchesVeiculo = !veiculoId || vistoria.idVeiculo === veiculoId;
      const matchesMotorista = !motoristaId || vistoria.idMotorista === motoristaId;
      const matchesStatus = !status || vistoria.status === status;
      const matchesUsuario = !usuarioId || vistoria.idUsuario === usuarioId;
      const matchesData = this.matchesDateRange(vistoria.datavistoria, dataInicio, dataFim);
      return (
        matchesVeiculo &&
        matchesMotorista &&
        matchesStatus &&
        matchesUsuario &&
        matchesData
      );
    });
    this.filtered = filtered;
    this.currentPage = 1;
    this.applyPagination();
  }

  applyPagination(): void {
    const total = this.filtered.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.itemsPerPage));
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paged = this.filtered.slice(start, end);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.applyPagination();
  }

  clearFilters(): void {
    this.filterForm.reset({
      veiculoId: '',
      motoristaId: '',
      status: '',
      usuarioId: '',
      dataInicio: '',
      dataFim: '',
    });
  }

  openDrawer(vistoria: VistoriaResumo): void {
    this.selectedVistoria = vistoria;
    this.drawerOpen = true;
    this.irregularidades = [];
    this.imagensPorIrregularidade = {};
    this.audiosPorIrregularidade = {};
    this.carregarDetalheIrregularidades(vistoria.id);
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.selectedVistoria = null;
    this.showImageModal = false;
    this.selectedImage = null;
  }

  private carregarDetalheIrregularidades(vistoriaId: string): void {
    forkJoin({
      irregularidades: this.vistoriaService.listarIrregularidades(vistoriaId).pipe(
        catchError(() => of([] as IrregularidadeResumo[])),
      ),
      imagens: this.vistoriaService.listarIrregularidadesImagens(vistoriaId).pipe(
        catchError(() => of([] as IrregularidadeImagemResumo[])),
      ),
      audios: this.vistoriaService.listarIrregularidadesAudios(vistoriaId).pipe(
        catchError(() => of([] as IrregularidadeAudioResumo[])),
      ),
    }).subscribe({
      next: ({ irregularidades, imagens, audios }) => {
        this.irregularidades = this.sortIrregularidades(irregularidades ?? []);
        this.imagensPorIrregularidade = (imagens ?? []).reduce(
          (acc, g) => {
            acc[g.idirregularidade] = g.imagens ?? [];
            return acc;
          },
          {} as Record<string, IrregularidadeImagemItem[]>,
        );
        this.audiosPorIrregularidade = (audios ?? []).reduce(
          (acc, g) => {
            acc[g.idirregularidade] = g.audios ?? [];
            return acc;
          },
          {} as Record<string, IrregularidadeAudioItem[]>,
        );
      },
    });
  }

  private sortIrregularidades(items: IrregularidadeResumo[]): IrregularidadeResumo[] {
    return [...items].sort((a, b) => {
      const c1 = this.normalizeText(a.nomeArea).localeCompare(
        this.normalizeText(b.nomeArea),
        'pt-BR',
      );
      if (c1 !== 0) return c1;
      const c2 = this.normalizeText(a.nomeComponente).localeCompare(
        this.normalizeText(b.nomeComponente),
        'pt-BR',
      );
      if (c2 !== 0) return c2;
      return this.normalizeText(a.descricaoSintoma).localeCompare(
        this.normalizeText(b.descricaoSintoma),
        'pt-BR',
      );
    });
  }

  getUsuarioNome(idUsuario?: string): string {
    if (!idUsuario) return '-';
    const user = this.usuarios.find((u) => u.id === idUsuario);
    return user?.nome ?? '-';
  }

  getStatusLabel(status?: string): string {
    const option = this.statusOptions.find((opt) => opt.value === status);
    return option?.label ?? status ?? '-';
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'EM_ANDAMENTO':
        return 'status-andamento';
      case 'FINALIZADA':
        return 'status-finalizada';
      case 'CANCELADA':
        return 'status-cancelada';
      default:
        return 'status-default';
    }
  }

  formatNumero(value?: number): string {
    if (value === null || value === undefined) return '-';
    return Number(value).toLocaleString('pt-BR');
  }

  formatTempo(value?: number): string {
    if (value === null || value === undefined) return '-';
    return `${value} min`;
  }

  getIrregularidadeLinhaPrincipal(ir: IrregularidadeResumo): string {
    const area = ir.nomeArea?.trim() || 'Área';
    const comp = ir.nomeComponente?.trim() || 'Componente';
    const sint = ir.descricaoSintoma?.trim() || 'Sintoma';
    return `${area} · ${comp} · ${sint}`;
  }

  formatDuracaoAudio(ms?: number | null): string {
    if (ms == null || Number.isNaN(ms)) return '';
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}m ${r}s` : `${r}s`;
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  getImagemPreview(base64: string): string {
    return `data:image/jpeg;base64,${base64}`;
  }

  getAudioSrc(a: IrregularidadeAudioItem): string {
    const mime = a.mimeType?.trim() || 'audio/mpeg';
    return `data:${mime};base64,${a.dadosBase64}`;
  }

  openImage(nomeArquivo: string, dadosBase64: string): void {
    this.selectedImage = { nomeArquivo, dadosBase64 };
    this.showImageModal = true;
  }

  closeImage(): void {
    this.showImageModal = false;
    this.selectedImage = null;
  }

  printVistoria(): void {
    if (!this.selectedVistoria) return;
    const doc = window.open('', '_blank', 'width=1024,height=768');
    if (!doc) return;

    const printDate = new Date().toLocaleString('pt-BR');
    const dataVistoria = new Date(this.selectedVistoria.datavistoria).toLocaleString('pt-BR');
    const usuario = this.getUsuarioNome(this.selectedVistoria.idUsuario);
    const usuarioImpressao =
      this.authService.getCurrentUser()?.nome ||
      this.authService.getCurrentUser()?.email ||
      usuario;
    const veiculoDescricao = this.selectedVistoria.veiculo?.descricao ?? '-';
    const placa = this.selectedVistoria.veiculo?.placa ?? '-';
    const motoristaNome = this.selectedVistoria.motorista?.nome ?? '-';
    const motoristaMatricula = this.selectedVistoria.motorista?.matricula ?? '-';
    const bateriaTexto =
      this.selectedVistoria.porcentagembateria === null ||
      this.selectedVistoria.porcentagembateria === undefined
        ? '-'
        : `${this.selectedVistoria.porcentagembateria}%`;

    const irregularidadesHtml = this.irregularidades.map((ir) => {
      const imagens = (this.imagensPorIrregularidade[ir.id] ?? [])
        .map((img) =>
          `<img src="${this.getImagemPreview(img.dadosBase64)}" alt="${this.escapeHtml(img.nomeArquivo)}" />`,
        )
        .join('');
      const audios = this.audiosPorIrregularidade[ir.id] ?? [];
      const audiosHtml =
        audios.length > 0
          ? `<ul class="item-audios">${audios
              .map(
                (a) =>
                  `<li>${this.escapeHtml(a.nomeArquivo)}${
                    a.duracaoMs != null ? ` (${this.formatDuracaoAudio(a.duracaoMs)})` : ''
                  }</li>`,
              )
              .join('')}</ul>`
          : '';
      const titulo = this.escapeHtml(this.getIrregularidadeLinhaPrincipal(ir));
      const obs = ir.observacao
        ? `<div class="item-obs">${this.escapeHtml(ir.observacao)}</div>`
        : '';
      const statusLabel = ir.resolvido ? 'Resolvida' : 'Pendente';
      const statusClass = ir.resolvido ? 'ok' : 'nok';
      return `
        <div class="item">
          <div class="item-title">
            <span>${titulo}</span>
            <span class="item-status ${statusClass}">${statusLabel}</span>
          </div>
          ${obs}
          ${audiosHtml ? `<div class="item-audios-wrap"><strong>Áudios:</strong>${audiosHtml}</div>` : ''}
          <div class="item-images">${imagens || '<span class="muted">Sem fotos</span>'}</div>
        </div>
      `;
    }).join('');

    doc.document.write(`
      <html>
        <head>
          <title>Vistoria</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; color: #111827; }
            h1 { margin: 0; font-size: 22px; }
            .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 12px; }
            .header-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
            .header-meta { display: flex; gap: 12px; font-size: 13px; color: #6b7280; margin-top: 6px; flex-wrap: wrap; }
            .cover { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 16px; font-size: 14px; color: #374151; margin-bottom: 12px; }
            .item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
            .item-title { font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
            .item-status { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 12px; margin-bottom: 6px; }
            .item-status.ok { background: #dcfce7; color: #166534; }
            .item-status.nok { background: #fee2e2; color: #991b1b; }
            .item-obs { color: #6b7280; margin-bottom: 8px; }
            .item-audios-wrap { margin-bottom: 8px; font-size: 13px; color: #374151; }
            .item-audios { margin: 4px 0 0 18px; padding: 0; }
            .item-images { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
            .item-images img { width: 100%; height: auto; border-radius: 6px; border: 1px solid #e5e7eb; }
            .muted { color: #9ca3af; }
            .footer { position: fixed; bottom: 12px; left: 16px; right: 16px; font-size: 12px; color: #6b7280; display: flex; justify-content: space-between; }
            @media print { body { padding-bottom: 40px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-top">
              <h1>Relatório de Vistoria</h1>
              <strong>${this.getStatusLabel(this.selectedVistoria.status)}</strong>
            </div>
            <div class="header-meta">
              <span>ID: ${this.selectedVistoria.id}</span>
              <span>Data da vistoria: ${dataVistoria}</span>
            </div>
          </div>
          <div class="cover">
            <div><strong>Veículo:</strong> ${veiculoDescricao}</div>
            <div><strong>Placa:</strong> ${placa}</div>
            <div><strong>Motorista:</strong> ${motoristaNome}</div>
            <div><strong>Matrícula:</strong> ${motoristaMatricula}</div>
            <div><strong>Vistoriador:</strong> ${usuario}</div>
            <div><strong>Odômetro:</strong> ${this.formatNumero(this.selectedVistoria.odometro)}</div>
            <div><strong>Bateria:</strong> ${bateriaTexto}</div>
            <div><strong>Tempo:</strong> ${this.formatTempo(this.selectedVistoria.tempo)}</div>
            <div><strong>Observação:</strong> ${this.selectedVistoria.observacao ?? '-'}</div>
          </div>
          ${irregularidadesHtml}
          <div class="footer">
            <span>Impresso por: ${usuarioImpressao}</span>
            <span>Impresso em: ${printDate}</span>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    doc.document.close();
  }

  async downloadImages(): Promise<void> {
    if (!this.selectedVistoria) return;
    const zip = new JSZip();

    const veiculo = this.sanitizeFilename(this.selectedVistoria.veiculo?.descricao ?? 'veiculo');
    const dataHora = this.formatDateTimeFilename(this.selectedVistoria.datavistoria);
    const zipName = `${veiculo}_${dataHora}_vistoria.zip`;

    this.irregularidades.forEach((ir, irIndex) => {
      const imagens = this.imagensPorIrregularidade[ir.id] ?? [];
      const irLabel = this.sanitizeFilename(
        `${ir.nomeArea ?? 'area'}_${ir.nomeComponente ?? 'comp'}_${ir.descricaoSintoma ?? 'sintoma'}`,
      );
      const prefix = `${veiculo}_${dataHora}_IR${irIndex + 1}_${irLabel}`;
      imagens.forEach((img, index) => {
        const ext = this.getFileExtension(img.nomeArquivo) || 'jpg';
        const imageIndex = index + 1;
        const fileName = `${prefix}_IMG_${imageIndex}.${ext}`;
        zip.file(fileName, img.dadosBase64, { base64: true });
      });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, zipName);
  }

  private sanitizeFilename(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();
  }

  private formatDateTimeFilename(dateValue: string): string {
    const date = new Date(dateValue);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${dd}${mm}${yyyy}_${hh}${mi}`;
  }

  private getFileExtension(nomeArquivo: string): string | null {
    const parts = nomeArquivo.split('.');
    if (parts.length < 2) return null;
    return parts[parts.length - 1].toLowerCase();
  }

  private matchesDateRange(
    datavistoria?: string,
    dataInicio?: string | null,
    dataFim?: string | null,
  ): boolean {
    if (!datavistoria) return false;
    const dateValue = new Date(datavistoria).getTime();
    const start = dataInicio ? new Date(dataInicio).setHours(0, 0, 0, 0) : null;
    const end = dataFim ? new Date(dataFim).setHours(23, 59, 59, 999) : null;
    if (start && dateValue < start) return false;
    if (end && dateValue > end) return false;
    return true;
  }

  private normalizeText(value?: string | null): string {
    return (value ?? '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
