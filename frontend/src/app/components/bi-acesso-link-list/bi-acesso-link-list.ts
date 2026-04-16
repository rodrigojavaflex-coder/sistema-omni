import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService, BiAcessoLinkService } from '../../services';
import {
  BiAcessoLink,
  CreateBiAcessoLinkDto,
} from '../../models/bi-acesso-link.model';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-bi-acesso-link-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bi-acesso-link-list.html',
  styleUrls: ['./bi-acesso-link-list.css'],
})
export class BiAcessoLinkListComponent implements OnInit {
  private readonly biAcessoService = inject(BiAcessoLinkService);
  private readonly formBuilder = inject(FormBuilder);
  readonly authService = inject(AuthService);

  readonly permissions = Permission;

  loading = false;
  saving = false;
  error: string | null = null;
  links: BiAcessoLink[] = [];
  editingId: string | null = null;

  readonly form = this.formBuilder.group({
    nomeMenu: ['', [Validators.required, Validators.maxLength(120)]],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    ordem: [1, [Validators.required, Validators.min(1)]],
    ativo: [true],
  });

  ngOnInit(): void {
    this.loadLinks();
  }

  loadLinks(): void {
    this.loading = true;
    this.error = null;
    this.biAcessoService.getAll(true).subscribe({
      next: (links) => {
        this.links = links;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar os links de BI.';
        this.loading = false;
      },
    });
  }

  startCreate(): void {
    this.editingId = null;
    this.form.reset({
      nomeMenu: '',
      url: '',
      ordem: 1,
      ativo: true,
    });
    this.error = null;
  }

  startEdit(link: BiAcessoLink): void {
    this.editingId = link.id;
    this.form.reset({
      nomeMenu: link.nomeMenu,
      url: link.url,
      ordem: link.ordem || 1,
      ativo: link.ativo,
    });
    this.error = null;
  }

  cancelEdit(): void {
    this.startCreate();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as CreateBiAcessoLinkDto;
    this.saving = true;
    this.error = null;

    const request$ = this.editingId
      ? this.biAcessoService.update(this.editingId, payload)
      : this.biAcessoService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.startCreate();
        this.loadLinks();
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.error =
          (error.error?.message as string) || 'Não foi possível salvar o link de BI.';
      },
    });
  }

  remove(link: BiAcessoLink): void {
    const confirmed = window.confirm(
      `Confirma a exclusão do link "${link.nomeMenu}"? Essa ação não pode ser desfeita.`,
    );
    if (!confirmed) {
      return;
    }

    this.error = null;
    this.biAcessoService.delete(link.id).subscribe({
      next: () => {
        if (this.editingId === link.id) {
          this.startCreate();
        }
        this.loadLinks();
      },
      error: (error: HttpErrorResponse) => {
        this.error =
          (error.error?.message as string) || 'Não foi possível excluir o link de BI.';
      },
    });
  }
}
