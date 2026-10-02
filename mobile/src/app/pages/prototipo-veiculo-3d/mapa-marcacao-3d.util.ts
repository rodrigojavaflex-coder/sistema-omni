/**
 * Mapeia marcação 2D (vista + %) → hotspot 3D no bounding box do model-viewer.
 * Aproximação visual (RN-VIS-009) — alinhada ao mapa de avaria OMNI:
 * - LADO ESQUERDO: frente à esquerda no desenho
 * - LADO DIREITO: frente à direita no desenho (inverte X%)
 * - FRENTE: espelha X% no eixo Z (direita no desenho = direita na tela 3D)
 * - FRENTE/TRASEIRA: leve offset para baixo no Y
 * - Bbox glTF centrado na origem (model-viewer)
 * - Meshy: +Z = lado esquerdo do veículo, −Z = lado direito
 */

export interface DimensoesModelo3d {
  x: number;
  y: number;
  z: number;
}

export type FaceVista3d =
  | 'esquerda'
  | 'direita'
  | 'frente'
  | 'traseira'
  | 'teto'
  | 'desconhecida';

export interface PosicaoHotspot3d {
  position: string;
  normal: string;
  face: FaceVista3d;
}

/** Fallback se getDimensions() ainda não estiver pronto. */
export const DIMENSOES_ONIBUS_FALLBACK: DimensoesModelo3d = {
  x: 12,
  y: 3.2,
  z: 2.6,
};

/** Fator para colar o pin na carroceria (bbox costuma ser maior que o mesh). */
const FATOR_LATERAL = 0.82;
type FaceLateralOrbit = 'frente' | 'traseira' | 'esquerda' | 'direita';

/**
 * Model-viewer: theta=0 → câmera em +Z; +π/2 → +X; −π/2 → −X.
 * Meshy: frente=−X, traseira=+X, esquerda=+Z, direita=−Z.
 */
const LIMIAR_FACE_ORBIT = 0.42;

function normalizarTheta(thetaRad: number): number {
  let t = thetaRad % (Math.PI * 2);
  if (t > Math.PI) t -= Math.PI * 2;
  if (t < -Math.PI) t += Math.PI * 2;
  return t;
}

function scoresFaceOrbit(thetaRad: number): Record<FaceLateralOrbit, number> {
  const t = normalizarTheta(thetaRad);
  return {
    frente: Math.cos(t + Math.PI / 2),
    traseira: Math.cos(t - Math.PI / 2),
    esquerda: Math.cos(t),
    direita: Math.cos(t - Math.PI),
  };
}

/**
 * Frente/trás só quando dominam o perfil lateral (evita 1.1 da traseira no flanco).
 */
export function faceVisivelNoOrbit(
  face: FaceVista3d,
  thetaRad: number,
): boolean {
  if (face === 'teto' || face === 'desconhecida') {
    return true;
  }
  if (
    face !== 'frente' &&
    face !== 'traseira' &&
    face !== 'esquerda' &&
    face !== 'direita'
  ) {
    return false;
  }

  const scores = scoresFaceOrbit(thetaRad);
  const score = scores[face];
  if (score <= LIMIAR_FACE_ORBIT) {
    return false;
  }

  const lateralMax = Math.max(scores.esquerda, scores.direita);
  const longitudinalMax = Math.max(scores.frente, scores.traseira);

  if (face === 'frente' || face === 'traseira') {
    return score >= longitudinalMax && score > lateralMax;
  }

  return score >= lateralMax && score > longitudinalMax;
}

/** X% 0→esquerda da imagem. Traseira: +Z à esquerda do desenho. Frente: espelhado (ver abaixo). */
function zNaFaceLongitudinal(
  u: number,
  halfW: number,
  espelharHorizontal: boolean,
): number {
  const t = espelharHorizontal ? 2 * u - 1 : 1 - 2 * u;
  return halfW * FATOR_LATERAL * t;
}

/** Empurra pinos da frente/traseira um pouco para baixo (desenhos 2D vs bbox 3D). */
const OFFSET_Y_FRONTAL_FRAC = 0.08;

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

