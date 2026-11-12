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
    <div className="flex flex-wrap gap-4">
      <div>
        <label htmlFor="search">Search</label>
        <input
          id="search"
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            updateUrl("q", value);
          }}
          className="ml-2 rounded border p-2"
        />
      </div>
      <div>
        <label htmlFor="sort">Sort</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => updateUrl("sort", e.target.value)}
          className="ml-2 rounded border p-2"
        >
          <option value="name">Name</option>
          <option value="pasc">Price Low to High</option>
          <option value="pdesc">Price High to Low</option>
        </select>
      </div>
    </div>
  );
}
