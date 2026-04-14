/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
import Terminal from './components/Terminal';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#0052FF] selection:text-white">
          <Terminal />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
