import { useState } from "react";
import { NavLink, useNavigate, Outlet, Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  PawPrint,
  LayoutDashboard,
  Calendar,
  FileText,
  Heart,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  UserCheck,
  Stethoscope,
  Shield,
  ChevronRight,
  Search,
  Home,
  Users,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_CONFIGS: Record<string, NavItem[]> = {
  owner: [
    {
      label: "Overview",
      path: "/owner",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Appointments",
      path: "/owner/appointments",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Medical Records",
      path: "/owner/medical-records",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "My Pets",
      path: "/owner/my-pets",
      icon: <Heart className="w-5 h-5" />,
    },
    {
      label: "Reminders",
      path: "/owner/reminders",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      label: "Profile",
      path: "/owner/profile",
      icon: <User className="w-5 h-5" />,
    },
  ],
  clinic: [
    {
      label: "Dashboard",
      path: "/clinic",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Clinic Details",
      path: "/clinic/details",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      label: "Appointments",
      path: "/clinic/appointments",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Manage Doctors",
      path: "/clinic/doctors",
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      label: "Manage Pets",
      path: "/clinic/pets",
      icon: <Heart className="w-5 h-5" />,
    },
  ],
  doctor: [
    {
      label: "Dashboard",
      path: "/doctor",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Appointments",
      path: "/doctor/appointments",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Pet History",
      path: "/doctor/pet-history",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "My Profile",
      path: "/doctor/profile",
      icon: <User className="w-5 h-5" />,
    },
  ],
  admin: [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Manage Clinics",
      path: "/admin/clinics",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      label: "Pet History",
      path: "/admin/pet-history",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Manage Doctors",
      path: "/admin/doctors",
      icon: <Stethoscope className="w-5 h-5" />,
    },
  ],
};

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; badge: string }
> = {
  owner: {
    label: "Pet Owner",
    color: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  clinic: {
    label: "Clinic Admin",
    color: "from-blue-500 to-cyan-600",
    badge: "bg-blue-100 text-blue-700",
  },
  doctor: {
    label: "Vet Doctor",
    color: "from-purple-500 to-violet-600",
    badge: "bg-purple-100 text-purple-700",
  },
  admin: {
    label: "System Admin",
    color: "from-orange-500 to-red-600",
    badge: "bg-orange-100 text-orange-700",
  },
};

export default function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const role = currentUser.role;
  const navItems = NAV_CONFIGS[role] || [];
  const roleConfig = ROLE_CONFIG[role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-17 h-17`}
            >
               <img src='https://i.ibb.co/QjYJmg16/petcare-hub.png' alt="" className=" rounded-2xl w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">
                PetCare Hub
              </h1>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleConfig.badge}`}
              >
                {roleConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-5 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
              <img
                src="https://i.ibb.co/3yhfW8Lt/avatar.png"
                alt={currentUser.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {currentUser.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${role}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? `bg-gradient-to-r ${roleConfig.color} text-white shadow-lg`
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        {/* <header className="bg-black border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 cursor-pointer">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${roleConfig.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header> */}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
