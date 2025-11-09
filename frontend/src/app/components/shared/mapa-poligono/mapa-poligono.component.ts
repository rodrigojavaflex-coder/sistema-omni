import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare var google: any;

export interface PontoLocalizacao {
  latitude: number;
  longitude: number;
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

@Component({
  selector: 'app-mapa-poligono',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-poligono.component.html',
  styleUrls: ['./mapa-poligono.component.css']
})
export class MapaPoligonoComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('containerMapa', { static: false }) containerMapa!: ElementRef;
  
  @Input() poligonoInicial: GeoJSONPolygon | null = null;
  @Input() poligonosExtras: GeoJSONPolygon[] = [];
  @Input() nomesPoligonos: string[] = []; // Nomes correspondentes aos poligonosExtras
  @Input() centro: [number, number] = [-16.656293, -49.331340];
  @Input() zoom: number = 12;
  @Input() modoEdicao: boolean = true;
  
  @Output() poligonoSelecionado = new EventEmitter<GeoJSONPolygon | null>();
  
  poligonoSelecionado_interna: GeoJSONPolygon | null = null;
  pontos: PontoLocalizacao[] = [];
  poligonoAtual: any = null;
  
  private mapa: any = null;
  private marcadores: any[] = [];
  private poligonosExtrasMapa: any[] = [];
  private infoWindowsExtras: any[] = []; // InfoWindows dos polígonos extras
  private apiKey: string = '';
  private geocoder: any = null;
  private currentTheme: 'light' | 'dark' = 'light';
  private isDragging: boolean = false;
  private clickListener: any = null;
  private carregandoPoligonoExterno: boolean = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.poligonoInicial?.coordinates[0]) {
      this.pontos = this.poligonoInicial.coordinates[0].map(coord => ({
        latitude: coord[0],
        longitude: coord[1]
      }));
      this.poligonoSelecionado_interna = this.poligonoInicial;
    }
    
    this.detectarTema();
    this.observarMudancasTema();
    this.buscarChaveAPI();
  }

  private iniciarMonitorInfoWindow(): void {
    // Método removido - causava loop infinito
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modoEdicao']) {
      this.aplicarModoEdicao();
    }

    // Processar poligonosExtras apenas se for primeira mudança ou se mudar a referência
    if (changes['poligonosExtras'] && this.mapa && !changes['poligonosExtras'].firstChange) {
      this.atualizarPoligonosExtras();
    }

    if (changes['poligonoInicial'] && !changes['poligonoInicial'].firstChange) {
      if (this.poligonoInicial?.coordinates[0]) {
        this.carregandoPoligonoExterno = true;

        this.pontos = this.poligonoInicial.coordinates[0].map(coord => ({
          latitude: coord[0],
          longitude: coord[1]
        }));

        if (this.pontos.length > 1) {
          const primeiro = this.pontos[0];
          const ultimo = this.pontos[this.pontos.length - 1];
          if (primeiro.latitude === ultimo.latitude && primeiro.longitude === ultimo.longitude) {
            this.pontos.pop();
          }
        }

        this.poligonoSelecionado_interna = this.poligonoInicial;

        if (this.mapa) {
          this.removerMarcadores();

          if (this.poligonoAtual) {
            this.poligonoAtual.setMap(null);
            this.poligonoAtual = null;
          }

          // Desenhar sem zoom automático em modo edição
          this.redesenharPoligono(this.modoEdicao === false);
        }

        this.carregandoPoligonoExterno = false;
      } else if (changes['poligonoInicial'].previousValue) {
        this.limparElementosEdicao(true);
      }
    }

    if (this.apiKey && this.mapa === null) {
      setTimeout(() => this.criarMapa(), 50);
    }
  }

  ngAfterViewInit(): void {
    // Angular lifecycle hook para após a view ser inicializada
  }

  private aplicarModoEdicao(): void {
    if (!this.modoEdicao && this.clickListener) {
      (window as any).google.maps.event.removeListener(this.clickListener);
      this.clickListener = null;
    } else if (this.modoEdicao && this.mapa && !this.clickListener) {
      this.clickListener = this.mapa.addListener('click', (evento: any) => {
        if (this.isDragging) return;
        if (evento.latLng) {
          this.adicionarPonto(evento.latLng.lat(), evento.latLng.lng());
        }
      });
    }
  }

  private atualizarPoligonosExtras(): void {
    // Limpar polígonos extras antigos
    this.poligonosExtrasMapa.forEach(poly => poly.setMap(null));
    this.poligonosExtrasMapa = [];

    // Adicionar novos polígonos extras
    this.poligonosExtras.forEach((geoJson, index) => {
      if (geoJson.coordinates[0]) {
        const posicoes = geoJson.coordinates[0].map(coord => ({
          lat: coord[0],
          lng: coord[1]
        }));

        const cores = ['#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4'];
        const cor = cores[index % cores.length];

        const polygon = new (window as any).google.maps.Polygon({
          paths: posicoes,
          strokeColor: cor,
          strokeOpacity: 0.7,
          strokeWeight: 2,
          fillColor: cor,
          fillOpacity: 0.25,
          map: this.mapa,
          draggable: false,
          editable: false
        });

        this.poligonosExtrasMapa.push(polygon);
      }
    });
  }

  // Método público para atualizar polígonos extras manualmente (evita loop infinito)
  atualizarPoligonosExtrasManual(poligonos: GeoJSONPolygon[], nomes: string[] = []): void {
    if (!this.mapa) return;

    // Limpar polígonos extras antigos
    this.poligonosExtrasMapa.forEach(poly => poly.setMap(null));
    this.poligonosExtrasMapa = [];

    // Limpar InfoWindows antigos
    this.infoWindowsExtras.forEach(iw => iw.close());
    this.infoWindowsExtras = [];

    // Adicionar novos polígonos extras
    poligonos.forEach((geoJson, index) => {
      if (geoJson.coordinates[0]) {
        const posicoes = geoJson.coordinates[0].map(coord => ({
          lat: coord[0],
          lng: coord[1]
        }));

        const cores = ['#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4'];
        const cor = cores[index % cores.length];

        const polygon = new (window as any).google.maps.Polygon({
          paths: posicoes,
          strokeColor: cor,
          strokeOpacity: 0.7,
          strokeWeight: 2,
          fillColor: cor,
          fillOpacity: 0.25,
          map: this.mapa,
          draggable: false,
          editable: false
        });

        this.poligonosExtrasMapa.push(polygon);

        // Adicionar label com o nome do trecho
        const nome = nomes[index] || `Área ${index + 1}`;
        this.adicionarLabelPoligono(polygon, nome, posicoes);
      }
    });
  }

  // Método para adicionar um label (InfoWindow) no centro do polígono
  private adicionarLabelPoligono(polygon: any, nome: string, posicoes: any[]): void {
    if (posicoes.length === 0) return;

    try {
      // Calcular o centro do polígono (média de todos os pontos)
      let sumLat = 0, sumLng = 0;
      posicoes.forEach(pos => {
        sumLat += pos.lat;
        sumLng += pos.lng;
      });
      const centroLat = sumLat / posicoes.length;
      const centroLng = sumLng / posicoes.length;

      // Criar HTML do balão - apenas texto preto e branco
      const isDarkTheme = this.currentTheme === 'dark';
      const bgColor = isDarkTheme ? '#000000' : '#ffffff';
      const textColor = isDarkTheme ? '#ffffff' : '#000000';
      
      const htmlContent = `<div style="background-color: ${bgColor}; color: ${textColor}; padding: 2px 4px;">${nome}</div>`;

      // Criar InfoWindow
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: htmlContent,
        position: { lat: centroLat, lng: centroLng }
      });

      infoWindow.open(this.mapa);
      this.infoWindowsExtras.push(infoWindow);
    } catch (error) {
      console.error('Erro ao adicionar label no polígono:', error);
    }
  }

  // Método público para fazer zoom automático em um polígono GeoJSON
  zoomEmPoligono(geoJson: GeoJSONPolygon): void {
    if (!geoJson.coordinates[0] || !this.mapa) return;

    try {
      const posicoes = geoJson.coordinates[0].map(coord => ({
        lat: coord[0],
        lng: coord[1]
      }));

      const bounds = new (window as any).google.maps.LatLngBounds();
      posicoes.forEach(pos => bounds.extend(pos));
      this.mapa.fitBounds(bounds);
    } catch (error) {
      console.error('Erro ao fazer zoom no polígono:', error);
    }
  }

  // Método para fazer zoom automático em um polígono GeoJSON
  private fitBoundsPoligono(geoJson: GeoJSONPolygon): void {
    if (!geoJson.coordinates[0]) return;

    try {
      const posicoes = geoJson.coordinates[0].map(coord => ({
        lat: coord[0],
        lng: coord[1]
      }));

      const bounds = new (window as any).google.maps.LatLngBounds();
      posicoes.forEach(pos => bounds.extend(pos));
      this.mapa.fitBounds(bounds);
    } catch (error) {
      console.error('Erro ao fazer zoom no polígono:', error);
    }
  }

  private removerMarcadores(): void {
    this.marcadores.forEach(m => {
      if (m.marcador) {
        m.marcador.map = null;
      }
    });
    this.marcadores = [];
  }

  private limparElementosEdicao(limparPontos: boolean = false): void {
    this.removerMarcadores();
    
    if (this.poligonoAtual) {
      this.poligonoAtual.setMap(null);
      this.poligonoAtual = null;
    }

    if (limparPontos) {
      this.pontos = [];
    }

    this.poligonosExtrasMapa.forEach(poly => poly.setMap(null));
    this.poligonosExtrasMapa = [];
  }

  private buscarChaveAPI(): void {
    this.http.get<{ key: string }>('/api/config/google-maps-key').subscribe(
      (response) => {
        this.apiKey = response.key;
        this.carregarGoogleMaps();
      },
      (error) => console.error('Erro ao buscar chave:', error)
    );
  }

  private carregarGoogleMaps(): void {
    const win = window as any;
    if (win.google?.maps) {
      setTimeout(() => this.criarMapa(), 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&loading=async&libraries=marker,drawing`;
    script.async = true;
    script.defer = true;
    script.onload = () => setTimeout(() => this.criarMapa(), 200);
    script.onerror = () => console.error('Erro ao carregar Google Maps');
    document.head.appendChild(script);
  }

  private criarMapa(): void {
    if (!this.containerMapa?.nativeElement || !(window as any).google?.maps) return;

    try {
      const container = this.containerMapa.nativeElement;
      container.id = 'mapa-poligono-container';

      this.mapa = new (window as any).google.maps.Map(container, {
        center: { lat: this.centro[0], lng: this.centro[1] },
        zoom: this.zoom,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
        mapTypeId: (window as any).google.maps.MapTypeId.ROADMAP,
        mapId: 'mapa-poligono-container'  // NECESSÁRIO para AdvancedMarkerElement
      });

      if (this.currentTheme === 'dark') {
        this.aplicarTemaNoturnoCSS();
      }

      // Listener para adicionar pontos - APENAS em modo edição
      if (this.modoEdicao) {
        this.clickListener = this.mapa.addListener('click', (evento: any) => {
          if (this.isDragging) return;
          if (evento.latLng) {
            this.adicionarPonto(evento.latLng.lat(), evento.latLng.lng());
          }
        });
      }

      if (this.pontos.length > 0) {
        this.redesenharPoligono();
      }
    } catch (error) {
      console.error('Erro ao criar mapa:', error);
    }
  }

  private adicionarPonto(lat: number, lng: number): void {
    if (!this.mapa) return;
    
    this.pontos.push({ latitude: lat, longitude: lng });
    this.adicionarMarcador(lat, lng, this.pontos.length);
    
    if (this.pontos.length >= 3) {
      this.atualizarPoligono();
    }
  }

  private atualizarPoligono(): void {
    if (this.pontos.length < 3 || !this.mapa) return;

    try {
      // Remover polígono antigo
      if (this.poligonoAtual) {
        this.poligonoAtual.setMap(null);
        this.poligonoAtual = null;
      }

      const posicoes = this.pontos.map(p => ({ lat: p.latitude, lng: p.longitude }));

      // Criar novo polígono com as posições atualizadas
      this.poligonoAtual = new (window as any).google.maps.Polygon({
        paths: posicoes,
        strokeColor: '#FF5722',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF5722',
        fillOpacity: 0.35,
        map: this.mapa,
        draggable: false,
        editable: false
      });

      this.emitirPoligono();
    } catch (error) {
      console.error('Erro ao atualizar polígono:', error);
    }
  }

  private adicionarMarcador(lat: number, lng: number, indice: number): void {
    if (!this.mapa) return;

    try {
      const win = window as any;
      const markerContent = document.createElement('div');
      markerContent.innerHTML = `
        <div style="position: absolute; left: -24px; top: -38px; width: 48px; height: 38px; display: flex; align-items: center; justify-content: center; gap: 0px;">
          <!-- PIN com bordas (estilo mapa) -->
          <div style="
            position: relative;
            width: 30px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            transition: all 0.2s ease;
            flex-shrink: 0;
            z-index: 2;
          "
          id="marker-pin-${indice}">
            <!-- Corpo do PIN -->
            <svg viewBox="0 0 40 50" width="24" height="32" style="position: absolute; top: 0; left: 3px;">
              <defs>
                <linearGradient id="grad-${indice}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF5722;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#FF6F42;stop-opacity:1" />
                </linearGradient>
              </defs>
              <!-- Desenho do PIN -->
              <path d="M 20 0 C 30 0 38 8 38 18 C 38 28 20 48 20 48 C 20 48 2 28 2 18 C 2 8 10 0 20 0 Z" 
                    fill="url(#grad-${indice})" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <!-- Número dentro do PIN -->
            <span style="
              position: absolute;
              color: white;
              font-size: 13px;
              font-weight: bold;
              z-index: 1;
              top: 4px;
            ">
              ${indice}
            </span>
          </div>
          
          <!-- Botão de fechar (X) à direita -->
          <div style="
            background: #ff4444;
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid white;
            transition: all 0.2s ease;
            flex-shrink: 0;
            z-index: 3;
            margin-left: -6px;
            margin-top: -40px;
          "
          id="close-btn-${indice}"
          title="Clique para remover">
            ✕
          </div>
        </div>`;

      const marcador = new win.google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        map: this.mapa,
        title: `Ponto ${indice}`,
        content: markerContent,
        gmpDraggable: true
      });

      // Referência ao botão de fechar
      const closeBtn = markerContent.querySelector(`#close-btn-${indice}`) as HTMLElement;
      const markerPin = markerContent.querySelector(`#marker-pin-${indice}`) as HTMLElement;

      // Click no X para remover
      if (closeBtn) {
        closeBtn.addEventListener('click', (e: any) => {
          e.stopPropagation();
          if (!this.isDragging) {
            this.removerPonto(indice - 1);
          }
        });

        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.transform = 'scale(1.2)';
          closeBtn.style.backgroundColor = '#ff2222';
        });

        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.transform = 'scale(1)';
          closeBtn.style.backgroundColor = '#ff4444';
        });
      }

      // Drag para mover
      marcador.addListener('dragstart', () => {
        this.isDragging = true;
        if (markerPin) markerPin.style.cursor = 'grabbing';
      });

      marcador.addListener('dragend', (event: any) => {
        this.isDragging = false;
        if (markerPin) markerPin.style.cursor = 'grab';
        if (event?.latLng && indice - 1 >= 0 && indice - 1 < this.pontos.length) {
          this.pontos[indice - 1] = {
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng()
          };
          this.atualizarPoligonoMarcador(indice - 1, event.latLng.lat(), event.latLng.lng());
          // Emitir o polígono atualizado para o parent
          this.emitirPoligono();
        }
      });

      this.marcadores.push({ marcador, indice });

      // Hover no marcador PIN
      if (markerPin) {
        markerPin.addEventListener('mouseenter', () => {
          markerPin.style.transform = 'scale(1.15)';
        });

        markerPin.addEventListener('mouseleave', () => {
          markerPin.style.transform = 'scale(1)';
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar marcador:', error);
    }
  }

  private redesenharPoligono(comZoom: boolean = false): void {
    if (this.pontos.length < 3 || !this.mapa) return;

    try {
      // Remover marcadores antigos
      this.marcadores.forEach(m => {
        m.marcador.map = null;
      });
      this.marcadores = [];

      // Remover polígono antigo
      if (this.poligonoAtual) {
        this.poligonoAtual.setMap(null);
        this.poligonoAtual = null;
      }

      // Criar novos marcadores
      this.pontos.forEach((ponto, index) => {
        this.adicionarMarcador(ponto.latitude, ponto.longitude, index + 1);
      });

      const posicoes = this.pontos.map(p => ({ lat: p.latitude, lng: p.longitude }));

      this.poligonoAtual = new (window as any).google.maps.Polygon({
        paths: posicoes,
        strokeColor: '#FF5722',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF5722',
        fillOpacity: 0.35,
        map: this.mapa,
        draggable: false,
        editable: false
      });

      // Fazer zoom automático apenas quando solicitado (não em modo edição)
      if (comZoom) {
        const bounds = new (window as any).google.maps.LatLngBounds();
        posicoes.forEach(pos => bounds.extend(pos));
        this.mapa.fitBounds(bounds);
      }

      this.emitirPoligono();
    } catch (error) {
      console.error('Erro ao redesenhar:', error);
    }
  }

  private atualizarPoligonoMarcador(indice: number, lat: number, lng: number): void {
    if (!this.poligonoAtual || this.pontos.length < 3) return;

    try {
      const path = this.poligonoAtual.getPath();
      if (path && path.setAt) {
        path.setAt(indice, new (window as any).google.maps.LatLng(lat, lng));
      }
    } catch (error) {
      console.error('Erro ao atualizar polígono:', error);
    }
  }

  private removerPonto(indice: number): void {
    if (indice < 0 || indice >= this.pontos.length) return;

    // Remover marcador com índice = indice + 1
    const marcadorObj = this.marcadores.find(m => m.indice === indice + 1);
    if (marcadorObj) {
      marcadorObj.marcador.map = null;
      this.marcadores = this.marcadores.filter(m => m.indice !== indice + 1);
    }

    // Remover ponto do array
    this.pontos.splice(indice, 1);

    // Reconstruir marcadores com nova numeração
    const marcadoresAntigos = [...this.marcadores];
    this.marcadores = [];
    
    marcadoresAntigos.forEach(m => {
      // Remover marcador antigo
      m.marcador.map = null;
      
      // Calcular novo índice
      let novoIndice = m.indice;
      if (m.indice > indice + 1) {
        novoIndice = m.indice - 1;
      }
      
      // Recriar marcador com novo índice e ponto correto
      if (novoIndice - 1 >= 0 && novoIndice - 1 < this.pontos.length) {
        const ponto = this.pontos[novoIndice - 1];
        this.adicionarMarcador(ponto.latitude, ponto.longitude, novoIndice);
      }
    });

    // Atualizar polígono
    if (this.pontos.length < 3) {
      if (this.poligonoAtual) {
        this.poligonoAtual.setMap(null);
        this.poligonoAtual = null;
      }
    } else {
      this.atualizarPoligono();
    }
  }

  private emitirPoligono(): void {
    // NÃO emitir enquanto estamos carregando um polígono externo para evitar loops
    if (this.carregandoPoligonoExterno) return;
    
    if (this.pontos.length >= 3) {
      const coordenadas = this.pontos.map(p => [p.latitude, p.longitude]);
      coordenadas.push(coordenadas[0]);
      
      this.poligonoSelecionado_interna = {
        type: 'Polygon',
        coordinates: [coordenadas]
      };
      
      this.poligonoSelecionado.emit(this.poligonoSelecionado_interna);
    }
  }

  private limparTudo(): void {
    this.marcadores.forEach(m => {
      m.marcador.map = null;
    });
    this.marcadores = [];
    this.pontos = [];

    if (this.poligonoAtual) {
      this.poligonoAtual.setMap(null);
      this.poligonoAtual = null;
    }
  }

  obterGeometria(): GeoJSONPolygon | null {
    return this.poligonoSelecionado_interna;
  }

  buscarLocalizacao(endereco: string): void {
    if (!endereco?.trim() || !this.mapa) return;

    const win = window as any;
    if (!this.geocoder) {
      this.geocoder = new win.google.maps.Geocoder();
    }

    this.geocoder.geocode({ address: endereco }, (results: any[], status: any) => {
      if (status === win.google.maps.GeocoderStatus.OK && results.length > 0) {
        // Limpar pontos e polígono ao buscar nova localização
        this.limparTudo();
        this.poligonoSelecionado_interna = null;
        this.poligonoSelecionado.emit(null);

        const location = results[0].geometry.location;
        const bounds = results[0].geometry.bounds;

        this.mapa.setCenter(location);
        if (bounds) {
          this.mapa.fitBounds(bounds);
        } else {
          this.mapa.setZoom(14);
        }
      } else {
        alert('Localização não encontrada.');
      }
    });
  }

  private detectarTema(): void {
    this.currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
  }

  private observarMudancasTema(): void {
    const observer = new MutationObserver(() => {
      const novoTema = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
      if (novoTema !== this.currentTheme) {
        this.currentTheme = novoTema;
        if (this.currentTheme === 'dark') {
          this.aplicarTemaNoturnoCSS();
        } else {
          this.removerTemaNoturnoCSS();
        }
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  private aplicarTemaNoturnoCSS(): void {
    if (this.containerMapa?.nativeElement) {
      this.containerMapa.nativeElement.style.filter = 'invert(0.9) hue-rotate(200deg)';
    }
  }

  private removerTemaNoturnoCSS(): void {
    if (this.containerMapa?.nativeElement) {
      this.containerMapa.nativeElement.style.filter = 'none';
    }
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener.remove();
    }
    this.limparTudo();
    if (this.mapa) {
      this.mapa = null;
    }
  }
}
