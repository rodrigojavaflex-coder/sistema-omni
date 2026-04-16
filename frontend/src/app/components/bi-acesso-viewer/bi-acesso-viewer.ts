import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BiAcessoLinkService } from '../../services';

@Component({
  selector: 'app-bi-acesso-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bi-acesso-viewer.html',
  styleUrls: ['./bi-acesso-viewer.css'],
})
export class BiAcessoViewerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly biAcessoService = inject(BiAcessoLinkService);
  private readonly sanitizer = inject(DomSanitizer);

  loading = true;
  error: string | null = null;
  iframeUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    const linkId = this.route.snapshot.paramMap.get('id');
    if (!linkId) {
      this.loading = false;
      this.error = 'Link de BI inválido.';
      return;
    }

    this.biAcessoService.getAccessibleLink(linkId).subscribe({
      next: (data) => {
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
        this.loading = false;
      },
      error: (err) => {
        this.error =
          (err?.error?.message as string) ||
          'Não foi possível abrir esse painel de BI.';
        this.loading = false;
      },
    });
  }

  voltarAoSistema(): void {
    this.router.navigate(['/']);
  }
}
