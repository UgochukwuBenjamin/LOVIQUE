
import { useRef, useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  Video,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Edit3,
  Plus,
  X,
  Send,
  User,
  Grid3X3,
  Film,
  Info
} from "lucide-react";

import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Your Name",
    bio: "Welcome to my LOVIQUE profile. This is where my story begins.",
    location: "",
    workplace: "",
    education: ""
  });

  const [profilePicture, setProfilePicture] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState({});

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setProfilePicture(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setCoverPhoto(URL.createObjectURL(file));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please select an image or video.");
      return;
    }

    setSelectedMedia({
      file,
      url: URL.createObjectURL(file),
      type: isImage ? "image" : "video"
    });
  };

  const createPost = (e) => {
    e.preventDefault();

    if (!postText.trim() && !selectedMedia) {
      alert("Write something or select a photo/video first.");
      return;
    }

    const newPost = {
      id: Date.now(),
      text: postText.trim(),
      media: selectedMedia,
      date: new Date().toLocaleString(),
      likes: 0,
      liked: false,
      comments: []
    };

    setPosts((previousPosts) => [newPost, ...previousPosts]);
    setPostText("");
    setSelectedMedia(null);

    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }
  };

  const toggleLike = (postId) => {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const addComment = (postId) => {
    const comment = commentDrafts[postId]?.trim();

    if (!comment) return;

    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, comment]
            }
          : post
      )
    );

    setCommentDrafts((previous) => ({
      ...previous,
      [postId]: ""
    }));
  };

  const sharePost = async (post) => {
    const shareText = `${profile.name} shared a post on LOVIQUE: ${post.text}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "LOVIQUE Post",
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Post text copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        alert("Unable to share this post.");
      }
    }
  };

  const saveProfile = (e) => {
    e.preventDefault();
    setEditingProfile(false);
  };

  const photos = posts.filter(
    (post) => post.media?.type === "image"
  );

  const videos = posts.filter(
    (post) => post.media?.type === "video"
  );

  const renderPost = (post) => (
    <article className="profile-post" key={post.id}>
      <div className="post-header">
        <div className="post-author">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              <User size={22} />
            </div>
          )}

          <div>
            <h3>{profile.name}</h3>
            <span>{post.date}</span>
          </div>
        </div>

        <button className="post-more" aria-label="More post options">
          <MoreHorizontal size={22} />
        </button>
      </div>

      {post.text && (
        <p className="post-text">{post.text}</p>
      )}

      {post.media && (
        <div className="post-media">
          {post.media.type === "image" ? (
            <img src={post.media.url} alt="Post" />
          ) : (
            <video
              src={post.media.url}
              controls
              playsInline
            />
          )}
        </div>
      )}

      <div className="post-stats">
        <span>
          <Heart size={15} fill="#e94f86" color="#e94f86" />
          {post.likes} likes
        </span>

        <span>{post.comments.length} comments</span>
      </div>

      <div className="post-actions">
        <button
          className={post.liked ? "liked" : ""}
          onClick={() => toggleLike(post.id)}
        >
          <Heart size={19} fill={post.liked ? "currentColor" : "none"} />
          Like
        </button>

        <button
          onClick={() =>
            document
              .getElementById(`comment-${post.id}`)
              ?.focus()
          }
        >
          <MessageCircle size={19} />
          Comment
        </button>

        <button onClick={() => sharePost(post)}>
          <Share2 size={19} />
          Share
        </button>
      </div>

      {post.comments.length > 0 && (
        <div className="post-comments">
          {post.comments.map((comment, index) => (
            <div className="comment-item" key={index}>
              <strong>{profile.name}</strong>
              <span>{comment}</span>
            </div>
          ))}
        </div>
      )}

      <div className="comment-form">
        <input
          id={`comment-${post.id}`}
          type="text"
          placeholder="Write a comment..."
          value={commentDrafts[post.id] || ""}
          onChange={(e) =>
            setCommentDrafts((previous) => ({
              ...previous,
              [post.id]: e.target.value
            }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") addComment(post.id);
          }}
        />

        <button
          onClick={() => addComment(post.id)}
          aria-label="Send comment"
        >
          <Send size={17} />
        </button>
      </div>
    </article>
  );

  return (
    <div className="profile-page">
      {/* Profile header */}
      <div className="profile-header-card">
        <div
          className="profile-cover"
          style={
            coverPhoto
              ? { backgroundImage: `url(${coverPhoto})` }
              : {}
          }
        >
          <button
            className="cover-edit-button"
            onClick={() => coverInputRef.current?.click()}
          >
            <Camera size={17} />
            Edit cover photo
          </button>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleCoverChange}
          />
        </div>

        <div className="profile-main-info">
          <div className="profile-avatar-wrapper">
            {profilePicture ? (
              <img
                src={profilePicture}
                className="profile-avatar"
                alt="Profile"
              />
            ) : (
              <div className="profile-avatar avatar-placeholder">
                <User size={55} />
              </div>
            )}

            <button
              className="avatar-camera-button"
              onClick={() => profileInputRef.current?.click()}
              aria-label="Change profile picture"
            >
              <Camera size={17} />
            </button>

            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfileChange}
            />
          </div>

          <div className="profile-name-area">
            <h1>{profile.name}</h1>
            <p>{profile.bio}</p>

            <span className="profile-post-count">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          <button
            className="edit-profile-button"
            onClick={() => setEditingProfile(true)}
          >
            <Edit3 size={17} />
            Edit profile
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => setActiveTab("posts")}
          >
            <Grid3X3 size={17} />
            Posts
          </button>

          <button
            className={activeTab === "about" ? "active" : ""}
            onClick={() => setActiveTab("about")}
          >
            <Info size={17} />
            About
          </button>

          <button
            className={activeTab === "photos" ? "active" : ""}
            onClick={() => setActiveTab("photos")}
          >
            <ImageIcon size={17} />
            Photos
          </button>

          <button
            className={activeTab === "videos" ? "active" : ""}
            onClick={() => setActiveTab("videos")}
          >
            <Film size={17} />
            Videos
          </button>
        </div>
      </div>

      {/* Profile content */}
      <div className="profile-content">

        {activeTab === "posts" && (
          <>
            <aside className="profile-sidebar">
              <div className="profile-panel">
                <h2>Intro</h2>

                <p className="intro-bio">{profile.bio}</p>

                {profile.location && (
                  <p>
                    <MapPin size={17} />
                    Lives in {profile.location}
                  </p>
                )}

                {profile.workplace && (
                  <p>
                    <Briefcase size={17} />
                    Works at {profile.workplace}
                  </p>
                )}

                {profile.education && (
                  <p>
                    <GraduationCap size={17} />
                    Studied at {profile.education}
                  </p>
                )}

                {!profile.location &&
                  !profile.workplace &&
                  !profile.education && (
                    <span className="empty-intro">
                      Add your location, work and education to your profile.
                    </span>
                  )}

                <button
                  className="panel-edit-button"
                  onClick={() => setEditingProfile(true)}
                >
                  Edit details
                </button>
              </div>

              <div className="profile-panel">
                <div className="panel-heading">
                  <h2>Photos</h2>
                  <button onClick={() => setActiveTab("photos")}>
                    See all
                  </button>
                </div>

                <div className="sidebar-photo-grid">
                  {photos.slice(0, 6).map((post) => (
                    <img
                      key={post.id}
                      src={post.media.url}
                      alt="User post"
                    />
                  ))}

                  {photos.length === 0 && (
                    <p className="empty-media">
                      Your photos will appear here.
                    </p>
                  )}
                </div>
              </div>
            </aside>

            <section className="profile-feed">
              <form className="create-post-card" onSubmit={createPost}>
                <div className="composer-top">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={21} />
                    </div>
                  )}

                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder={`What's on your mind, ${profile.name.split(" ")[0]}?`}
                    rows={2}
                  />
                </div>

                {selectedMedia && (
                  <div className="selected-media-preview">
                    {selectedMedia.type === "image" ? (
                      <img src={selectedMedia.url} alt="Preview" />
                    ) : (
                      <video src={selectedMedia.url} controls />
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedMedia(null)}
                      aria-label="Remove selected media"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <div className="composer-bottom">
                  <button
                    type="button"
                    className="media-picker-button"
                    onClick={() => mediaInputRef.current?.click()}
                  >
                    <ImageIcon size={20} />
                    Photo
                  </button>

                  <button
                    type="button"
                    className="media-picker-button video-picker"
                    onClick={() => mediaInputRef.current?.click()}
                  >
                    <Video size={20} />
                    Photo / Video
                  </button>

                  <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/*,video/*"
                    hidden
                    onChange={handleMediaChange}
                  />

                  <button
                    type="submit"
                    className="publish-button"
                    disabled={!postText.trim() && !selectedMedia}
                  >
                    Post
                  </button>
                </div>
              </form>

              <div className="feed-heading">
                <h2>Posts</h2>
                <button>
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {posts.length > 0 ? (
                posts.map(renderPost)
              ) : (
                <div className="empty-posts">
                  <div className="empty-post-icon">
                    <ImageIcon size={32} />
                  </div>
                  <h3>No posts yet</h3>
                  <p>
                    Share your first photo, video or update with your
                    LOVIQUE community.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "about" && (
          <section className="profile-full-panel">
            <h2>About {profile.name}</h2>

            <p>{profile.bio}</p>

            <div className="about-details">
              <p>
                <MapPin size={19} />
                {profile.location || "Location not added"}
              </p>

              <p>
                <Briefcase size={19} />
                {profile.workplace || "Workplace not added"}
              </p>

              <p>
                <GraduationCap size={19} />
                {profile.education || "Education not added"}
              </p>
            </div>

            <button
              className="edit-profile-button"
              onClick={() => setEditingProfile(true)}
            >
              <Edit3 size={17} />
              Edit information
            </button>
          </section>
        )}

        {activeTab === "photos" && (
          <section className="profile-full-panel">
            <div className="media-tab-heading">
              <h2>Photos</h2>
              <span>{photos.length} photos</span>
            </div>

            {photos.length > 0 ? (
              <div className="media-gallery">
                {photos.map((post) => (
                  <img
                    key={post.id}
                    src={post.media.url}
                    alt="Profile post"
                  />
                ))}
              </div>
            ) : (
              <div className="empty-posts">
                <ImageIcon size={35} />
                <h3>No photos yet</h3>
                <p>Photos you share will appear here.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "videos" && (
          <section className="profile-full-panel">
            <div className="media-tab-heading">
              <h2>Videos</h2>
              <span>{videos.length} videos</span>
            </div>

            {videos.length > 0 ? (
              <div className="video-gallery">
                {videos.map((post) => (
                  <video
                    key={post.id}
                    src={post.media.url}
                    controls
                    playsInline
                  />
                ))}
              </div>
            ) : (
              <div className="empty-posts">
                <Video size={35} />
                <h3>No videos yet</h3>
                <p>Videos you share will appear here.</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Edit profile modal */}
      {editingProfile && (
        <div
          className="profile-modal-overlay"
          onClick={() => setEditingProfile(false)}
        >
          <form
            className="profile-edit-modal"
            onSubmit={saveProfile}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>Edit profile</h2>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            <label>
              Full name
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Bio
              <textarea
                rows={3}
                maxLength={200}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </label>

            <label>
              Location
              <input
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="Your city"
              />
            </label>

            <label>
              Workplace
              <input
                value={profile.workplace}
                onChange={(e) =>
                  setProfile({ ...profile, workplace: e.target.value })
                }
                placeholder="Where you work"
              />
            </label>

            <label>
              Education
              <input
                value={profile.education}
                onChange={(e) =>
                  setProfile({ ...profile, education: e.target.value })
                }
                placeholder="Your school"
              />
            </label>

            <button type="submit" className="publish-button save-profile">
              Save changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Profile;
