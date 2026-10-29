import React, { useState, useEffect, useRef } from 'react';
import { RodadaData } from '../types';
import { SIMBOLOS_ARCADE, getSimboloInfo, formatarCombinacaoArcade } from '../symbols';
import { soundEngine } from '../audio';
import { 
  Sparkles, 
  RotateCw, 
  Terminal, 
  Coins, 
  Volume2, 
  VolumeX, 
  Tv, 
  Award, 
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';

interface SlotMachineProps {
  onSortear: (seed?: number) => Promise<RodadaData | null>;
  rodadaAtual: RodadaData | null;
  loading: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
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
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isMuted());
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);

  // Tabuleiro visual temporário durante rotação para criar ilusão de rolo físico
  const [displayBoard, setDisplayBoard] = useState<string[][]>([
    ['A', 'C', 'E'],
    ['B', 'D', 'A'],
    ['C', 'E', 'B'],
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Sincroniza o tabuleiro quando uma nova rodada chega do backend
  useEffect(() => {
    if (rodadaAtual && !isSpinning) {
      setDisplayBoard(rodadaAtual.tabuleiro);
    }
  }, [rodadaAtual, isSpinning]);

  // Efeito de partículas para comemoração de vitória
  const dispararParticulas = (corHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const count = 60;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles: Particle[] = [];
    const colors = [corHex, '#fbbf24', '#ffffff', '#f59e0b'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      newParticles.push({
        x: centerX + (Math.random() * 60 - 30),
        y: centerY + (Math.random() * 40 - 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    }

    particlesRef.current = newParticles;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particlesRef.current) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravidade
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (alive) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  const handleGirar = async () => {
    if (loading || isSpinning) return;

    soundEngine.playCoin();
    setIsSpinning(true);

    // Efeito de rotação com ticks de catraca mecânica
    const intervalTicks = setInterval(() => {
      soundEngine.playReelTick(180 + Math.random() * 80);
      // Altera símbolos aleatoriamente durante o giro para sensação de rolo em alta velocidade
      const simbolosPossiveis = ['A', 'B', 'C', 'D', 'E'];
      setDisplayBoard([
        [simbolosPossiveis[Math.floor(Math.random() * 5)], simbolosPossiveis[Math.floor(Math.random() * 5)], simbolosPossiveis[Math.floor(Math.random() * 5)]],
        [simbolosPossiveis[Math.floor(Math.random() * 5)], simbolosPossiveis[Math.floor(Math.random() * 5)], simbolosPossiveis[Math.floor(Math.random() * 5)]],
        [simbolosPossiveis[Math.floor(Math.random() * 5)], simbolosPossiveis[Math.floor(Math.random() * 5)], simbolosPossiveis[Math.floor(Math.random() * 5)]],
      ]);
    }, 70);

    const s = seedInput.trim() !== '' ? parseInt(seedInput.trim(), 10) : undefined;

    // Dispara a requisição ao backend
    const promiseResultado = onSortear(isNaN(s as number) ? undefined : s);

    // Animação de giro de 600ms
    setTimeout(async () => {
      clearInterval(intervalTicks);
      const res = await promiseResultado;
      setIsSpinning(false);

      if (res) {
        soundEngine.playReelLock();
        setDisplayBoard(res.tabuleiro);
        setTotalRodadas((prev) => prev + 1);
        setSaldoSessao((prev) => prev + res.lucro);
        setPremiosAcumulados((prev) => prev + res.premio);

        if (res.premiado) {
          setVitoriasSessao((prev) => prev + 1);
          const simbInfo = getSimboloInfo(res.linha_central[0]);
          soundEngine.playWinFanfare(simbInfo.multiplicador);
          dispararParticulas(simbInfo.corHex);
        } else {
          soundEngine.playNoWin();
        }
      }
    }, 600);
  };

  // Suporte a acessibilidade: tecla Espaço para girar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const handleToggleSound = () => {
    const novoStatus = soundEngine.toggleMute();
    setIsMuted(novoStatus);
  };

  const handleResetBanca = () => {
    setSaldoSessao(100.0);
    setTotalRodadas(0);
    setVitoriasSessao(0);
    setPremiosAcumulados(0);
  };

  const rtpSessao = totalRodadas > 0 ? (premiosAcumulados / (totalRodadas * 1.0)) * 100 : 0;
  const isSaldoCritico = saldoSessao < 10.0;

  return (
    <div className={`max-w-5xl mx-auto space-y-6 relative ${scanlinesActive ? 'crt-scanlines' : ''}`}>
      {/* Canvas de Partículas para Vitórias */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 w-full h-full"
      />

      {/* =========================================================================
          PAINEL SUPERIOR: HUD DO JOGADOR (ESTILO COMANDO ARCADE / FLIPERAMA)
         ========================================================================= */}
      <div className="arcade-cabinet rounded-2xl p-4 sm:p-5 relative border-2 border-slate-700/80">
        {/* Parafusos nos cantos do gabinete */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />

        {/* Barra de utilitários rápidos (Mute, Scanlines, Reset) */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSaldoCritico ? 'bg-rose-400' : 'bg-emerald-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSaldoCritico ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="font-mono text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              {isSaldoCritico ? 'STATUS: CRÉDITOS BAIXOS' : 'STATUS: SISTEMA OPERACIONAL'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors font-mono text-[11px] ${
                isMuted ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              }`}
              title="Ligar/Desligar Efeitos Sonoros do Gabinete"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? 'MUDO' : 'ÁUDIO'}</span>
            </button>

            <button
              onClick={() => setScanlinesActive(!scanlinesActive)}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors font-mono text-[11px] ${
                scanlinesActive ? 'bg-sky-500/10 border-sky-500/40 text-sky-400' : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
              title="Ativar/Desativar Efeito CRT Scanlines"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>CRT</span>
            </button>

            <button
              onClick={handleResetBanca}
              className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono text-[11px]"
              title="Reiniciar saldo para 100 fichas"
            >
              <RotateCcw className="w-3 h-3" />
              <span>REINICIAR BANCA</span>
            </button>
          </div>
        </div>

        {/* Grid de Contadores do HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Odômetro de Saldo */}
          <div className={`odometer-display rounded-xl p-3 border text-center transition-all ${
            isSaldoCritico 
              ? 'border-rose-500/80 bg-rose-950/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse' 
              : 'border-slate-800'
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              Banca do Jogador
            </span>
            <div className="flex items-center justify-center gap-1.5 font-display text-2xl font-black">
              <span className="text-amber-400 text-lg">🪙</span>
              <span className={saldoSessao >= 100 ? 'text-emerald-400' : 'text-rose-400'}>
                {saldoSessao.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              {saldoSessao >= 100 ? `Lucro: +${(saldoSessao - 100).toFixed(2)}` : `Prejuízo: ${(saldoSessao - 100).toFixed(2)}`}
            </span>
          </div>

          {/* Contador de Rodadas */}
          <div className="odometer-display rounded-xl p-3 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              Rodadas Jogadas
            </span>
            <p className="font-display text-2xl font-black text-white">
              {totalRodadas.toString().padStart(4, '0')}
            </p>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Aposta fixa: 🪙 1,0
            </span>
          </div>

          {/* Taxa de Vitórias */}
          <div className="odometer-display rounded-xl p-3 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              Taxa de Prêmio
            </span>
            <p className="font-display text-2xl font-black text-amber-300">
              {totalRodadas > 0 ? ((vitoriasSessao / totalRodadas) * 100).toFixed(1) : '0.0'}%
            </p>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Teórico: 4.0% ({vitoriasSessao} vits)
            </span>
          </div>

          {/* RTP Acumulado */}
          <div className="odometer-display rounded-xl p-3 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              RTP da Sessão
            </span>
            <p className="font-display text-2xl font-black text-sky-400">
              {rtpSessao.toFixed(1)}%
            </p>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Teórico Modelo: 84.0%
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TABULEIRO DE ROLOS 3x3 COM FOCO IMERSIVO NA LINHA CENTRAL
         ========================================================================= */}
      <div className="arcade-cabinet rounded-3xl p-6 sm:p-8 relative border-2 border-amber-500/30 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Luzes decorativas do gabinete */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Título do Gabinete */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cilindros Circulares R = (⚡, 🔮, ⚛️, 💎, 👑)
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-wider flex items-center justify-center gap-3">
            MÁQUINA DE ROLOS ARCADES
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            3 rolos independentes com janelas circulares (mod 5). Somente a <strong>linha central</strong> determina pagamento.
          </p>
        </div>

        {/* Grade 3x3 do Jogo */}
        <div className="max-w-lg mx-auto space-y-3">
          {/* LINHA SUPERIOR (FORA DE FOCO / PROFUNDIDADE DE CAMPO) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 opacity-35 filter blur-[1px] scale-95 select-none transition-all duration-300">
            {displayBoard[0].map((sym, idx) => {
              const info = getSimboloInfo(sym);
              return (
                <div
                  key={`top-${idx}`}
                  className={`h-16 sm:h-20 rounded-2xl border-2 ${info.borderClass} bg-gradient-to-b ${info.bgGrad} flex flex-col items-center justify-center shadow-inner ${
                    isSpinning ? 'animate-spin-blur' : ''
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow">{info.icone}</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Topo</span>
                </div>
              );
            })}
          </div>

          {/* LINHA CENTRAL (A ÚNICA AVALIADA — DESTAQUE MÁXIMO COM MOLDURA LUMINOSA) */}
          <div className="relative">
            {/* Glow contínuo de energia */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-3xl blur-md opacity-70 animate-energy-line pointer-events-none" />
            
            <div className="relative bg-[#050814] border-2 border-amber-400 rounded-2xl p-3 sm:p-4 shadow-2xl">
              {/* Placa dourada com o indicador de linha central */}
              <div className="flex items-center justify-between px-2 pb-2.5 text-[11px] font-display font-black text-amber-400 uppercase tracking-widest border-b border-amber-500/20 mb-3">
                <span className="flex items-center gap-1">◀ ROLO 1</span>
                <span className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  ⭐ LINHA CENTRAL DE PAGAMENTO ⭐
                </span>
                <span className="flex items-center gap-1">ROLO 3 ▶</span>
              </div>

              {/* Os 3 rolos centrais */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {displayBoard[1].map((sym, idx) => {
                  const info = getSimboloInfo(sym);
                  const isMatch = rodadaAtual?.premiado && !isSpinning;
                  return (
                    <div
                      key={`center-${idx}`}
                      className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                        info.borderClass
                      } bg-gradient-to-b ${info.bgGrad} ${info.glowClass} ${
                        isSpinning ? 'animate-spin-blur' : ''
                      } ${isMatch ? 'scale-105 border-white shadow-[0_0_30px_rgba(255,255,255,0.6)]' : ''}`}
                    >
                      {/* Reflexo luminoso no topo do slot */}
                      <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                      <span className="text-4xl sm:text-5xl filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-transform hover:scale-110">
                        {info.icone}
                      </span>
                      <span className={`text-[11px] font-display font-bold uppercase tracking-wider mt-1 ${info.textClass}`}>
                        {info.nome}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                        🪙 {info.multiplicador}x
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LINHA INFERIOR (FORA DE FOCO / PROFUNDIDADE DE CAMPO) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 opacity-35 filter blur-[1px] scale-95 select-none transition-all duration-300">
            {displayBoard[2].map((sym, idx) => {
              const info = getSimboloInfo(sym);
              return (
                <div
                  key={`base-${idx}`}
                  className={`h-16 sm:h-20 rounded-2xl border-2 ${info.borderClass} bg-gradient-to-b ${info.bgGrad} flex flex-col items-center justify-center shadow-inner ${
                    isSpinning ? 'animate-spin-blur' : ''
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow">{info.icone}</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Base</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            PAINEL DE FEEDBACK DO RESULTADO (VITÓRIA VS PERDA DA RODADA)
           ========================================================================= */}
        <div className="mt-6 max-w-lg mx-auto">
          {rodadaAtual && !isSpinning ? (
            <div
              className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                rodadaAtual.premiado
                  ? 'bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-950/80 border-slate-700/80 shadow-inner'
              }`}
            >
              {/* Cabeçalho do resultado */}
              <div className="text-center">
                {rodadaAtual.premiado ? (
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-xl sm:text-2xl font-display font-black text-amber-300">
                      <Award className="w-7 h-7 text-yellow-400 animate-bounce" />
                      <span>GRANDE VITÓRIA! TRINCA CONFIRMADA!</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-2xl py-1">
                      {formatarCombinacaoArcade(rodadaAtual.combinacao_central).icones.map((ic, i) => (
                        <span key={i} className="animate-pulse">{ic}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-base font-display font-bold text-slate-300">
                    <AlertTriangle className="w-5 h-5 text-slate-500" />
                    <span>Sem Prêmio ({formatarCombinacaoArcade(rodadaAtual.combinacao_central).icones.join(' ')} - Combinação Mista)</span>
                  </div>
                )}
              </div>

              {/* Grade de balanço financeiro da rodada */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center text-xs sm:text-sm font-mono">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Aposta</span>
                  <strong className="text-white">🪙 1.00</strong>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Prêmio Bruto (P)</span>
                  <strong className={rodadaAtual.premio > 0 ? 'text-amber-400' : 'text-slate-400'}>
                    🪙 {rodadaAtual.premio.toFixed(2)}
                  </strong>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Lucro Líquido (X)</span>
                  <strong className={rodadaAtual.lucro >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {rodadaAtual.lucro > 0 ? `+${rodadaAtual.lucro.toFixed(2)}` : rodadaAtual.lucro.toFixed(2)}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 text-center italic">
                {rodadaAtual.explicacao_regra}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400 font-mono">
              Pressione o botão <strong className="text-amber-300">GIRAR CILINDROS</strong> ou a tecla <strong className="text-amber-300">ESPAÇO</strong> para sortear.
            </div>
          )}
        </div>

        {/* =========================================================================
            PAINEL DE CONTROLE: BOTÃO 3D ARCADE + TERMINAL DEBUG CRT DE SEMENTE
           ========================================================================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5 max-w-xl mx-auto">
          {/* Terminal CRT de Semente */}
          <div className="w-full sm:w-1/2 bg-[#02040a] border-2 border-emerald-500/50 rounded-2xl p-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mb-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>TERMINAL RNG // SEED</span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Semente livre (ex: 2026)"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="w-full bg-slate-950/90 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 placeholder-emerald-800/80 focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]"
              />
            </div>
            <span className="text-[9px] text-emerald-700/80 font-mono block mt-1">
              MT19937 determinístico
            </span>
          </div>

          {/* Botão Físico 3D de Giro Arcade */}
          <button
            onClick={handleGirar}
            disabled={loading || isSpinning}
            className="w-full sm:w-1/2 btn-arcade-spin py-4 px-6 rounded-2xl text-slate-950 font-display font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            <RotateCw className={`w-6 h-6 text-slate-950 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>GIRAR (🪙 1)</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 font-mono mt-4">
          💡 <strong>Acessibilidade Arcade:</strong> Pressione a <strong>Barra de Espaço</strong> para girar sem as mãos no mouse.
        </p>
      </div>

      {/* =========================================================================
          TABELA DE PAGAMENTOS INTERATIVA (PAYTABLE / MANUAL DE GABINETE)
         ========================================================================= */}
      <div className="arcade-cabinet rounded-2xl p-5 border-2 border-slate-700/80">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <h3 className="text-sm font-display font-black text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            MANUAL DE PREMIAÇÕES DO GABINETE (LINHA CENTRAL)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Apenas 5 das 125 triplas são premiadas (4,0%)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center font-mono text-xs">
          {Object.entries(SIMBOLOS_ARCADE).map(([key, info]) => (
            <div
              key={key}
              className={`p-2.5 rounded-xl border ${info.borderClass}/60 bg-gradient-to-b ${info.bgGrad} shadow-sm transition-transform hover:scale-105`}
            >
              <div className="text-xl mb-1 flex items-center justify-center gap-0.5">
                <span>{info.icone}</span>
                <span>{info.icone}</span>
                <span>{info.icone}</span>
              </div>
              <p className={`font-display font-black text-xs ${info.textClass}`}>
                {info.nome}
              </p>
              <p className="font-display font-black text-amber-300 text-sm mt-0.5">
                🪙 {info.multiplicador}x
              </p>
              <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
                Lucro: <strong className="text-emerald-400">+{info.lucroLiquido.toFixed(1)}</strong>
              </p>
              <p className="text-[9px] text-slate-400">
                Prob: <strong>0.8%</strong> (1/125)
              </p>
            </div>
          ))}

          {/* Outras combinações (Perda da Aposta) */}
          <div className="p-2.5 rounded-xl border border-rose-900/60 bg-gradient-to-b from-rose-950/40 to-slate-950 shadow-sm transition-transform hover:scale-105">
            <div className="text-xl mb-1 flex items-center justify-center gap-0.5 opacity-60">
              <span>⚡</span>
              <span>🔮</span>
              <span>👑</span>
            </div>
            <p className="font-display font-black text-xs text-rose-400">
              Outras (Mistas)
            </p>
            <p className="font-display font-black text-rose-300 text-sm mt-0.5">
              🪙 0x
            </p>
            <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
              Lucro: <strong className="text-rose-400">-1.00</strong>
            </p>
            <p className="text-[9px] text-slate-400">
              Prob: <strong>96.0%</strong> (120/125)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
