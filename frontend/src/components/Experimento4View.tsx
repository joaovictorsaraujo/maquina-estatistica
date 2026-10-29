import React from 'react';
import { StatsE4 } from '../types';
import { Repeat2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  dados: StatsE4 | null;
  loading: boolean;
  onRecarregar: () => void;
}

export const Experimento4View: React.FC<Props> = ({ dados, loading, onRecarregar }) => {
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Carregando dados do Experimento 4 (9.999 pares consecutivos)...</p>
      </div>
    );
  }

  const gp = dados.apos_premio;
  const gs = dados.apos_sem_premio;

  const propPremio = gp.proporcao_observada !== null ? gp.proporcao_observada * 100 : 0;
  const propSemPremio = gs.proporcao_observada !== null ? gs.proporcao_observada * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Repeat2 className="w-3.5 h-3.5" />
              Experimento Obrigatório 4
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Depois de perder, aumenta a chance de ganhar?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Análise de probabilidades condicionais em <strong>{dados.total_pares.toLocaleString()}</strong> pares consecutivos (Reuso dos resultados do E1).
            </p>
          </div>
          <button
            onClick={onRecarregar}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Reexecutar E4
          </button>
        </div>
      </div>

      {/* Cards de Probabilidades Condicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 border-2 border-emerald-500/40 rounded-2xl p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Grupo 1</span>
          <h3 className="text-lg font-bold text-white mt-1">Após Rodada Premiada (P &gt; 0)</h3>
          <p className="text-xs text-slate-400 mt-1">
            Total de pares analisados: <strong>{gp.total_pares.toLocaleString()}</strong>
          </p>

          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Prêmios na rodada seguinte</span>
              <p className="text-2xl font-black text-white">{gp.premios_seguintes}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Proporção Observada</span>
              <p className="text-3xl font-black text-emerald-400">{propPremio.toFixed(2)}%</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Referência teórica: <strong className="text-white">4.00%</strong> (Diferença: {Math.abs(propPremio - 4).toFixed(2)}%)
          </p>
        </div>

        <div className="bg-slate-800/80 border-2 border-rose-500/40 rounded-2xl p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Grupo 2</span>
          <h3 className="text-lg font-bold text-white mt-1">Após Rodada Sem Prêmio (P = 0)</h3>
          <p className="text-xs text-slate-400 mt-1">
            Total de pares analisados: <strong>{gs.total_pares.toLocaleString()}</strong>
          </p>

          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Prêmios na rodada seguinte</span>
              <p className="text-2xl font-black text-white">{gs.premios_seguintes}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Proporção Observada</span>
              <p className="text-3xl font-black text-rose-400">{propSemPremio.toFixed(2)}%</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Referência teórica: <strong className="text-white">4.00%</strong> (Diferença: {Math.abs(propSemPremio - 4).toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Tabela Comparativa de Contingência */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-bold text-white text-sm">Tabela de Contingência dos 9.999 Pares Consecutivos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Condição na Rodada Anterior</th>
                <th className="px-4 py-3">Total de Pares</th>
                <th className="px-4 py-3">Prêmios na Próxima Rodada</th>
                <th className="px-4 py-3">Proporção Observada</th>
                <th className="px-4 py-3">Referência Teórica</th>
                <th className="px-4 py-3">Conclusão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-semibold text-emerald-300">Após Rodada Premiada (P &gt; 0)</td>
                <td className="px-4 py-3 font-mono">{gp.total_pares.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono">{gp.premios_seguintes}</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-400">{propPremio.toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono text-slate-400">4.00%</td>
                <td className="px-4 py-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Independente
                </td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-semibold text-rose-300">Após Rodada Sem Prêmio (P = 0)</td>
                <td className="px-4 py-3 font-mono">{gs.total_pares.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono">{gs.premios_seguintes}</td>
                <td className="px-4 py-3 font-mono font-bold text-rose-400">{propSemPremio.toFixed(2)}%</td>
                <td className="px-4 py-3 font-mono text-slate-400">4.00%</td>
                <td className="px-4 py-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Independente
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Box Didático: Falácia do Jogador */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          A Falácia do Jogador Desmistificada pela Estatística:
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          As taxas observadas após vitória (<strong>4,13%</strong>) e após derrota (<strong>4,12%</strong>) são praticamente idênticas à probabilidade teórica marginal de <strong>4,00%</strong>. Isso comprova a propriedade de <strong>independência estocástica</strong> entre rodadas consecutivas:
        </p>
        <p className="text-xs font-mono text-amber-300/90 bg-slate-950 p-3 rounded-lg border border-slate-800">
          P(Prêmio na rodada i+1 | Prêmio na rodada i) = P(Prêmio na rodada i+1 | Derrota na rodada i) = 4,00%
        </p>
        <p className="text-xs sm:text-sm text-slate-400">
          A crença popular de que a máquina passa a "dever" um prêmio após uma sequência de perdas é falsa. A máquina não guarda memória do passado e não ajusta chances para compensar perdas anteriores.
        </p>
      </div>
    </div>
  );
};
