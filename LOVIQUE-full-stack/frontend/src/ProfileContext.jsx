
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const ProfileContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialProfile = {
  userId: null,
  username: "",
  fullName: "",
  firstName: "",
  country: "",
  avatarUrl: "",
  picture: null,
  interests: [],
  bio: "",
  visibility: "public",
  allowMessages: "matches",
  showInterests: true,
  onboardingCompleted: false
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile);
  const [profileLoading, setProfileLoading] = useState(true);

  const refreshProfile = async () => {
    const token = sessionStorage.getItem("lovique_token");

    if (!token) {
      setProfile(initialProfile);
      setProfileLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/profiles/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load your profile.");
      }

      const data = await response.json();

      const userProfile = data.profile || data;

      setProfile((previous) => ({
        ...previous,
        ...userProfile,
        interests: userProfile.interests || [],
        avatarUrl: userProfile.avatarUrl || "",
        picture: null
      }));

    } catch (error) {
      console.error("Profile loading error:", error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        profileLoading,
        refreshProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside ProfileProvider"
    );
  }

  return context;
}
