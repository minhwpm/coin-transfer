"use client";
import { Coin } from "@/types";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const Token = ({ coin }: { coin: Coin }) => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAccount || !coin.coin_type) return;

    const fetchBalance = async () => {
      try {
        const result = await suiClient.getBalance({
          owner: currentAccount.address,
          coinType: coin.coin_type,
        });
        console.log(
          "Balance for",
          coin.symbol,
          ":",
          result.totalBalance.toString()
        );
        setBalance(result.totalBalance.toString());
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchBalance();
  }, [coin.coin_type, coin.symbol, suiClient, currentAccount]);

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        {coin.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coin.logo}
            width={20}
            height={20}
            alt={coin.name}
            className="rounded-full w-5 h-5 object-cover"
          />
        ) : (
          <div className="rounded-full w-5 h-5 bg-gray-300 flex items-center justify-center text-xs">
            N/A
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-semibold">{coin.symbol}</div>
          <div className="text-sm text-slate-500">{coin.name}</div>
        </div>
      </div>
      <div>{balance ? (parseFloat(balance) / 1e9).toFixed(2) : ""}</div>
    </div>
  );
};