function formatM(n: number): string {
  return `${n.toFixed(3)}m`;
}

function normalizarVista(descricaoVista: string): string {
  return (descricaoVista ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function classificarFaceVista(descricaoVista: string): FaceVista3d {
  const d = normalizarVista(descricaoVista);
  if (d.includes('esquerd')) return 'esquerda';
  if (d.includes('direit')) return 'direita';
  if (d.includes('frent') || d.includes('diante')) return 'frente';
  if (d.includes('trase') || d.includes('rear')) return 'traseira';
  if (d.includes('teto') || d.includes('superior') || d.includes('cima')) {
    return 'teto';
  }
  return 'desconhecida';
}

/**
 * Eixos (bbox centrado, Meshy biometano):
 * - X: comprimento (− frente … + traseira)
 * - Y: altura (− baixo … + cima)
 * - Z: largura (+ esquerda … − direita) — invertido vs convenção “OpenGL”
 */
export function mapearMarcacaoParaHotspot3d(
  descricaoVista: string,
  posXPct: number,
  posYPct: number,
  dims: DimensoesModelo3d = DIMENSOES_ONIBUS_FALLBACK,
): PosicaoHotspot3d {
  const face = classificarFaceVista(descricaoVista);
  const u = clamp01(posXPct / 100);
  // Imagem: Y% 0 = topo, 100 = base → em 3D: topo = +Y, base = −Y
  const vTopToBottom = clamp01(posYPct / 100);

  const halfL = dims.x / 2;
  const halfH = dims.y / 2;
  const halfW = dims.z / 2;

  const y = halfH - vTopToBottom * dims.y;
  const yBody = Math.min(halfH * 0.88, Math.max(-halfH * 0.82, y));
  const yFrontal = Math.min(
    halfH * 0.88,
    Math.max(-halfH * 0.82, yBody - dims.y * OFFSET_Y_FRONTAL_FRAC),
  );

  switch (face) {
    case 'esquerda': {
      // Desenho: frente à esquerda → X−; Meshy: esquerda = +Z
      const x = -halfL + u * dims.x;
      return {
        position: `${formatM(x)} ${formatM(yBody)} ${formatM(halfW * FATOR_LATERAL)}`,
        normal: '0m 0m 1m',
        face,
      };
    }
    case 'direita': {
      // Desenho: frente à direita → inverte X%; Meshy: direita = −Z
      const x = -halfL + (1 - u) * dims.x;
      return {
        position: `${formatM(x)} ${formatM(yBody)} ${formatM(-halfW * FATOR_LATERAL)}`,
        normal: '0m 0m -1m',
        face,
      };
    }
    case 'frente': {
      // Olhando a frente: X% à direita no desenho deve cair à direita na tela → espelha Z
      const z = zNaFaceLongitudinal(u, halfW, true);
      return {
        position: `${formatM(-halfL * FATOR_LATERAL)} ${formatM(yFrontal)} ${formatM(z)}`,
        normal: '-1m 0m 0m',
        face,
      };
    }
    case 'traseira': {
      const z = zNaFaceLongitudinal(u, halfW, false);
      return {
        position: `${formatM(halfL * FATOR_LATERAL)} ${formatM(yFrontal)} ${formatM(z)}`,
        normal: '1m 0m 0m',
        face,
      };
    }
    case 'teto': {
      const x = -halfL + u * dims.x;
      const z = -halfW * FATOR_LATERAL + vTopToBottom * dims.z * FATOR_LATERAL;
      return {
        position: `${formatM(x)} ${formatM(halfH * 0.92)} ${formatM(z)}`,
        normal: '0m 1m 0m',
        face,
      };
    }
    default: {
      const x = -halfL + u * dims.x;
      return {
        position: `${formatM(x)} ${formatM(yBody)} ${formatM(halfW * FATOR_LATERAL)}`,
        normal: '0m 0m 1m',
        face: 'desconhecida',
      };
    }
  }
}
