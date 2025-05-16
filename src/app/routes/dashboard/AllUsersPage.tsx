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
                if (data.success === true) {
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

    if (loading) return <p className="text-center text-white mt-20">Loading users...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="min-h-screen flex bg-[#050B1E] text-white">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <div className="max-w-7xl mx-auto mt-10 p-6 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold">All Users</h2>
                            <p className="text-gray-400">Manage, search, and filter all registered users.</p>
                        </div>
                        <input
                            type="text"
                            placeholder="Search username, name, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 w-full md:w-72"
                        />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div
                            onClick={() => setFilter("all")}
                            className={`cursor-pointer bg-gradient-to-br from-blue-700 to-blue-900 p-5 rounded-xl shadow-lg ${filter === "all" ? "ring-2 ring-blue-400" : ""}`}
                        >
                            <h4 className="text-sm text-gray-300">Total Users</h4>
                            <p className="text-3xl font-bold mt-1">{users.length}</p>
                        </div>
                        <div
                            onClick={() => setFilter("reseller")}
                            className={`cursor-pointer bg-gradient-to-br from-green-700 to-green-900 p-5 rounded-xl shadow-lg ${filter === "reseller" ? "ring-2 ring-green-400" : ""}`}
                        >
                            <h4 className="text-sm text-gray-300">Total Resellers</h4>
                            <p className="text-3xl font-bold mt-1">{users.filter(u => Number(u.wallet) >= 100).length}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto bg-[#0F172A] rounded-2xl shadow-xl">
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
                                    onClick={() => navigate(`/userdetails/${user.id}`)}
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
                            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
