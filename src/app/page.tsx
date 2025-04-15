"use client";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Wallet } from "./components/Wallet";
import { TokenSelectorProvider } from "./components/TokenSelectorProvider";
import "@mysten/dapp-kit/dist/index.css";

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});
const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={
          process.env.NEXT_PUBLIC_DEFAULT_NETWORK as
            | "localnet"
            | "mainnet"
            | "testnet"
            | undefined
        }
      >
        <WalletProvider>
          <TokenSelectorProvider>
            <main className="flex items-center justify-center min-h-screen bg-slate-50">
              <div className="w-full md:w-2xl p-4 sm:p-5 md:border md:border-solid md:border-black/[.08] md:rounded-2xl md:shadow">
                <Wallet />
              </div>
            </main>
          </TokenSelectorProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
