import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, catchError, forkJoin, from, map, of, switchMap } from 'rxjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user.service';
import { VistoriaService } from '../../services/vistoria.service';
import { AuthService } from '../../services/auth.service';
import { ConfiguracaoService } from '../../services/configuracao.service';
import { ModeloVeiculoService } from '../../services/modelo-veiculo.service';
import { VeiculoService } from '../../services/veiculo.service';
import {
  ROTULO_COLUNA_PERCENTUAL_NIVEL,
  rotuloPercentualNivel,
} from '../../models/combustivel.enum';
import {
  IrregularidadeAudioItem,
  IrregularidadeAudioResumo,
  IrregularidadeImagemItem,
  IrregularidadeImagemResumo,
  IrregularidadeResumo,
  StatusErpVistoria,
  VistoriaResumo,
} from '../../models/vistoria.model';
import { Permission, Usuario } from '../../models/usuario.model';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { MotoristaAutocompleteComponent } from '../shared/motorista-autocomplete/motorista-autocomplete.component';
import { UsuarioAutocompleteComponent } from '../shared/usuario-autocomplete/usuario-autocomplete.component';

interface MapaImpressaoVista {
  dataUrl: string;
  baixa: boolean;
}

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
  private configuracaoService = inject(ConfiguracaoService);
  private modeloVeiculoService = inject(ModeloVeiculoService);
  private veiculoService = inject(VeiculoService);
  private fb = inject(FormBuilder);

  loading = false;
  error = '';
  success = '';
  drawerOpen = false;
  loadingFilters = false;
  usuariosLoaded = false;
  enviandoErp = false;
  imprimindoId: string | null = null;
  erpIntegracaoAtiva = false;
  selectedIds = new Set<string>();
  readonly canReprocessarErp = this.authService.hasPermission(
    Permission.VISTORIA_WEB_REPROCESSAR_ERP,
  );

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

  erpStatusOptions: { value: StatusErpVistoria | ''; label: string }[] = [
    { value: '', label: 'ERP: todos' },
    { value: 'PENDENTE', label: 'ERP: pendente' },
    { value: 'ENVIADO', label: 'ERP: enviado' },
    { value: 'FALHA', label: 'ERP: falha' },
    { value: 'NAO_APLICA', label: 'ERP: não aplica' },
  ];

  currentPage = 1;
  itemsPerPage = 100;
  totalPages = 0;
  readonly rotuloColunaPercentualNivel = ROTULO_COLUNA_PERCENTUAL_NIVEL;

  filterForm = this.fb.group({
    veiculoId: [''],
    motoristaId: [''],
    status: [''],
    erpStatus: [''],
    usuarioId: [''],
    numeroVistoria: [''],
    erpNumeroVistoria: [''],
    dataInicio: [''],
    dataFim: [''],
  });

  ngOnInit(): void {
    this.loadingFilters = true;
    this.loading = true;
    this.loadUsuarios();

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.vistoriaService.getErpStatus().subscribe({
      next: (status) => {
        this.erpIntegracaoAtiva = !!status?.ativo;
      },
      error: () => {
        this.erpIntegracaoAtiva = false;
      },
    });
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
          this.error = this.error === 'Erro ao carregar vistorias.' ? '' : this.error;
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
      erpStatus,
      usuarioId,
      numeroVistoria,
      erpNumeroVistoria,
      dataInicio,
      dataFim,
    } = this.filterForm.value;

    const numeroFiltro = this.somenteDigitos(numeroVistoria);
    const erpFiltro = this.normalizeText(erpNumeroVistoria);

    const filtered = (this.vistorias ?? []).filter((vistoria) => {
      const matchesVeiculo = !veiculoId || vistoria.idVeiculo === veiculoId;
      const matchesMotorista = !motoristaId || vistoria.idMotorista === motoristaId;
      const matchesStatus = !status || vistoria.status === status;
      const matchesErpStatus = !erpStatus || vistoria.erpStatus === erpStatus;
      const matchesUsuario = !usuarioId || vistoria.idUsuario === usuarioId;
      const matchesNumero =
        !numeroFiltro ||
        this.somenteDigitos(vistoria.numeroVistoria).includes(numeroFiltro);
      const matchesErpNumero =
        !erpFiltro ||
        this.normalizeText(vistoria.erpNumeroVistoria).includes(erpFiltro);
      const matchesData = this.matchesDateRange(vistoria.datavistoria, dataInicio, dataFim);
      return (
        matchesVeiculo &&
        matchesMotorista &&
        matchesStatus &&
        matchesErpStatus &&
        matchesUsuario &&
        matchesNumero &&
        matchesErpNumero &&
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
      erpStatus: '',
      usuarioId: '',
      numeroVistoria: '',
      erpNumeroVistoria: '',
      dataInicio: '',
      dataFim: '',
    });
  }

  podeSelecionar(vistoria: VistoriaResumo): boolean {
    return (
      this.canReprocessarErp &&
      this.erpIntegracaoAtiva &&
      !!vistoria.erpElegivel
    );
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  toggleSelecao(vistoria: VistoriaResumo, checked: boolean): void {
    if (!this.podeSelecionar(vistoria)) {
      this.selectedIds.delete(vistoria.id);
      return;
    }
    if (checked) {
      this.selectedIds.add(vistoria.id);
    } else {
      this.selectedIds.delete(vistoria.id);
    }
  }

  get visiveisElegiveis(): VistoriaResumo[] {
    return this.paged.filter((item) => this.podeSelecionar(item));
  }

  get allVisibleSelected(): boolean {
    const visiveis = this.visiveisElegiveis;
    return visiveis.length > 0 && visiveis.every((item) => this.selectedIds.has(item.id));
  }

  toggleSelectVisible(checked: boolean): void {
    this.visiveisElegiveis.forEach((item) => {
      if (checked) {
        this.selectedIds.add(item.id);
      } else {
        this.selectedIds.delete(item.id);
      }
    });
  }

  onToggleSelectVisible(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.toggleSelectVisible(!!target?.checked);
  }

  onToggleSelecao(vistoria: VistoriaResumo, event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.toggleSelecao(vistoria, !!target?.checked);
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  enviarSelecionadas(): void {
    const ids = [...this.selectedIds].filter((id) => {
      const item = this.vistorias.find((vistoria) => vistoria.id === id);
      return !!item && this.podeSelecionar(item);
    });
    this.enviarAoErp(ids);
  }

  enviarVistoria(vistoria: VistoriaResumo): void {
    if (!this.podeSelecionar(vistoria)) {
      return;
    }
    this.enviarAoErp([vistoria.id]);
  }

  private enviarAoErp(ids: string[]): void {
    if (ids.length === 0 || this.enviandoErp) {
      return;
    }
    if (!this.erpIntegracaoAtiva) {
      this.error = 'Envio ao ERP desabilitado na configuração do sistema.';
      this.success = '';
      return;
    }
    this.enviandoErp = true;
    this.error = '';
    this.success = '';
    this.vistoriaService.enviarAoErp(ids).subscribe({
      next: (resposta) => {
        this.enviandoErp = false;
        this.selectedIds.clear();
        this.success = `Envio ao ERP: ${resposta.enviadas} enviada(s), ${resposta.falhas} falha(s), ${resposta.ignoradas} ignorada(s).`;
        this.loading = true;
        this.loadVistorias();
      },
      error: (err: { error?: { message?: string }; message?: string }) => {
        this.enviandoErp = false;
        this.success = '';
        this.error =
          err?.error?.message ||
          err?.message ||
          'Erro ao enviar vistorias ao ERP.';
      },
    });
  }

  formatNumeroVistoria(value?: number): string {
    if (value === null || value === undefined) return '—';
    return String(value);
  }

  formatErpNumero(value?: string | null): string {
    const texto = value?.trim();
    return texto ? texto : '—';
  }

  getErpStatusLabel(status?: StatusErpVistoria | string | null): string {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'ENVIADO':
        return 'Enviado';
      case 'FALHA':
        return 'Falha';
      case 'NAO_APLICA':
        return 'Não aplica';
      default:
        return status?.trim() ? String(status) : '—';
    }
  }

  getErpStatusClass(status?: StatusErpVistoria | string | null): string {
    switch (status) {
      case 'PENDENTE':
        return 'erp-status-pendente';
      case 'ENVIADO':
        return 'erp-status-enviado';
      case 'FALHA':
        return 'erp-status-falha';
      case 'NAO_APLICA':
        return 'erp-status-nao-aplica';
      default:
        return 'erp-status-nao-aplica';
    }
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
    this.carregarDetalheIrregularidades$(vistoriaId).subscribe({
      next: (detalhe) => {
        if (this.selectedVistoria?.id !== vistoriaId) {
          return;
        }
        this.irregularidades = detalhe.irregularidades;
        this.imagensPorIrregularidade = detalhe.imagensPorIrregularidade;
        this.audiosPorIrregularidade = detalhe.audiosPorIrregularidade;
      },
    });
  }

  private carregarDetalheIrregularidades$(vistoriaId: string) {
    return forkJoin({
      irregularidades: this.vistoriaService.listarIrregularidades(vistoriaId).pipe(
        catchError(() => of([] as IrregularidadeResumo[])),
      ),
      imagens: this.vistoriaService.listarIrregularidadesImagens(vistoriaId).pipe(
        catchError(() => of([] as IrregularidadeImagemResumo[])),
      ),
      audios: this.vistoriaService.listarIrregularidadesAudios(vistoriaId).pipe(
        catchError(() => of([] as IrregularidadeAudioResumo[])),
      ),
    }).pipe(
      map(({ irregularidades, imagens, audios }) => ({
        irregularidades: this.sortIrregularidades(irregularidades ?? []),
        imagensPorIrregularidade: (imagens ?? []).reduce(
          (acc, g) => {
            acc[g.idirregularidade] = g.imagens ?? [];
            return acc;
          },
          {} as Record<string, IrregularidadeImagemItem[]>,
        ),
        audiosPorIrregularidade: (audios ?? []).reduce(
          (acc, g) => {
            acc[g.idirregularidade] = g.audios ?? [];
            return acc;
          },
          {} as Record<string, IrregularidadeAudioItem[]>,
        ),
      })),
    );
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

  private getIrregularidadeLinhaRelatorio(ir: IrregularidadeResumo): string {
    const area = ir.nomeArea?.trim() || 'Área';
    const comp = ir.nomeComponente?.trim() || 'Componente';
    const sint = ir.descricaoSintoma?.trim() || 'Sintoma';
    return `${area} - ${comp} - ${sint}`;
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

  rotuloPercentualVistoria(vistoria: VistoriaResumo | null | undefined): string {
    return rotuloPercentualNivel(vistoria?.veiculo?.combustivel, {
      prefixoPercentual: false,
    });
  }

  printVistoria(vistoria?: VistoriaResumo | null): void {
    const alvo = vistoria ?? this.selectedVistoria;
    if (!alvo || this.imprimindoId === alvo.id) {
      return;
    }

    const doc = window.open('', '_blank', 'width=1024,height=768');
    if (!doc) {
      return;
    }

    const usarCache = this.drawerOpen && this.selectedVistoria?.id === alvo.id;
    const detalhe$ = usarCache
      ? of({
          irregularidades: this.irregularidades,
          imagensPorIrregularidade: this.imagensPorIrregularidade,
          audiosPorIrregularidade: this.audiosPorIrregularidade,
        })
      : this.carregarDetalheIrregularidades$(alvo.id);

    this.imprimindoId = alvo.id;
    doc.document.write(
      '<html><body><p>Carregando relatório da vistoria...</p></body></html>',
    );
    detalhe$
      .pipe(
        switchMap((detalhe) =>
          forkJoin({
            detalhe: of(detalhe),
            logoUrl: this.carregarLogoRelatorio$(),
            mapas: this.carregarMapasImpressao$(alvo, detalhe.irregularidades),
          }),
        ),
      )
      .subscribe({
        next: ({ detalhe, logoUrl, mapas }) => {
          this.gerarImpressao(
            doc,
            alvo,
            detalhe.irregularidades,
            detalhe.imagensPorIrregularidade,
            detalhe.audiosPorIrregularidade,
            logoUrl,
            mapas,
          );
          this.imprimindoId = null;
        },
        error: () => {
          doc.close();
          this.imprimindoId = null;
        },
      });
  }

  private carregarLogoRelatorio$() {
    return this.configuracaoService.getLogoRelatorio().pipe(
      switchMap((res) => {
        if (res.dataUrl) {
          return of(res.dataUrl);
        }
        const url = this.montarUrlLogo(res.logoRelatorio);
        if (!url) {
          return of(null as string | null);
        }
        return from(
          fetch(url)
            .then(async (response) => {
              if (!response.ok) {
                return url;
              }
              const blob = await response.blob();
              return await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result ?? url));
                reader.onerror = () => resolve(url);
                reader.readAsDataURL(blob);
              });
            })
            .catch(() => url),
        );
      }),
      catchError(() => of(null as string | null)),
    );
  }

  private montarUrlLogo(path?: string | null): string | null {
    const raw = path?.trim();
    if (!raw) {
      return null;
    }
    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const rel = raw.startsWith('/') ? raw : `/${raw}`;
    return `${origin}${rel}`;
  }

  private resolveModeloId$(vistoria: VistoriaResumo): Observable<string | null> {
    const direto = vistoria.veiculo?.idModelo?.trim();
    if (direto) {
      return of(direto);
    }
    return this.veiculoService.getById(vistoria.idVeiculo).pipe(
      map((veiculo) => veiculo.idModelo?.trim() || null),
      catchError(() => of(null as string | null)),
    );
  }

  private blobToDataUrl$(blob: Blob): Observable<string> {
    return from(
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler imagem'));
        reader.readAsDataURL(blob);
      }),
    );
  }

  private lerDimensaoImagem$(dataUrl: string): Observable<{ w: number; h: number }> {
    return from(
      new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({
            w: img.naturalWidth || 1,
            h: img.naturalHeight || 1,
          });
        img.onerror = () => resolve({ w: 1, h: 1 });
        img.src = dataUrl;
      }),
    );
  }

  private carregarMapasImpressao$(
    vistoria: VistoriaResumo,
    irregularidades: IrregularidadeResumo[],
  ): Observable<Record<string, MapaImpressaoVista>> {
    const idsVista = [
      ...new Set(
        irregularidades
          .map((ir) => ir.marcacao?.idVista)
          .filter((id): id is string => !!id),
      ),
    ];
    if (idsVista.length === 0) {
      return of({});
    }
    return this.resolveModeloId$(vistoria).pipe(
      switchMap((idModelo) => {
        if (!idModelo) {
          return of({} as Record<string, MapaImpressaoVista>);
        }
        const pedidos = idsVista.map((idVista) =>
          this.modeloVeiculoService.getVistaImagem(idModelo, idVista).pipe(
            switchMap((blob) => this.blobToDataUrl$(blob)),
            switchMap((dataUrl) =>
              this.lerDimensaoImagem$(dataUrl).pipe(
                map((dim) => ({
                  idVista,
                  dataUrl,
                  baixa: dim.h / dim.w < 0.55,
                })),
              ),
            ),
            catchError(() => of(null)),
          ),
        );
        return forkJoin(pedidos).pipe(
          map((itens) => {
            const mapas: Record<string, MapaImpressaoVista> = {};
            for (const item of itens) {
              if (item) {
                mapas[item.idVista] = {
                  dataUrl: item.dataUrl,
                  baixa: item.baixa,
                };
              }
            }
            return mapas;
          }),
        );
      }),
    );
  }

  private gerarImpressao(
    doc: Window,
    vistoria: VistoriaResumo,
    irregularidades: IrregularidadeResumo[],
    imagensPorIrregularidade: Record<string, IrregularidadeImagemItem[]>,
    audiosPorIrregularidade: Record<string, IrregularidadeAudioItem[]>,
    logoUrl: string | null,
    mapas: Record<string, MapaImpressaoVista>,
  ): void {
    const printDate = new Date().toLocaleString('pt-BR');
    const dataVistoria = new Date(vistoria.datavistoria).toLocaleString('pt-BR');
    const usuario = this.getUsuarioNome(vistoria.idUsuario);
    const usuarioImpressao =
      this.authService.getCurrentUser()?.nome ||
      this.authService.getCurrentUser()?.email ||
      usuario;
    const veiculoDescricao = vistoria.veiculo?.descricao ?? '-';
    const placa = vistoria.veiculo?.placa ?? '-';
    const motoristaNome = vistoria.motorista?.nome ?? '-';
    const motoristaMatricula = vistoria.motorista?.matricula ?? '-';
    const bateriaTexto =
      vistoria.porcentagembateria === null ||
      vistoria.porcentagembateria === undefined
        ? '-'
        : `${vistoria.porcentagembateria}%`;
    const tituloRelatorio = 'Relatório de Vistoria';
    const logoHtml = logoUrl
      ? `<img class="logo" src="${logoUrl}" alt="Logo" />`
      : '<span class="logo-placeholder"></span>';
    const rodapeEsquerda = usuarioImpressao
      ? `Emissão: ${printDate} · Usuário: ${this.escapeHtml(usuarioImpressao)}`
      : `Emissão: ${printDate}`;

    const irregularidadesHtml =
      irregularidades.length === 0
        ? '<p class="muted">Nenhuma irregularidade registrada nesta vistoria.</p>'
        : irregularidades
            .map((ir) => {
              const imagens = imagensPorIrregularidade[ir.id] ?? [];
              const imagensHtml =
                imagens.length > 0
                  ? `<div class="item-images">${imagens
                      .map(
                        (img) =>
                          `<div class="img-cell"><img src="${this.getImagemPreview(img.dadosBase64)}" alt="${this.escapeHtml(img.nomeArquivo)}" /></div>`,
                      )
                      .join('')}</div>`
                  : '<div class="muted">Sem imagens anexadas.</div>';
              const audios = audiosPorIrregularidade[ir.id] ?? [];
              const audiosHtml =
                audios.length > 0
                  ? `<div class="item-audios-wrap"><strong>Áudios:</strong><ul class="item-audios">${audios
                      .map(
                        (a) =>
                          `<li>${this.escapeHtml(a.nomeArquivo)}${
                            a.duracaoMs != null
                              ? ` (${this.formatDuracaoAudio(a.duracaoMs)})`
                              : ''
                          }</li>`,
                      )
                      .join('')}</ul></div>`
                  : '';
              const tituloItem = this.escapeHtml(
                this.getIrregularidadeLinhaRelatorio(ir),
              );
              const obsTxt = ir.observacao?.trim() || 'Não informada.';
              const mapa = ir.marcacao ? mapas[ir.marcacao.idVista] : undefined;
              const localLabel = ir.marcacao
                ? `<div class="item-local-label">Local: ${this.escapeHtml(
                    ir.marcacao.descricaoVista || 'Veículo',
                  )}</div>`
                : '';
              const mapaHtml = mapa
                ? `<div class="mapa-wrap${mapa.baixa ? ' mapa-baixa' : ''}">
                     <div class="mapa-frame">
                       <img src="${mapa.dataUrl}" alt="Local no veículo" />
                       <span class="mapa-dot" style="left:${ir.marcacao?.posXPct ?? 0}%;top:${ir.marcacao?.posYPct ?? 0}%"></span>
                     </div>
                   </div>`
                : '';
              const fotosAoLado = !!(mapa && !mapa.baixa && imagens.length > 0);
              const midiaClass = fotosAoLado
                ? 'item-midia item-midia-lado'
                : 'item-midia';
              return `
        <div class="item">
          <div class="item-title">${tituloItem}</div>
          <div class="item-meta">Observação: ${this.escapeHtml(obsTxt)}</div>
          ${audiosHtml}
          ${localLabel}
          <div class="${midiaClass}">
            ${mapaHtml}
            ${imagensHtml}
          </div>
        </div>
      `;
            })
            .join('');

    doc.document.open();
    doc.document.write(`
      <html>
        <head>
          <title>${this.escapeHtml(tituloRelatorio)}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm 12mm 14mm 12mm;
              @bottom-right {
                content: "Página " counter(page) " de " counter(pages);
                font-size: 8pt;
                color: #64748b;
              }
            }
            * { box-sizing: border-box; }
            body { font-family: Helvetica, Arial, sans-serif; margin: 0; color: #0f172a; }
            .header-brand {
              display: grid;
              grid-template-columns: 96pt 1fr 96pt;
              align-items: center;
              column-gap: 6pt;
              margin-bottom: 0;
            }
            .logo, .logo-placeholder {
              width: 96pt;
              height: 32pt;
              object-fit: contain;
              object-position: left center;
            }
            .header-brand h1 {
              margin: 0;
              font-size: 13pt;
              font-weight: 400;
              text-align: center;
              color: #0f172a;
            }
            .header-sub {
              text-align: center;
              font-size: 9pt;
              color: #475569;
              margin: 1pt 0 0;
            }
            .header-emissao {
              text-align: center;
              font-size: 8pt;
              color: #64748b;
              margin: 1pt 0 6pt;
            }
            .cover {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1pt 12pt;
              font-size: 8pt;
              color: #334155;
              margin-bottom: 8pt;
            }
            .item {
              border: 0.8pt solid #cbd5e1;
              border-radius: 6pt;
              padding: 6pt 8pt;
              margin-bottom: 8pt;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .item-title { font-weight: 700; font-size: 9pt; color: #0f172a; margin-bottom: 2pt; }
            .item-meta { font-size: 8pt; color: #334155; margin-bottom: 4pt; }
            .item-audios-wrap { margin-bottom: 6pt; font-size: 8pt; color: #334155; }
            .item-audios { margin: 3pt 0 0 16pt; padding: 0; }
            .item-local-label {
              font-size: 8pt;
              font-weight: 700;
              color: #334155;
              margin: 0 0 4pt;
            }
            .item-midia { margin-top: 2pt; }
            .item-midia-lado {
              display: grid;
              grid-template-columns: auto 1fr;
              gap: 8pt;
              align-items: start;
              justify-items: start;
            }
            .mapa-wrap {
              max-width: 210pt;
              border: 0.6pt solid #e2e8f0;
              border-radius: 4pt;
              overflow: hidden;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .mapa-frame {
              position: relative;
              display: block;
              width: max-content;
              max-width: 210pt;
              line-height: 0;
            }
            .mapa-frame img {
              display: block;
              max-width: 210pt;
              max-height: 210pt;
              width: auto;
              height: auto;
            }
            .mapa-wrap.mapa-baixa {
              max-width: 100%;
              margin-bottom: 8pt;
            }
            .mapa-wrap.mapa-baixa .mapa-frame {
              width: 100%;
              max-width: 100%;
            }
            .mapa-wrap.mapa-baixa img {
              max-width: 100%;
              max-height: none;
              width: 100%;
              height: auto;
            }
            .mapa-dot {
              position: absolute;
              width: 12pt;
              height: 12pt;
              transform: translate(-50%, -50%);
              border-radius: 50%;
              background: #2563eb;
              border: 1pt solid #1e40af;
              box-shadow: inset 0 0 0 12pt #2563eb;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            .item-images {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8pt;
            }
            .img-cell {
              height: 200pt;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .img-cell img {
              max-width: 100%;
              max-height: 200pt;
              width: auto;
              height: auto;
              object-fit: contain;
            }
            .item-midia-lado .item-images {
              grid-template-columns: repeat(2, 1fr);
            }
            .item-midia-lado .img-cell {
              height: auto;
              max-height: 210pt;
            }
            .item-midia-lado .img-cell img { max-height: 210pt; }
            .muted { color: #6b7280; font-size: 8pt; }
            .footer {
              position: fixed;
              bottom: 6mm;
              left: 12mm;
              right: 26mm;
              font-size: 8pt;
              color: #64748b;
              border-top: 0.5pt solid #e2e8f0;
              padding-top: 3pt;
            }
            @media print {
              body { padding-bottom: 18pt; }
              .footer { position: fixed; }
              .item, .img-cell, .mapa-wrap {
                break-inside: avoid;
                page-break-inside: avoid;
              }
              body, img, .mapa-dot {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header-brand">
            ${logoHtml}
            <h1>${this.escapeHtml(tituloRelatorio)}</h1>
            <span></span>
          </div>
          <div class="header-sub">Veículo: ${this.escapeHtml(veiculoDescricao)} · Placa: ${this.escapeHtml(placa)}</div>
          <div class="header-emissao">Emissão: ${printDate}</div>
          <div class="cover">
            <div><strong>Status:</strong> ${this.escapeHtml(this.getStatusLabel(vistoria.status))}</div>
            <div><strong>Data da vistoria:</strong> ${dataVistoria}</div>
            <div><strong>Motorista:</strong> ${this.escapeHtml(motoristaNome)}</div>
            <div><strong>Matrícula:</strong> ${this.escapeHtml(motoristaMatricula)}</div>
            <div><strong>Vistoriador:</strong> ${this.escapeHtml(usuario)}</div>
            <div><strong>Odômetro:</strong> ${this.formatNumero(vistoria.odometro)}</div>
            <div><strong>${this.escapeHtml(this.rotuloPercentualVistoria(vistoria))}:</strong> ${bateriaTexto}</div>
            <div><strong>Tempo:</strong> ${this.formatTempo(vistoria.tempo)}</div>
            <div><strong>Observação:</strong> ${this.escapeHtml(vistoria.observacao ?? '-')}</div>
            <div><strong>Vistoria:</strong> ${this.formatNumeroVistoria(vistoria.numeroVistoria)}</div>
            <div><strong>Vistoria OMNI:</strong> ${this.formatErpNumero(vistoria.erpNumeroVistoria)}</div>
            <div><strong>Erro ERP:</strong> ${this.escapeHtml(vistoria.erpUltimoErro ?? '-')}</div>
          </div>
          ${irregularidadesHtml}
          <div class="footer">${rodapeEsquerda}</div>
          <script>
            window.onload = () => setTimeout(() => window.print(), 400);
          </script>
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

  private somenteDigitos(value?: string | number | null): string {
    return String(value ?? '').replace(/\D+/g, '');
  }
}
