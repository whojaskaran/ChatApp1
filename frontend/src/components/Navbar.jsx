// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-base-100 border-b border-base-300 px-4 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-primary">
        ChatApp
      </Link>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-sm btn-ghost flex items-center gap-1"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          <span className="hidden sm:inline">
            {theme === "light" ? "Dark" : "Light"}
          </span>
        </button>

        {/* Logout Button */}
        {authUser && (
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline flex items-center gap-1"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
