
import { Link } from "react-router-dom";
import {
  Home,
  Compass,
  Users,
  MessageCircle,
  Bell,
  Search
} from "lucide-react";

import "./DashboardNavbar.css";

export default function DashboardNavbar() {
  return (
    <header className="fb-topbar">
      <Link to="/dashboard" className="fb-logo">
        LOVIQUE<span>♥</span>
      </Link>

      <div className="fb-search">
        <Search size={18} />
        <input type="search" placeholder="Search LOVIQUE" />
      </div>

      <nav className="fb-top-links">
        <Link to="/dashboard" className="fb-top-link">
          <Home />
          <span>Home</span>
        </Link>

        <Link to="/discover" className="fb-top-link">
          <Compass />
          <span>Discover</span>
        </Link>

        <Link to="/communities" className="fb-top-link">
          <Users />
          <span>Communities</span>
        </Link>
      </nav>

      <div className="fb-top-actions">
        <Link to="/messages" className="fb-icon-button" aria-label="Messages">
          <MessageCircle />
        </Link>

        <Link to="/notifications" className="fb-icon-button" aria-label="Notifications">
          <Bell />
        </Link>

        <Link to="/profile" className="fb-top-avatar" aria-label="My profile">
          <img
            src="https://i.pravatar.cc/150?img=5"
            alt="Your profile"
          />
        </Link>
      </div>
    </header>
  );
}
