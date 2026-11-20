
import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    profileVisibility: "public",
    showInterests: true,
    allowMessages: true,
    notifications: true
  });

  const updateSetting = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">Settings</h1>

      <p className="text-gray-400 mb-8">
        Manage your account and preferences.
      </p>

      {/* Profile settings */}
      <section className="bg-[#171717] border border-gray-800 rounded-xl p-6 mb-6">

        <h2 className="text-xl font-semibold mb-6">
          Profile Settings
        </h2>

        <label className="block text-sm mb-3">
          Profile visibility
        </label>

        <select
          value={settings.profileVisibility}
          onChange={(e) =>
            updateSetting("profileVisibility", e.target.value)
          }
          className="w-full bg-[#242424] border border-gray-700 rounded-lg p-3 outline-none focus:border-[#C11235]"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <label className="flex items-center justify-between py-5 border-b border-gray-800 gap-4">
          <span>
            <span className="block font-medium">Show interests</span>
            <span className="text-sm text-gray-500">
              Display your interests on your profile.
            </span>
          </span>

          <input
            type="checkbox"
            checked={settings.showInterests}
            onChange={(e) =>
              updateSetting("showInterests", e.target.checked)
            }
            className="accent-[#C11235] w-5 h-5"
          />
        </label>

        <label className="flex items-center justify-between py-5 gap-4">
          <span>
            <span className="block font-medium">Allow messages</span>
            <span className="text-sm text-gray-500">
              Allow other members to message you.
            </span>
          </span>

          <input
            type="checkbox"
            checked={settings.allowMessages}
            onChange={(e) =>
              updateSetting("allowMessages", e.target.checked)
            }
            className="accent-[#C11235] w-5 h-5"
          />
        </label>

      </section>

      {/* Notification settings */}
      <section className="bg-[#171717] border border-gray-800 rounded-xl p-6 mb-6">

        <h2 className="text-xl font-semibold mb-5">
          Notifications
        </h2>

        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block font-medium">
              Push notifications
            </span>
            <span className="text-sm text-gray-500">
              Receive updates about your account.
            </span>
          </span>

          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              updateSetting("notifications", e.target.checked)
            }
            className="accent-[#C11235] w-5 h-5"
          />
        </label>

      </section>

      <button
        type="button"
        onClick={() => alert("Settings are currently saved in page state only. Backend saving will be added later.")}
        className="bg-[#C11235] px-7 py-3 rounded-lg font-semibold hover:bg-red-700"
      >
        Save Settings
      </button>

    </div>
  );
}

