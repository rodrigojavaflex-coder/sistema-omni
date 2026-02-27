import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user.service';
import { VistoriaService } from '../../services/vistoria.service';
import { AuthService } from '../../services/auth.service';
import {
  ChecklistImagemResumo,
  ChecklistItemResumo,
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
  activeTab: 'checklist' | 'imagens' = 'checklist';
  loadingFilters = false;
  usuariosLoaded = false;

  vistorias: VistoriaResumo[] = [];
  filtered: VistoriaResumo[] = [];
  paged: VistoriaResumo[] = [];
  usuarios: Usuario[] = [];
  selectedVistoria: VistoriaResumo | null = null;
  checklistItens: ChecklistItemResumo[] = [];
  imagensChecklist: ChecklistImagemResumo[] = [];
  imagensPorItem: Record<string, ChecklistImagemResumo['imagens']> = {};
  itemInfoMap: Record<string, { descricao?: string; sequencia?: number }> = {};
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
    this.activeTab = 'checklist';
    this.checklistItens = [];
    this.imagensChecklist = [];
    this.imagensPorItem = {};
    this.itemInfoMap = {};
    this.loadChecklist(vistoria.id);
    this.loadImagens(vistoria.id);
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.selectedVistoria = null;
    this.showImageModal = false;
    this.selectedImage = null;
  }

  setActiveTab(tab: 'checklist' | 'imagens'): void {
    this.activeTab = tab;
  }

  private loadChecklist(vistoriaId: string): void {
    this.vistoriaService.listarChecklist(vistoriaId).subscribe({
      next: (items) => {
        const ordenados = [...(items ?? [])].sort((a, b) => {
          const seqA = a.sequencia ?? 0;
          const seqB = b.sequencia ?? 0;
          return seqA - seqB;
        });
        this.checklistItens = ordenados;
        this.itemInfoMap = ordenados.reduce((acc, item) => {
          acc[item.iditemvistoriado] = {
            descricao: item.descricaoItem,
            sequencia: item.sequencia,
          };
          return acc;
        }, {} as Record<string, { descricao?: string; sequencia?: number }>);
      },
      error: () => {
        this.checklistItens = [];
      },
    });
  }

  private loadImagens(vistoriaId: string): void {
    this.vistoriaService.listarChecklistImagens(vistoriaId).subscribe({
      next: (items) => {
        this.imagensChecklist = items ?? [];
        this.imagensPorItem = (items ?? []).reduce((acc, item) => {
          acc[item.iditemvistoriado] = item.imagens ?? [];
          return acc;
        }, {} as Record<string, ChecklistImagemResumo['imagens']>);
      },
      error: () => {
        this.imagensChecklist = [];
        this.imagensPorItem = {};
      },
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

  getItemTitulo(item: ChecklistItemResumo): string {
    const sequencia = item.sequencia ? `${item.sequencia}. ` : '';
    return `${sequencia}${item.descricaoItem ?? item.iditemvistoriado}`;
  }

  getImagemPreview(base64: string): string {
    return `data:image/jpeg;base64,${base64}`;
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

    const checklistHtml = this.checklistItens.map((item) => {
      const imagens = (this.imagensPorItem[item.iditemvistoriado] ?? [])
        .map((img) =>
          `<img src="${this.getImagemPreview(img.dadosBase64)}" alt="${img.nomeArquivo}" />`,
        )
        .join('');
      return `
        <div class="item">
          <div class="item-title">
            <span>${this.getItemTitulo(item)}</span>
            <span class="item-status ${item.conforme ? 'ok' : 'nok'}">
              ${item.conforme ? 'Conforme' : 'Não conforme'}
            </span>
          </div>
          ${item.observacao ? `<div class="item-obs">${item.observacao}</div>` : ''}
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
          ${checklistHtml}
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
    const grupos = this.imagensChecklist ?? [];
    const zip = new JSZip();

    const veiculo = this.sanitizeFilename(this.selectedVistoria.veiculo?.descricao ?? 'veiculo');
    const dataHora = this.formatDateTimeFilename(this.selectedVistoria.datavistoria);
    const zipName = `${veiculo}_${dataHora}_vistoria.zip`;

    grupos.forEach((grupo) => {
      const itemInfo = this.itemInfoMap[grupo.iditemvistoriado];
      const itemSequencia = itemInfo?.sequencia ?? 0;
      const itemNome = this.sanitizeFilename(itemInfo?.descricao ?? 'item');
      grupo.imagens.forEach((img, index) => {
        const ext = this.getFileExtension(img.nomeArquivo) || 'jpg';
        const imageIndex = index + 1;
        const itemSuffix = itemSequencia ? `${itemSequencia}_IMG_${imageIndex}` : `${imageIndex}`;
        const fileName = `${veiculo}_${dataHora}_${itemNome}_ITEM_${itemSuffix}.${ext}`;
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
