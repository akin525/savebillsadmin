import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";
import {
    Search,
    Filter,
    Download,
    Eye,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    RefreshCw,
    FileText,
    Activity
} from "lucide-react";

interface PurchaseEntry {
    id: number;
    username: string;
    plan: string;
    amount: string;
    result: string;
    phone: string;
    refid: string;
    date: string;
    server_res: string;
    token: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PurchaseData {
    sumbill: number;
    todaybill: number;
    yesterdaybill: number;
    twodaybill: number;
    threedaybill: number;
    fourdaybill: number;
    aweekbill: number;
    all: PurchaseEntry[];
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const PurchaseSummary = () => {
    const [data, setData] = useState<PurchaseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedServerRes, setSelectedServerRes] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateRange, setDateRange] = useState<string>("all");
    const itemsPerPage = 10;
    const token = getAuthToken();

    const formatCurrency = (value: number | string) => `₦${parseFloat(value.toString()).toLocaleString()}`;

    const fetchPurchases = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await fetch(`${baseUrl}purchase`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const result = await res.json();
            if (result.success) {
                setData(result.data);
                if (showRefresh) toast.success("Data refreshed successfully");
            } else {
                toast.error("Failed to fetch purchase summary");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-[#050B1E] via-[#0A1128] to-[#050B1E] text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            <Activity className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Loading Purchase Data</h3>
                            <p className="text-gray-400">Fetching latest purchase information...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-[#050B1E] via-[#0A1128] to-[#050B1E] text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">No Data Available</h3>
                            <p className="text-gray-400">Unable to load purchase information</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const filteredPurchases = data.all.filter((entry) => {
        const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.refid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.phone.includes(searchTerm);

        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "success" && entry.result === "1") ||
            (statusFilter === "pending" && entry.result !== "1");

        return matchesSearch && matchesStatus;
    }).sort((a, b) => b.id - a.id);

    const paginatedPurchases = filteredPurchases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

    // Calculate percentage changes (mock data for demo)
    const todayChange = data.yesterdaybill > 0 ? ((data.todaybill - data.yesterdaybill) / data.yesterdaybill * 100) : 0;

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
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Purchase Analytics
                            </h1>
                            <p className="text-gray-400 mt-1">Monitor and analyze all purchase transactions</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fetchPurchases(true)}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-600/30 transition-all duration-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-600/30 transition-all duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SummaryCard
                            icon={DollarSign}
                            label="Total Revenue"
                            value={formatCurrency(data.sumbill)}
                            change={null}
                            color="blue"
                        />
                        <SummaryCard
                            icon={TrendingUp}
                            label="Today's Sales"
                            value={formatCurrency(data.todaybill)}
                            change={todayChange}
                            color="green"
                        />
                        <SummaryCard
                            icon={Clock}
                            label="Yesterday"
                            value={formatCurrency(data.yesterdaybill)}
                            change={null}
                            color="purple"
                        />
                        <SummaryCard
                            icon={Users}
                            label="Total Transactions"
                            value={data.all.length.toString()}
                            change={null}
                            color="orange"
                        />
                    </div>

                    {/* Weekly Overview */}
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            Weekly Overview
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <WeeklyCard label="2 Days Ago" value={formatCurrency(data.twodaybill)} />
                            <WeeklyCard label="3 Days Ago" value={formatCurrency(data.threedaybill)} />
                            <WeeklyCard label="4 Days Ago" value={formatCurrency(data.fourdaybill)} />
                            <WeeklyCard label="Week Ago" value={formatCurrency(data.aweekbill)} />
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                        {/* Table Header */}
                        <div className="p-6 border-b border-gray-700/50">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    All Transactions
                                    <span className="text-sm font-normal text-gray-400">({filteredPurchases.length})</span>
                                </h2>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="success">Success</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-800/30">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">ID</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">User</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Plan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Amount</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Phone</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Reference</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/30">
                                {paginatedPurchases.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        className="hover:bg-gray-800/30 transition-colors duration-200"
                                    >
                                        <td className="py-4 px-6 text-sm font-medium text-blue-400">#{entry.id}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {entry.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium">{entry.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                                    {entry.plan}
                                                </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-semibold text-green-400">
                                            {formatCurrency(entry.amount)}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-300">{entry.phone}</td>
                                        <td className="py-4 px-6">
                                            <code className="text-xs bg-gray-800/50 px-2 py-1 rounded text-gray-300">
                                                {entry.refid.substring(0, 12)}...
                                            </code>
                                        </td>
                                        <td className="py-4 px-6">
                                            {entry.result === "1" ? (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Success
                                                    </span>
                                            ) : (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-300">
                                            {new Date(entry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => setSelectedServerRes(entry.server_res)}
                                                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-6 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-400">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredPurchases.length)} of {filteredPurchases.length} transactions
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className="flex items-center gap-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="flex items-center gap-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Server Response Modal */}
            {selectedServerRes && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-600/50 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Server Response Details
                            </h2>
                            <button
                                onClick={() => setSelectedServerRes(null)}
                                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400 hover:text-white" />
                            </button>
                        </div>
                        <div className="p-6 overflow-auto max-h-96">
                            <pre className="bg-gray-900/50 p-4 rounded-xl text-sm overflow-auto whitespace-pre-wrap text-gray-300 border border-gray-700/30">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(selectedServerRes || "{}"), null, 2);
                                    } catch {
                                        return selectedServerRes || "No server response available.";
                                    }
                                })()}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SummaryCard = ({
                         icon: Icon,
                         label,
                         value,
                         change,
                         color
                     }: {
    icon: any;
    label: string;
    value: string;
    change: number | null;
    color: string;
}) => {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
        green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
        purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
        orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-sm rounded-2xl border p-6 hover:scale-105 transition-all duration-200`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                {change !== null && (
                    <div className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(change).toFixed(1)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm text-gray-400 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    );
};

const WeeklyCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
        <p className="text-xs text-gray-400 mb-2">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
    </div>
);

export default PurchaseSummary;
