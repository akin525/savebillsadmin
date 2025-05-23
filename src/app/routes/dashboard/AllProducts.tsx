import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/auth.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { toast } from "react-toastify";

type Product = {
    id: number;
    plan_id: string;
    network: string;
    plan: string;
    code: string;
    amount: string;
    tamount: string;
    ramount: string;
    status: number;
    createdAt: string;
    updatedAt: string;
};

const AllProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const token = getAuthToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetch(`${baseUrl}product`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    setProducts(data.product);
                    setFilteredProducts(data.product);
                } else {
                    setError("Failed to load products");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Something went wrong");
                setLoading(false);
            });
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearch(term);
        setCurrentPage(1);
        setFilteredProducts(
            products.filter(
                (p) =>
                    p.plan.toLowerCase().includes(term) ||
                    p.network.toLowerCase().includes(term) ||
                    p.code.toLowerCase().includes(term)
            )
        );
    };

    const toggleStatus = async (id: number) => {
        setTogglingId(id);
        try {
            const response = await fetch(`${baseUrl}switch`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (data.success === true) {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === id ? { ...product, ...data.product } : product
                    )
                );
                toast.success("Status switched successfully");
            } else {
                toast.error("Failed to switch status: " + data.message);
            }
        } catch (error) {
            console.error("Error switching status:", error);
            toast.error("Something went wrong while switching status.");
        } finally {
            setTogglingId(null);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct({ ...product });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingProduct) {
            setProducts((prev) =>
                prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
            );
            setShowModal(false);
        }
    };

    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
                    <h1 className="text-3xl font-bold mb-4 text-center">All Data Products</h1>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by name, code, network..."
                        className="w-full p-2 rounded-md text-black mb-6"
                    />

                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currentProducts.map((product) => (
                            <div key={product.id} className="bg-[#0F172A] p-5 rounded-xl shadow-lg">
                                <h2 className="text-xl font-semibold text-blue-400">{product.plan}</h2>
                                <p className="text-sm text-gray-300">
                                    Network: {product.network.toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-300">Code: {product.code}</p>
                                <p className="text-sm text-green-400">Amount: ₦{product.amount}</p>
                                <p className="text-sm text-gray-400">Retail: ₦{product.ramount}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Updated: {product.updatedAt}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        className="bg-yellow-600 hover:bg-yellow-700 text-sm py-1 px-3 rounded"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span>{product.status === 1 ? "Active" : "Inactive"}</span>
                                        <div
                                            onClick={() => toggleStatus(product.id)}
                                            className={`w-10 h-5 flex items-center bg-gray-700 rounded-full p-1 cursor-pointer transition ${
                                                product.status === 1 ? "bg-green-600" : "bg-gray-600"
                                            }`}
                                        >
                                            {togglingId === product.id ? (
                                                <div className="text-xs text-white animate-pulse mx-auto">...</div>
                                            ) : (
                                                <div
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                                                        product.status === 1 ? "translate-x-5" : ""
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => setCurrentPage(num)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === num ? "bg-blue-600" : "bg-gray-700"
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && editingProduct && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E293B] p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-center text-white">Edit Product</h3>
                        {["plan_id", "network", "plan", "code", "amount", "tamount", "ramount"].map(
                            (field) => (
                                <div key={field} className="mb-4">
                                    <label className="block text-sm mb-1 capitalize text-gray-300">
                                        {field}:
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 bg-[#0F172A] text-white rounded placeholder-gray-400"
                                        placeholder={field}
                                        value={(editingProduct as any)[field]}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                [field]: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            )
                        )}
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProductsPage;
