
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    title: "Welcome to LOVIQUE!",
    description: "Your account is ready. Start exploring.",
    time: "Just now",
    read: false
  },
  {
    id: 2,
    title: "New community",
    description: "A new community has been added to Discover.",
    time: "2 hours ago",
    read: false
  },
  {
    id: 3,
    title: "Complete your profile",
    description: "Add more information to your profile.",
    time: "Yesterday",
    read: true
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  };

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-400 mt-2">
            You have {unreadCount} unread notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="text-[#C11235] hover:underline text-sm font-semibold"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 rounded-xl border ${
              notification.read
                ? "bg-[#171717] border-gray-800"
                : "bg-[#251116] border-[#C11235]/50"
            }`}
          >
            <div className="flex justify-between gap-3">

              <div>
                <h2 className="font-semibold">
                  {notification.title}
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  {notification.description}
                </p>

                <p className="text-gray-600 text-xs mt-3">
                  {notification.time}
                </p>
              </div>

              {!notification.read && (
                <span className="w-2 h-2 bg-[#C11235] rounded-full mt-2 shrink-0" />
              )}

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

