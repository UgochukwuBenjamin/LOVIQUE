
import { useState } from "react";

const categories = [
  "Technology",
  "Music",
  "Gaming",
  "Photography",
  "Education",
  "Fashion",
  "Art",
  "Business",
  "Sports",
  "Reading"
];

export default function Discover() {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">Discover</h1>

      <p className="text-gray-400 mb-8">
        Explore interests and find communities that inspire you.
      </p>

      <input
        type="search"
        placeholder="Search interests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#171717] border border-gray-700 rounded-xl p-4 mb-8 outline-none focus:border-[#C11235]"
      />

      <h2 className="text-xl font-semibold mb-5">
        Explore categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category}
            className="bg-[#171717] border border-gray-800 p-6 rounded-xl hover:border-[#C11235] transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#C11235]/20 flex items-center justify-center text-[#C11235] text-xl mb-4">
              ✦
            </div>

            <h3 className="font-semibold">{category}</h3>

            <p className="text-gray-500 text-sm mt-2">
              Explore this interest
            </p>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <p className="text-gray-500 mt-5">
          No matching interests found.
        </p>
      )}

    </div>
  );
}

