import React from 'react';
import { PlayCircle, BarChart3, LineChart, Users, Repeat2, TrendingUp, FolderDown, Info, ShieldAlert, Sparkles } from 'lucide-react';

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
    { id: 'simulador', label: '🎰 Simulador Arcade', icon: PlayCircle },
    { id: 'e1', label: 'E1: Frequências', icon: BarChart3 },
    { id: 'e2', label: 'E2: Grandes Números', icon: LineChart },
    { id: 'e3', label: 'E3: Saldo Limitado', icon: Users },
    { id: 'e4', label: 'E4: Independência', icon: Repeat2 },
    { id: 'e5', label: 'E5: Pagamentos +10%', icon: TrendingUp },
    { id: 'arquivos', label: 'Arquivos CSV / PNG', icon: FolderDown },
    { id: 'sobre', label: 'Conceitos Teóricos', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060A16]/95 backdrop-blur border-b border-amber-500/20 shadow-2xl">
      {/* Aviso Obrigatório em destaque */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-center text-xs font-mono font-medium text-amber-300 flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span><strong>Simulador acadêmico — somente créditos fictícios</strong> (IFES Campus Serra — Bacharelado em Sistemas de Informação)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('simulador')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 flex items-center justify-center font-display font-black text-slate-950 text-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-200/50">
              ⚡
            </div>
            <div>
              <h1 className="font-display font-black text-base sm:text-lg text-white leading-tight flex items-center gap-2">
                <span>MÁQUINA ESTATÍSTICA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">ARCADE</span>
              </h1>
              <p className="text-[11px] font-mono text-slate-400">Probabilidade, Apostas e Pensamento Crítico</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExecutarTodos}
              disabled={executandoTodos}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-display font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Executa os 5 experimentos encadeados e atualiza todos os CSVs e gráficos no backend"
            >
              {executandoTodos ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>CALCULANDO...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span className="hidden sm:inline">EXECUTAR 5 EXPERIMENTOS</span>
                  <span className="sm:hidden">EXECUTAR</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Abas responsivas com rolagem horizontal em telas menores */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar font-mono">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-300'
                    : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
