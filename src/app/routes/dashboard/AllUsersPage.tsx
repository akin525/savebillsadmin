import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { getAuthToken } from "@/utils/auth";
import { useNavigate } from "react-router";

type User = {
    id: number;
    name: string;
    phone: string;
    username: string;
    email: string;
    wallet: string;
    account_number: string;
    account_name: string;
    gender: string;
    is_verify: string;
    cashback: number;
    reward: number;
    createdAt: string;
};

const USERS_PER_PAGE = 10;

const AllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<"all" | "reseller">("all");

    const token = getAuthToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${baseUrl}alluser`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUsers(data.users);
                    setFilteredUsers(data.users);
                } else {
                    setError("Failed to load users.");
                }
            })
            .catch(() => setError("Error fetching users."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        filterAndSearch();
    }, [users, filter, searchTerm]);

    const filterAndSearch = () => {
        let updated = [...users];
        if (filter === "reseller") {
            updated = updated.filter((user) => Number(user.wallet) >= 100);
        }
        if (searchTerm.trim() !== "") {
            updated = updated.filter((user) =>
                [user.username, user.name, user.phone].some((field) =>
                    field?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        setFilteredUsers(updated);
        setCurrentPage(1);
    };

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    if (loading) return <div className="flex items-center justify-center h-screen text-gray-300">Loading users...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-[#050B1E] via-[#0F172A] to-[#050B1E] text-white">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <div className="max-w-7xl mx-auto mt-10 p-6 space-y-8">
                    {/* Header and Search */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h2 className="text-4xl font-bold">All Users</h2>
                            <p className="text-gray-400 mt-1">Manage, search, and filter all registered users.</p>
                        </div>
                        <input
                            type="text"
                            placeholder="Search username, name, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-[#1E293B] text-white placeholder-gray-500 w-full md:w-80 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Users"
                            value={users.length}
                            gradient="from-blue-700 to-blue-900"
                            active={filter === "all"}
                            onClick={() => setFilter("all")}
                        />
                        <StatCard
                            title="Total Resellers"
                            value={users.filter(u => Number(u.wallet) >= 100).length}
                            gradient="from-green-700 to-green-900"
                            active={filter === "reseller"}
                            onClick={() => setFilter("reseller")}
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto bg-[#0F172A] rounded-2xl shadow-2xl">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="text-gray-400 text-left border-b border-gray-600">
                                <th className="py-4 px-4">#</th>
                                <th className="py-4 px-4">Username</th>
                                <th className="py-4 px-4">Name</th>
                                <th className="py-4 px-4">Phone</th>
                                <th className="py-4 px-4">Wallet</th>
                                <th className="py-4 px-4">Verified</th>
                                <th className="py-4 px-4">Joined</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    onClick={() => navigate(`/userdetails/${user.username}`)}
                                    className="border-b border-gray-700 hover:bg-[#162338] cursor-pointer"
                                >
                                    <td className="py-4 px-4">{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                                    <td className="py-4 px-4">{user.username}</td>
                                    <td className="py-4 px-4">{user.name}</td>
                                    <td className="py-4 px-4">{user.phone}</td>
                                    <td className="py-4 px-4">₦{user.wallet}</td>
                                    <td className="py-4 px-4">
                                        {user.is_verify === "true" ? (
                                            <span className="text-green-400">Yes</span>
                                        ) : (
                                            <span className="text-yellow-400">No</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-600"
                        >
                            Previous
                        </button>
                        <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-600"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable StatCard component
const StatCard = ({ title, value, gradient, active, onClick }: { title: string; value: number; gradient: string; active: boolean; onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer bg-gradient-to-br ${gradient} p-5 rounded-2xl shadow-xl hover:scale-105 transform transition ${active ? "ring-4 ring-opacity-50 ring-white" : ""}`}
    >
        <h4 className="text-sm text-gray-300">{title}</h4>
        <p className="text-4xl font-bold mt-1">{value}</p>
    </div>
);

export default AllUsers;
