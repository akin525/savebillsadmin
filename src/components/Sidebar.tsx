import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
    X,
    LayoutDashboard,
    Settings,
    LogOut,
    Database,
    DollarSign,
    SearchCode,
    ChevronDown,
    ChevronRight,
    CreditCard,
    Users,
    Package,
    Search,
    RefreshCw,
    Wallet,
    HelpCircle,
    UserCircle,
    Menu,
    Zap
} from "lucide-react";

interface MenuItem {
    title: string;
    icon: any;
    path?: string;
    badge?: string;
    children?: MenuItem[];
}

export default function Sidebar({
                                    isOpen,
                                    onClose,
                                }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(isOpen);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(isOpen);
    }, [isOpen]);

    const toggleMenu = (menuTitle: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuTitle)
                ? prev.filter(item => item !== menuTitle)
                : [...prev, menuTitle]
        );
    };

    const menuItems: MenuItem[] = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
        },
        {
            title: "Transactions",
            icon: CreditCard,
            children: [
                { title: "All Deposits", icon: Database, path: "/alldeposit" },
                { title: "All Purchases", icon: DollarSign, path: "/allpurchase" },
                { title: "Pending Purchases", icon: RefreshCw, path: "/allpending", badge: "3" },
                { title: "Search Transaction", icon: Search, path: "/search-tran" },
            ]
        },
        {
            title: "Management",
            icon: Settings,
            children: [
                { title: "All Users", icon: Users, path: "/allusers" },
                { title: "Data Products", icon: Package, path: "/allproducts" },
                { title: "MCD Recheck", icon: SearchCode, path: "/recheck" },
            ]
        },
        {
            title: "Financial",
            icon: Wallet,
            children: [
                { title: "Withdraw MCD", icon: DollarSign, path: "/withdraw" },
            ]
        }
    ];

    const accountItems: MenuItem[] = [
        { title: "Profile", icon: UserCircle, path: "/profile" },
        { title: "Site Settings", icon: Settings, path: "/settings" },
        { title: "Support", icon: HelpCircle, path: "/support" }
    ];

    const isActiveRoute = (path: string) => {
        return location.pathname === path;
    };

    const hasActiveChild = (children?: MenuItem[]) => {
        return children?.some(child => isActiveRoute(child.path || ''));
    };

    const renderMenuItem = (item: MenuItem, level = 0) => {
        const isExpanded = expandedMenus.includes(item.title);
        const isActive = item.path ? isActiveRoute(item.path) : hasActiveChild(item.children);
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return (
                <div key={item.title} className="mb-1">
                    <button
                        onClick={() => toggleMenu(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                            isActive || isExpanded
                                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30'
                                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center">
                            <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                                isActive || isExpanded ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                            }`} />
                            <span>{item.title}</span>
                        </div>
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4 transition-transform" />
                        ) : (
                            <ChevronRight className="h-4 w-4 transition-transform" />
                        )}
                    </button>

                    {isExpanded && (
                        <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-700/50 pl-4">
                            {item.children?.map(child => renderMenuItem(child, level + 1))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                key={item.title}
                to={item.path || '#'}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group mb-1 ${
                    isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : level > 0
                            ? 'text-gray-400 hover:bg-gray-800/30 hover:text-white ml-2'
                            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
            >
                <div className="flex items-center">
                    <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                        isActive ? 'text-white' : level > 0 ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-white'
                    }`} />
                    <span>{item.title}</span>
                </div>
                {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-all duration-300 ease-in-out bg-gradient-to-b from-[#0A1128] via-[#0F1629] to-[#0A1128] border-r border-gray-700/50 lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                    <Link to="/" className="flex items-center group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Savebills
                            </p>
                            <p className="text-xs text-gray-400">Admin Panel</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 lg:hidden transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    {/* Main Navigation */}
                    <div className="space-y-2">
                        <div className="px-3 mb-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                                <Menu className="w-3 h-3 mr-2" />
                                Main Menu
                            </h3>
                        </div>
                        {menuItems.map(item => renderMenuItem(item))}
                    </div>

                    {/* Account Section */}
                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                        <div className="px-3 mb-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                                <UserCircle className="w-3 h-3 mr-2" />
                                Account
                            </h3>
                        </div>
                        <div className="space-y-1">
                            {accountItems.map(item => renderMenuItem(item))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-700/50 p-4 bg-gradient-to-r from-gray-800/20 to-gray-900/20">
                    {/* User Profile Card */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                A
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-white">Admin User</p>
                                <p className="text-xs text-gray-400">admin@savebills.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <Link
                        to="/login"
                        className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
