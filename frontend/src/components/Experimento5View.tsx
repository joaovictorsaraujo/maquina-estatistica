import React from 'react';
import { StatsE5 } from '../types';
import { TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  dados: StatsE5 | null;
  loading: boolean;
  onRecarregar: () => void;
}

export const Experimento5View: React.FC<Props> = ({ dados, loading, onRecarregar }) => {
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Carregando dados do Experimento 5 (Comparação de Tabelas)...</p>
      </div>
    );
  }

  const b = dados.base;
  const a = dados.aumentada_10;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Experimento Obrigatório 5
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Prêmios maiores tornam o jogo favorável?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Comparação da Tabela Base com a Tabela com acréscimo de 10% sobre os <strong>mesmos 10.000 resultados</strong> do E1.
            </p>
          </div>
          <button
            onClick={onRecarregar}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Reexecutar E5
          </button>
        </div>
      </div>

      {/* Cards Comparativos Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tabela Base */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-lg font-bold text-white">Tabela Base Oficial</h3>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-700 text-slate-300">Aposta 1.00</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">RTP Teórico</span>
              <p className="text-xl font-black text-sky-400 mt-0.5">{b.rtp_teorico.toFixed(2)}%</p>
              <span className="text-[10px] text-slate-500">Observado: {b.rtp_observado.toFixed(2)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Lucro Esperado E[X]</span>
              <p className="text-xl font-black text-rose-400 mt-0.5">{b.lucro_medio_teorico.toFixed(4)}</p>
              <span className="text-[10px] text-slate-500">Observado: {b.lucro_medio_observado.toFixed(4)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 text-xs text-slate-400 space-y-1">
            <p>• Chance de vitória teórica: <strong className="text-white">{(b.prob_premio_teorica * 100).toFixed(2)}%</strong></p>
            <p>• Frequência observada: <strong className="text-amber-400">{(b.freq_premio_observada * 100).toFixed(2)}%</strong></p>
            <p>• Prêmio médio teórico: <strong className="text-white">{b.premio_medio_teorico.toFixed(4)} créditos</strong></p>
          </div>
        </div>

        {/* Tabela +10% */}
        <div className="bg-slate-800/80 border-2 border-amber-500/50 rounded-2xl p-6 space-y-4 shadow-xl shadow-amber-950/20">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-lg font-bold text-amber-300">Tabela com Pagamentos +10%</h3>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              +10% nos Prêmios
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">RTP Teórico</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{a.rtp_teorico.toFixed(2)}%</p>
              <span className="text-[10px] text-slate-500">Observado: {a.rtp_observado.toFixed(2)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Lucro Esperado E[X]</span>
              <p className="text-xl font-black text-rose-400 mt-0.5">{a.lucro_medio_teorico.toFixed(4)}</p>
              <span className="text-[10px] text-slate-500">Observado: {a.lucro_medio_observado.toFixed(4)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 text-xs text-slate-400 space-y-1">
            <p>• Chance de vitória teórica: <strong className="text-white">{(a.prob_premio_teorica * 100).toFixed(2)}%</strong> (INALTERADA)</p>
            <p>• Frequência observada: <strong className="text-amber-400">{(a.freq_premio_observada * 100).toFixed(2)}%</strong> (IDÊNTICA)</p>
            <p>• Prêmio médio teórico: <strong className="text-white">{a.premio_medio_teorico.toFixed(4)} créditos</strong></p>
          </div>
        </div>
      </div>

      {/* Tabela Comparativa Detalhada */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-bold text-white text-sm">Quadro Comparativo de Indicadores Teóricos e Empíricos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Indicador</th>
                <th className="px-4 py-3">Tabela Base (Teórico)</th>
                <th className="px-4 py-3">Tabela Base (Observado)</th>
                <th className="px-4 py-3">Tabela +10% (Teórico)</th>
                <th className="px-4 py-3">Tabela +10% (Observado)</th>
                <th className="px-4 py-3">Variação Teórica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-semibold text-white">Probabilidade de Vitória</td>
                <td className="px-4 py-3 font-mono">{(b.prob_premio_teorica * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono text-amber-400">{(b.freq_premio_observada * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono">{(a.prob_premio_teorica * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono text-amber-400">{(a.freq_premio_observada * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 font-semibold text-slate-400">0% (Inalterada)</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-semibold text-white">Prêmio Bruto Médio</td>
                <td className="px-4 py-3 font-mono">{b.premio_medio_teorico.toFixed(4)}</td>
                <td className="px-4 py-3 font-mono">{b.premio_medio_observado.toFixed(4)}</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{a.premio_medio_teorico.toFixed(4)}</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{a.premio_medio_observado.toFixed(4)}</td>
                <td className="px-4 py-3 text-emerald-400 font-semibold">+10.0%</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-semibold text-white">Lucro Líquido Médio E[X]</td>
                <td className="px-4 py-3 font-mono text-rose-400">{b.lucro_medio_teorico.toFixed(4)}</td>
                <td className="px-4 py-3 font-mono text-rose-400">{b.lucro_medio_observado.toFixed(4)}</td>
                <td className="px-4 py-3 font-mono text-rose-400">{a.lucro_medio_teorico.toFixed(4)}</td>
                <td className="px-4 py-3 font-mono text-rose-400">{a.lucro_medio_observado.toFixed(4)}</td>
                <td className="px-4 py-3 text-emerald-400 font-semibold">Reduz perda</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-semibold text-white">RTP (Return to Player)</td>
                <td className="px-4 py-3 font-mono text-sky-400">{b.rtp_teorico.toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono text-sky-400">{b.rtp_observado.toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{a.rtp_teorico.toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{a.rtp_observado.toFixed(2)}%</td>
                <td className="px-4 py-3 text-emerald-400 font-semibold">+8.4 pontos perc.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusão Matemática Chave */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Conclusão Crítica: Por que o jogo continua desfavorável?
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Embora aumentar os pagamentos em 10% eleve o RTP de <strong>84,0% para 92,4%</strong> e diminua a perda esperada por rodada de <strong>-0,16 para -0,076 créditos</strong>, a esperança matemática continua estritamente negativa.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-bold pt-2">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            1. Pagar mais por vitória
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            2. Pagar com maior frequência
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            3. Produzir lucro esperado positivo
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center italic">
          Essas três afirmações representam conceitos matemáticos distintos. Mesmo pagando 10% a mais, a casa mantém vantagem esperada de 7,6%.
        </p>
      </div>
    </div>
  );
};
