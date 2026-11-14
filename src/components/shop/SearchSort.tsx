/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  q: string;
  sort: string;
}

export default function SearchSort({ q, sort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();

    router.push(query ? `/shop?${query}` : "/shop");
  }
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="w-full sm:max-w-md">
        <label
          htmlFor="search"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Search
        </label>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path d="m16 16 4 4" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            id="search"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              updateUrl("q", value);
            }}
            placeholder="Search products..."
            className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-500 hover:border-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
          />
        </div>
      </div>
      <div className="w-full sm:w-64">
        <label
          htmlFor="sort"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Sort
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => updateUrl("sort", e.target.value)}
          className="h-12 w-full cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none transition-all hover:border-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
        >
          <option value="name">Name</option>
          <option value="price-asc">Price Low to High</option>
          <option value="price-desc">Price High to Low</option>
        </select>
      </div>
    </div>
  );
}
