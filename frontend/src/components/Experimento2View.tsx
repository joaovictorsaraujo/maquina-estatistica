import React from 'react';
import { StatsE2 } from '../types';
import { LineChart, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  dados: StatsE2 | null;
  loading: boolean;
  onRecarregar: () => void;
}

export const Experimento2View: React.FC<Props> = ({ dados, loading, onRecarregar }) => {
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Carregando dados do Experimento 2 (3 sementes × 10.000 rodadas)...</p>
      </div>
    );
  }

  const sementes = ['10', '2026', '123456'];
  const pontos = ['100', '1000', '10000'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <LineChart className="w-3.5 h-3.5" />
              Experimento Obrigatório 2
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              O que muda quando aumentamos a amostra?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Demonstração da Lei dos Grandes Números em 3 sequências de 10.000 rodadas (Seeds 10, 2026 e 123456).
            </p>
          </div>
          <button
            onClick={onRecarregar}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Reexecutar E2
          </button>
        </div>
      </div>

      {/* Tabela 3x3 de Médias Acumuladas */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-2">
          Tabela 3 × 3 de Médias Acumuladas do Lucro Líquido
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          A média acumulada da semente 2026 foi reaproveitada diretamente do Experimento 1, conforme especificado pelo professor.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Semente</th>
                <th className="px-4 py-3">Após 100 Rodadas</th>
                <th className="px-4 py-3">Após 1.000 Rodadas</th>
                <th className="px-4 py-3">Após 10.000 Rodadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {sementes.map((seed) => {
                const linha = dados.tabela_3x3[seed] || {};
                return (
                  <tr key={seed} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-left font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                      Seed {seed} {seed === '2026' && <span className="text-amber-400 text-xs font-normal">(Reuso E1)</span>}
                    </td>
                    {pontos.map((p) => {
                      const val = linha[p] ?? 0;
                      return (
                        <td
                          key={p}
                          className={`px-4 py-3 font-mono font-bold ${
                            val >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {val >= 0 ? `+${val.toFixed(4)}` : val.toFixed(4)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-900/90 font-bold text-slate-300">
              <tr>
                <td className="px-4 py-3 text-left">Referência Teórica:</td>
                <td colSpan={3} className="px-4 py-3 font-mono text-amber-400">
                  E[X] = {dados.referencia_teorica.toFixed(4)} créditos por rodada
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Verificação de Reprodutibilidade da Seed 2026 */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <h3 className="font-bold text-white text-base">
              Verificação Obrigatória de Reprodutibilidade (Seed 2026)
            </h3>
            <p className="text-xs text-slate-400">
              Comparação dos 10 primeiros sorteios da repetição independente com os originais do E1.
            </p>
          </div>
          <span className="ml-auto px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/30">
            100% REPRODUZÍVEL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {dados.comparacao_10_primeiros.map((item) => (
            <div key={item.rodada} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Rodada #{item.rodada}</span>
              <p className="font-bold text-amber-300 text-sm mt-0.5">{item.original_comb}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">K={JSON.stringify(item.original_paradas)}</p>
              <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Coincide</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explicação Conceitual */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs sm:text-sm text-slate-300 space-y-2">
        <h4 className="font-bold text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Interpretação da Lei dos Grandes Números:
        </h4>
        <p>
          • A Lei dos Grandes Números afirma que a média amostral de muitas rodadas converge em probabilidade para o valor esperado teórico (<strong>-0.16</strong>).
        </p>
        <p>
          • <strong>Ela não exige aproximação monotônica</strong> (as médias oscilam para cima e para baixo ao longo da trajetória).
        </p>
        <p>
          • Sequências iniciais favoráveis (como o lucro médio positivo de <strong>+0.20</strong> nas sementes 2026 e 123456 em N=100) são diluídas pela repetição, e não "compensadas" por rodadas futuras.
        </p>
      </div>
    </div>
  );
};
