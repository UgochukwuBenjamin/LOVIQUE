
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../ProfileContext";

import {
  Image,
  Video,
  Smile,
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Search,
  Globe,
  Send,
  Heart,
  Compass,
  Users,
  MessageCircle,
  Bell,
  Settings,
  Plus,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  UserRound
} from "lucide-react";

import "./Dashboard.css";

// DEFAULT PROFILE AVATAR
function ProfileAvatar({ src, name, className = "" }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "50%",
        background: "#242424",
        flexShrink: 0
      }}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name || "Profile picture"}
          onError={() => setImageError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      ) : (
        <UserRound size={22} color="#999" />
      )}
    </div>
  );
}

// SAMPLE COMMUNITY POSTS
const initialPosts = [
  {
    id: 1,
    name: "Alex Morgan",
    username: "@alexmorgan",
    avatar: "https://i.pravatar.cc/150?img=12",
    time: "2 hours ago",
    content:
      "It's always a beautiful feeling connecting with people who share your interests. What's everyone working on today?",
    image: "",
    likes: 24,
    comments: [
      {
        id: 1,
        name: "Jordan Lee",
        text: "Absolutely! Great to be here."
      }
    ]
  },
  {
    id: 2,
    name: "Jordan Lee",
    username: "@jordanlee",
    avatar: "https://i.pravatar.cc/150?img=11",
    time: "4 hours ago",
    content:
      "A little reminder: keep learning, keep growing and never stop exploring new possibilities.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000",
    likes: 48,
    comments: []
  },
  {
    id: 3,
    name: "Taylor James",
    username: "@taylorjames",
    avatar: "https://i.pravatar.cc/150?img=47",
    time: "Yesterday",
    content:
      "New week, new opportunities. Looking forward to meeting new people and discovering new communities on LOVIQUE!",
    image: "",
    likes: 17,
    comments: []
  }
];

// SAMPLE STORIES
const stories = [
  {
    name: "Your Story",
    image: "",
    own: true
  },
  {
    name: "Alex",
    image: "https://i.pravatar.cc/150?img=12"
  },
  {
    name: "Jordan",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Taylor",
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    name: "Morgan",
    image: "https://i.pravatar.cc/150?img=32"
  }
];

// SAMPLE PEOPLE
const people = [
  {
    name: "Alex Morgan",
    image: "https://i.pravatar.cc/150?img=12"
  },
  {
    name: "Jordan Lee",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Taylor James",
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    name: "Morgan Smith",
    image: "https://i.pravatar.cc/150?img=32"
  }
];

// SAMPLE COMMUNITIES
const communities = [
  {
    icon: "✳",
    name: "Tech & Innovation",
    members: "2.4k members",
    color: "red"
  },
  {
    icon: "✦",
    name: "Creative Minds",
    members: "1.8k members",
    color: "purple"
  },
  {
    icon: "⌘",
    name: "Learning Together",
    members: "950 members",
    color: "gold"
  }
];

