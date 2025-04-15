"use client";

import { FormEvent, Suspense, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
  useWallets,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { shortenAddress } from "@/utils";
import { FormattedBigDecimalInput } from "@/components/FormattedBigDecimalInput";
import { TokenSelector } from "@/components/TokenSelector";
import { TfiWallet } from "react-icons/tfi";
import { IoIosArrowDown } from "react-icons/io";
import { useIsClient } from "@/hook";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { openSelector } from "@/store/tokenSelectorSlice";

export const Wallet = () => {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [balance, setBalance] = useState<string | null>(null);
  const isClient = useIsClient();

  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.tokenSelector.isOpen);
  const selectedCoin = useSelector(
    (state: RootState) => state.tokenSelector.selectedCoin
  );

  const coinType = selectedCoin?.coin_type;

  const fetchBalance = useCallback(async () => {
    if (!currentAccount) return;
    try {
      const res = await suiClient.getBalance({ owner: currentAccount.address });
      setBalance(res.totalBalance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  }, [currentAccount, suiClient]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const receiverAddress = formData.get("receiverAddress") as string;
    const amount = formData.get("amount") as string;

    if (!receiverAddress || !amount || !coinType || !currentAccount) {
      alert("Please fill in all fields and connect wallet.");
      return;
    }

    const tx = new Transaction();
    tx.setSender(currentAccount.address);
    tx.transferObjects(
      [coinWithBalance({ balance: parseFloat(amount) * 1e9, type: coinType })],
      receiverAddress
    );

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: (res) => {
          console.log("Transaction success:", res);
          alert("Transaction sent successfully!");
        },
        onError: (err) => {
          console.error("Transaction error:", err);
          alert("Transaction failed.");
        },
        onSettled: fetchBalance,
      }
    );
  };

  const renderTransaction = () => (
    <div className="flex flex-wrap justify-between gap-4 mb-4 p-4 text-slate-500 bg-slate-100 rounded-2xl">
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-bold">You send</label>

        <div
          onClick={() => dispatch(openSelector())}
          className="cursor-pointer hover:bg-slate-200 border border-solid border-black/[.08] rounded-full w-24 h-10 sm:h-12 px-2 flex items-center"
        >
          <span>{selectedCoin.symbol ?? "SUI"}</span>
          <span className="ml-auto">
            <IoIosArrowDown size={20} />
          </span>
        </div>

        <input hidden name="coinType" type="text" value={coinType} readOnly />

        <div className="pl-2 text-sm flex items-center gap-2">
          <TfiWallet size={15} />
          <span>
            {selectedCoin.name !== "SUI"
              ? selectedCoin.balance ?? 0
              : balance
              ? parseFloat(balance) / 1e9
              : 0}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 mb-4">
        <div className="flex items-center justify-end space-x-1 text-sm font-bold text-red-600">
          <div className="cursor-pointer rounded-md px-1 hover:bg-red-50">
            Half
          </div>
          <div className="cursor-pointer rounded-md px-1 hover:bg-red-50">
            Max
          </div>
        </div>
        <FormattedBigDecimalInput name="amount" />
      </div>
    </div>
  );

  if (!isClient) return renderTransaction();

  return (
    <>
      <div>
        {wallets.map((wallet) => (
          <div key={wallet.name} className="flex flex-col items-start gap-2">
            {currentAccount && (
              <div className="w-full flex items-center gap-2 p-2 rounded-full border border-black/[.08]">
                <Image
                  src={wallet.icon}
                  width={35}
                  height={35}
                  alt="wallet"
                  className="rounded-full"
                />
                <span>{shortenAddress(currentAccount.address)}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 mb-4 w-full"
            >
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm font-bold text-center sm:text-left">
                  Receiver address
                </label>
                <input
                  type="text"
                  name="receiverAddress"
                  placeholder="Input receiver address"
                  aria-label="Input receiver address"
                  className="border border-solid border-black/[.08] rounded-full h-10 sm:h-12 px-4 sm:px-5 w-full"
                />
              </div>

              {renderTransaction()}

              {currentAccount ? (
                <input
                  type="submit"
                  value="Send"
                  className="bg-slate-800 font-semibold w-full rounded-full px-8 py-3 text-slate-100"
                />
              ) : (
                <ConnectButton connectText="Connect wallet" />
              )}
            </form>
          </div>
        ))}
      </div>

      <Suspense fallback="Loading token selector...">
        {isOpen && <TokenSelector />}
      </Suspense>
    </>
  );
};
