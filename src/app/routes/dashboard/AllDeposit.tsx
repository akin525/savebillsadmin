import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";

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
            <div className="text-white text-center py-10">
                <span className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full inline-block" />
                <p>Loading deposit summary...</p>
            </div>
        );
    }

    if (!data) {
        return <div className="text-red-500 text-center">No data available.</div>;
    }

    const filteredDeposits = data.deposit
        .slice() // create a shallow copy to avoid mutating the original data
        .sort((a, b) => b.id - a.id) // sort by id descending
        .filter((dep) =>
            dep.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dep.payment_ref.toLowerCase().includes(searchTerm.toLowerCase())
        );


    const paginatedDeposits = filteredDeposits.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);

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

                <div className="p-6 bg-[#050B1E] text-white min-h-screen">
                    <h1 className="text-3xl font-bold mb-8">Deposit Summary</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                        <SummaryCard label="Total Deposit" value={formatCurrency(data.sumdepo)} />
                        <SummaryCard label="Today" value={formatCurrency(data.todaydeposit)} />
                        <SummaryCard label="Yesterday" value={formatCurrency(data.yesterdayDepo)} />
                        <SummaryCard label="2 Days Ago" value={formatCurrency(data.twodayDepo)} />
                        <SummaryCard label="3 Days Ago" value={formatCurrency(data.threedayDepo)} />
                        <SummaryCard label="4 Days Ago" value={formatCurrency(data.fourdayDepo)} />
                        <SummaryCard label="A Week Ago" value={formatCurrency(data.aweekDepo)} />
                    </div>

                    <div className="bg-[#0B1229] p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">All Deposits</h2>
                            <input
                                type="text"
                                placeholder="Search by username or reference..."
                                className="bg-[#1a213b] text-white px-4 py-2 rounded-md outline-none w-64"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-white">
                                <thead className="text-xs uppercase bg-[#1a213b] text-gray-400">
                                <tr>
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Username</th>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Payment Ref</th>
                                    <th className="py-3 px-4">Initial Wallet</th>
                                    <th className="py-3 px-4">Final Wallet</th>
                                    <th className="py-3 px-4">Created At</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedDeposits.map((dep) => (
                                    <tr key={dep.id} className="border-b border-[#1a213b] hover:bg-[#1f293e]">
                                        <td className="py-2 px-4">{dep.id}</td>
                                        <td className="py-2 px-4">{dep.username}</td>
                                        <td className="py-2 px-4">{formatCurrency(dep.amount)}</td>
                                        <td className="py-2 px-4 text-xs break-all">{dep.payment_ref}</td>
                                        <td className="py-2 px-4">{formatCurrency(dep.iwallet)}</td>
                                        <td className="py-2 px-4">{formatCurrency(dep.fwallet)}</td>
                                        <td className="py-2 px-4">{dep.createdAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <p className="text-sm text-gray-400">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredDeposits.length)} of {filteredDeposits.length} entries
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className="px-3 py-1 bg-[#1a213b] rounded-md text-white disabled:opacity-40"
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="px-3 py-1 bg-[#1a213b] rounded-md text-white disabled:opacity-40"
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-[#0B1229] p-5 rounded-xl shadow-md">
        <p className="text-sm text-gray-400">{label}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
    </div>
);

export default DepositSummary;