export default function Dashboard() {
  const { profile, profileLoading } = useProfile();

  const [posts, setPosts] = useState(initialPosts);
  const [postText, setPostText] = useState("");
  const [commentText, setCommentText] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [followedPeople, setFollowedPeople] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [search, setSearch] = useState("");

  // AUTHENTICATED USER
  const currentUser = {
    name:
      profile.fullName ||
      profile.firstName ||
      profile.username ||
      "Your Name",

    username: profile.username
      ? `@${profile.username}`
      : "@you",

    image: profile.avatarUrl || ""
  };

  // CREATE POST
  const createPost = () => {
    if (!postText.trim()) return;

    const newPost = {
      id: Date.now(),
      name: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.image,
      time: "Just now",
      content: postText.trim(),
      image: "",
      likes: 0,
      comments: []
    };

    setPosts((previous) => [newPost, ...previous]);
    setPostText("");
  };

  // LIKE POSTS
  const toggleLike = (postId) => {
    setLikedPosts((previous) =>
      previous.includes(postId)
        ? previous.filter((id) => id !== postId)
        : [...previous, postId]
    );
  };

  // ADD COMMENTS
  const addComment = (postId) => {
    const text = commentText[postId]?.trim();

    if (!text) return;

    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  name: currentUser.name,
                  text
                }
              ]
            }
          : post
      )
    );

    setCommentText((previous) => ({
      ...previous,
      [postId]: ""
    }));
  };

  // FOLLOW PEOPLE
  const toggleFollow = (name) => {
    setFollowedPeople((previous) =>
      previous.includes(name)
        ? previous.filter((person) => person !== name)
        : [...previous, name]
    );
  };

  // SEARCH POSTS
  const filteredPosts = posts.filter((post) =>
    `${post.name} ${post.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // SHARE POSTS
  const sharePost = async (post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LOVIQUE post",
          text: post.content
        });
      } catch {
        // Sharing was cancelled or unavailable.
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(post.content);
      } catch {
        // Clipboard access was unavailable.
      }
    }
  };

  // PROFILE LOADING
  if (profileLoading) {
    return (
      <div className="pulse-dashboard">
        <p
          style={{
            textAlign: "center",
            padding: "40px",
            color: "white"
          }}
        >
          Loading your LOVIQUE experience...
        </p>
      </div>
    );
  }

  return (
    <div className="pulse-dashboard">
      <div className="pulse-layout">

        {/* LEFT NAVIGATION */}
        <aside className="pulse-sidebar">
          <div className="pulse-sidebar-inner">

            <div className="pulse-sidebar-profile">
              <ProfileAvatar
                src={currentUser.image}
                name={currentUser.name}
              />

              <div>
                <strong>{currentUser.name}</strong>
                <span>Your personal space</span>
              </div>
            </div>

            <p className="pulse-nav-label">YOUR SPACE</p>

            <nav className="pulse-nav">
              <Link to="/dashboard" className="pulse-nav-link active">
                <Compass />
                <span>Home feed</span>
              </Link>

              <Link to="/profile" className="pulse-nav-link">
                <Users />
                <span>My profile</span>
              </Link>

              <Link to="/discover" className="pulse-nav-link">
                <Search />
                <span>Discover</span>
              </Link>

              <Link to="/communities" className="pulse-nav-link">
                <Users />
                <span>Communities</span>
              </Link>

              <Link to="/messages" className="pulse-nav-link">
                <MessageCircle />
                <span>Messages</span>
              </Link>

              <Link to="/notifications" className="pulse-nav-link">
                <Bell />
                <span>Notifications</span>
              </Link>

              <Link to="/settings" className="pulse-nav-link">
                <Settings />
                <span>Settings</span>
              </Link>
            </nav>

            <div className="pulse-sidebar-card">
              <span className="pulse-mini-icon">
                <Sparkles size={17} />
              </span>

              <h3>Your world, your people.</h3>

              <p>
                Discover communities and conversations that matter to you.
              </p>

              <Link to="/discover">
                Explore now <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="pulse-sidebar-bottom">
              <span>LOVIQUE</span>
              <p>© 2026 LOVIQUE</p>
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="pulse-main">

          {/* WELCOME HEADER */}
          <section className="pulse-welcome">
            <div className="pulse-welcome-content">
              <span className="pulse-eyebrow">
                <span className="pulse-live-dot" />
                YOUR COMMUNITY, YOUR MOMENT
              </span>

              <h1>
                Your world.
                <br />
                <span>Your people.</span>
              </h1>

              <p>
                A space to connect, discover ideas and share
                the moments that make you, you.
              </p>
            </div>

            <div className="pulse-welcome-art" aria-hidden="true">
              <div className="pulse-orbit pulse-orbit-one" />
              <div className="pulse-orbit pulse-orbit-two" />
              <div className="pulse-orbit pulse-orbit-three" />
              <div className="pulse-orbit-core">
                L<span>♥</span>
              </div>
              <span className="pulse-orbit-star star-one">✦</span>
              <span className="pulse-orbit-star star-two">✧</span>
              <span className="pulse-orbit-star star-three">✦</span>
            </div>
          </section>

          {/* STORIES */}
          <section className="pulse-stories-section">
            <div className="pulse-section-title">
              <div>
                <span className="pulse-kicker">MOMENTS</span>
                <h2>Stories</h2>
              </div>

              <span className="pulse-section-note">
                A little glimpse into everyone's world
              </span>
            </div>

            <div className="pulse-stories">
              {stories.map((story, index) => (
                <button
                  type="button"
                  className={`pulse-story ${story.own ? "own-story" : ""}`}
                  key={index}
                >
                  <div className="pulse-story-photo">
                    {story.own ? (
                      <ProfileAvatar
                        src={currentUser.image}
                        name={currentUser.name}
                      />
                    ) : (
                      <img src={story.image} alt={story.name} />
                    )}

                    {story.own ? (
                      <span className="pulse-story-add">
                        <Plus size={17} />
                      </span>
                    ) : (
                      <span className="pulse-story-indicator" />
                    )}
                  </div>

                  <span>
                    {story.own
                      ? currentUser.name.split(" ")[0]
                      : story.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* CREATE POST */}
          <section className="pulse-composer">
            <div className="pulse-composer-heading">
              <div>
                <span className="pulse-kicker">SHARE SOMETHING</span>
                <h2>Start a conversation</h2>
              </div>

              <span className="pulse-composer-spark">
                <Sparkles size={18} />
              </span>
            </div>

            <div className="pulse-composer-input">
              <ProfileAvatar
                src={currentUser.image}
                name={currentUser.name}
              />

              <textarea
                placeholder="What's happening in your world?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                rows="3"
              />
            </div>

            <div className="pulse-composer-footer">
              <div className="pulse-composer-tools">
                <button type="button" title="Add a photo">
                  <Image size={17} />
                  <span>Photo</span>
                </button>

                <button type="button" title="Add a video">
                  <Video size={17} />
                  <span>Video</span>
                </button>

                <button type="button" title="Add a feeling">
                  <Smile size={17} />
                  <span>Feeling</span>
                </button>
              </div>

              <button
                type="button"
                className="pulse-publish-button"
                onClick={createPost}
                disabled={!postText.trim()}
              >
                Publish <ArrowUpRight size={17} />
              </button>
            </div>
          </section>

          {/* FEED */}
          <section className="pulse-feed-section">
            <div className="pulse-feed-heading">
              <div>
                <span className="pulse-kicker">THE COMMUNITY</span>
                <h2>Fresh from your world</h2>
              </div>

              <label className="pulse-search">
                <Search size={17} />

                <input
                  type="search"
                  placeholder="Find a conversation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="pulse-empty">
                <Search size={30} />
                <h3>No conversations found</h3>
                <p>Try another search to explore the feed.</p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isLiked = likedPosts.includes(post.id);

                return (
                  <article className="pulse-post" key={post.id}>

                    <div className="pulse-post-header">
                      <div className="pulse-post-author">

                        <ProfileAvatar
                          src={post.avatar}
                          name={post.name}
                        />

                        <div>
                          <h3>{post.name}</h3>

                          <p>
                            {post.username}
                            <span> · </span>
                            {post.time}
                            <Globe size={12} />
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="pulse-more"
                        aria-label="More post options"
                      >
                        <MoreHorizontal size={21} />
                      </button>
                    </div>

                    <div className="pulse-post-content">
                      <p>{post.content}</p>

                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post"
                          className="pulse-post-image"
                        />
                      )}
                    </div>

                    <div className="pulse-post-stats">
                      <span>
                        <Heart
                          size={15}
                          fill="#ed4560"
                          color="#ed4560"
                        />
                        {post.likes + (isLiked ? 1 : 0)} reactions
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveComment(
                            activeComment === post.id ? null : post.id
                          )
                        }
                      >
                        {post.comments.length} comments
                      </button>
                    </div>

                    <div className="pulse-post-actions">
                      <button
                        type="button"
                        className={isLiked ? "is-liked" : ""}
                        onClick={() => toggleLike(post.id)}
                      >
                        <ThumbsUp size={18} />
                        <span>{isLiked ? "Liked" : "Like"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveComment(
                            activeComment === post.id ? null : post.id
                          )
                        }
                      >
                        <MessageSquare size={18} />
                        <span>Comment</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => sharePost(post)}
                      >
                        <Share2 size={18} />
                        <span>Share</span>
                      </button>
                    </div>

                    {activeComment === post.id && (
                      <div className="pulse-comments">

                        {post.comments.map((comment) => (
                          <div
                            className="pulse-comment"
                            key={comment.id}
                          >
                            <strong>{comment.name}</strong>
                            <p>{comment.text}</p>
                          </div>
                        ))}

                        <div className="pulse-comment-input">
                          <input
                            type="text"
                            placeholder="Write something..."
                            value={commentText[post.id] || ""}
                            onChange={(e) =>
                              setCommentText((previous) => ({
                                ...previous,
                                [post.id]: e.target.value
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addComment(post.id);
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => addComment(post.id)}
                            aria-label="Send comment"
                          >
                            <Send size={17} />
                          </button>
                        </div>

                      </div>
                    )}

                  </article>
                );
              })
            )}
          </section>
        </main>

        {/* RIGHT DISCOVERY PANEL */}
        <aside className="pulse-discovery">

          <section className="pulse-discovery-card pulse-discover-banner">
            <span className="pulse-kicker">MADE FOR CONNECTION</span>

            <h2>
              There is a whole world waiting to meet you.
            </h2>

            <p>
              Find people and communities that make every visit worthwhile.
            </p>

            <Link to="/discover">
              Discover people <ArrowUpRight size={16} />
            </Link>

            <div className="pulse-banner-decoration">
              L<span>♥</span>
            </div>
          </section>

          <section className="pulse-discovery-card">
            <div className="pulse-discovery-heading">
              <div>
                <span className="pulse-kicker">NEW CONNECTIONS</span>
                <h3>People to know</h3>
              </div>

              <Link to="/discover">See all</Link>
            </div>

            <div className="pulse-people-list">
              {people.map((person) => {
                const isFollowing = followedPeople.includes(person.name);

                return (
                  <div className="pulse-person" key={person.name}>
                    <img src={person.image} alt={person.name} />

                    <div className="pulse-person-info">
                      <strong>{person.name}</strong>
                      <span>Suggested for you</span>
                    </div>

                    <button
                      type="button"
                      className={isFollowing ? "following" : ""}
                      onClick={() => toggleFollow(person.name)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="pulse-discovery-card">
            <div className="pulse-discovery-heading">
              <div>
                <span className="pulse-kicker">FIND YOUR PEOPLE</span>
                <h3>Trending spaces</h3>
              </div>

              <TrendingUp size={18} />
            </div>

            <div className="pulse-community-list">
              {communities.map((community) => (
                <Link
                  to="/communities"
                  className="pulse-community"
                  key={community.name}
                >
                  <span
                    className={`pulse-community-icon ${community.color}`}
                  >
                    {community.icon}
                  </span>

                  <span className="pulse-community-info">
                    <strong>{community.name}</strong>
                    <small>{community.members}</small>
                  </span>

                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </section>

          <div className="pulse-footer">
            <Link to="/about">About LOVIQUE</Link>
            <Link to="/settings">Privacy</Link>
            <Link to="/settings">Terms</Link>
            <p>Made for meaningful connections. ♥</p>
          </div>

        </aside>

      </div>
    </div>
  );
}