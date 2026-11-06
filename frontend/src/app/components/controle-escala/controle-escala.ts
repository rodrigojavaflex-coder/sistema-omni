import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ControleEscalaService } from '../../services/controle-escala.service';
import { EscalaPainelItem, EscalaPainelResponse } from '../../models/controle-escala.model';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-controle-escala',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './controle-escala.html',
  styleUrls: ['./controle-escala.css'],
})
export class ControleEscalaComponent implements OnInit {
  private readonly escalaService = inject(ControleEscalaService);
  private readonly authService = inject(AuthService);

  readonly canSync = this.authService.hasPermission(Permission.CONTROLE_ESCALA_SYNC);

  data = this.hojeIso();
  somenteAlertas = signal(false);
  loading = signal(false);
  syncing = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  painel = signal<EscalaPainelResponse | null>(null);

  readonly itensFiltrados = computed(() => {
    const itens = this.painel()?.itens ?? [];
    if (!this.somenteAlertas()) {
      return itens;
    }
    return itens.filter((i) => i.alertaRetidoNaEscala || i.alertaAutonomia);
  });

  onSomenteAlertasChange(checked: boolean): void {
    this.somenteAlertas.set(!!checked);
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.escalaService.getPainel(this.data).subscribe({
      next: (res) => {
        this.painel.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.painel.set(null);
        this.error.set(
          err?.error?.message || err?.message || 'Erro ao carregar o painel.',
        );
      },
    });
  }

  sincronizarEscala(): void {
    if (!this.canSync || this.syncing()) {
      return;
    }
    this.syncing.set(true);
    this.error.set(null);
    this.success.set(null);
    this.escalaService.syncEscala(this.data).subscribe({
      next: (res) => {
        this.syncing.set(false);
        this.success.set(
          `Escala sincronizada: ${res.upserts} veículo(s), ${res.semVinculo} sem vínculo OMNI.`,
        );
        this.carregar();
      },
      error: (err) => {
        this.syncing.set(false);
        this.error.set(
          err?.error?.message || err?.message || 'Falha ao sincronizar escala.',
        );
      },
    });
  }

  sincronizarTelemetria(): void {
    if (!this.canSync || this.syncing()) {
      return;
    }
    this.syncing.set(true);
    this.error.set(null);
    this.success.set(null);
    this.escalaService.syncTelemetria().subscribe({
      next: (res) => {
        this.syncing.set(false);
        this.success.set(
          `Telemetria sincronizada: ${res.upserts} veículo(s), ${res.semVinculo} sem vínculo OMNI.`,
        );
        this.carregar();
      },
      error: (err) => {
        this.syncing.set(false);
        this.error.set(
          err?.error?.message ||
            err?.message ||
            'Falha ao sincronizar telemetria.',
        );
      },
    });
  }

  linhasResumo(item: EscalaPainelItem): string {
    if (!item.linhas?.length) {
      return '—';
    }
    return item.linhas
      .map((l) => `${l.linha ?? '?'} (${l.km ?? 0} km)`)
      .join(', ');
  }

  fmtKm(valor: number | null | undefined): string {
    if (valor == null || !Number.isFinite(valor)) {
      return '—';
    }
    return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
  }

  private hojeIso(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
