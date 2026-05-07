import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Filtro de período para as filas do fluxo de irregularidades.
 *
 * Regra (aceite + testes manuais): o intervalo emitido em `periodoAplicado` deve
 * filtrar o mesmo instante exibido na coluna "Registrado" por etapa — o pai envia
 * `referenciaPeriodo` na API (`CRIADO_EM` em tratamento; `ENTRADA_STATUS` em
 * manutenção e validação final, com fallback `criadoEm` no backend, espelhando
 * `getDataRegistradoFluxo` no front).
 */

export type GranularidadePeriodo = 'diario' | 'semanal' | 'mensal' | 'anual' | 'personalizar';

export interface PeriodoIntervaloPayload {
  dataInicio: string;
  dataFim: string;
}

const MESES_CURTOS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

@Component({
  selector: 'app-periodo-fluxo-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periodo-fluxo-filter.component.html',
  styleUrls: ['./periodo-fluxo-filter.component.css'],
})
export class PeriodoFluxoFilterComponent implements OnChanges, OnInit {
  /** Incrementado pelo pai em "Limpar" para restaurar período padrão (ano corrente). */
  @Input() clearSeq = 0;

  @Output() periodoAplicado = new EventEmitter<PeriodoIntervaloPayload>();

  /** Granularidade cujo intervalo já foi aplicado ao filtro da lista. */
  granularidade: GranularidadePeriodo = 'anual';
  /** Referência do período exibido (início lógico: dia, 1º do mês, 1º jan, início da semana). */
  anchor = new Date(new Date().getFullYear(), 0, 1);

  menuAberto = false;

  /**
   * Ano atual no modo `anual`; `[(ngModel)]` mantém seleção correta com lista **ordenada**.
   */
  anoSelecaoControl: number | null = null;

  /** Intervalo atual quando granularidade é `personalizar`. */
  private aplicadoCustomInicio = '';
  private aplicadoCustomFim = '';

  readonly opcoesMenu: { key: GranularidadePeriodo; label: string }[] = [
    { key: 'diario', label: 'diário' },
    { key: 'semanal', label: 'semanal' },
    { key: 'mensal', label: 'mensal' },
    { key: 'anual', label: 'anual' },
    { key: 'personalizar', label: 'personalizar...' },
  ];

  ngOnInit(): void {
    this.aplicarIntervaloAtual(true);
    this.sincronizarSelectAnoComAnchor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearSeq'] && !changes['clearSeq'].firstChange) {
      this.granularidade = 'anual';
      const now = new Date();
      this.anchor = new Date(now.getFullYear(), 0, 1);
      this.menuAberto = false;
      this.aplicadoCustomInicio = '';
      this.aplicadoCustomFim = '';
      this.aplicarIntervaloAtual(true);
      this.sincronizarSelectAnoComAnchor();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    const t = ev.target as HTMLElement;
    if (t.closest('.periodo-fluxo-host')) {
      return;
    }
    this.menuAberto = false;
  }

  get labelCentral(): string {
    const g = this.granularidade;
    if (g === 'personalizar') {
      const a = this.parseInputDate(this.aplicadoCustomInicio);
      const b = this.parseInputDate(this.aplicadoCustomFim);
      if (a && b) {
        return `${this.fmtData(a)} – ${this.fmtData(b)}`;
      }
      return 'Personalizado';
    }
    if (g === 'diario') {
      const d = this.cloneDate(this.anchor);
      d.setHours(0, 0, 0, 0);
      return `${d.getDate()} ${MESES_CURTOS[d.getMonth()]} ${d.getFullYear()}`;
    }
    if (g === 'semanal') {
      const ini = this.inicioSemana(this.anchor);
      const fim = this.fimSemana(this.anchor);
      return `${this.fmtDataCurta(ini)} – ${this.fmtDataCurta(fim)}`;
    }
    if (g === 'mensal') {
      const d = this.cloneDate(this.anchor);
      const m = MESES_CURTOS[d.getMonth()];
      return `${m} ${d.getFullYear()}`;
    }
    return String(this.anchor.getFullYear());
  }

  get podeNavegar(): boolean {
    return this.granularidade !== 'personalizar';
  }

  alternarMenu(ev: MouseEvent): void {
    ev.stopPropagation();
    this.menuAberto = !this.menuAberto;
  }

