import  { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import {getAuthToken} from "@/utils/auth.tsx";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const PendingPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const token = getAuthToken();

    useEffect(() => {
        fetch(`${baseUrl}pending`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const pending = data.all.filter((item: any) => item.result === "0");
                setPurchases(pending);
            })
            .catch((error) => {
                console.error("Error fetching pending purchases:", error);
            });
    }, []);


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
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Purchases</h2>

            {purchases.length === 0 ? (
                <div className="text-gray-500">No pending purchases found.</div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {purchases.map((purchase: any) => (
                        <div
                            key={purchase.id}
                            className="border rounded-xl p-4 shadow hover:shadow-lg cursor-pointer transition"
                            onClick={() => navigate(`/transaction/${purchase.id}`)}
                        >
                            <div className="text-sm text-gray-500">{purchase.date.split("T")[0]}</div>
                            <h3 className="font-bold text-lg mt-1">{purchase.plan}</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                <strong>Phone:</strong> {purchase.phone}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Amount:</strong> ₦{parseFloat(purchase.amount).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>User:</strong> {purchase.username}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 truncate">{purchase.refid}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
            </div>
        </div>
    );
};

export default PendingPurchases;
