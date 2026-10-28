import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Filtro de tempo na etapa (desde ENTRADA_STATUS) para as filas do fluxo.
 * Presets em horas (> 8h / 24h / 48h / 72h) + personalizar em dias (> N dias → horas na API).
 */

const HORAS_POR_DIA = 24;

export type TempoEtapaPreset =
  | 'qualquer'
  | 'gt8'
  | 'gt24'
  | 'gt48'
  | 'gt72'
  | 'personalizar';

export interface TempoEtapaFiltroPayload {
  horasMin?: number | null;
  horasMax?: number | null;
}

const PRESET_MIN: Record<Exclude<TempoEtapaPreset, 'qualquer' | 'personalizar'>, number> = {
  gt8: 8,
  gt24: 24,
  gt48: 48,
  gt72: 72,
};

@Component({
  selector: 'app-tempo-etapa-fluxo-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tempo-etapa-fluxo-filter.component.html',
  styleUrls: ['./tempo-etapa-fluxo-filter.component.css'],
})
export class TempoEtapaFluxoFilterComponent implements OnChanges {
  /** Incrementado pelo pai em "Limpar" para restaurar "Qualquer". */
  @Input() clearSeq = 0;

  @Output() tempoAplicado = new EventEmitter<TempoEtapaFiltroPayload>();

  preset: TempoEtapaPreset = 'qualquer';
  menuAberto = false;
  /** Personalizar: maior que N dias (convertido para horas ao emitir). */
  personalizarDiasMaiorQue: number | null = null;
  personalizarErro = '';

  readonly opcoesMenu: { key: TempoEtapaPreset; label: string }[] = [
    { key: 'qualquer', label: 'Qualquer tempo' },
    { key: 'gt8', label: '> 8 h' },
    { key: 'gt24', label: '> 24 h' },
    { key: 'gt48', label: '> 48 h' },
    { key: 'gt72', label: '> 72 h' },
    { key: 'personalizar', label: 'Personalizar (dias)…' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearSeq'] && !changes['clearSeq'].firstChange) {
      this.resetParaQualquer(true);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    const t = ev.target as HTMLElement;
    if (t.closest('.tempo-etapa-fluxo-host')) {
      return;
    }
    this.menuAberto = false;
  }

  get labelCentral(): string {
    if (this.preset === 'qualquer') {
      return 'Tempo na etapa';
    }
    if (this.preset === 'personalizar') {
      const dias = this.personalizarDiasMaiorQue;
      if (dias != null) {
        return `> ${dias} d`;
      }
      return 'Personalizado';
    }
    const horas = PRESET_MIN[this.preset];
    return `> ${horas} h`;
  }

  get temFiltroAtivo(): boolean {
    return this.preset !== 'qualquer';
  }

  alternarMenu(ev: MouseEvent): void {
    ev.stopPropagation();
    this.menuAberto = !this.menuAberto;
  }

  selecionarPreset(key: TempoEtapaPreset, ev: MouseEvent): void {
    ev.stopPropagation();
    if (key === 'personalizar') {
      this.preset = 'personalizar';
      this.personalizarErro = '';
      // Mantém o menu aberto para editar min/max.
      return;
    }
    this.menuAberto = false;
    this.personalizarErro = '';
    this.personalizarDiasMaiorQue = null;
    this.preset = key;
    if (key === 'qualquer') {
      this.tempoAplicado.emit({ horasMin: null, horasMax: null });
      return;
    }
    this.tempoAplicado.emit({
      horasMin: PRESET_MIN[key],
      horasMax: null,
    });
  }

  aplicarPersonalizar(ev?: Event): void {
    ev?.stopPropagation();
    const dias = this.normalizarDias(this.personalizarDiasMaiorQue);
    if (dias == null || dias < 1) {
      this.personalizarErro = 'Informe quantos dias (maior que).';
      return;
    }
    this.personalizarErro = '';
    this.personalizarDiasMaiorQue = dias;
    this.preset = 'personalizar';
    this.menuAberto = false;
    this.tempoAplicado.emit({
      horasMin: dias * HORAS_POR_DIA,
      horasMax: null,
    });
  }

  limparPersonalizar(ev: Event): void {
    ev.stopPropagation();
    this.resetParaQualquer(true);
  }

  private resetParaQualquer(emitir: boolean): void {
    this.preset = 'qualquer';
    this.menuAberto = false;
    this.personalizarDiasMaiorQue = null;
    this.personalizarErro = '';
    if (emitir) {
      this.tempoAplicado.emit({ horasMin: null, horasMax: null });
    }
  }

  private normalizarDias(value: number | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) {
      return null;
    }
    return Math.floor(n);
  }
}
