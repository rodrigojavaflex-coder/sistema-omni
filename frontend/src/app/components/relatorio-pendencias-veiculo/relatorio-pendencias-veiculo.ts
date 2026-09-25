import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VistoriaService } from '../../services/vistoria.service';
import {
  IrregularidadeHistoricoVeiculoItem,
} from '../../models/vistoria.model';
import { Veiculo, StatusVeiculo } from '../../models/veiculo.model';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';

interface OptionItem {
  id: string;
  nome: string;
}

@Component({
  selector: 'app-relatorio-pendencias-veiculo',
  standalone: true,
  imports: [CommonModule, FormsModule, VeiculoAutocompleteComponent],
  templateUrl: './relatorio-pendencias-veiculo.html',
  styleUrls: ['./relatorio-pendencias-veiculo.css'],
})
export class RelatorioPendenciasVeiculoComponent {
  private readonly vistoriaService = inject(VistoriaService);

  readonly statusAtivo = StatusVeiculo.ATIVO;

  loading = false;
  gerandoPdf = false;
  errorMessage = '';
  pdfErrorMessage = '';
  veiculoId = '';
  veiculoDescricao = '';
  total = 0;
  itens: IrregularidadeHistoricoVeiculoItem[] = [];
  areaOptions: OptionItem[] = [];
  componenteOptions: OptionItem[] = [];
  areaFiltro = '';
  componenteFiltro = '';

  get itensFiltrados(): IrregularidadeHistoricoVeiculoItem[] {
    return this.itens.filter((item) => {
      const byArea = !this.areaFiltro || item.idarea === this.areaFiltro;
      const byComponente =
        !this.componenteFiltro || item.idcomponente === this.componenteFiltro;
      return byArea && byComponente;
    });
  }

  onVeiculoSelected(veiculo: Veiculo): void {
    this.veiculoId = veiculo.id;
    this.veiculoDescricao = veiculo.descricao || '-';
    this.pdfErrorMessage = '';
    this.carregar(veiculo.id);
  }

  onVeiculoIdChange(value: string | null): void {
    if (!value) {
      this.resetState();
    }
  }

  onAreaChange(): void {
    if (!this.areaFiltro) {
      this.componenteFiltro = '';
      this.rebuildComponenteOptions();
      return;
    }
    const componentesDaArea = this.itens
      .filter((item) => item.idarea === this.areaFiltro)
      .map((item) => ({
        id: item.idcomponente,
        nome: item.nomeComponente ?? 'Componente',
      }));
    this.componenteOptions = this.deduplicateOptions(componentesDaArea);
    if (
      this.componenteFiltro &&
      !this.componenteOptions.some((option) => option.id === this.componenteFiltro)
    ) {
      this.componenteFiltro = '';
    }
  }

  formatarData(dateIso?: string): string {
    if (!dateIso) {
      return '-';
    }
    const date = new Date(dateIso);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleString('pt-BR');
  }

  quantidadeImagens(item: IrregularidadeHistoricoVeiculoItem): number {
    return (item.midias ?? []).filter((m) => m.tipo === 'imagem').length;
  }

  quantidadeAudios(item: IrregularidadeHistoricoVeiculoItem): number {
    return (item.midias ?? []).filter((m) => m.tipo === 'audio').length;
  }

  gerarRelatorioPdf(): void {
    if (!this.veiculoId || this.gerandoPdf) {
      return;
    }
    this.gerandoPdf = true;
    this.pdfErrorMessage = '';
    this.vistoriaService
      .baixarPdfPendenciasVeiculo(this.veiculoId, {
        areaId: this.areaFiltro || undefined,
        componenteId: this.componenteFiltro || undefined,
      })
      .subscribe({
        next: async (blob) => {
          try {
            await this.abrirPdf(blob);
          } catch (error: unknown) {
            this.pdfErrorMessage = this.mensagemErroPdf(error);
          } finally {
            this.gerandoPdf = false;
          }
        },
        error: (err: unknown) => {
          this.pdfErrorMessage = this.mensagemErroPdf(err);
          this.gerandoPdf = false;
        },
      });
  }

