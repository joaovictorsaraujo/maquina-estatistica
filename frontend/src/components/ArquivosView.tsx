import React, { useState, useEffect } from 'react';
import { Download, FileText, Image as ImageIcon, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ArquivoItem {
  nome: string;
  tamanho_kb: number;
  tipo: string;
}

export const ArquivosView: React.FC = () => {
  const [arquivos, setArquivos] = useState<{ tabelas: ArquivoItem[]; graficos: ArquivoItem[] }>({
    tabelas: [],
    graficos: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/resultados/arquivos')
      .then((res) => res.json())
      .then((data) => {
        setArquivos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao listar arquivos:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Arquivos de Resultados, Tabelas CSV e Gráficos
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Todos os dados gerados pela Máquina Estatística para exportação, auditoria e inclusão no relatório acadêmico em PDF.
        </p>
      </div>

      {/* Gráficos Oficiais */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-400" />
          Gráficos em Alta Resolução (300 DPI — Matplotlib)
        </h3>
        <p className="text-xs text-slate-400">
          Clique em uma imagem para ampliar ou faça o download direto para inserção no artigo de 6 a 10 páginas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {arquivos.graficos.map((g) => (
            <div
              key={g.nome}
              className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div
                className="cursor-pointer overflow-hidden bg-slate-950 flex items-center justify-center p-2 h-52"
                onClick={() => setImagemSelecionada(g.nome)}
              >
                <img
                  src={`/api/resultados/download/png/${g.nome}`}
                  alt={g.nome}
                  className="max-h-full max-w-full object-contain rounded hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 border-t border-slate-700 flex items-center justify-between bg-slate-900/60">
                <div>
                  <p className="font-bold text-white text-xs sm:text-sm">{g.nome}</p>
                  <p className="text-[11px] text-slate-400">{g.tamanho_kb} KB • PNG 300 DPI</p>
                </div>
                <a
                  href={`/api/resultados/download/png/${g.nome}`}
                  download={g.nome}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabelas CSV */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          Tabelas em Formato CSV Padronizado (UTF-8)
        </h3>
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Nome do Arquivo CSV</th>
                  <th className="px-4 py-3">Finalidade / Experimento</th>
                  <th className="px-4 py-3">Tamanho</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {arquivos.tabelas.map((tab) => {
                  let descricao = 'Tabela de resultados';
                  if (tab.nome.includes('e1_frequencias')) descricao = 'E1: Seis categorias de lucro, probabilidades e contagens';
                  else if (tab.nome.includes('e1_metricas')) descricao = 'E1: Resumo numérico com N, médias, RTP, s e IC 95%';
                  else if (tab.nome.includes('e2_medias')) descricao = 'E2: Médias acumuladas nas rodadas 100, 1.000 e 10.000';
                  else if (tab.nome.includes('e2_reprodutibilidade')) descricao = 'E2: Conferência determinística dos 10 primeiros sorteios';
                  else if (tab.nome.includes('e3_sessoes')) descricao = 'E3: Sessões consolidadas dos 100 participantes virtuais';
                  else if (tab.nome.includes('e3_resumo')) descricao = 'E3: Resumo estatístico com taxas de perda e esgotamento';
                  else if (tab.nome.includes('e3_trajetorias')) descricao = 'E3: Trajetórias rodada a rodada dos 5 primeiros participantes';
                  else if (tab.nome.includes('e4_condicional')) descricao = 'E4: Tabela de contingência para os 9.999 pares consecutivos';
                  else if (tab.nome.includes('e5_comparacao')) descricao = 'E5: Comparação analítica entre Tabela Base e Tabela +10%';

                  return (
                    <tr key={tab.nome} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>{tab.nome}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{descricao}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{tab.tamanho_kb} KB</td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`/api/resultados/download/csv/${tab.nome}`}
                          download={tab.nome}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Imagem Ampliada */}
      {imagemSelecionada && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImagemSelecionada(null)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{imagemSelecionada}</span>
              <button
                onClick={() => setImagemSelecionada(null)}
                className="px-2.5 py-1 text-xs bg-slate-800 text-slate-400 hover:text-white rounded"
              >
                Fechar [ESC]
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center">
              <img
                src={`/api/resultados/download/png/${imagemSelecionada}`}
                alt={imagemSelecionada}
                className="max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
