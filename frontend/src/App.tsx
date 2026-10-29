import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SlotMachine } from './components/SlotMachine';
import { Experimento1View } from './components/Experimento1View';
import { Experimento2View } from './components/Experimento2View';
import { Experimento3View } from './components/Experimento3View';
import { Experimento4View } from './components/Experimento4View';
import { Experimento5View } from './components/Experimento5View';
import { ArquivosView } from './components/ArquivosView';
import { SobreView } from './components/SobreView';
import { RodadaData, StatsE1, StatsE2, StatsE3, StatsE4, StatsE5 } from './types';
import { ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulador');
  const [rodadaAtual, setRodadaAtual] = useState<RodadaData | null>(null);
  const [loadingRodada, setLoadingRodada] = useState<boolean>(false);
  const [executandoTodos, setExecutandoTodos] = useState<boolean>(false);

  // Estados dos Experimentos
  const [e1Data, setE1Data] = useState<StatsE1 | null>(null);
  const [e1Loading, setE1Loading] = useState<boolean>(false);

  const [e2Data, setE2Data] = useState<StatsE2 | null>(null);
  const [e2Loading, setE2Loading] = useState<boolean>(false);

  const [e3Data, setE3Data] = useState<StatsE3 | null>(null);
  const [e3Loading, setE3Loading] = useState<boolean>(false);

  const [e4Data, setE4Data] = useState<StatsE4 | null>(null);
  const [e4Loading, setE4Loading] = useState<boolean>(false);

  const [e5Data, setE5Data] = useState<StatsE5 | null>(null);
  const [e5Loading, setE5Loading] = useState<boolean>(false);

  // Sorteio de rodada individual
  const handleSortearRodada = async (seed?: number): Promise<RodadaData | null> => {
    setLoadingRodada(true);
    try {
      const resp = await fetch('/api/rodada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: seed !== undefined ? seed : null }),
      });
      if (!resp.ok) throw new Error('Falha no sorteio');
      const data: RodadaData = await resp.json();
      setRodadaAtual(data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoadingRodada(false);
    }
  };

  // Carregamento sob demanda dos experimentos
  const carregarE1 = () => {
    setE1Loading(true);
    fetch('/api/experimentos/e1', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setE1Data(d))
      .catch((e) => console.error(e))
      .finally(() => setE1Loading(false));
  };

  const carregarE2 = () => {
    setE2Loading(true);
    fetch('/api/experimentos/e2', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setE2Data(d))
      .catch((e) => console.error(e))
      .finally(() => setE2Loading(false));
  };

  const carregarE3 = () => {
    setE3Loading(true);
    fetch('/api/experimentos/e3', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setE3Data(d))
      .catch((e) => console.error(e))
      .finally(() => setE3Loading(false));
  };

  const carregarE4 = () => {
    setE4Loading(true);
    fetch('/api/experimentos/e4', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setE4Data(d))
      .catch((e) => console.error(e))
      .finally(() => setE4Loading(false));
  };

  const carregarE5 = () => {
    setE5Loading(true);
    fetch('/api/experimentos/e5', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setE5Data(d))
      .catch((e) => console.error(e))
      .finally(() => setE5Loading(false));
  };

  // Carrega os dados quando a aba correspondente é aberta
  useEffect(() => {
    if (activeTab === 'e1' && !e1Data) carregarE1();
    if (activeTab === 'e2' && !e2Data) carregarE2();
    if (activeTab === 'e3' && !e3Data) carregarE3();
    if (activeTab === 'e4' && !e4Data) carregarE4();
    if (activeTab === 'e5' && !e5Data) carregarE5();
  }, [activeTab]);

  // Execução de todos os experimentos em lote
  const handleExecutarTodos = async () => {
    setExecutandoTodos(true);
    try {
      const resp = await fetch('/api/experimentos/executar-todos', { method: 'POST' });
      if (resp.ok) {
        // Recarrega todos os estados
        carregarE1();
        carregarE2();
        carregarE3();
        carregarE4();
        carregarE5();
        alert('Todos os 5 experimentos foram recalculados e os arquivos físicos CSV/PNG foram atualizados!');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao executar os experimentos.');
    } finally {
      setExecutandoTodos(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExecutarTodos={handleExecutarTodos}
        executandoTodos={executandoTodos}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulador' && (
          <SlotMachine
            onSortear={handleSortearRodada}
            rodadaAtual={rodadaAtual}
            loading={loadingRodada}
          />
        )}
        {activeTab === 'e1' && (
          <Experimento1View dados={e1Data} loading={e1Loading} onRecarregar={carregarE1} />
        )}
        {activeTab === 'e2' && (
          <Experimento2View dados={e2Data} loading={e2Loading} onRecarregar={carregarE2} />
        )}
        {activeTab === 'e3' && (
          <Experimento3View dados={e3Data} loading={e3Loading} onRecarregar={carregarE3} />
        )}
        {activeTab === 'e4' && (
          <Experimento4View dados={e4Data} loading={e4Loading} onRecarregar={carregarE4} />
        )}
        {activeTab === 'e5' && (
          <Experimento5View dados={e5Data} loading={e5Loading} onRecarregar={carregarE5} />
        )}
        {activeTab === 'arquivos' && <ArquivosView />}
        {activeTab === 'sobre' && <SobreView />}
      </main>

      {/* Rodapé com aviso obrigatório */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>Simulador acadêmico — somente créditos fictícios</span>
        </div>
        <p>
          Instituto Federal do Espírito Santo (IFES) — Campus Serra • Bacharelado em Sistemas de Informação
        </p>
        <p className="text-[11px] text-slate-600">
          Trabalho I — Probabilidade e Estatística I (2026/2) • Prof. Fidelis Zanetti de Castro
        </p>
      </footer>
    </div>
  );
};
