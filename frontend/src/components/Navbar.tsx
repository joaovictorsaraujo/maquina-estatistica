import React from 'react';
import { PlayCircle, BarChart3, LineChart, Users, Repeat2, TrendingUp, FolderDown, Info, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExecutarTodos: () => void;
  executandoTodos: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onExecutarTodos,
  executandoTodos,
}) => {
  const tabs = [
    { id: 'simulador', label: 'Simulador 3x3', icon: PlayCircle },
    { id: 'e1', label: 'E1: Frequências', icon: BarChart3 },
    { id: 'e2', label: 'E2: Grandes Números', icon: LineChart },
    { id: 'e3', label: 'E3: Saldo Limitado', icon: Users },
    { id: 'e4', label: 'E4: Independência', icon: Repeat2 },
    { id: 'e5', label: 'E5: Pagamentos +10%', icon: TrendingUp },
    { id: 'arquivos', label: 'Arquivos CSV / PNG', icon: FolderDown },
    { id: 'sobre', label: 'Conceitos Teóricos', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl">
      {/* Aviso Obrigatório em destaque */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-center text-xs sm:text-sm font-medium text-amber-300 flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span><strong>Simulador acadêmico — somente créditos fictícios</strong> (IFES Campus Serra — BSI)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('simulador')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              M
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-white leading-tight">Máquina Estatística</h1>
              <p className="text-xs text-slate-400">Probabilidade, Apostas e Pensamento Crítico</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExecutarTodos}
              disabled={executandoTodos}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 transition-all disabled:opacity-50"
              title="Executa os 5 experimentos encadeados e atualiza todos os CSVs e gráficos no backend"
            >
              {executandoTodos ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculando...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Executar 5 Experimentos</span>
                  <span className="sm:hidden">Executar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Abas responsivas com rolagem horizontal em telas menores */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
