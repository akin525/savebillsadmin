import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAuthToken } from "@/utils/auth";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { UserCog,  RefreshCw} from "lucide-react";
import UserManagement from "@/components/ui/UserManagement.tsx";

interface UserProfile {
    id: number;
    name: string;
    phone: string;
    username: string;
    email: string;
    wallet: string;
    bank: string;
    bank1: string;
    account_number: string;
    account_number1: string;
    account_name: string;
    account_name1: string;
    gender: string;
    dob: string;
    apikey: string;
    address: string;
    is_verify: string;
    point: number;
    cashback: number;
    reward: number;
    createdAt: string;
    updatedAt: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function ManageUserPage() {
    const { id } = useParams();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userDeposit, setUserDeposit] = useState<number>(0);
    const [userBill, setUserBill] = useState<number>(0);
    const [userCharge, setUserCharge] = useState<number>(0);
    const [safelock, setSafelock] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [allbill, setAllbill] = useState([]);
    const [alldeposit, setAlldeposit] = useState([]);

    const fetchUserData = async () => {
        setLoading(true);
        setError("");

        try {
            const token = getAuthToken();
            const res = await fetch(`${baseUrl}users`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: id }),
            });

            if (!res.ok) throw new Error("Failed to fetch user details");
            const result = await res.json();

            setUser(result.userdetail);
            setAllbill(result.allbill);
            setAlldeposit(result.alldeposit);

            setUserDeposit(Number(result.userdeposit ?? 0));
            setUserBill(Number(result.userbill ?? 0));
            setUserCharge(Number(result.usercharge ?? 0));
            setSafelock(Number(result.safelock ?? 0));
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="p-8 space-y-8 max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                        <UserCog size={36} className="text-cyan-400" />
                        Manage User
                        <button
                            onClick={fetchUserData}
                            className="ml-auto flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-sm rounded-lg shadow transition"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </h1>

                    {loading ? (
                        <p className="text-gray-400 text-lg">Loading user details...</p>
                    ) : error ? (
                        <p className="text-red-500 text-lg font-semibold">{error}</p>
                    ) : user ? (
                        <div className="grid grid-cols-1  gap-10">
                            <section className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur rounded-3xl p-8 shadow-2xl border border-gray-700 xl:col-span-2 hover:shadow-cyan-500/20 transition">
                                <header className="flex items-center gap-4 mb-8">
                                    <UserCog size={32} className="text-cyan-400" />
                                    <h2 className="text-3xl font-bold">User Information</h2>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
                                    <UserInfoRow label="Full Name" value={user.name} />
                                    <UserInfoRow label="Username" value={`@${user.username}`} />
                                    <UserInfoRow label="Email" value={user.email} />
                                    <UserInfoRow label="Phone" value={user.phone} />
                                    <UserInfoRow label="Address" value={user.address} />
                                    <UserInfoRow label="Gender" value={user.gender} />
                                    <UserInfoRow label="Date of Birth" value={new Date(user.dob).toLocaleDateString()} />
                                    <UserInfoRow label="Wallet Balance" value={`₦${user.wallet}`} />
                                    <UserInfoRow label="Cashback" value={`₦${user.cashback}`} />
                                    <UserInfoRow label="Reward Points" value={`${user.reward}`} />
                                    <UserInfoRow label="Bank 1" value={user.bank} />
                                    <UserInfoRow label="Account Name 1" value={user.account_name} />
                                    <UserInfoRow label="Account Number 1" value={user.account_number} />
                                    <UserInfoRow label="Bank 2" value={user.bank1} />
                                    <UserInfoRow label="Account Name 2" value={user.account_name1} />
                                    <UserInfoRow label="Account Number 2" value={user.account_number1} />
                                    <UserInfoRow label="API Key" value={user.apikey} />

                                    <div className="flex items-center gap-3">
                                        <strong className="text-gray-400">Status:</strong>
                                        <span
                                            className={`px-4 py-1 rounded-full text-sm font-semibold ${
                                                user.is_verify === "true"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-red-600 text-white"
                                            }`}
                                        >
                                            {user.is_verify === "true" ? "Verified" : "Unverified"}
                                        </span>
                                    </div>

                                    <UserInfoRow label="Created At" value={new Date(user.createdAt).toLocaleDateString()} />
                                    <UserInfoRow label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString()} />
                                </div>

                                <section className="mt-10 bg-gray-800/80 rounded-2xl p-6 border border-gray-700">
                                    <h3 className="text-xl font-semibold mb-5 text-cyan-400">Financial Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <UserInfoRow label="Total Deposit" value={`₦${userDeposit.toLocaleString()}`} />
                                        <UserInfoRow label="Total Bill" value={`₦${userBill.toLocaleString()}`} />
                                        <UserInfoRow label="Total Charges" value={`₦${userCharge.toLocaleString()}`} />
                                        <UserInfoRow label="Safe Lock" value={`₦${safelock.toFixed(2)}`} />
                                    </div>
                                </section>
                            </section>

                            {/*<section className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur rounded-3xl p-8 shadow-2xl border border-gray-700 flex flex-col gap-6 hover:shadow-cyan-500/20 transition">*/}
                            {/*    <header className="flex items-center gap-4 mb-6">*/}
                            {/*        <ShieldCheck size={32} className="text-cyan-400" />*/}
                            {/*        <h2 className="text-3xl font-bold">Admin Actions</h2>*/}
                            {/*    </header>*/}

                            {/*    <div className="flex flex-col gap-4">*/}
                            {/*        <ActionButton icon={<CreditCard size={24} />} text="Credit User Balance" color="bg-green-600" />*/}
                            {/*        <ActionButton icon={<CreditCard size={24} />} text="Debit User Balance" color="bg-yellow-600" />*/}
                            {/*        <ActionButton icon={<RefreshCw size={24} />} text="Generate Account Number" color="bg-blue-600" />*/}
                            {/*        <ActionButton icon={<Mail size={24} />} text="Send Email" color="bg-indigo-600" />*/}
                            {/*        <ActionButton icon={<ShieldCheck size={24} />} text="Update User Details" color="bg-gray-600" />*/}
                            {/*        <ActionButton icon={<Ban size={24} />} text="Change Status" color="bg-red-600" />*/}
                            {/*    </div>*/}
                            {/*</section>*/}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-lg">User not found.</p>
                    )}
                </main>

                <UserManagement userdetail={user ?? undefined} allbill={allbill} alldeposit={alldeposit} />
            </div>
        </div>
    );
}

function UserInfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-gray-700 pb-3 last:border-none hover:bg-gray-800/40 rounded-lg px-3 transition">
            <span className="font-medium text-gray-400">{label}:</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}

// function ActionButton({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
//     return (
//         <button
//             className={`${color} flex items-center gap-4 justify-center rounded-2xl px-6 py-4 font-semibold transition duration-200 hover:scale-105 active:scale-95 shadow-lg`}
//             type="button"
//         >
//             <span className="text-white">{icon}</span>
//             <span className="text-lg">{text}</span>
//         </button>
//     );
// }
