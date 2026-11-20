
import { Link } from "react-router-dom";

const activities = [
  {
    title: "Explore new communities",
    description: "Find people who share your interests."
  },
  {
    title: "Complete your profile",
    description: "Add more details to introduce yourself."
  },
  {
    title: "Discover something new",
    description: "Explore topics and interests across LOVIQUE."
  }
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-8">
        <p className="text-[#C11235] text-sm font-semibold">
          WELCOME TO LOVIQUE
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Welcome back!
        </h1>

        <p className="text-gray-400 mt-2">
          Your space to connect, share and belong.
        </p>
      </div>

      <div className="bg-gradient-to-r from-[#5c071a] to-[#C11235] rounded-2xl p-7 md:p-10 mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Find your community.
        </h2>

        <p className="text-gray-200 mb-6 max-w-lg">
          Discover communities, explore your interests and connect with people.
        </p>

        <Link
          to="/discover"
          className="inline-block bg-white text-[#C11235] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          Start Exploring
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

        {[
          { title: "Discover", value: "Explore", path: "/discover" },
          { title: "Communities", value: "Find your people", path: "/communities" },
          { title: "Messages", value: "Stay connected", path: "/messages" }
        ].map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className="bg-[#171717] border border-gray-800 rounded-xl p-6 hover:border-[#C11235] transition"
          >
            <p className="text-gray-400 text-sm">{item.title}</p>
            <h3 className="text-xl font-bold mt-3">{item.value}</h3>
            <p className="text-[#C11235] text-sm mt-5">Open page →</p>
          </Link>
        ))}

      </div>

      <h2 className="text-xl font-bold mb-5">Getting started</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <div
            key={activity.title}
            className="bg-[#171717] border border-gray-800 rounded-xl p-5"
          >
            <h3 className="font-semibold mb-2">{activity.title}</h3>
            <p className="text-gray-400 text-sm">{activity.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

