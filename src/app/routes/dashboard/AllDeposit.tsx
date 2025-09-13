import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";
import {
    TrendingUp,
    Calendar,
    Search,
    Filter,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
    Wallet,
    CreditCard,
    DollarSign,
    Clock,
    User,
    Hash,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from "lucide-react";

interface DepositData {
    sumdepo: number;
    todaydeposit: number;
    yesterdayDepo: number;
    twodayDepo: number;
    threedayDepo: number;
    fourdayDepo: number;
    aweekDepo: number;
    deposit: DepositEntry[];
}

interface DepositEntry {
    id: number;
    status: string;
    username: string;
    payment_ref: string;
    amount: string;
    iwallet: string;
    fwallet: string;
    narration: string | null;
    date: string | null;
    createdAt: string;
    updatedAt: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const DepositSummary = () => {
    const [data, setData] = useState<DepositData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const token = getAuthToken();

    const formatCurrency = (value: number | string) => `₦${parseFloat(value.toString()).toLocaleString()}`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const res = await fetch(`${baseUrl}alldeposit`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const result = await res.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    toast.error("Failed to fetch deposit summary");
                }
            } catch (error: any) {
                toast.error(error.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchDeposits();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex bg-[#050B1E] text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading deposit summary...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex bg-[#050B1E] text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-red-400">No data available</p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredDeposits = data.deposit
        .slice()
        .sort((a, b) => b.id - a.id)
        .filter((dep) =>
            dep.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dep.payment_ref.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const paginatedDeposits = filteredDeposits.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);

    const summaryCards = [
        {
            label: "Total Deposits",
            value: formatCurrency(data.sumdepo),
            icon: Wallet,
            gradient: "from-blue-600 to-blue-700",
            bgGradient: "from-blue-900/20 to-blue-800/10",
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400"
        },
        {
            label: "Today",
            value: formatCurrency(data.todaydeposit),
            icon: TrendingUp,
            gradient: "from-green-600 to-green-700",
            bgGradient: "from-green-900/20 to-green-800/10",
            iconBg: "bg-green-500/20",
            iconColor: "text-green-400"
        },
        {
            label: "Yesterday",
            value: formatCurrency(data.yesterdayDepo),
            icon: Calendar,
            gradient: "from-purple-600 to-purple-700",
            bgGradient: "from-purple-900/20 to-purple-800/10",
            iconBg: "bg-purple-500/20",
            iconColor: "text-purple-400"
        },
        {
            label: "2 Days Ago",
            value: formatCurrency(data.twodayDepo),
            icon: Clock,
            gradient: "from-orange-600 to-orange-700",
            bgGradient: "from-orange-900/20 to-orange-800/10",
            iconBg: "bg-orange-500/20",
            iconColor: "text-orange-400"
        },
        {
            label: "3 Days Ago",
            value: formatCurrency(data.threedayDepo),
            icon: Clock,
            gradient: "from-indigo-600 to-indigo-700",
            bgGradient: "from-indigo-900/20 to-indigo-800/10",
            iconBg: "bg-indigo-500/20",
            iconColor: "text-indigo-400"
        },
        {
            label: "4 Days Ago",
            value: formatCurrency(data.fourdayDepo),
            icon: Clock,
            gradient: "from-pink-600 to-pink-700",
            bgGradient: "from-pink-900/20 to-pink-800/10",
            iconBg: "bg-pink-500/20",
            iconColor: "text-pink-400"
        },
        {
            label: "A Week Ago",
            value: formatCurrency(data.aweekDepo),
            icon: Calendar,
            gradient: "from-teal-600 to-teal-700",
            bgGradient: "from-teal-900/20 to-teal-800/10",
            iconBg: "bg-teal-500/20",
            iconColor: "text-teal-400"
        }
    ];

    return (
        <div className="min-h-screen flex bg-[#050B1E] text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Deposit Analytics
                                </h1>
                                <p className="text-gray-400 mt-1">Monitor and track all deposit transactions</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* Summary Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {summaryCards.map((card, index) => (
                                <SummaryCard key={index} {...card} />
                            ))}
                        </div>

                        {/* Deposits Table Section */}
                        <div className="bg-gradient-to-br from-[#0F1629] to-[#1A2332] rounded-2xl border border-gray-700/50 overflow-hidden">
                            {/* Table Header */}
                            <div className="p-6 border-b border-gray-700/50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">Recent Deposits</h2>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {filteredDeposits.length} total transactions
                                        </p>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search username or reference..."
                                            className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-80"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800/30">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" />
                                                ID
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                User
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Amount
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Reference
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <ArrowUpRight className="w-4 h-4" />
                                                Initial
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <ArrowDownRight className="w-4 h-4" />
                                                Final
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Date
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                    {paginatedDeposits.map((dep) => (
                                        <tr
                                            key={dep.id}
                                            className="hover:bg-gray-800/30 transition-colors duration-200"
                                        >
                                            <td className="py-4 px-6">
                                                <span className="text-blue-400 font-mono text-sm">#{dep.id}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                        {dep.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-white font-medium">{dep.username}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                    <span className="text-green-400 font-semibold">
                                                        {formatCurrency(dep.amount)}
                                                    </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                    <span className="text-gray-300 font-mono text-xs bg-gray-800/50 px-2 py-1 rounded">
                                                        {dep.payment_ref.slice(0, 12)}...
                                                    </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-300">{formatCurrency(dep.iwallet)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-300">{formatCurrency(dep.fwallet)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-400 text-sm">{formatDate(dep.createdAt)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-6 border-t border-gray-700/50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <p className="text-sm text-gray-400">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredDeposits.length)} of {filteredDeposits.length} entries
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                            currentPage === pageNum
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
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
                </main>
            </div>
        </div>
    );
};

const SummaryCard = ({
                         label,
                         value,
                         icon: Icon,
                         gradient,
                         bgGradient,
                         iconBg,
                         iconColor
                     }: {
    label: string;
    value: string;
    icon: any;
    gradient: string;
    bgGradient: string;
    iconBg: string;
    iconColor: string;
}) => (
    <div className={`relative bg-gradient-to-br ${bgGradient} border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 group overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-full`} />
            </div>

            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    </div>
);

export default DepositSummary;
