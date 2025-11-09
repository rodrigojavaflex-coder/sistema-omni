export interface Trecho {
  id: string;
  descricao: string;
  area?: GeoJSONPolygon;
  criadoEm: string;
  atualizadoEm: string;
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface CreateTrechoDto {
  descricao: string;
  area?: GeoJSONPolygon;
}

export interface UpdateTrechoDto extends Partial<CreateTrechoDto> {}
