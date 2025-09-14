import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";
import {
    Clock,
    DollarSign,
    Calendar,
    Search,
    RefreshCw,
    AlertTriangle,
    FileText,
    CheckCircle2,
    Smartphone,
    Hash,
    ChevronRight,
    Package,
    Users,
} from "lucide-react";
import { toast } from "react-toastify";

interface PendingPurchase {
    id: number;
    username: string;
    plan: string;
    amount: string;
    phone: string;
    refid: string;
    date: string;
    result: string;
    createdAt: string;
    updatedAt: string;
}

// Define priority type
type PriorityLevel = 'high' | 'medium' | 'low';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const PendingPurchases = () => {
    const [purchases, setPurchases] = useState<PendingPurchase[]>([]);
    const [filteredPurchases, setFilteredPurchases] = useState<PendingPurchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "amount" | "username">("date");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const token = getAuthToken();

    const fetchPendingPurchases = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const res = await fetch(`${baseUrl}pending`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Failed to fetch data");

            const data = await res.json();
            const pending = data.all.filter((item: any) => item.result === "0");
            setPurchases(pending);
            setFilteredPurchases(pending);

            if (showRefresh) {
                toast.success("Data refreshed successfully");
            }
        } catch (error) {
            console.error("Error fetching pending purchases:", error);
            toast.error("Failed to fetch pending purchases");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPendingPurchases();
    }, []);

    useEffect(() => {
        let filtered = purchases.filter((purchase) =>
            purchase.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.phone.includes(searchTerm) ||
            purchase.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.refid.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort filtered results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "amount":
                    return parseFloat(b.amount) - parseFloat(a.amount);
                case "username":
                    return a.username.localeCompare(b.username);
                default:
                    return 0;
            }
        });

        setFilteredPurchases(filtered);
    }, [searchTerm, sortBy, purchases]);

    const formatCurrency = (amount: string) => `₦${parseFloat(amount).toLocaleString()}`;
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    const getPriorityLevel = (dateString: string): PriorityLevel => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours > 48) return "high";
        if (diffInHours > 24) return "medium";
        return "low";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-[#050B1E] via-[#0A1128] to-[#050B1E] text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                            <Clock className="w-6 h-6 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Loading Pending Purchases</h3>
                            <p className="text-gray-400">Fetching pending transaction data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#050B1E] via-[#0A1128] to-[#050B1E] text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <div className="flex-1 overflow-auto p-6 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                    Pending Purchases
                                </span>
                            </h1>
                            <p className="text-gray-400 mt-1">Monitor and manage pending transactions</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fetchPendingPurchases(true)}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600/20 border border-orange-500/30 rounded-xl text-orange-400 hover:bg-orange-600/30 transition-all duration-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            icon={Package}
                            label="Total Pending"
                            value={purchases.length.toString()}
                            color="orange"
                            subtitle="Transactions"
                        />
                        <StatsCard
                            icon={DollarSign}
                            label="Pending Value"
                            value={formatCurrency(purchases.reduce((sum, p) => sum + parseFloat(p.amount), 0).toString())}
                            color="red"
                            subtitle="Total amount"
                        />
                        <StatsCard
                            icon={AlertTriangle}
                            label="High Priority"
                            value={purchases.filter(p => getPriorityLevel(p.date) === "high").length.toString()}
                            color="yellow"
                            subtitle=">48h old"
                        />
                        <StatsCard
                            icon={Users}
                            label="Unique Users"
                            value={new Set(purchases.map(p => p.username)).size.toString()}
                            color="blue"
                            subtitle="Affected users"
                        />
                    </div>

                    {/* Controls */}
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by user, phone, plan..."
                                        className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full sm:w-80"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "username")}
                                    className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="amount">Sort by Amount</option>
                                    <option value="username">Sort by User</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">View:</span>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === "grid"
                                            ? "bg-orange-600/30 text-orange-400"
                                            : "bg-gray-800/50 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <Package className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === "list"
                                            ? "bg-orange-600/30 text-orange-400"
                                            : "bg-gray-800/50 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {filteredPurchases.length === 0 ? (
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">No Pending Purchases</h3>
                                    <p className="text-gray-400">
                                        {searchTerm
                                            ? "No purchases match your search criteria."
                                            : "All transactions have been processed successfully!"
                                        }
                                    </p>
                                </div>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="px-4 py-2 bg-orange-600/20 border border-orange-500/30 rounded-xl text-orange-400 hover:bg-orange-600/30 transition-all duration-200"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={viewMode === "grid"
                            ? "grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                            : "space-y-4"
                        }>
                            {filteredPurchases.map((purchase) => (
                                viewMode === "grid" ? (
                                    <PurchaseCard
                                        key={purchase.id}
                                        purchase={purchase}
                                        onClick={() => navigate(`/transaction/${purchase.id}`)}
                                        formatCurrency={formatCurrency}
                                        formatDate={formatDate}
                                        getTimeAgo={getTimeAgo}
                                        getPriorityLevel={getPriorityLevel}
                                    />
                                ) : (
                                    <PurchaseListItem
                                        key={purchase.id}
                                        purchase={purchase}
                                        onClick={() => navigate(`/transaction/${purchase.id}`)}
                                        formatCurrency={formatCurrency}
                                        formatDate={formatDate}
                                        getTimeAgo={getTimeAgo}
                                        getPriorityLevel={getPriorityLevel}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({
                       icon: Icon,
                       label,
                       value,
                       color,
                       subtitle
                   }: {
    icon: any;
    label: string;
    value: string;
    color: 'orange' | 'red' | 'yellow' | 'blue';
    subtitle: string;
}) => {
    const colorClasses: Record<'orange' | 'red' | 'yellow' | 'blue', string> = {
        orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
        red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
        yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
        blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm rounded-2xl border p-6 hover:scale-105 transition-all duration-200`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-400 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
};

const PurchaseCard = ({
                          purchase,
                          onClick,
                          formatCurrency,
                          formatDate,
                          getTimeAgo,
                          getPriorityLevel
                      }: {
    purchase: PendingPurchase;
    onClick: () => void;
    formatCurrency: (amount: string) => string;
    formatDate: (date: string) => string;
    getTimeAgo: (date: string) => string;
    getPriorityLevel: (date: string) => PriorityLevel;
}) => {
    const priority = getPriorityLevel(purchase.date);
    const priorityColors: Record<PriorityLevel, string> = {
        high: 'border-red-500/50 bg-red-500/10',
        medium: 'border-yellow-500/50 bg-yellow-500/10',
        low: 'border-gray-600/50 bg-gray-800/30'
    };

    return (
        <div
            className={`${priorityColors[priority]} backdrop-blur-sm rounded-2xl border p-6 hover:scale-105 cursor-pointer transition-all duration-200 group`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-sm font-bold">
                        {purchase.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{purchase.username}</h3>
                        <p className="text-xs text-gray-400">#{purchase.id}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400">{getTimeAgo(purchase.date)}</div>
                    {priority === 'high' && (
                        <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            Urgent
                        </div>
                    )}
                </div>
            </div>

            {/* Plan */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Plan</span>
                </div>
                <p className="font-semibold text-white">{purchase.plan}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-gray-400">Amount</span>
                    </div>
                    <p className="text-sm font-semibold text-green-400">{formatCurrency(purchase.amount)}</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Smartphone className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-gray-400">Phone</span>
                    </div>
                    <p className="text-sm text-white">{purchase.phone}</p>
                </div>
            </div>

            {/* Reference */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Reference</span>
                </div>
                <code className="text-xs bg-gray-800/50 px-2 py-1 rounded text-gray-300 block truncate">
                    {purchase.refid}
                </code>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                <div className="text-xs text-gray-400">
                    {formatDate(purchase.date)}
                </div>
                <div className="flex items-center gap-1 text-orange-400 group-hover:text-orange-300 transition-colors">
                    <span className="text-xs">View Details</span>
                    <ChevronRight className="w-3 h-3" />
                </div>
            </div>
        </div>
    );
};

const PurchaseListItem = ({
                              purchase,
                              onClick,
                              formatCurrency,
                              getTimeAgo,
                              getPriorityLevel
                          }: {
    purchase: PendingPurchase;
    onClick: () => void;
    formatCurrency: (amount: string) => string;
    formatDate: (date: string) => string;
    getTimeAgo: (date: string) => string;
    getPriorityLevel: (date: string) => PriorityLevel;
}) => {
    const priority = getPriorityLevel(purchase.date);

    return (
        <div
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:bg-gray-800/60 cursor-pointer transition-all duration-200 group"
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-sm font-bold">
                        {purchase.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-white">{purchase.username}</h3>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                {purchase.plan}
                            </span>
                            {priority === 'high' && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                                    <AlertTriangle className="w-3 h-3" />
                                    Urgent
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <Smartphone className="w-3 h-3" />
                                {purchase.phone}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {getTimeAgo(purchase.date)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-lg font-semibold text-green-400">{formatCurrency(purchase.amount)}</div>
                        <div className="text-xs text-gray-400">#{purchase.id}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default PendingPurchases;
