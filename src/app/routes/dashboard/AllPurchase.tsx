import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";

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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedServerRes, setSelectedServerRes] = useState<string | null>(null);
    const itemsPerPage = 10;
    const token = getAuthToken();

    const formatCurrency = (value: number | string) => `₦${parseFloat(value.toString()).toLocaleString()}`;

    useEffect(() => {
        const fetchPurchases = async () => {
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
                } else {
                    toast.error("Failed to fetch purchase summary");
                }
            } catch (error: any) {
                toast.error(error.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    if (loading) {
        return (
            <div className="text-white text-center py-10">
                <span className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full inline-block" />
                <p>Loading purchase summary...</p>
            </div>
        );
    }

    if (!data) {
        return <div className="text-red-500 text-center">No data available.</div>;
    }

    const filteredPurchases = data.all.filter((entry) =>
        entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.refid.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.id - a.id);

    const paginatedPurchases = filteredPurchases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

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
                    <h1 className="text-3xl font-bold mb-8">Purchase Summary</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                        <SummaryCard label="Total Purchase" value={formatCurrency(data.sumbill)} />
                        <SummaryCard label="Today" value={formatCurrency(data.todaybill)} />
                        <SummaryCard label="Yesterday" value={formatCurrency(data.yesterdaybill)} />
                        <SummaryCard label="2 Days Ago" value={formatCurrency(data.twodaybill)} />
                        <SummaryCard label="3 Days Ago" value={formatCurrency(data.threedaybill)} />
                        <SummaryCard label="4 Days Ago" value={formatCurrency(data.fourdaybill)} />
                        <SummaryCard label="A Week Ago" value={formatCurrency(data.aweekbill)} />
                    </div>

                    <div className="bg-[#0B1229] p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">All Purchases</h2>
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
                                    <th className="py-3 px-4">Plan</th>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Phone</th>
                                    <th className="py-3 px-4">Ref ID</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Created At</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedPurchases.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        className="border-b border-[#1a213b] hover:bg-[#1f293e] cursor-pointer"
                                        onClick={() => setSelectedServerRes(entry.server_res)}
                                    >
                                        <td className="py-2 px-4">{entry.id}</td>
                                        <td className="py-2 px-4">{entry.username}</td>
                                        <td className="py-2 px-4">{entry.plan}</td>
                                        <td className="py-2 px-4">{formatCurrency(entry.amount)}</td>
                                        <td className="py-2 px-4">{entry.phone}</td>
                                        <td className="py-2 px-4 break-all text-xs">{entry.refid}</td>
                                        <td className="py-2 px-4">
                                            {entry.result === "1" ? (
                                                <span className="text-green-400 font-medium">Success</span>
                                            ) : (
                                                <span className="text-yellow-400 font-medium">Pending</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4">{entry.createdAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <p className="text-sm text-gray-400">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredPurchases.length)} of {filteredPurchases.length} entries
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

                    {selectedServerRes && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                            <div className="bg-[#0B1229] p-6 rounded-xl shadow-lg max-w-md w-full text-white relative">
                                <h2 className="text-lg font-semibold mb-4">Server Response</h2>
                                <pre
                                    className="bg-[#1a213b] p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
  {(() => {
      try {
          return JSON.stringify(JSON.parse(selectedServerRes || "{}"), null, 2);
      } catch {
          return selectedServerRes || "No server response available.";
      }
  })()}
</pre>

                                <button
                                    onClick={() => setSelectedServerRes(null)}
                                    className="absolute top-3 right-4 text-gray-300 hover:text-white text-xl"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({label, value}: { label: string; value: string }) => (
    <div className="bg-[#0B1229] p-5 rounded-xl shadow-md">
        <p className="text-sm text-gray-400">{label}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
    </div>
);

export default PurchaseSummary;
