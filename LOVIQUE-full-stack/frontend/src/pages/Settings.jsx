import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const initialSettings = {
  // Privacy and discovery
  profileVisibility: "public",
  showInterests: true,
  showOnlineStatus: true,
  showDistance: true,
  showAge: true,
  appearInDiscovery: true,
  readReceipts: true,

  // Interactions
  allowMessages: "matches",
  allowLikes: true,
  allowConnectionRequests: true,

  // Notifications
  notifications: true,
  messageNotifications: true,
  matchNotifications: true,
  likeNotifications: true,
  connectionNotifications: true,
  emailNotifications: false,
  promotionalNotifications: false,

  // Safety
  incognitoMode: false,
  hideFromContacts: false,

  // Account
  pauseAccount: false,
};

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 py-4 border-b border-gray-800 last:border-0 cursor-pointer">
      <span className="min-w-0">
        <span className="block font-medium text-white">{label}</span>

        {description && <span className="block text-sm text-gray-500 mt-1">{description}</span>}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#C11235] w-5 h-5 shrink-0 cursor-pointer"
      />
    </label>
  );
}

function SelectSetting({ label, description, value, onChange, options }) {
  return (
    <div className="py-4 border-b border-gray-800 last:border-0">
      <label className="block font-medium text-white mb-2">{label}</label>

      {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#242424] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-[#C11235]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingsSection({ title, description, children }) {
  return (
    <section className="bg-[#171717] border border-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>

      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

      {children}
    </section>
  );
}

export default function Settings({ onSave }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  // Remember the profile visibility value originally loaded from the API.
  const [originalProfileVisibility, setOriginalProfileVisibility] = useState(
    initialSettings.profileVisibility
  );

  // LOAD SETTINGS WHEN THE PAGE OPENS
  useEffect(() => {
    let isActive = true;

    const loadSettings = async () => {
      try {
        const token = sessionStorage.getItem("lovique_token");

        if (!API_URL) {
          throw new Error("API URL is not configured. Check your frontend environment file.");
        }

        if (!token) {
          throw new Error("Please sign in to view your settings.");
        }

        const response = await fetch(`${API_URL}/api/settings/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message ||
              (response.status === 401
                ? "Your session has expired. Please sign in again."
                : "Unable to load your settings.")
          );
        }

        if (!data.settings) {
          throw new Error("The server returned an invalid settings response.");
        }

        if (isActive) {
          const { updatedAt, ...savedSettings } = data.settings;

          setSettings({
            ...initialSettings,
            ...savedSettings,
          });

          setOriginalProfileVisibility(
            savedSettings.profileVisibility ?? initialSettings.profileVisibility
          );
        }
      } catch (error) {
        if (isActive) {
          setSaveMessage(error.message || "Unable to load your settings.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const updateSetting = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaveMessage("");
  };

  // SAVE SETTINGS TO THE BACKEND
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage("");

      const token = sessionStorage.getItem("lovique_token");

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      if (!token) {
        throw new Error("Please sign in before saving your settings.");
      }

      // Only send profileVisibility if the user actually changed it.
      // This avoids requiring an existing profile for unrelated settings.
      const settingsToSave = { ...settings };

      if (settings.profileVisibility === originalProfileVisibility) {
        delete settingsToSave.profileVisibility;
      }

      const response = await fetch(`${API_URL}/api/settings/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsToSave),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            (response.status === 401
              ? "Your session has expired. Please sign in again."
              : "Unable to save your settings.")
        );
      }

      if (data.settings) {
        const { updatedAt, ...savedSettings } = data.settings;

        setSettings((previous) => ({
          ...previous,
          ...savedSettings,
        }));

        setOriginalProfileVisibility(savedSettings.profileVisibility ?? settings.profileVisibility);

        if (onSave) {
          await onSave(data.settings);
        }
      }

      setSaveMessage("Your settings have been saved successfully.");
    } catch (error) {
      setSaveMessage(error.message || "Unable to save your settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-2 text-white">Settings</h1>

      <p className="text-gray-400 mb-8">
        Manage your privacy, interactions, notifications and account preferences.
      </p>

      {loading ? (
        <p className="text-gray-400 py-8">Loading your settings...</p>
      ) : (
        <>
          {/* PRIVACY AND DISCOVERY */}
          <SettingsSection
            title="Privacy & Discovery"
            description="Control how other members see and discover you."
          >
            <SelectSetting
              label="Profile visibility"
              description="Choose who can view your profile."
              value={settings.profileVisibility}
              onChange={(value) => updateSetting("profileVisibility", value)}
              options={[
                { label: "Public", value: "public" },
                { label: "Private", value: "private" },
              ]}
            />

            <Toggle
              label="Appear in discovery"
              description="Allow your profile to appear in other members' discovery feeds."
              checked={settings.appearInDiscovery}
              onChange={(value) => updateSetting("appearInDiscovery", value)}
            />

            <Toggle
              label="Show my interests"
              description="Display your interests on your profile."
              checked={settings.showInterests}
              onChange={(value) => updateSetting("showInterests", value)}
            />

            <Toggle
              label="Show online status"
              description="Let other members know when you are online."
              checked={settings.showOnlineStatus}
              onChange={(value) => updateSetting("showOnlineStatus", value)}
            />

            <Toggle
              label="Show my distance"
              description="Allow other members to see your approximate distance."
              checked={settings.showDistance}
              onChange={(value) => updateSetting("showDistance", value)}
            />

            <Toggle
              label="Show my age"
              description="Display your age on your dating profile."
              checked={settings.showAge}
              onChange={(value) => updateSetting("showAge", value)}
            />

            <Toggle
              label="Read receipts"
              description="Let matches know when you have read their messages."
              checked={settings.readReceipts}
              onChange={(value) => updateSetting("readReceipts", value)}
            />
          </SettingsSection>

          {/* INTERACTIONS */}
          <SettingsSection
            title="Interactions"
            description="Decide how other members can interact with you."
          >
            <SelectSetting
              label="Who can message me?"
              description="Control who can start a conversation with you."
              value={settings.allowMessages}
              onChange={(value) => updateSetting("allowMessages", value)}
              options={[
                { label: "Everyone", value: "everyone" },
                { label: "Matches only", value: "matches" },
                { label: "Nobody", value: "nobody" },
              ]}
            />

            <Toggle
              label="Allow likes"
              description="Allow other members to like your profile."
              checked={settings.allowLikes}
              onChange={(value) => updateSetting("allowLikes", value)}
            />

            <Toggle
              label="Allow connection requests"
              description="Allow other members to send you connection requests."
              checked={settings.allowConnectionRequests}
              onChange={(value) => updateSetting("allowConnectionRequests", value)}
            />
          </SettingsSection>

          {/* NOTIFICATIONS */}
          <SettingsSection
            title="Notifications"
            description="Choose which updates you want to receive."
          >
            <Toggle
              label="All notifications"
              description="Master control for LOVIQUE notifications."
              checked={settings.notifications}
              onChange={(value) => updateSetting("notifications", value)}
            />

            <div className={!settings.notifications ? "opacity-40 pointer-events-none" : ""}>
              <Toggle
                label="New messages"
                checked={settings.messageNotifications}
                onChange={(value) => updateSetting("messageNotifications", value)}
              />

              <Toggle
                label="New matches"
                checked={settings.matchNotifications}
                onChange={(value) => updateSetting("matchNotifications", value)}
              />

              <Toggle
                label="Profile likes"
                checked={settings.likeNotifications}
                onChange={(value) => updateSetting("likeNotifications", value)}
              />

              <Toggle
                label="Connection requests"
                checked={settings.connectionNotifications}
                onChange={(value) => updateSetting("connectionNotifications", value)}
              />

              <Toggle
                label="Email notifications"
                description="Receive important account updates through email."
                checked={settings.emailNotifications}
                onChange={(value) => updateSetting("emailNotifications", value)}
              />

              <Toggle
                label="Promotional notifications"
                description="Receive product updates, announcements and promotions."
                checked={settings.promotionalNotifications}
                onChange={(value) => updateSetting("promotionalNotifications", value)}
              />
            </div>
          </SettingsSection>

          {/* SAFETY */}
          <SettingsSection
            title="Safety & Privacy"
            description="Additional controls for your privacy on LOVIQUE."
          >
            <Toggle
              label="Incognito mode"
              description="Hide your profile from ordinary discovery. Its exact visibility rules will be enforced by the backend."
              checked={settings.incognitoMode}
              onChange={(value) => updateSetting("incognitoMode", value)}
            />

            <Toggle
              label="Hide me from phone contacts"
              description="Avoid recommending your profile to people in your synced contacts."
              checked={settings.hideFromContacts}
              onChange={(value) => updateSetting("hideFromContacts", value)}
            />
          </SettingsSection>

          {/* ACCOUNT */}
          <SettingsSection
            title="Account Management"
            description="Take a break or manage your LOVIQUE account."
          >
            <Toggle
              label="Pause my account"
              description="Temporarily hide your profile from discovery while you take a break."
              checked={settings.pauseAccount}
              onChange={(value) => updateSetting("pauseAccount", value)}
            />

            <div className="pt-5 mt-3 border-t border-gray-800">
              <h3 className="font-medium text-white mb-2">Need a break?</h3>

              <p className="text-sm text-gray-500 mb-4">
                You can deactivate or permanently delete your account. These actions will be handled
                separately with confirmation.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled
                  className="border border-gray-700 text-gray-400 px-4 py-2 rounded-lg opacity-60 cursor-not-allowed"
                >
                  Deactivate account
                </button>

                <button
                  type="button"
                  disabled
                  className="border border-red-900 text-red-400 px-4 py-2 rounded-lg opacity-60 cursor-not-allowed"
                >
                  Delete account
                </button>
              </div>
            </div>
          </SettingsSection>

          {/* SAVE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-400" aria-live="polite">
              {saveMessage}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#C11235] px-7 py-3 rounded-lg font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}