import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare var google: any;

export interface PontoLocalizacao {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-mapa-localizacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-localizacao.component.html',
  styleUrls: ['./mapa-localizacao.component.css']
})
export class MapaLocalizacaoComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('containerMapa', { static: false }) containerMapa!: ElementRef;
  
  @Input() localizacaoInicial: PontoLocalizacao | null = null;
  @Input() enderecoInicial: string | null = null;
  @Input() endereco: string | null = null;
  @Input() zoom: number = 15;
  @Input() centro: [number, number] = [-16.656293, -49.331340]; // Goiânia, GO
  
  @Output() localizacaoSelecionada = new EventEmitter<PontoLocalizacao | null>();
  
  localizacaoSelecionada_interna: PontoLocalizacao | null = null;
  private mapa: any = null;
  private marcador: any = null;
  private apiKey: string = '';
  private geocoder: any = null;
  private currentTheme: 'light' | 'dark' = 'light';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.localizacaoInicial) {
      this.localizacaoSelecionada_interna = this.localizacaoInicial;
      this.centro = [this.localizacaoInicial.latitude, this.localizacaoInicial.longitude];
    }
    
    // Detectar tema escuro
    this.detectarTema();
    
    // Observar mudanças de tema
    this.observarMudancasTema();
    
    this.buscarChaveAPI();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar mudanças em localizacaoInicial (importante para edição de ocorrências)
    if (changes['localizacaoInicial'] && !changes['localizacaoInicial'].firstChange) {
      if (this.localizacaoInicial) {
        this.localizacaoSelecionada_interna = this.localizacaoInicial;
        this.centro = [this.localizacaoInicial.latitude, this.localizacaoInicial.longitude];
        
        // Se o mapa já foi criado, atualizar a posição
        if (this.mapa && this.marcador) {
          const posicao = { lat: this.localizacaoInicial.latitude, lng: this.localizacaoInicial.longitude };
          this.marcador.map = null; // Remover marcador antigo
          this.adicionarMarcador(this.localizacaoInicial.latitude, this.localizacaoInicial.longitude);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // Garantir que o container tenha um ID válido
    if (this.containerMapa && this.containerMapa.nativeElement) {
      this.containerMapa.nativeElement.id = 'mapa-container';
      this.cdr.detectChanges();
    }
    
    // Se a chave já foi carregada, criar o mapa
    if (this.apiKey) {
      setTimeout(() => this.criarMapa(), 50);
    }
  }

  private buscarChaveAPI(): void {
    this.http.get<{ key: string }>('/api/config/google-maps-key').subscribe({
      next: (response) => {
        if (response.key) {
          this.apiKey = response.key;
          this.carregarGoogleMaps();
        } else {
          console.error('Erro: chave não obtida do servidor');
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar configuração da API do Google Maps', err);
      }
    });
  }

  private carregarGoogleMaps(): void {
    const win = window as any;
    if (win.google && win.google.maps) {
      // Google Maps já foi carregado
      setTimeout(() => this.criarMapa(), 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&loading=async&libraries=marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Garantir que o container tem ID antes de criar o mapa
      if (this.containerMapa && this.containerMapa.nativeElement) {
        this.containerMapa.nativeElement.id = 'mapa-container';
      }
      // Aguardar um pouco para garantir que tudo está pronto
      setTimeout(() => this.criarMapa(), 200);
    };
    
    script.onerror = (error: any) => {
      console.error('Erro ao carregar Google Maps');
    };

    document.head.appendChild(script);
  }

  private criarMapa(): void {
    // Verificações preliminares
    if (!this.containerMapa || !this.containerMapa.nativeElement) {
      console.error('Container não disponível');
      setTimeout(() => this.criarMapa(), 100);
      return;
    }

    const win = window as any;
    if (!win.google || !win.google.maps) {
      console.error('Google Maps API não foi carregada');
      return;
    }

    try {
      const container = this.containerMapa.nativeElement;
      
      // Garantir que o container tem ID válido
      if (!container.id) {
        container.id = 'mapa-container';
      }

      // Garantir que o container está visível e tem dimensões
      if (container.offsetHeight === 0 || container.offsetWidth === 0) {
        console.error('Container sem dimensões válidas');
        return;
      }

      const centroMapa = {
        lat: this.localizacaoSelecionada_interna?.latitude || this.centro[0],
        lng: this.localizacaoSelecionada_interna?.longitude || this.centro[1]
      };

      const mapOptions = {
        center: centroMapa,
        zoom: this.zoom,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
        mapTypeId: win.google.maps.MapTypeId.ROADMAP,
        mapId: 'mapa-container', // Necessário para AdvancedMarkerElement
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180
          }
        }
      };

      // Criar o mapa no container com ID válido
      this.mapa = new win.google.maps.Map(container, mapOptions);
      
      // Aplicar estilos noturnos se tema escuro (sem usar styles property)
      if (this.currentTheme === 'dark') {
        this.aplicarTemaNoturnoCSS();
      }
      
      // Adicionar listener de clique
      this.mapa.addListener('click', (evento: any) => {
        if (evento.latLng) {
          const lat = evento.latLng.lat();
          const lng = evento.latLng.lng();
          this.definirLocalizacao(lat, lng);
        }
      });

      // Se houver localização inicial, adicionar marcador
      if (this.localizacaoSelecionada_interna) {
        this.adicionarMarcador(
          this.localizacaoSelecionada_interna.latitude,
          this.localizacaoSelecionada_interna.longitude
        );
      }
    } catch (error) {
      console.error('Erro ao criar mapa:', error);
    }
  }

  private geocodificarEndereco(endereco: string): void {
    if (!endereco || endereco.trim() === '') {
      return;
    }

    const win = window as any;
    if (!win.google || !win.google.maps) {
      console.error('Google Maps API não foi carregada');
      return;
    }

    // Inicializar geocoder se ainda não foi
    if (!this.geocoder) {
      this.geocoder = new win.google.maps.Geocoder();
    }

    this.geocoder.geocode({ address: endereco }, (results: any[], status: string) => {
      if (status === win.google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;
        const latitude = location.lat();
        const longitude = location.lng();
        
        // Definir localização e adicionar marcador
        this.definirLocalizacao(latitude, longitude);
      } else {
        console.warn(`Geocodificação falhou: ${status}`);
      }
    });
  }

  private definirLocalizacao(latitude: number, longitude: number): void {
    this.localizacaoSelecionada_interna = { latitude, longitude };
    this.cdr.detectChanges(); // Forçar detecção de mudanças
    this.adicionarMarcador(latitude, longitude);
    this.localizacaoSelecionada.emit(this.localizacaoSelecionada_interna);
  }

  private adicionarMarcador(latitude: number, longitude: number): void {
    if (!this.mapa) {
      console.error('Mapa não foi inicializado');
      return;
    }

    try {
      const win = window as any;
      
      // Remover marcador anterior
      if (this.marcador) {
        if (this.marcador.map !== undefined) {
          this.marcador.map = null;
        } else if (this.marcador.setMap) {
          this.marcador.setMap(null);
        }
        this.marcador = null;
      }

      const posicao = { lat: latitude, lng: longitude };

      // Usar AdvancedMarkerElement (recomendado pelo Google)
      const markerContent = document.createElement('div');
      markerContent.innerHTML = `
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <path d="M16 0C9.4 0 4 5.4 4 12c0 8 12 28 12 28s12-20 12-28c0-6.6-5.4-12-12-12z" fill="#FF5722"/>
          <circle cx="16" cy="12" r="5" fill="white"/>
        </svg>`;

      this.marcador = new win.google.maps.marker.AdvancedMarkerElement({
        position: posicao,
        map: this.mapa,
        title: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        content: markerContent
      });

      // Criar InfoWindow
      const infoWindow = new win.google.maps.InfoWindow({
        content: `<div style="color: #333; font-family: Arial; font-size: 13px; padding: 10px; min-width: 250px;">
                    <b style="color: #FF5722; font-size: 14px;">Localização da Ocorrência</b><br/>
                    ${this.endereco ? `<div style="margin: 5px 0; font-size: 12px; color: #666;"><i>Endereço: ${this.endereco}</i></div>` : ''}
                    <hr style="margin: 5px 0; border: none; border-top: 1px solid #ddd;"/>
                    <b>Latitude:</b> ${latitude.toFixed(6)}<br/>
                    <b>Longitude:</b> ${longitude.toFixed(6)}
                  </div>`
      });

      // Adicionar listener de clique
      this.marcador.addListener('click', () => {
        infoWindow.open(this.mapa, this.marcador);
      });

      // Abrir InfoWindow automaticamente
      infoWindow.open(this.mapa, this.marcador);

      // Centralizar mapa no marcador
      this.mapa.setCenter(posicao);
      this.mapa.setZoom(this.zoom);
    } catch (error) {
      console.error('Erro ao adicionar marcador:', error);
    }
  }

  geocodificarEnderecoDoCampo(endereco: string): void {
    if (endereco && endereco.trim() !== '') {
      this.geocodificarEndereco(endereco);
    }
  }

  obterGeometria(): any {
    if (!this.localizacaoSelecionada_interna) return null;
    return {
      type: 'Point',
      coordinates: [
        this.localizacaoSelecionada_interna.longitude,
        this.localizacaoSelecionada_interna.latitude
      ]
    };
  }

  private detectarTema(): void {
    const isDark = document.body.classList.contains('theme-dark');
    this.currentTheme = isDark ? 'dark' : 'light';
  }

  private observarMudancasTema(): void {
    // Observar mudanças na classe theme-dark do body
    const observer = new MutationObserver(() => {
      const isDark = document.body.classList.contains('theme-dark');
      const newTheme = isDark ? 'dark' : 'light';
      if (newTheme !== this.currentTheme) {
        this.currentTheme = newTheme;
        if (this.mapa) {
          this.aplicarEstiloMapa();
        }
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  private aplicarEstiloMapa(): void {
    if (!this.mapa) return;
    
    if (this.currentTheme === 'dark') {
      this.aplicarTemaNoturnoCSS();
    } else {
      this.removerTemaNoturnoCSS();
    }
  }

  private aplicarTemaNoturnoCSS(): void {
    const container = this.containerMapa?.nativeElement;
    if (container) {
      container.style.filter = 'invert(0.9) hue-rotate(200deg)';
    }
  }

  private removerTemaNoturnoCSS(): void {
    const container = this.containerMapa?.nativeElement;
    if (container) {
      container.style.filter = 'none';
    }
  }

  private getEstilosNoturnos(): any[] {
    return [
      {
        elementType: 'geometry',
        stylers: [{ color: '#242f3e' }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#242f3e' }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9080' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3751ff' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ];
  }
}
