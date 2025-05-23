import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAuthToken } from "@/utils/auth.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import {
    RotateCcw, CheckCircle, XCircle, Repeat, ShieldCheck
} from "lucide-react";

type Bill = {
    id: string;
    username: string;
    plan?: string;
    amount: number;
    phone: string;
    refid: string;
    date: string;
    result: string;
};

const TransactionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [bill, setBill] = useState<Bill | null>(null);
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
            .catch(() => {
                console.error("Error loading bill");
                setLoading(false);
            });
    }, [id]);

    const handleAction = (action: string) => {
        fetch(`${baseUrl}pending/${id}/${action}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => alert(`${action} completed: ${JSON.stringify(data)}`))
            .catch(() => alert(`Error performing ${action}`));
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

                <main className="flex-1 overflow-y-auto p-6 sm:p-10">
                    <div className="max-w-4xl mx-auto bg-[#0F172A] p-8 rounded-2xl border border-slate-700 shadow-lg">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Transaction Details</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-200">
                            <Detail label="Transaction ID" value={bill.id} />
                            <Detail label="Username" value={bill.username} />
                            <Detail label="Plan" value={bill.plan || "N/A"} />
                            <Detail label="Amount" value={`₦${bill.amount.toLocaleString()}`} />
                            <Detail label="Phone" value={bill.phone} />
                            <Detail label="Reference ID" value={bill.refid} />
                            <Detail label="Date" value={new Date(bill.date).toLocaleString()} />
                            <Detail
                                label="Status"
                                value={bill.result === "0" ? "Pending" : "Completed"}
                                color={bill.result === "0" ? "text-yellow-400" : "text-green-400"}
                            />
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-4">Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <ActionButton label="Reverse Money" onClick={() => handleAction("reverse-money")} color="bg-red-600" icon={<XCircle />} />
                                <ActionButton label="Mark as Success" onClick={() => handleAction("mark-success")} color="bg-green-600" icon={<CheckCircle />} />
                                <ActionButton label="Mark as Reversed" onClick={() => handleAction("mark-reversed")} color="bg-yellow-600" icon={<RotateCcw />} />
                                <ActionButton label="Reprocess" onClick={() => handleAction("reprocess")} color="bg-blue-600" icon={<Repeat />} />
                                <ActionButton label="Revalidate" onClick={() => handleAction("revalidate")} color="bg-purple-600" icon={<ShieldCheck />} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const Detail = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <p>
        <span className="block text-slate-400 font-medium">{label}</span>
        <span className={`text-base font-semibold ${color ?? "text-white"}`}>{value}</span>
    </p>
);

const ActionButton = ({
                          label,
                          onClick,
                          color,
                          icon
                      }: {
    label: string;
    onClick: () => void;
    color: string;
    icon: JSX.Element;
}) => (
    <button
        onClick={onClick}
        className={`${color} hover:opacity-90 transition-opacity text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md`}
    >
        {icon} {label}
    </button>
);

export default TransactionDetails;
