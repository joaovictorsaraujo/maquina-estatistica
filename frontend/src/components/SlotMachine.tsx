import React, { useState, useEffect } from 'react';
import { RodadaData } from '../types';
import { Sparkles, RotateCw, Hash, DollarSign, Award, AlertCircle } from 'lucide-react';

interface SlotMachineProps {
  onSortear: (seed?: number) => Promise<RodadaData | null>;
  rodadaAtual: RodadaData | null;
  loading: boolean;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  onSortear,
  rodadaAtual,
  loading,
}) => {
  const [seedInput, setSeedInput] = useState<string>('');
  const [saldoSessao, setSaldoSessao] = useState<number>(100.0);
  const [totalRodadas, setTotalRodadas] = useState<number>(0);
  const [vitoriasSessao, setVitoriasSessao] = useState<number>(0);
  const [premiosAcumulados, setPremiosAcumulados] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Tabuleiro padrão antes do primeiro giro
  const defaultBoard = [
    ['A', 'C', 'E'],
    ['B', 'D', 'A'],
    ['C', 'E', 'B'],
  ];

  const board = rodadaAtual ? rodadaAtual.tabuleiro : defaultBoard;

  const handleGirar = async () => {
    if (loading || isSpinning) return;
    setIsSpinning(true);

    const s = seedInput.trim() !== '' ? parseInt(seedInput.trim(), 10) : undefined;
    
    // Pequeno delay visual para animação
    setTimeout(async () => {
      const res = await onSortear(isNaN(s as number) ? undefined : s);
      setIsSpinning(false);
      if (res) {
        setTotalRodadas((prev) => prev + 1);
        setSaldoSessao((prev) => prev + res.lucro);
        if (res.premiado) {
          setVitoriasSessao((prev) => prev + 1);
        }
        setPremiosAcumulados((prev) => prev + res.premio);
      }
    }, 400);
  };

  // Suporte a acessibilidade: tecla Espaço para girar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleGirar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, isSpinning, seedInput]);

  const corSimbolo = (s: string) => {
    switch (s) {
      case 'A': return 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
      case 'B': return 'bg-blue-950/80 border-blue-500 text-blue-300';
      case 'C': return 'bg-purple-950/80 border-purple-500 text-purple-300';
      case 'D': return 'bg-amber-950/80 border-amber-500 text-amber-300';
      case 'E': return 'bg-rose-950/80 border-rose-500 text-rose-300';
      default: return 'bg-slate-800 border-slate-700 text-slate-200';
    }
  };

  const rtpSessao = totalRodadas > 0 ? (premiosAcumulados / (totalRodadas * 1.0)) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cards de Métricas da Sessão */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400 font-medium">Saldo da Sessão</p>
          <p className={`text-xl font-black ${saldoSessao >= 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {saldoSessao.toFixed(2)} <span className="text-xs font-normal text-slate-400">créditos</span>
          </p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400 font-medium">Rodadas Jogadas</p>
          <p className="text-xl font-black text-white">{totalRodadas}</p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400 font-medium">Taxa de Vitórias</p>
          <p className="text-xl font-black text-amber-300">
            {totalRodadas > 0 ? ((vitoriasSessao / totalRodadas) * 100).toFixed(1) : '0.0'}%
          </p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400 font-medium">RTP Acumulado</p>
          <p className="text-xl font-black text-sky-400">{rtpSessao.toFixed(1)}%</p>
        </div>
      </div>

      {/* Máquina de Rolos */}
      <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            TABULEIRO 3 × 3 DE ROLOS DIGITAIS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cada coluna é uma janela consecutiva de um rolo circular <code className="text-amber-300">R = (A, B, C, D, E)</code>
          </p>
        </div>

        {/* Grade 3x3 */}
        <div className="max-w-md mx-auto space-y-2.5">
          {/* Linha Superior (Não avaliada) */}
          <div className="grid grid-cols-3 gap-3 opacity-60">
            {board[0].map((sym, idx) => (
              <div
                key={`top-${idx}`}
                className={`h-16 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center font-black text-2xl sm:text-3xl transition-transform ${corSimbolo(sym)} ${
                  isSpinning ? 'animate-spin-reel' : ''
                }`}
              >
                <span>{sym}</span>
                <span className="text-[10px] font-normal tracking-wider uppercase opacity-70">Topo</span>
              </div>
            ))}
          </div>

          {/* Linha Central (ÚNICA LINHA AVALIADA — Realçada) */}
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl blur-sm opacity-60 animate-pulse pointer-events-none" />
            <div className="relative bg-slate-950/90 border-2 border-amber-400 rounded-xl p-2.5 shadow-2xl">
              <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                <span>◀ Rolo 1</span>
                <span>⭐ ÚNICA LINHA AVALIADA ⭐</span>
                <span>Rolo 3 ▶</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {board[1].map((sym, idx) => (
                  <div
                    key={`center-${idx}`}
                    className={`h-20 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center font-black text-4xl sm:text-5xl shadow-inner ${corSimbolo(sym)} ${
                      isSpinning ? 'animate-spin-reel' : ''
                    }`}
                  >
                    <span>{sym}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300/80">Centro</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Linha Inferior (Não avaliada) */}
          <div className="grid grid-cols-3 gap-3 opacity-60">
            {board[2].map((sym, idx) => (
              <div
                key={`base-${idx}`}
                className={`h-16 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center font-black text-2xl sm:text-3xl transition-transform ${corSimbolo(sym)} ${
                  isSpinning ? 'animate-spin-reel' : ''
                }`}
              >
                <span>{sym}</span>
                <span className="text-[10px] font-normal tracking-wider uppercase opacity-70">Base</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback do Resultado */}
        <div className="mt-6 max-w-md mx-auto">
          {rodadaAtual ? (
            <div
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                rodadaAtual.premiado
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-lg font-black">
                {rodadaAtual.premiado ? (
                  <>
                    <Award className="w-6 h-6 text-yellow-400" />
                    <span className="text-yellow-400">VITÓRIA! TRINCA CENTRAL {rodadaAtual.combinacao_central}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <span>Sem Prêmio ({rodadaAtual.combinacao_central})</span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400">Aposta:</span> <strong className="text-white">1.00</strong>
                </div>
                <div>
                  <span className="text-slate-400">Prêmio (P):</span>{' '}
                  <strong className={rodadaAtual.premio > 0 ? 'text-emerald-400' : 'text-white'}>
                    {rodadaAtual.premio.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Lucro (X):</span>{' '}
                  <strong className={rodadaAtual.lucro >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {rodadaAtual.lucro > 0 ? `+${rodadaAtual.lucro.toFixed(2)}` : rodadaAtual.lucro.toFixed(2)}
                  </strong>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 italic">{rodadaAtual.explicacao_regra}</p>
            </div>
          ) : (
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
              Pressione o botão <strong>Girar Rodada</strong> ou a <strong>Barra de Espaço</strong> para sortear.
            </div>
          )}
        </div>

        {/* Controles de Ação e Semente */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Semente (Opcional):</span>
            <div className="relative flex-1">
              <Hash className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="number"
                placeholder="Ex: 2026"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            onClick={handleGirar}
            disabled={loading || isSpinning}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>GIRAR RODADA (1 CRÉDITO)</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-3">
          💡 <strong>Acessibilidade:</strong> Você também pode disparar o sorteio pressionando a <strong>Barra de Espaço</strong>.
        </p>
      </div>

      {/* Tabela de Pagamentos em formato compacto */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-amber-400" />
          TABELA OFICIAL DE PAGAMENTOS (LINHA CENTRAL)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-emerald-400 font-bold">A–A–A</span>
            <p className="text-slate-300 font-black">5x (P=5)</p>
            <p className="text-slate-500 text-[10px]">Lucro: +4 | Prob: 0.8%</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-blue-400 font-bold">B–B–B</span>
            <p className="text-slate-300 font-black">10x (P=10)</p>
            <p className="text-slate-500 text-[10px]">Lucro: +9 | Prob: 0.8%</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold">C–C–C</span>
            <p className="text-slate-300 font-black">15x (P=15)</p>
            <p className="text-slate-500 text-[10px]">Lucro: +14 | Prob: 0.8%</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-amber-400 font-bold">D–D–D</span>
            <p className="text-slate-300 font-black">25x (P=25)</p>
            <p className="text-slate-500 text-[10px]">Lucro: +24 | Prob: 0.8%</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-rose-400 font-bold">E–E–E</span>
            <p className="text-slate-300 font-black">50x (P=50)</p>
            <p className="text-slate-500 text-[10px]">Lucro: +49 | Prob: 0.8%</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-bold">Outras (120)</span>
            <p className="text-rose-400 font-black">0x (P=0)</p>
            <p className="text-slate-500 text-[10px]">Lucro: -1 | Prob: 96%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
