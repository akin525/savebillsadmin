import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuthToken } from "../utils/auth";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useUser } from "@/context/UserContext";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { setAdmin, setUser } = useUser();

    useEffect(() => {
        const verifyTokenAndFetch = async () => {
            const token = getAuthToken();
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // Fetch dashboard user data
                const userRes = await fetch(`${baseUrl}dashboard`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const userData = await userRes.json();
                if (!userRes.ok || !userData.success) {
                    throw new Error(userData.message || "Unauthorized");
                }

                const userPayload = userData.data;

                setUser({
                    id: userPayload.id,
                    name: userPayload.name,
                    username: userPayload.username,
                    email: userPayload.email,
                    phone: userPayload.phone,
                    balance: userPayload.balance,
                    earning: userPayload.earning,
                    telegram_id: userPayload.telegram_id,
                    telegram_verified: userPayload.telegram_verified,
                    email_verified: userPayload.email_verified,
                    country: userPayload.country,
                    profile_photo_path: userPayload.profile_photo_path,
                    ref_code: userPayload.ref_code,
                    referral: userPayload.referral,
                    status: userPayload.status,
                    bep_address: userPayload.bep_address,
                    telegram_otp: userPayload.telegram_otp,
                    online: userPayload.online,
                    created_at: userPayload.created_at,
                    updated_at: userPayload.updated_at,
                });

                // Fetch admin financial stats
                const paylonyRes = await fetch("https://api.paylony.com/api/v1/wallet_balance", {
                    headers: {
                        Authorization: `Bearer sk_live_av30amcd3piinbfm48j0v8iv8sd5hm81rhqikjz`,
                        "Content-Type": "application/json",
                    },
                });
                const McdBalance = await fetch("https://reseller.mcd.5starcompany.com.ng/api/v1/my-balance", {
                    headers: {
                        Authorization: `Bearer ChBfBAKZXxBhVDM6Vta54LAjNHcpNSzAhUcgmxr274wUetwtgGbbOJ1Uv0HoQckSLK8o9VIs1YlUUzP6ONe7rpXY2W7hg2YlYxcO7fJOP8uUPe3SG8hVKUwbrkkgmX4piw2yipJbY6R1tK5MyIFZYn`,
                        "Content-Type": "application/json",
                    },
                });

                const paylonyData = await paylonyRes.json();
                const mcdDatat=await McdBalance.json();

                setAdmin({
                    ...userPayload,
                    paylonybalance: paylonyData?.data?.balance ?? 0,
                    paylonypendingbalance: paylonyData?.data?.pending ?? 0,
                    pendingtransaction: userPayload.pendingtransaction,
                    dataprofit: userPayload.dataprofit,
                    allcharges: userPayload.allcharges,
                    todaypurchase: userPayload.todaypurchase,
                    todaydeposit: userPayload.todaydeposit,
                    noti: userPayload.noti,
                    mcdcom: userPayload.mcdcom,
                    wallet: userPayload.wallet,
                    totalbill: userPayload.totalbill,
                    totaldeposit: userPayload.totaldeposit,
                    allock: userPayload.allock,
                    users: userPayload.users,
                    newusers: userPayload.newusers,
                    id: userPayload.id,
                    username: userPayload.username,
                    email: userPayload.email,
                    mcdbalance:mcdDatat.data.wallet ?? 0,
                    mcdcom: mcdDatat.data.commission ?? 0,

                });

                setIsValid(true);
            } catch (error: any) {
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                toast.error(error.message || "Session expired. Please login again.");
                navigate("/login");
            }
        };

        verifyTokenAndFetch();
    }, [navigate, setUser, setAdmin]);

    if (isValid === null) {
        return (
            <div className="min-h-screen text-white flex bg-[#050B1E]">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader setSidebarOpen={setSidebarOpen} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
