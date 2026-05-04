import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  Home,
  Car,
  BarChart3,
  Settings,
  Repeat,
  FileText,
  Calendar,
  CheckCircle,
  TrendingUp,
  Bell,
  User,
  Users,
  LogOut,
  ChevronLeft,
  MenuIcon,
} from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { images } from "../../assets";

const navigation = [
  { name: "Dashboard", path: "/app", icon: Home, end: true },
  { name: "Utilisateurs", path: "/app/users", icon: Users },
  { name: "Véhicules", path: "/app/vehicules", icon: Car },
  {
    name: "Lois de route",
    path: "/app/lois-de-route",
    icon: BarChart3,
  },
  { name: "Calages", path: "/app/calages", icon: Settings },
  { name: "Cycles", path: "/app/cycles", icon: Repeat },
  { name: "Demandes", path: "/app/demandes", icon: FileText },
  { name: "Planning", path: "/app/planning", icon: Calendar },
  {
    name: "Validation",
    path: "/app/validation",
    icon: CheckCircle,
  },
  {
    name: "Reporting",
    path: "/app/reporting",
    icon: TrendingUp,
  },
];

export function Layout() {
  const navigate = useNavigate();
  // État pour gérer si la barre est réduite ou non
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar avec largeur dynamique */}
      <aside
        className={`${
          isCollapsed ? "w-24" : "w-56"
        } bg-[#B3002B] text-white flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Header de la Sidebar avec le bouton Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-[#E30613]/30 rounded-lg ml-auto px-4"
        >
          {isCollapsed ? (
            <MenuIcon size={20} />
          ) : (
            <ChevronLeft size={22} />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"} // seulement le Dashboard
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive
                      ? "bg-white/13 border-l-4 border-white" // actif légèrement clair
                      : "hover:bg-white/10"
                  }${isCollapsed ? "justify-center px-0" : ""}`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {/* On cache le texte si réduit */}
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-[#E0E0E0] px-8 py-5 flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Menu
              as="div"
              className="relative inline-block text-left"
            >
              <MenuButton className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[#E30613] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-1 py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => navigate("/app/profile")}
                        className={`${focus ? "bg-gray-100" : ""} group flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-700`}
                      >
                        <User className="w-4 h-4" />
                        Mon profil
                      </button>
                    )}
                  </MenuItem>
                </div>
                <div className="px-1 py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={handleLogout}
                        className={`${focus ? "bg-gray-100" : ""} group flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm text-red-600`}
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}