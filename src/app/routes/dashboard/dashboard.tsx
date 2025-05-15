import {JSX, useState} from "react";
import Sidebar from "../../../components/Sidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import {
    User, Wallet, HandCoins, TrendingUp, BellRing, Activity,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { admin } = useUser();

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

    const barData = [
        { name: "Today Purchase", value: admin?.todaypurchase ?? 0 },
        { name: "Today Deposit", value: admin?.todaydeposit ?? 0 },
        { name: "Pending Tx", value: admin?.pendingtransaction ?? 0 },
        { name: "New Users", value: admin?.newusers ?? 0 },
    ];

    const pieData = [
        { name: "Total Deposit", value: admin?.totaldeposit ?? 0 },
        { name: "Total Bill", value: admin?.totalbill ?? 0 },
    ];

    return (
        <div className="min-h-screen flex bg-[#050B1E] text-white">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                     onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                            <p className="text-gray-400 mb-8">{admin?.noti || "System Status and Insights"}</p>


                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Bar Chart */}
                                <div className="bg-[#070D20] p-6 rounded-xl border border-gray-800 shadow-lg">
                                    <h2 className="text-xl font-semibold mb-4">Daily Metrics</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ReBarChart data={barData}>
                                            <XAxis dataKey="name" stroke="#ccc"/>
                                            <YAxis stroke="#ccc"/>
                                            <Tooltip/>
                                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                                        </ReBarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-[#070D20] p-6 rounded-xl border border-gray-800 shadow-lg">
                                    <h2 className="text-xl font-semibold mb-4">Deposit vs Billing</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#3b82f6"
                                                dataKey="value"
                                                label
                                            >
                                                {pieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip/>
                                            <Legend/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <br/>
                            <hr/>
                            <br/>
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <StatCard
                                    icon={<Wallet className="text-blue-400 w-6 h-6"/>}
                                    label="Wallet Balance"
                                    value={`₦${admin?.wallet?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<Wallet className="text-blue-400 w-6 h-6"/>}
                                    label="Today Deposit"
                                    value={`₦${admin?.todaydeposit?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<Wallet className="text-blue-400 w-6 h-6"/>}
                                    label="Paylony Balance"
                                    value={`₦${admin?.paylonybalance?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<Wallet className="text-blue-400 w-6 h-6"/>}
                                    label="Paylony Pending"
                                    value={`₦${admin?.paylonypendingbalance?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<Wallet className="text-blue-400 w-6 h-6"/>}
                                    label="Today Purchase"
                                    value={`₦${admin?.todaypurchase?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<HandCoins className="text-green-400 w-6 h-6"/>}
                                    label="Total Deposit"
                                    value={`₦${admin?.totaldeposit?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<TrendingUp className="text-yellow-400 w-6 h-6"/>}
                                    label="Total Bill"
                                    value={`₦${admin?.totalbill?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<User className="text-purple-400 w-6 h-6"/>}
                                    label="Total Users"
                                    value={admin?.users?.toLocaleString() ?? '0'}
                                />
                                <StatCard
                                    icon={<BellRing className="text-pink-400 w-6 h-6"/>}
                                    label="Pending Transactions"
                                    value={admin?.pendingtransaction?.toLocaleString() ?? '0'}
                                />
                                <StatCard
                                    icon={<User className="text-teal-400 w-6 h-6"/>}
                                    label="New Users Today"
                                    value={admin?.newusers?.toLocaleString() ?? '0'}
                                />
                                <StatCard
                                    icon={<Activity className="text-orange-400 w-6 h-6"/>}
                                    label="Data Profit"
                                    value={`₦${admin?.dataprofit?.toLocaleString() ?? '0'}`}
                                />
                                <StatCard
                                    icon={<HandCoins className="text-red-400 w-6 h-6"/>}
                                    label="Total Charges"
                                    value={`₦${admin?.allcharges?.toLocaleString() ?? '0'}`}
                                />
                            </div>



                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Reusable Stat Card Component
function StatCard({icon, label, value}: { icon: JSX.Element; label: string; value: string | number }) {
    return (
        <div
            className="bg-[#070D20] rounded-xl p-6 border border-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300">{label}</h3>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}
