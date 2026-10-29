/**
 * Mapeamento e Configuração dos Símbolos Arcade Retrô-Futuristas.
 * 
 * Substitui os símbolos textuais frios (A, B, C, D, E) por glifos icônicos,
 * paleta de neon dedicada e multiplicadores formatados com fichas/moedas.
 */

export interface SimboloInfo {
  letra: string;
  icone: string;
  nome: string;
  corHex: string;
  multiplicador: number;
  premioBruto: number;
  lucroLiquido: number;
  bgGrad: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
  neonBorder: string;
}

export const SIMBOLOS_ARCADE: Record<string, SimboloInfo> = {
  A: {
    letra: 'A',
    icone: '⚡',
    nome: 'Raio de Energia',
    corHex: '#10B981',
    multiplicador: 5,
    premioBruto: 5.0,
    lucroLiquido: 4.0,
    bgGrad: 'from-emerald-950/90 via-slate-900 to-slate-950',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    neonBorder: 'rgba(16, 185, 129, 0.8)',
  },
  B: {
    letra: 'B',
    icone: '🔮',
    nome: 'Orbe Místico',
    corHex: '#3B82F6',
    multiplicador: 10,
    premioBruto: 10.0,
    lucroLiquido: 9.0,
    bgGrad: 'from-blue-950/90 via-slate-900 to-slate-950',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    glowClass: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
    neonBorder: 'rgba(59, 130, 246, 0.8)',
  },
  C: {
    letra: 'C',
    icone: '⚛️',
    nome: 'Átomo Quântico',
    corHex: '#A855F7',
    multiplicador: 15,
    premioBruto: 15.0,
    lucroLiquido: 14.0,
    bgGrad: 'from-purple-950/90 via-slate-900 to-slate-950',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    neonBorder: 'rgba(168, 85, 247, 0.8)',
  },
  D: {
    letra: 'D',
    icone: '💎',
    nome: 'Diamante Gaussiano',
    corHex: '#F59E0B',
    multiplicador: 25,
    premioBruto: 25.0,
    lucroLiquido: 24.0,
    bgGrad: 'from-amber-950/90 via-slate-900 to-slate-950',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-400',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    neonBorder: 'rgba(245, 158, 11, 0.8)',
  },
  E: {
    letra: 'E',
    icone: '👑',
    nome: 'Coroa de Gauss',
    corHex: '#F43F5E',
    multiplicador: 50,
    premioBruto: 50.0,
    lucroLiquido: 49.0,
    bgGrad: 'from-rose-950/90 via-slate-900 to-slate-950',
    borderClass: 'border-rose-500',
    textClass: 'text-rose-400',
    glowClass: 'shadow-[0_0_25px_rgba(244,63,94,0.45)]',
    neonBorder: 'rgba(244, 63, 94, 0.9)',
  },
};

/**
 * Retorna as informações visuais completas de um símbolo.
 */
export function getSimboloInfo(simbolo: string): SimboloInfo {
  return (
    SIMBOLOS_ARCADE[simbolo] || {
      letra: simbolo,
      icone: '❓',
      nome: 'Desconhecido',
      corHex: '#94A3B8',
      multiplicador: 0,
      premioBruto: 0,
      lucroLiquido: -1,
      bgGrad: 'from-slate-900 to-slate-950',
      borderClass: 'border-slate-700',
      textClass: 'text-slate-400',
      glowClass: '',
      neonBorder: 'rgba(148, 163, 184, 0.4)',
    }
  );
}

/**
 * Converte uma combinação textual (ex: "A-A-A" ou "B-D-A") para visualização com ícones arcade.
 */
export function formatarCombinacaoArcade(comb: string): { icones: string[]; letras: string[]; premiado: boolean } {
  if (!comb) return { icones: [], letras: [], premiado: false };
  const partes = comb.split('-').map((s) => s.trim().toUpperCase());
  const icones = partes.map((p) => getSimboloInfo(p).icone);
  const premiado = partes.length === 3 && partes[0] === partes[1] && partes[1] === partes[2];
  return { icones, letras: partes, premiado };
}
