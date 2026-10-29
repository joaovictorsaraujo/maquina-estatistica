import React from 'react';
import { Info, BookOpen, Scale, AlertCircle } from 'lucide-react';

export const SobreView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Fundamentação Teórica e Diretrizes
        </div>
        <h2 className="text-2xl font-black text-white">Conceitos Matemáticos e Sociais em Ação</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Este simulador foi construído para confrontar intuições populares com evidências estatísticas auditáveis. No debate público sobre jogos de azar on-line, a retórica comercial frequentemente utiliza termos como <em>"RTP de 84%"</em> ou sequências animadas para sugerir que o jogador receberá a maior parte do dinheiro de volta. A matemática do modelo demonstra o contrário.
        </p>
      </div>

      {/* Grid de Conceitos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            1. Espaço Amostral e Independência
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Há <code className="text-amber-300">5³ = 125</code> triplas centrais equiprováveis. Como cada parada é sorteada uniformemente em &#123;0, 1, 2, 3, 4&#125;, cada tripla possui probabilidade estrita de <strong className="text-white">1/125 = 0,80%</strong>. Apenas 5 dessas 125 combinações geram pagamento, fixando a chance de vitória em <strong className="text-white">4,00%</strong>.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-400" />
            2. Distinção: Chance vs RTP vs Lucro
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>Chance de vitória (4%)</strong> mede a frequência de prêmios. <strong>RTP (84%)</strong> mede o percentual do volume global de apostas que retorna em prêmios brutos. <strong>Lucro esperado (-0,16 créditos)</strong> mede o saldo médio por rodada. O RTP não é uma garantia de devolução de 84% do depósito inicial de uma pessoa em sua sessão.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            3. A Falácia do Jogador
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            O Experimento 4 demonstrou empiricamente que a taxa de vitória após uma derrota é de <strong>4,12%</strong> e após uma vitória é de <strong>4,13%</strong>. Ambas oscilam ao redor da teoria (4%). A máquina não possui memória, não se "aquece" e não "deve" prêmio após derrotas consecutivas.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-400" />
            4. Viés de Sobrevivência e Ruína
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No Experimento 3, enquanto a <strong>média</strong> de saldo final foi de 52,10 créditos (puxada por um apostador que teve sorte atípica e alcançou 390 créditos), a <strong>mediana</strong> foi de <strong>zero crédito</strong>: <strong>67% dos participantes esgotaram 100% de seus recursos</strong> antes de completar 500 rodadas.
          </p>
        </div>
      </div>

      {/* Fontes Substantivas para o Relatório */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          Fontes Documentais Mapeadas (Brasil e Saúde Pública)
        </h3>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li>
            <strong>Banco Central do Brasil (2024):</strong> Estimou transferências brutas via Pix de R$ 18 a 21 bilhões mensais para plataformas.
          </li>
          <li>
            <strong>Tribunal de Contas da União (TCU, 2026):</strong> Acórdão 1296/2026 estimou receita bruta (GGR) do mercado autorizado em R$ 17,4 bilhões no 1º semestre de 2025.
          </li>
          <li>
            <strong>Instituto de Estudos para Políticas de Saúde (IEPS, 2025):</strong> Estimou custos sociais de R$ 38,8 bilhões ao ano, sendo R$ 30,6 bilhões ligados à saúde e perda de bem-estar.
          </li>
          <li>
            <strong>LENAD III / UNIFESP (2025) & The Lancet (2024):</strong> Sintetizaram prevalência de 15,8% de jogo problemático entre adultos que utilizam cassinos on-line.
          </li>
        </ul>
      </div>
    </div>
  );
};
