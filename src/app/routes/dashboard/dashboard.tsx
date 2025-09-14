import {JSX, useState} from "react";
import Sidebar from "../../../components/Sidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import {
    User, Wallet, HandCoins, TrendingUp, BellRing, Activity,
    ArrowUpRight, ArrowDownRight, Eye, EyeOff
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,  Area, AreaChart
} from "recharts";

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showBalances, setShowBalances] = useState(true);
    const { admin } = useUser();

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

    const barData = [
        { name: "Purchase", value: admin?.todaypurchase ?? 0, color: "#3b82f6" },
        { name: "Deposit", value: admin?.todaydeposit ?? 0, color: "#10b981" },
        { name: "Pending", value: admin?.pendingtransaction ?? 0, color: "#f59e0b" },
        { name: "New Users", value: admin?.newusers ?? 0, color: "#8b5cf6" },
    ];

    const pieData = [
        { name: "Total Deposit", value: admin?.totaldeposit ?? 0 },
        { name: "Total Bill", value: admin?.totalbill ?? 0 },
        { name: "Data Profit", value: admin?.dataprofit ?? 0 },
    ];

    // Mock trend data - replace with actual data
    const trendData = [
        { name: "Mon", deposits: 4000, bills: 2400 },
        { name: "Tue", deposits: 3000, bills: 1398 },
        { name: "Wed", deposits: 2000, bills: 9800 },
        { name: "Thu", deposits: 2780, bills: 3908 },
        { name: "Fri", deposits: 1890, bills: 4800 },
        { name: "Sat", deposits: 2390, bills: 3800 },
        { name: "Sun", deposits: 3490, bills: 4300 },
    ];

    const primaryStats = [
        {
            icon: <Wallet className="w-6 h-6" />,
            label: "Wallet Balance",
            value: admin?.wallet ?? 0,
            trend: "+12.5%",
            trendUp: true,
            color: "blue"
        },
        {
            icon: <HandCoins className="w-6 h-6" />,
            label: "Today Deposit",
            value: admin?.todaydeposit ?? 0,
            trend: "+8.2%",
            trendUp: true,
            color: "green"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            label: "Today Purchase",
            value: admin?.todaypurchase ?? 0,
            trend: "-2.1%",
            trendUp: false,
            color: "purple"
        },
        {
            icon: <User className="w-6 h-6" />,
            label: "Total Users",
            value: admin?.users ?? 0,
            trend: "+15.3%",
            trendUp: true,
            color: "orange",
            isCount: true
        }
    ];

    const secondaryStats = [
        { icon: <Wallet />, label: "MCD Balance", value: admin?.mcdbalance ?? 0, color: "purple" },
        { icon: <Wallet />, label: "MCD Commission", value: admin?.mcdcom ?? 0, color: "purple" },
        { icon: <Wallet />, label: "Paylony Balance", value: admin?.paylonybalance ?? 0, color: "blue" },
        { icon: <Wallet />, label: "Paylony Pending", value: admin?.paylonypendingbalance ?? 0, color: "yellow" },
        { icon: <HandCoins />, label: "Total Deposit", value: admin?.totaldeposit ?? 0, color: "green" },
        { icon: <TrendingUp />, label: "Total Bill", value: admin?.totalbill ?? 0, color: "purple" },
        { icon: <BellRing />, label: "Pending Transactions", value: admin?.pendingtransaction ?? 0, color: "pink" },
        { icon: <User />, label: "New Users Today", value: admin?.newusers ?? 0, color: "teal", isCount: true },
        { icon: <Activity />, label: "Data Profit", value: admin?.dataprofit ?? 0, color: "orange" },
        { icon: <HandCoins />, label: "Total Charges", value: admin?.allcharges ?? 0, color: "red" },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#050B1E] via-[#0A1128] to-[#050B1E] text-white">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                     onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Header Section */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-gray-400 mt-2 text-lg">
                                        {admin?.noti || "System Status and Insights"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowBalances(!showBalances)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {showBalances ? "Hide" : "Show"} Balances
                                </button>
                            </div>

                            {/* Primary Stats - Hero Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {primaryStats.map((stat, index) => (
                                    <PrimaryStatCard key={index} {...stat} showValue={showBalances} />
                                ))}
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                                {/* Weekly Trend */}
                                <div className="xl:col-span-2 bg-gradient-to-br from-[#0F1629] to-[#1A2332] p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-white">Weekly Trends</h2>
                                        <div className="flex gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span className="text-gray-400">Deposits</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-gray-400">Bills</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={trendData}>
                                            <defs>
                                                <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorBills" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" stroke="#6b7280" />
                                            <YAxis stroke="#6b7280" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="deposits"
                                                stroke="#3b82f6"
                                                fillOpacity={1}
                                                fill="url(#colorDeposits)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="bills"
                                                stroke="#10b981"
                                                fillOpacity={1}
                                                fill="url(#colorBills)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-gradient-to-br from-[#0F1629] to-[#1A2332] p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
                                    <h2 className="text-xl font-semibold mb-6 text-white">Revenue Distribution</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Daily Metrics Bar Chart */}
                            <div className="bg-gradient-to-br from-[#0F1629] to-[#1A2332] p-6 rounded-2xl border border-gray-700/50 shadow-2xl mb-8">
                                <h2 className="text-xl font-semibold mb-6 text-white">Today's Metrics</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ReBarChart data={barData}>
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </ReBarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Secondary Stats Grid */}
                            <div className="bg-gradient-to-br from-[#0F1629] to-[#1A2332] p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
                                <h2 className="text-xl font-semibold mb-6 text-white">Detailed Metrics</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {secondaryStats.map((stat, index) => (
                                        <SecondaryStatCard key={index} {...stat} showValue={showBalances} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Enhanced Primary Stat Card Component
function PrimaryStatCard({
                             icon,
                             label,
                             value,
                             trend,
                             trendUp,
                             color,
                             isCount = false,
                             showValue
                         }: {
    icon: JSX.Element;
    label: string;
    value: number;
    trend: string;
    trendUp: boolean;
    color: string;
    isCount?: boolean;
    showValue: boolean;
}) {
    const colorClasses = {
        blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
        green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
        purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
        orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400",
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                    {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {trend}
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">{label}</h3>
            <div className="text-2xl font-bold text-white">
                {showValue ? (
                    isCount ? value.toLocaleString() : `₦${value.toLocaleString()}`
                ) : (
                    "••••••"
                )}
            </div>
        </div>
    );
}

// Secondary Stat Card Component
function SecondaryStatCard({
                               icon,
                               label,
                               value,
                               color,
                               isCount = false,
                               showValue
                           }: {
    icon: JSX.Element;
    label: string;
    value: number;
    color: string;
    isCount?: boolean;
    showValue: boolean;
}) {
    const colorClasses = {
        blue: "text-blue-400",
        green: "text-green-400",
        yellow: "text-yellow-400",
        purple: "text-purple-400",
        pink: "text-pink-400",
        teal: "text-teal-400",
        orange: "text-orange-400",
        red: "text-red-400",
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center gap-3 mb-3">
                <div className={`${colorClasses[color as keyof typeof colorClasses]} w-5 h-5`}>
                    {icon}
                </div>
                <h3 className="text-sm font-medium text-gray-300 truncate">{label}</h3>
            </div>
            <div className="text-lg font-semibold text-white">
                {showValue ? (
                    isCount ? value.toLocaleString() : `₦${value.toLocaleString()}`
                ) : (
                    "••••••"
                )}
            </div>
        </div>
    );
}
