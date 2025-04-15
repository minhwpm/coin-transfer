"use client";
import classNames from "classnames";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { closeSelector, setSelectedCoin } from "@/store/tokenSelectorSlice";
import { Token } from "@/components/Token";
import { useIsClient, useDebounceQuery } from "@/hook";
import { Coin, DEFAULT_COIN } from "@/types";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";

const PAGE_LIMIT = 10;

export const TokenSelector = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounceQuery(query, 500);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.tokenSelector.isOpen);
  const isClient = useIsClient();
  const isSearching = !!debouncedQuery;

  const fetchCoins = async ({ pageParam = 0 }) => {
    const apiUrl = isSearching
      ? process.env.NEXT_PUBLIC_SEARCH_COIN_API
      : process.env.NEXT_PUBLIC_LIST_COIN_API;

    if (!apiUrl) throw new Error("Coin API URL not defined");

    const body = isSearching
      ? { search: debouncedQuery }
      : { pagination: { limit: PAGE_LIMIT, offset: pageParam } };

    const res = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const { data } = await res.json();
    return data;
  };

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["coins", debouncedQuery],
      queryFn: fetchCoins,
      getNextPageParam: (lastPage, pages) =>
        !isSearching && lastPage.length === PAGE_LIMIT
          ? pages.length * PAGE_LIMIT
          : undefined,
      initialPageParam: 0,
    });

  const coins: Coin[] = isSearching
    ? data?.pages.flat() ?? []
    : [DEFAULT_COIN, ...(data?.pages.flat() ?? [])];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 10 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleSelect = (coin: Coin) => {
    dispatch(setSelectedCoin(coin));
    dispatch(closeSelector());
  };

  return (
    <div
      className={classNames(
        "fixed top-0 left-0 right-0 bottom-0 p-4 flex items-center justify-center z-50 bg-slate-100/10 backdrop-blur-md",
        { hidden: !isOpen }
      )}
    >
      <div className="bg-white relative w-full max-w-xl h-[400px] pb-5 overflow-y-auto border border-gray-300 rounded-2xl flex flex-col overflow-hidden">
        <button
          onClick={() => dispatch(closeSelector())}
          className="cursor-pointer absolute top-3 right-3 p-1 rounded-full hover:bg-slate-200"
        >
          <IoIosClose size={25} />
        </button>

        <div className="p-5">
          <h2 className="font-bold mb-2">Select token</h2>
          <div className="px-4 rounded-full flex items-center gap-2 border border-gray-300">
            <CiSearch size={20} />
            <input
              type="text"
              placeholder="Search tokens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 outline-none"
            />
          </div>
        </div>
        {isClient && (
          <div onScroll={handleScroll} className="overflow-auto pb-5">
            <ul className="pb-5 flex flex-col gap-2">
              {coins.map((coin) => (
                <li
                  key={coin.coin_type}
                  onClick={() => handleSelect(coin)}
                  className="px-4 py-1 cursor-pointer hover:bg-slate-100"
                >
                  <Token coin={coin} />
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center p-4">
              {(isLoading || isFetchingNextPage) && <p>Loading...</p>}
              {!hasNextPage && !isSearching && !isLoading && (
                <p>No more coins to load</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
