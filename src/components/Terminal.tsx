import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal as TerminalIcon, 
  Cpu, 
  Database, 
  Activity, 
  Shield, 
  Zap, 
  Code,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { cn } from '../lib/utils';
import { formatEther, parseEther } from 'viem';

// Builder Level logic
const getBuilderLevel = (count: number) => {
  if (count >= 10) return 'Arch-Architect';
  if (count >= 5) return 'Senior Builder';
  if (count >= 1) return 'Junior Dev';
  return 'Newbie';
};

export default function Terminal() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  
  const [checkInCount, setCheckInCount] = useState(0);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Initializing Base Builder Terminal...', '[SYSTEM] Awaiting wallet connection...']);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('base_builder_count');
    if (saved) setCheckInCount(parseInt(saved));
    
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const { sendTransaction, data: hash, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleCheckIn = () => {
    if (!address) return;
    addLog('Initiating Daily Check-in...');
    
    // Send 0 ETH to self with "BASE" builder code
    // Builder Code: 0x42415345 (BASE)
    // In production, you'd use your specific Builder Code from Base docs
    sendTransaction({
      to: address,
      value: parseEther('0'),
      data: '0x42415345', 
    });
  };

  useEffect(() => {
    if (isSuccess) {
      const newCount = checkInCount + 1;
      setCheckInCount(newCount);
      localStorage.setItem('base_builder_count', newCount.toString());
      addLog(`Check-in successful! Total builds: ${newCount}`);
    }
  }, [isSuccess]);

  if (isBooting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-[#0052FF]" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm tracking-widest uppercase"
        >
          Booting System...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[1024px] mx-auto bg-[#050505] border-x border-[#26262b]">
      {/* Header */}
      <header className="h-20 px-10 flex items-center justify-between border-b border-[#26262b]">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-[#0052FF] rounded-full flex items-center justify-center">
            <TerminalIcon className="w-4 h-4 text-white" />
          </div>
          <span className="uppercase">Base Pulse</span>
        </div>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="bg-[#121214] border border-[#26262b] px-4 py-2 rounded-full font-mono text-xs text-[#88888E]">
              {address?.slice(0, 6)}...{address?.slice(-4)} • BASE
            </div>
          ) : (
            <div className="text-[10px] uppercase tracking-widest text-[#88888E]">Awaiting Connection</div>
          )}
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_340px] bg-[#26262b] gap-px overflow-hidden">
        {/* Dashboard (Left) */}
        <section className="bg-[#050505] p-10 flex flex-col gap-10 overflow-y-auto scrollbar-hide">
          <div>
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.1em] text-[#88888E] mb-2">Live Network Metrics</div>
              <h2 className="text-2xl font-semibold">Network Performance</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#121214] border border-[#26262b] p-6 rounded-xl">
                <div className="text-[11px] text-[#88888E] mb-2">Current Gas</div>
                <div className="text-3xl font-semibold text-[#0052FF]">0.001</div>
                <div className="text-[11px] text-[#88888E] mt-1">Gwei (Base L2)</div>
              </div>
              <div className="bg-[#121214] border border-[#26262b] p-6 rounded-xl">
                <div className="text-[11px] text-[#88888E] mb-2">Wallet Balance</div>
                <div className="text-3xl font-semibold text-[#0052FF]">
                  {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'}
                </div>
                <div className="text-[11px] text-[#88888E] mt-1">{balance?.symbol || 'ETH'}</div>
              </div>
              <div className="bg-[#121214] border border-[#26262b] p-6 rounded-xl">
                <div className="text-[11px] text-[#88888E] mb-2">L1 Settlement</div>
                <div className="text-3xl font-semibold text-[#0052FF]">~12m</div>
                <div className="text-[11px] text-[#88888E] mt-1">Avg delay</div>
              </div>
            </div>
          </div>

          <div className="bg-[#121214] border border-[#26262b] rounded-2xl p-8">
            <div className="text-[10px] uppercase tracking-[0.1em] text-[#88888E] mb-6">Security & Health</div>
            <div className="space-y-4">
              {[
                { label: 'Sequencer Status', value: 'Operational', color: 'text-green-500' },
                { label: 'Fault Proofs', value: 'In Development', color: 'text-white' },
                { label: 'Active Modules', value: '3/3 Active', color: 'text-white' },
                { label: 'Builder SDK', value: 'v2.1', color: 'text-[#88888E] font-mono' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-[#26262b] last:border-0">
                  <span className="text-sm text-[#88888E]">{row.label}</span>
                  <span className={cn("text-sm font-medium", row.color)}>
                    {row.value === 'Operational' && <span className="mr-2">●</span>}
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-5">
            <div className="text-[10px] uppercase tracking-[0.1em] text-[#88888E] mb-4 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span>System Logs</span>
            </div>
            <div className="bg-[#121214] border border-[#26262b] rounded-xl p-4 font-mono text-[10px] h-32 overflow-y-auto scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className={cn("py-1 border-b border-[#26262b] last:border-0", i === 0 ? "text-[#0052FF]" : "text-[#88888E]")}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Side Panel (Right) */}
        <aside className="bg-[#050505] p-10 border-l border-[#26262b] flex flex-col gap-8 overflow-y-auto scrollbar-hide">
          <div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-[#88888E] mb-4">Loyalty Rewards</div>
            <div className="bg-gradient-to-b from-[#121214] to-transparent border border-[#26262b] rounded-[20px] p-8 text-center relative overflow-hidden">
              <div className="text-[10px] uppercase tracking-[0.1em] text-[#88888E] mb-2">Current Streak</div>
              <div className="text-6xl font-extrabold tracking-tighter my-2 leading-none">
                {checkInCount}
              </div>
              <div className="text-[11px] text-[#88888E] mb-4">Consecutive Days</div>
              
              <div className="h-1 w-full bg-[#26262b] rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full bg-[#0052FF] transition-all duration-1000" 
                  style={{ width: `${Math.min((checkInCount / 15) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-[#88888E]">Next milestone: 15 days</div>

              {!isConnected ? (
                <div className="mt-8 space-y-3">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      className="w-full py-4 bg-[#0052FF] text-white rounded-xl font-semibold text-sm hover:bg-[#0041cc] transition-all shadow-[0_4px_20px_rgba(0,82,255,0.2)]"
                    >
                      Connect {connector.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  <AnimatePresence mode="wait">
                    {isSending || isConfirming ? (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" />
                        <span className="text-[10px] uppercase tracking-widest text-[#88888E] animate-pulse">
                          {isSending ? 'Waiting for signature' : 'Confirming on Base'}
                        </span>
                      </div>
                    ) : isSuccess ? (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-2 py-4"
                      >
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                        <span className="text-xs font-medium text-green-500 uppercase tracking-widest">Check-in Complete</span>
                      </motion.div>
                    ) : (
                      <button
                        onClick={handleCheckIn}
                        className="w-full py-4 bg-[#0052FF] text-white rounded-xl font-semibold text-sm hover:bg-[#0041cc] transition-all shadow-[0_4px_20px_rgba(0,82,255,0.2)]"
                      >
                        Claim Daily Streak
                      </button>
                    )}
                  </AnimatePresence>
                  <div className="mt-4 text-[10px] text-[#88888E] italic">Free claim — Gas only on Base</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.1em] text-[#88888E] mb-4">Recent Activity</div>
            <div className="space-y-4">
              {checkInCount > 0 ? (
                Array.from({ length: Math.min(checkInCount, 3) }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-[#26262b] last:border-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div>
                      <div className="text-xs font-medium">Check-in Successful</div>
                      <div className="text-[10px] text-[#88888E] mt-0.5">{i === 0 ? 'Recently' : `${i + 1} days ago`} • tx: 0x...</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#88888E] italic py-4">No recent activity found.</div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[#26262b] flex justify-between text-[10px] text-[#88888E] uppercase tracking-widest">
            <span>VER: 0.1.0_ALPHA</span>
            {isConnected && (
              <button onClick={() => disconnect()} className="hover:text-white transition-colors">
                Disconnect
              </button>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
