import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAuthToken } from "@/utils/auth.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";

const TransactionDetails = () => {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = getAuthToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetch(`${baseUrl}findpurchase`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((res) => res.json())
            .then((data) => {
                setBill(data.bill);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading bill:", err);
                setLoading(false);
            });
    }, [id]);

    const handleAction = (action) => {
        fetch(`${baseUrl}pending/${id}/${action}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => alert(`${action} completed: ${JSON.stringify(data)}`))
            .catch((err) => alert(`Error performing ${action}`));
    };

    if (loading) return <p className="text-center text-white mt-10">Loading...</p>;
    if (!bill) return <p className="text-center text-white mt-10">No transaction found</p>;

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

                <div className="max-w-4xl mx-auto mt-10 p-8 bg-[#0F172A] shadow-xl rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6 border-b border-slate-600 pb-2">Transaction Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-2">
                            <p><span className="font-semibold text-gray-300">ID:</span> {bill.id}</p>
                            <p><span className="font-semibold text-gray-300">Username:</span> {bill.username}</p>
                            <p><span className="font-semibold text-gray-300">Plan:</span> {bill.plan || "N/A"}</p>
                            <p><span className="font-semibold text-gray-300">Amount:</span> ₦{bill.amount}</p>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-semibold text-gray-300">Phone:</span> {bill.phone}</p>
                            <p><span className="font-semibold text-gray-300">Ref ID:</span> {bill.refid}</p>
                            <p><span className="font-semibold text-gray-300">Date:</span> {new Date(bill.date).toLocaleString()}</p>
                            <p>
                                <span className="font-semibold text-gray-300">Status:</span>{" "}
                                <span className={`font-semibold ${bill.result === "0" ? "text-yellow-400" : "text-green-400"}`}>
                                    {bill.result === "0" ? "Pending" : "Completed"}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <button
                                onClick={() => handleAction("reverse-money")}
                                className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg"
                            >
                                Reverse Money
                            </button>
                            <button
                                onClick={() => handleAction("mark-success")}
                                className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg"
                            >
                                Mark as Success
                            </button>
                            <button
                                onClick={() => handleAction("mark-reversed")}
                                className="bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg"
                            >
                                Mark as Reversed
                            </button>
                            <button
                                onClick={() => handleAction("reprocess")}
                                className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
                            >
                                Reprocess
                            </button>
                            <button
                                onClick={() => handleAction("revalidate")}
                                className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg col-span-2 md:col-span-1"
                            >
                                Revalidate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;
