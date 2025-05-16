import { useState } from "react";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";
import { toast } from "react-toastify";

// Define type for bill object
interface Bill {
    id: string;
    username: string;
    plan?: string;
    amount: number;
    phone: string;
    refid: string;
    date: string;
    result: string;
    server_res?: string;
}

const ValidateMcd = () => {
    const [refid, setRefid] = useState("");
    const [bill, setBill] = useState<Bill | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [actionResponse, setActionResponse] = useState<string | null>(null);

    const baseUrl = "https://reseller.mcd.5starcompany.com.ng/api/v1/my-transaction";
    // const token = getAuthToken();

    const handleSearch = async () => {
        setLoading(true);
        setBill(null);
        setMessage(null);
        setActionResponse(null);

        try {
            const response = await fetch(`${baseUrl}/${refid}`, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ChBfBAKZXxBhVDM6Vta54LAjNHcpNSzAhUcgmxr274wUetwtgGbbOJ1Uv0HoQckSLK8o9VIs1YlUUzP6ONe7rpXY2W7hg2YlYxcO7fJOP8uUPe3SG8hVKUwbrkkgmX4piw2yipJbY6R1tK5MyIFZYn',
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            setBill(data.bill);
            setMessage(data.samson || null);
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string) => {
        if (!bill) return;
        try {
            setLoading(true);
            setActionResponse(null);

            const res = await fetch(`${baseUrl}pending/${bill.id}/${action}`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ChBfBAKZXxBhVDM6Vta54LAjNHcpNSzAhUcgmxr274wUetwtgGbbOJ1Uv0HoQckSLK8o9VIs1YlUUzP6ONe7rpXY2W7hg2YlYxcO7fJOP8uUPe3SG8hVKUwbrkkgmX4piw2yipJbY6R1tK5MyIFZYn',
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();

            if (typeof data.server_res === "string") {
                try {
                    setActionResponse(JSON.stringify(JSON.parse(data.server_res), null, 2));
                } catch {
                    setActionResponse(data.server_res);
                }
            } else if (data.server_res) {
                setActionResponse(JSON.stringify(data.server_res, null, 2));
            } else {
                setActionResponse(JSON.stringify(data, null, 2));
            }
        } catch {
            setActionResponse(`Error performing ${action}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="max-w-5xl mx-auto mt-12 p-10 bg-gray-900 rounded-2xl shadow-xl">
                    <h1 className="text-4xl font-bold mb-8 border-b border-gray-700 pb-4">
                        Search Transaction
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <input
                            type="text"
                            placeholder="Enter Reference ID"
                            value={refid}
                            onChange={(e) => setRefid(e.target.value)}
                            className="flex-grow rounded-lg bg-gray-800 border border-gray-700 px-6 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={!refid || loading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 px-8 py-3 rounded-lg font-semibold transition"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {message && (
                        <p className="mb-8 text-sm text-gray-400 italic">
                            <strong>Message:</strong> {message}
                        </p>
                    )}

                    {bill && (
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Left - Transaction Info */}
                            <div className="bg-gray-800 rounded-xl p-8 shadow-lg space-y-5 border border-gray-700">
                                <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">
                                    Transaction Details
                                </h2>
                                <div className="space-y-3 text-gray-300 text-lg">
                                    <p>
                                        <span className="font-medium text-gray-100">ID:</span> {bill.id}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Username:</span> {bill.username}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Plan:</span> {bill.plan || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Amount:</span>{" "}
                                        <span className="text-green-400 font-semibold">₦{bill.amount}</span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Phone:</span> {bill.phone}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Ref ID:</span> {bill.refid}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Date:</span>{" "}
                                        {new Date(bill.date).toLocaleString()}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Status:</span>{" "}
                                        <span
                                            className={`font-semibold ${
                                                bill.result === "0" ? "text-yellow-400" : "text-green-400"
                                            }`}
                                        >
                      {bill.result === "0" ? "Pending" : "Completed"}
                    </span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-100">Server Response:</span>{" "}
                                        <span className="break-words">{bill.server_res}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right - Actions & Response */}
                            <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 flex flex-col justify-between">
                                <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">Actions</h2>

                                {bill.result === "0" ? (
                                    <>
                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => handleAction("reverse-money")}
                                                disabled={loading}
                                                className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-3 font-semibold transition"
                                            >
                                                Reverse Money
                                            </button>
                                            <button
                                                onClick={() => handleAction("mark-success")}
                                                disabled={loading}
                                                className="w-full bg-green-600 hover:bg-green-700 rounded-lg py-3 font-semibold transition"
                                            >
                                                Mark as Success
                                            </button>
                                            <button
                                                onClick={() => handleAction("mark-reversed")}
                                                disabled={loading}
                                                className="w-full bg-yellow-600 hover:bg-yellow-700 rounded-lg py-3 font-semibold transition"
                                            >
                                                Mark as Reversed
                                            </button>
                                            <button
                                                onClick={() => handleAction("reprocess")}
                                                disabled={loading}
                                                className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-semibold transition"
                                            >
                                                Reprocess
                                            </button>
                                            <button
                                                onClick={() => handleAction("revalidate")}
                                                disabled={loading}
                                                className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-3 font-semibold transition"
                                            >
                                                Revalidate
                                            </button>
                                        </div>

                                        {actionResponse && (
                                            <pre className="mt-6 p-4 bg-gray-900 rounded-lg border border-green-600 text-green-400 font-mono text-sm max-h-48 overflow-auto whitespace-pre-wrap">
                        <strong>Action Response:</strong>
                                                {"\n"}
                                                {actionResponse}
                      </pre>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-400 text-center mt-6">No actions available</p>
                                )}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ValidateMcd;
