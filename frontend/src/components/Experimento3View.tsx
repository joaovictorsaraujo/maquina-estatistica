import React from 'react';
import { StatsE3 } from '../types';
import { Users, AlertOctagon, TrendingDown, Award, HelpCircle } from 'lucide-react';

interface Props {
  dados: StatsE3 | null;
  loading: boolean;
  onRecarregar: () => void;
}

export const Experimento3View: React.FC<Props> = ({ dados, loading, onRecarregar }) => {
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Carregando dados do Experimento 3 (100 participantes virtuais)...</p>
      </div>
    );
  }

  const s = dados.estatisticas;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              Experimento Obrigatório 3
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              O que acontece com um saldo limitado?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Simulação de 100 participantes virtuais (Saldo inicial: 100 créditos, Máximo: 500 rodadas, Semente: <strong>42</strong> contínua).
            </p>
          </div>
          <button
            onClick={onRecarregar}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Reexecutar E3
          </button>
        </div>
      </div>

      {/* Cards de Distribuição dos Participantes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-semibold uppercase">Ganhos (Bf &gt; 100)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2">
            {s.ganhos_contagem} <span className="text-sm font-normal text-slate-300">({(s.ganhos_proporcao * 100).toFixed(1)}%)</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Terminaram com saldo superior</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold uppercase">Empates (Bf = 100)</span>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-black text-slate-200 mt-2">
            {s.empates_contagem} <span className="text-sm font-normal text-slate-400">({(s.empates_proporcao * 100).toFixed(1)}%)</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Recuperaram a aposta exata</p>
        </div>

        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-semibold uppercase">Perdas (Bf &lt; 100)</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-2">
            {s.perdas_contagem} <span className="text-sm font-normal text-slate-300">({(s.perdas_proporcao * 100).toFixed(1)}%)</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Terminaram no prejuízo</p>
        </div>

        <div className="bg-red-950/60 border-2 border-red-500 rounded-xl p-4 shadow-lg shadow-red-950/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-300 font-black uppercase">Esgotamento Total</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-400 mt-2">
            {s.esgotamentos_contagem} <span className="text-sm font-normal text-slate-300">({(s.esgotamentos_proporcao * 100).toFixed(1)}%)</span>
          </p>
          <p className="text-[11px] text-red-300 mt-1">Saldo zerado (&lt; 1 crédito)</p>
        </div>
      </div>

      {/* Destaque Metodológico: Discrepância entre Média e Mediana (Viés de Sobrevivência) */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-2">
          Análise de Centro: Média vs Mediana e o Viés de Sobrevivência
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Observe a discrepância matemática entre a Média e a Mediana dos saldos finais após 500 rodadas:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Saldo Final Médio</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{s.saldo_final_media.toFixed(2)} créditos</p>
            <p className="text-[11px] text-slate-500 mt-1">Inflacionado por poucos vencedores atípicos</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-red-500/40">
            <span className="text-xs text-red-300 uppercase font-semibold">Saldo Final Mediano</span>
            <p className="text-2xl font-black text-red-400 mt-1">{s.saldo_final_mediana.toFixed(2)} créditos</p>
            <p className="text-[11px] text-red-300/80 mt-1">Mais da metade saiu com SALDO ZERO</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Amplitude da Amostra</span>
            <p className="text-2xl font-black text-sky-400 mt-1">
              {s.saldo_final_min.toFixed(0)} a {s.saldo_final_max.toFixed(0)} créditos
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Duração média: {s.rodadas_media.toFixed(1)} rodadas</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
          <p>
            🔍 <strong>Por que a média é 52,10 mas a mediana é zero?</strong>
          </p>
          <p className="text-slate-400 text-xs">
            Um único participante atingiu o pico de <strong>390 créditos</strong> graças a vitórias de 50x e 25x. Essa cauda longa puxa a média aritmética para cima, mas não reflete a experiência típica: <strong>67% dos participantes foram à ruína total</strong>. Em redes sociais, apenas o ganhador de 390 créditos publica seu resultado, gerando a falsa ilusão de que o jogo é rentável.
          </p>
        </div>
      </div>

      {/* Trajetórias dos 5 Primeiros Participantes */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-2">
          Os 5 Primeiros Participantes da Simulação (Sem Seleção de Resultados)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Conforme exigência do professor, exibimos exatamente os 5 primeiros participantes virtuais simulados:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {dados.trajetorias_5_primeiros.map((part) => (
            <div
              key={part.id_participante}
              className={`p-3 rounded-xl border text-center ${
                part.classificacao === 'ganho'
                  ? 'bg-emerald-950/50 border-emerald-500/50'
                  : 'bg-rose-950/40 border-rose-500/40'
              }`}
            >
              <span className="text-xs font-bold text-white">Participante #{part.id_participante}</span>
              <p
                className={`text-lg font-black mt-1 ${
                  part.saldo_final >= 100 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {part.saldo_final.toFixed(1)} créditos
              </p>
              <div className="mt-1 text-[11px] text-slate-400">
                <span>{part.rodadas} rodadas jogadas</span>
                <p className="font-semibold text-xs mt-0.5">
                  {part.esgotou ? '🛑 Esgotou Saldo' : '🏁 Concluiu 500'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
