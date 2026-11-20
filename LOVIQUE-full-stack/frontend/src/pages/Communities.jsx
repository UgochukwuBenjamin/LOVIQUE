
import { useState } from "react";

const initialCommunities = [
  {
    id: 1,
    name: "Tech Innovators",
    category: "Technology",
    description: "A space for people interested in technology and innovation."
  },
  {
    id: 2,
    name: "Creative Minds",
    category: "Art",
    description: "Share creative ideas, projects and inspiration."
  },
  {
    id: 3,
    name: "Music Lovers",
    category: "Music",
    description: "Connect through music and discover new sounds."
  },
  {
    id: 4,
    name: "Entrepreneur Hub",
    category: "Business",
    description: "Discuss business ideas and learn together."
  },
  {
    id: 5,
    name: "Book Circle",
    category: "Reading",
    description: "Share books, reviews and reading recommendations."
  },
  {
    id: 6,
    name: "Game Zone",
    category: "Gaming",
    description: "Talk about games and share gaming experiences."
  }
];

export default function Communities() {
  const [joined, setJoined] = useState([]);

  const toggleJoin = (id) => {
    setJoined((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-gray-400 mt-2">
            Find your people and share what you love.
          </p>
        </div>

        <button
          type="button"
          className="bg-[#C11235] px-5 py-3 rounded-lg font-semibold hover:bg-red-700"
          onClick={() => alert("Community creation will be connected to the backend soon.")}
        >
          + Create Community
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {initialCommunities.map((community) => {
          const isJoined = joined.includes(community.id);

          return (
            <div
              key={community.id}
              className="bg-[#171717] border border-gray-800 rounded-xl p-6 hover:border-[#C11235] transition"
            >
              <span className="text-xs text-[#C11235] bg-[#C11235]/10 px-3 py-2 rounded-full">
                {community.category}
              </span>

              <h2 className="text-xl font-bold mt-5">
                {community.name}
              </h2>

              <p className="text-gray-400 text-sm mt-3 mb-6">
                {community.description}
              </p>

              <button
                type="button"
                onClick={() => toggleJoin(community.id)}
                className={`w-full py-3 rounded-lg font-semibold ${
                  isJoined
                    ? "border border-gray-600 text-white"
                    : "bg-[#C11235] text-white hover:bg-red-700"
                }`}
              >
                {isJoined ? "Joined ✓" : "Join Community"}
              </button>
            </div>
          );
        })}

      </div>
    </div>
  );
}