  private carregar(veiculoId: string): void {
    this.areaFiltro = '';
    this.componenteFiltro = '';
    this.loading = true;
    this.errorMessage = '';
    this.vistoriaService.listarHistoricoIrregularidadesNaoResolvidas(veiculoId).subscribe({
      next: (response) => {
        this.veiculoDescricao = response.veiculo || this.veiculoDescricao || '-';
        this.total = response.total ?? 0;
        this.itens = response.itens ?? [];
        this.areaOptions = this.deduplicateOptions(
          this.itens.map((item) => ({
            id: item.idarea,
            nome: item.nomeArea ?? 'Área',
          })),
        );
        this.rebuildComponenteOptions();
        this.loading = false;
      },
      error: (err: unknown) => {
        this.errorMessage = this.extractErrorMessage(
          err,
          'Não foi possível carregar as pendências do veículo.',
        );
        this.itens = [];
        this.total = 0;
        this.areaOptions = [];
        this.componenteOptions = [];
        this.loading = false;
      },
    });
  }

  private resetState(): void {
    this.veiculoId = '';
    this.veiculoDescricao = '';
    this.total = 0;
    this.itens = [];
    this.areaFiltro = '';
    this.componenteFiltro = '';
    this.areaOptions = [];
    this.componenteOptions = [];
    this.errorMessage = '';
    this.pdfErrorMessage = '';
  }

  private rebuildComponenteOptions(): void {
    const source = this.areaFiltro
      ? this.itens.filter((item) => item.idarea === this.areaFiltro)
      : this.itens;
    this.componenteOptions = this.deduplicateOptions(
      source.map((item) => ({
        id: item.idcomponente,
        nome: item.nomeComponente ?? 'Componente',
      })),
    );
  }

  private deduplicateOptions(items: OptionItem[]): OptionItem[] {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item.nome);
      }
    });
    return Array.from(map.entries()).map(([id, nome]) => ({ id, nome }));
  }

  private async abrirPdf(blob: Blob): Promise<void> {
    if (!blob?.size) {
      throw new Error('O servidor retornou um PDF vazio.');
    }
    const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
    const isPdf =
      head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46;
    if (!isPdf) {
      let message =
        'Não foi possível abrir o PDF (arquivo corrompido ou formato inválido).';
      try {
        const text = await blob.text();
        const parsed = JSON.parse(text) as { message?: string };
        if (parsed?.message?.trim()) {
          message = parsed.message;
        }
      } catch {
        // mantém mensagem padrão
      }
      throw new Error(message);
    }
    const pdfBlob =
      blob.type === 'application/pdf'
        ? blob
        : new Blob([blob], { type: 'application/pdf' });
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  private mensagemErroPdf(error: unknown): string {
    const status = this.extractStatus(error);
    if (status === 403) {
      return 'Você não tem permissão para gerar o relatório PDF.';
    }
    if (status === 404) {
      return 'Relatório PDF não disponível neste ambiente. Verifique se a API está atualizada.';
    }
    return this.extractErrorMessage(error, 'Não foi possível gerar o relatório PDF.');
  }

  private extractStatus(error: unknown): number {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      return Number((error as { status?: number }).status) || 0;
    }
    return 0;
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const body = (error as { error?: unknown }).error;
      if (body instanceof Blob) {
        return fallback;
      }
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const msg = (body as { message?: string | string[] }).message;
        if (Array.isArray(msg)) {
          return msg.join(', ') || fallback;
        }
        if (typeof msg === 'string' && msg.trim()) {
          return msg;
        }
      }
      if (typeof body === 'string' && body.trim()) {
        return body;
      }
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const msg = String((error as { message: unknown }).message ?? '');
      if (msg.trim()) {
        return msg;
      }
    }
    return fallback;
  }
}
