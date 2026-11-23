
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const interestOptions = [
  "Technology", "Music", "Movies", "Reading", "Gaming",
  "Photography", "Sports", "Fashion", "Art", "Travel",
  "Cooking", "Fitness", "Entrepreneurship", "Education",
  "Business", "Design", "Science", "Nature", "Writing",
];

const steps = [
  "Create Profile",
  "Profile Picture",
  "Interests",
  "About You",
  "Preferences",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateProfile = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePicture = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPEG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setError("");

    const preview = URL.createObjectURL(file);

    updateProfile("picture", { file, preview });
  };

  const toggleInterest = (interest) => {
    setProfile((previous) => ({
      ...previous,
      interests: previous.interests.includes(interest)
        ? previous.interests.filter((item) => item !== interest)
        : [...previous.interests, interest],
    }));
  };

  const validateStep = () => {
    if (step === 0) {
      if (
        !profile.fullName.trim() ||
        !profile.username.trim() ||
        !profile.country.trim()
      ) {
        setError("Please complete all profile fields.");
        return false;
      }
    }

    if (step === 2 && profile.interests.length === 0) {
      setError("Please select at least one interest.");
      return false;
    }

    if (step === 2 && profile.interests.length > 19) {
      setError("You can select a maximum of 19 interests.");
      return false;
    }

    if (step === 3 && !profile.bio.trim()) {
      setError("Please write a short bio.");
      return false;
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    if (step < steps.length - 1) {
      setStep((previous) => previous + 1);
    }
  };

  const previousStep = () => {
    setError("");

    if (step > 0) {
      setStep((previous) => previous - 1);
    }
  };

  // Submit onboarding information to the backend
  const finishOnboarding = async () => {
    if (!validateStep() || submitting) return;

    const token = sessionStorage.getItem("lovique_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("fullName", profile.fullName.trim());
      formData.append("username", profile.username.trim());
      formData.append("country", profile.country.trim());
      formData.append("bio", profile.bio.trim());
      formData.append("visibility", profile.visibility);
      formData.append("allowMessages", profile.allowMessages);
      formData.append("showInterests", String(profile.showInterests));

      formData.append(
        "interests",
        JSON.stringify(profile.interests)
      );

      if (profile.picture?.file) {
        formData.append("picture", profile.picture.file);
      }

      const response = await fetch(
        `${API_URL}/api/profiles/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to complete your profile."
        );
      }

      setProfile((previous) => ({
        ...previous,
        onboardingCompleted: true,
      }));

      navigate("/dashboard");

    } catch (err) {
      console.error("Onboarding submission error:", err);

      setError(
        err.message || "Something went wrong. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-5 py-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-[#C11235] mb-3">
          LOVIQUE
        </h1>

        <p className="text-gray-400 mb-8">
          Let's get your profile ready. Tell the community a little about yourself.
        </p>

        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-8">
          {steps.map((item, index) => (
            <div
              key={item}
              className={`h-2 flex-1 rounded-full transition ${
                index <= step ? "bg-[#C11235]" : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between text-sm text-gray-400 mb-3">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{steps[step]}</span>
        </div>

        {/* MAIN CARD */}
        <div className="bg-[#171717] border border-gray-800 rounded-2xl p-6 md:p-10">

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Create your profile</h2>
              <p className="text-gray-400 mb-7">Let's start with the basics.</p>

              <label className="block mb-2">Full name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={profile.fullName}
                onChange={(e) => updateProfile("fullName", e.target.value)}
                className="w-full bg-[#242424] border border-gray-700 rounded-lg p-3 mb-5 outline-none focus:border-[#C11235]"
              />

              <label className="block mb-2">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={profile.username}
                onChange={(e) => updateProfile("username", e.target.value)}
                className="w-full bg-[#242424] border border-gray-700 rounded-lg p-3 mb-5 outline-none focus:border-[#C11235]"
              />

              <label className="block mb-2">Country</label>
              <input
                type="text"
                placeholder="Your country"
                value={profile.country}
                onChange={(e) => updateProfile("country", e.target.value)}
                className="w-full bg-[#242424] border border-gray-700 rounded-lg p-3 outline-none focus:border-[#C11235]"
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Add a profile picture</h2>
              <p className="text-gray-400 mb-8">
                Choose a picture to represent your profile.
              </p>

              <div className="w-36 h-36 mx-auto rounded-full bg-[#242424] border-2 border-dashed border-[#C11235] flex items-center justify-center overflow-hidden mb-6">
                {profile.picture?.preview ? (
                  <img
                    src={profile.picture.preview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-5xl">+</span>
                )}
              </div>

              <label className="inline-block bg-[#C11235] hover:bg-red-700 px-6 py-3 rounded-lg cursor-pointer font-medium">
                Upload Picture
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePicture}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-gray-500 mt-4">
                Maximum image size: 5MB.
              </p>

              {profile.picture && (
                <p className="text-green-500 text-sm mt-3">
                  Picture selected successfully.
                </p>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Choose your interests</h2>
              <p className="text-gray-400 mb-7">
                Select the things you enjoy. You can choose more than one.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interestOptions.map((interest) => {
                  const selected = profile.interests.includes(interest);

                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-lg border text-sm transition ${
                        selected
                          ? "bg-[#C11235] border-[#C11235] text-white"
                          : "bg-[#242424] border-gray-700 text-gray-300 hover:border-[#C11235]"
                      }`}
                    >
                      {selected ? "✓ " : ""}
                      {interest}
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-gray-500 mt-5">
                {profile.interests.length} interests selected
              </p>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Tell us about yourself</h2>
              <p className="text-gray-400 mb-7">
                Write a short introduction for your profile.
              </p>

              <textarea
                rows="6"
                maxLength="250"
                placeholder="Write something about yourself..."
                value={profile.bio}
                onChange={(e) => updateProfile("bio", e.target.value)}
                className="w-full bg-[#242424] border border-gray-700 rounded-lg p-4 outline-none focus:border-[#C11235] resize-none"
              />

              <p className="text-right text-sm text-gray-500 mt-2">
                {profile.bio.length}/250 characters
              </p>
            </div>
          )}

          {/* STEP 5 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Profile preferences</h2>
              <p className="text-gray-400 mb-7">
                Choose how your profile information is displayed.
              </p>

              <div className="mb-7">
                <label className="block mb-3 font-medium">Profile visibility</label>
                <select
                  value={profile.visibility}
                  onChange={(e) => updateProfile("visibility", e.target.value)}
                  className="w-full bg-[#242424] border border-gray-700 rounded-lg p-3 outline-none focus:border-[#C11235]"
                >
                  <option value="public">Public profile</option>
                  <option value="private">Private profile</option>
                </select>
              </div>

              <div className="mb-7">
                <label className="block mb-3 font-medium">Who can message me?</label>
                <p className="text-sm text-gray-500 mb-3">
                  Choose who can start a conversation with you.
                </p>

                <select
                  value={profile.allowMessages}
                  onChange={(e) => updateProfile("allowMessages", e.target.value)}
                  className="w-full bg-[#242424] border border-gray-700 rounded-lg p-3 outline-none focus:border-[#C11235]"
                >
                  <option value="everyone">Everyone</option>
                  <option value="matches">Matches only</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>

              <label className="flex items-center justify-between gap-4 py-5">
                <span>
                  <span className="block font-medium">Show my interests</span>
                  <span className="text-sm text-gray-500">
                    Display your selected interests on your profile.
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={profile.showInterests}
                  onChange={(e) => updateProfile("showInterests", e.target.checked)}
                  className="accent-[#C11235] w-5 h-5"
                />
              </label>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between gap-4 mt-10">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0 || submitting}
              className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-[#242424] disabled:opacity-30"
            >
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={submitting}
                className="px-7 py-3 rounded-lg bg-[#C11235] hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={finishOnboarding}
                disabled={submitting}
                className="px-7 py-3 rounded-lg bg-[#C11235] hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                {submitting ? "Saving Profile..." : "Complete Profile"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-7">
          © 2026 LOVIQUE. All rights reserved.
        </p>
      </div>
    </div>
  );
}