  selecionarGranularidade(g: GranularidadePeriodo, ev: MouseEvent): void {
    ev.stopPropagation();
    this.menuAberto = false;
    if (g === 'personalizar') {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 0);
      const inicio = this.toIsoDateOnly(first);
      const fim = this.toIsoDateOnly(last);
      this.granularidade = 'personalizar';
      this.aplicadoCustomInicio = inicio;
      this.aplicadoCustomFim = fim;
      this.periodoAplicado.emit({ dataInicio: inicio, dataFim: fim });
      return;
    }
    this.granularidade = g;
    this.aplicadoCustomInicio = '';
    this.aplicadoCustomFim = '';
    this.anchor = this.anchorInicioAoSelecionarMenu(g);
    this.aplicarIntervaloAtual(true);
    if (g === 'anual') {
      this.sincronizarSelectAnoComAnchor();
    }
  }

  /** Anos sempre em ordem crescente (evita “salto” 2031→2011 causado por rotação anterior). */
  /** Da `anoAtual - 5` até `anoAtual` (6 opções); nenhum ano futuro. */
  get anosSelect(): number[] {
    const cy = new Date().getFullYear();
    const hi = cy;
    const lo = cy - 5;
    const out: number[] = [];
    for (let y = lo; y <= hi; y++) {
      out.push(y);
    }
    return out;
  }

  trackAnoOption(_idx: number, y: number): number {
    return y;
  }

  private sincronizarSelectAnoComAnchor(): void {
    this.anoSelecaoControl = this.resolveAnoAnchorSeguro();
  }


  /** Ao escolher granularidade no menu: dia/semana/hoje ou mês/ano corridos — não preserva período navegado anteriormente. */
  private anchorInicioAoSelecionarMenu(g: GranularidadePeriodo): Date {
    const now = new Date();
    switch (g) {
      case 'diario':
      case 'semanal': {
        const d = this.cloneDate(now);
        d.setHours(0, 0, 0, 0);
        return d;
      }
      case 'mensal':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'anual':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return this.cloneDate(now);
    }
  }

  shift(delta: number, ev?: Event): void {
    ev?.stopPropagation();
    if (!this.podeNavegar) {
      return;
    }
    const d = this.cloneDate(this.anchor);
    switch (this.granularidade) {
      case 'diario':
        d.setDate(d.getDate() + delta);
        break;
      case 'semanal':
        d.setDate(d.getDate() + 7 * delta);
        break;
      case 'mensal':
        d.setMonth(d.getMonth() + delta, 1);
        break;
      case 'anual':
        d.setFullYear(d.getFullYear() + delta, d.getMonth(), d.getDate());
        break;
      default:
        return;
    }
    this.anchor = d;
    this.aplicarIntervaloAtual(true);
    if (this.granularidade === 'anual') {
      this.sincronizarSelectAnoComAnchor();
    }
  }

  private aplicarIntervaloAtual(emitir: boolean): void {
    if (this.granularidade === 'personalizar') {
      return;
    }
    const { inicio, fim } = this.calcularIntervalo(this.granularidade, this.anchor);
    if (emitir) {
      this.periodoAplicado.emit({ dataInicio: inicio, dataFim: fim });
    }
  }

  private calcularIntervalo(
    g: GranularidadePeriodo,
    ref: Date,
  ): { inicio: string; fim: string } {
    if (g === 'diario') {
      const x = this.cloneDate(ref);
      x.setHours(0, 0, 0, 0);
      return { inicio: this.toIsoDateOnly(x), fim: this.toIsoDateOnly(x) };
    }
    if (g === 'semanal') {
      const a = this.inicioSemana(ref);
      const b = this.fimSemana(ref);
      return { inicio: this.toIsoDateOnly(a), fim: this.toIsoDateOnly(b) };
    }
    if (g === 'mensal') {
      const y = ref.getFullYear();
      const m = ref.getMonth();
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 0);
      return { inicio: this.toIsoDateOnly(first), fim: this.toIsoDateOnly(last) };
    }
    if (g === 'anual') {
      const y = ref.getFullYear();
      const first = new Date(y, 0, 1);
      const last = new Date(y, 11, 31);
      return { inicio: this.toIsoDateOnly(first), fim: this.toIsoDateOnly(last) };
    }
    const x = this.cloneDate(ref);
    return { inicio: this.toIsoDateOnly(x), fim: this.toIsoDateOnly(x) };
  }

  private inicioSemana(ref: Date): Date {
    const x = this.cloneDate(ref);
    x.setHours(0, 0, 0, 0);
    const day = x.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    return x;
  }

  private fimSemana(ref: Date): Date {
    const s = this.inicioSemana(ref);
    const e = this.cloneDate(s);
    e.setDate(e.getDate() + 6);
    return e;
  }

  private cloneDate(d: Date): Date {
    return new Date(d.getTime());
  }

  private toIsoDateOnly(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseInputDate(s: string): Date | null {
    if (!s?.trim()) return null;
    const t = s.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
      const [y, m, d] = t.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return Number.isNaN(dt.getTime()) ? null : dt;
    }
    const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);
    if (br) {
      const d = Number(br[1]);
      const m = Number(br[2]) - 1;
      const y = Number(br[3]);
      const dt = new Date(y, m, d);
      return Number.isNaN(dt.getTime()) ? null : dt;
    }
    return null;
  }

  private fmtData(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  private fmtDataCurta(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  get valorIsoDiaAnchor(): string {
    const d = this.cloneDate(this.anchor);
    d.setHours(0, 0, 0, 0);
    return this.toIsoDateOnly(d);
  }

  get valorMesAnoAnchor(): string {
    const d = this.cloneDate(this.anchor);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private resolveAnoAnchorSeguro(): number {
    const cy = new Date().getFullYear();
    const y = this.anchor.getFullYear();
    if (!Number.isFinite(y) || Number.isNaN(this.anchor.getTime())) {
      return cy;
    }
    return y;
  }

  /** Textos do rótulo (evita duplicar lógica do labelCentral no template). */
  get textoDiario(): string {
    const d = this.cloneDate(this.anchor);
    d.setHours(0, 0, 0, 0);
    return `${d.getDate()} ${MESES_CURTOS[d.getMonth()]} ${d.getFullYear()}`;
  }

  get textoSemanal(): string {
    const ini = this.inicioSemana(this.anchor);
    const fim = this.fimSemana(this.anchor);
    return `${this.fmtDataCurta(ini)} – ${this.fmtDataCurta(fim)}`;
  }

  get textoMensal(): string {
    const d = this.cloneDate(this.anchor);
    return `${MESES_CURTOS[d.getMonth()]} ${d.getFullYear()}`;
  }

  get textoPersonalizadoInicio(): string {
    const a = this.parseInputDate(this.aplicadoCustomInicio);
    return a ? this.fmtData(a) : '—';
  }

  get textoPersonalizadoFim(): string {
    const b = this.parseInputDate(this.aplicadoCustomFim);
    return b ? this.fmtData(b) : '—';
  }

  get personalizadoTemIntervalo(): boolean {
    return !!(
      this.parseInputDate(this.aplicadoCustomInicio) &&
      this.parseInputDate(this.aplicadoCustomFim)
    );
  }

  customInicioIsoParaPicker(): string {
    return this.aplicadoCustomInicio || '';
  }

  customFimIsoParaPicker(): string {
    return this.aplicadoCustomFim || '';
  }

  /**
   * input type="date|month" invisível por cima do rótulo muitas vezes NÃO abre o picker no Chrome/Edge.
   * Delegamos ao gesto explícito do usuário: showPicker() (com fallback em click/focus).
   */
  abrirPickerNativo(ev: Event, native: HTMLInputElement | null): void {
    ev.preventDefault();
    ev.stopPropagation();
    if (!native) {
      return;
    }
    try {
      if (typeof native.showPicker === 'function') {
        const r = native.showPicker() as void | Promise<void>;
        if (r && typeof (r as Promise<void>).then === 'function') {
          void (r as Promise<void>).catch(() => {
            native.focus({ preventScroll: true });
            native.click();
          });
        }
        return;
      }
    } catch {
      /* NotAllowedError ou API indisponível */
    }
    native.focus({ preventScroll: true });
    native.click();
  }

  onPickDia(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    if (!v) {
      return;
    }
    const [y, m, d] = v.split('-').map(Number);
    this.anchor = new Date(y, m - 1, d);
    this.aplicarIntervaloAtual(true);
  }

  onPickMes(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    if (!v) {
      return;
    }
    const parts = v.split('-');
    const yi = Number(parts[0]);
    const mi = Number(parts[1]);
    if (!yi || !mi) {
      return;
    }
    this.anchor = new Date(yi, mi - 1, 1);
    this.aplicarIntervaloAtual(true);
  }

  onPickAnoModel(v: unknown): void {
    const raw = typeof v === 'number' ? v : Number(String(v ?? '').trim());
    if (!Number.isFinite(raw)) {
      return;
    }
    const y = Math.trunc(raw);
    if (y < 1900 || y > 2200) {
      return;
    }
    this.anchor = new Date(y, 0, 1);
    this.aplicarIntervaloAtual(true);
  }

  onPickPersonalizadoInicio(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    if (!v) {
      return;
    }
    let fim = this.aplicadoCustomFim;
    if (fim && v > fim) {
      fim = v;
    }
    this.aplicadoCustomInicio = v;
    if (fim) {
      this.aplicadoCustomFim = fim;
    }
    this.granularidade = 'personalizar';
    this.emitirSePersonalizadoValido();
  }

  onPickPersonalizadoFim(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    if (!v) {
      return;
    }
    let ini = this.aplicadoCustomInicio;
    if (ini && v < ini) {
      ini = v;
    }
    this.aplicadoCustomFim = v;
    if (ini) {
      this.aplicadoCustomInicio = ini;
    }
    this.granularidade = 'personalizar';
    this.emitirSePersonalizadoValido();
  }

  private emitirSePersonalizadoValido(): void {
    const ini = this.aplicadoCustomInicio?.trim();
    const fim = this.aplicadoCustomFim?.trim();
    if (!ini || !fim) {
      return;
    }
    const d1 = this.parseInputDate(ini);
    const d2 = this.parseInputDate(fim);
    if (!d1 || !d2 || d1.getTime() > d2.getTime()) {
      return;
    }
    this.periodoAplicado.emit({
      dataInicio: ini,
      dataFim: fim,
    });
  }
}
