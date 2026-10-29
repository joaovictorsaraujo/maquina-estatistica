export interface RodadaData {
  indice: number;
  paradas: number[];
  tabuleiro: string[][];
  linha_central: string[];
  combinacao_central: string;
  premio: number;
  lucro: number;
  premiado: boolean;
  explicacao_regra: string;
  aviso: string;
}

export interface CategoriaE1 {
  lucro_x: number;
  premio_p: number;
  combinacao: string;
  prob_teorica: number;
  contagem: number;
  freq_relativa: number;
  diferenca_abs: number;
}

export interface StatsE1 {
  n_rodadas: number;
  seed: number;
  soma_contagens: number;
  soma_freq_relativas: number;
  tabela_categorias: CategoriaE1[];
  lucro_medio_observado: number;
  lucro_medio_teorico: number;
  rtp_observado: number;
  rtp_teorico: number;
  proporcao_premiada_observada: number;
  proporcao_premiada_teorica: number;
  desvio_padrao_amostral: number;
  erro_padrao: number;
  ic_95_lucro: [number, number];
}

export interface StatsE2 {
  tabela_3x3: Record<string, Record<string, number>>;
  reprodutibilidade_confirmada: boolean;
  comparacao_10_primeiros: Array<{
    rodada: number;
    original_paradas: number[];
    original_comb: string;
    repeticao_paradas: number[];
    repeticao_comb: string;
    coincidem: boolean;
  }>;
  series_grafico: Record<string, Array<{ rodada: number; media: number }>>;
  referencia_teorica: number;
}

export interface TrajetoriaParticipante {
  id_participante: number;
  saldo_final: number;
  rodadas: number;
  esgotou: boolean;
  classificacao: string;
  pontos: Array<{ rodada: number; saldo: number }>;
}

export interface StatsE3 {
  estatisticas: {
    num_participantes: number;
    ganhos_contagem: number;
    ganhos_proporcao: number;
    empates_contagem: number;
    empates_proporcao: number;
    perdas_contagem: number;
    perdas_proporcao: number;
    soma_proporcoes: number;
    esgotamentos_contagem: number;
    esgotamentos_proporcao: number;
    saldo_final_min: number;
    saldo_final_max: number;
    saldo_final_media: number;
    saldo_final_mediana: number;
    saldo_final_desvio_padrao: number;
    rodadas_media: number;
    rodadas_mediana: number;
  };
  trajetorias_5_primeiros: TrajetoriaParticipante[];
}

export interface StatsE4 {
  total_pares: number;
  referencia_teorica: number;
  apos_premio: {
    condicao: string;
    total_pares: number;
    premios_seguintes: number;
    proporcao_observada: number | null;
    status: string;
    prob_teorica: number;
  };
  apos_sem_premio: {
    condicao: string;
    total_pares: number;
    premios_seguintes: number;
    proporcao_observada: number | null;
    status: string;
    prob_teorica: number;
  };
}

export interface IndicadorE5 {
  nome_tabela: string;
  prob_premio_teorica: number;
  freq_premio_observada: number;
  premio_medio_teorico: number;
  premio_medio_observado: number;
  lucro_medio_teorico: number;
  lucro_medio_observado: number;
  rtp_teorico: number;
  rtp_observado: number;
}

export interface StatsE5 {
  n_rodadas: number;
  base: IndicadorE5;
  aumentada_10: IndicadorE5;
}

export interface ConfigData {
  aviso_legal: string;
  simbolos: string[];
  custo_aposta: number;
  pagamentos_base: Record<string, number>;
  pagamentos_aumentados_10: Record<string, number>;
  teoria: {
    total_combinacoes: number;
    prob_premio: number;
    esperanca_premio_base: number;
    esperanca_lucro_base: number;
    rtp_base: number;
    esperanca_premio_aumentado: number;
    esperanca_lucro_aumentado: number;
    rtp_aumentado: number;
  };
}
