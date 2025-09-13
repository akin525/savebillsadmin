import {useState, useEffect, ChangeEvent, JSX} from "react";
import axios, { AxiosResponse } from "axios";
import swal from "sweetalert";
import {
    CreditCard,
    Building2,
    User,
    DollarSign,
    Shield,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowRight,
    Lock
} from "lucide-react";
import {getAuthToken} from "@/utils/auth.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";

// Type definitions
interface Bank {
    name: string;
    code: string;
}

interface ApiResponse {
    success: string;
    message: string;
    data?: any;
}

interface VerifyResponse {
    status: string;
    responseBody: {
        accountName: string;
    };
    message: string;
}

interface DashboardResponse {
    id: string;
}

export default function Withdraw(): JSX.Element {
    // State with proper typing
    const [network, setNetwork] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [po, setPo] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [refId, setRefId] = useState<string>("");
    const [banks, setBanks] = useState<Bank[]>([]);
    const [amount, setAmount] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // API endpoints
    const API_ENDPOINTS = {
        banks: "https://admin.server.savebills.com.ng/api/auth/bank",
        dashboard: "https://admin.server.savebills.com.ng/api/auth/dashboard",
        verify: "https://admin.server.savebills.com.ng/api/auth/verify",
        withdraw: "https://admin.server.savebills.com.ng/api/auth/with"
    };

    const token = getAuthToken();

    useEffect(() => {
        setRefId("withdraw" + Math.floor((Math.random() * 1000000000) + 1));
        fetchBanks();
        fetchUserData();
    }, []);

    const fetchBanks = async (): Promise<void> => {
        try {
            const response: AxiosResponse<{ data: Bank[] }> = await axios.get(
                API_ENDPOINTS.banks,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setBanks(response.data.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch banks. Please try again.");
            console.error("Error fetching banks:", err);
        }
    };

    const fetchUserData = async (): Promise<void> => {
        try {
            const response: AxiosResponse<DashboardResponse> = await axios.get(
                API_ENDPOINTS.dashboard,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUserId(response.data.id);
            setError("");
        } catch (err) {
            setError("Failed to fetch user data.");
            console.error("Error fetching user data:", err);
        }
    };

    const handleVerifyAccount = async (accountNumber: string): Promise<void> => {
        if (!network || accountNumber.length < 10) return;

        setIsVerifying(true);
        setName("Validating Account Number.......");
        setIsVerified(false);

        try {
            const response: AxiosResponse<VerifyResponse> = await axios.post(
                API_ENDPOINTS.verify,
                {
                    bank: network,
                    number: accountNumber
                }
            );

            if (response.data.status === "0") {
                setError("Invalid account number or bank selection");
                setName("");
            } else {
                setName(response.data.responseBody.accountName);
                setIsVerified(true);
                setError("");
            }
        } catch (err) {
            setError("Account verification failed. Please check your input.");
            setName("");
            console.error("Verification error:", err);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { id, value } = e.target;

        switch (id) {
            case "network":
                setNetwork(value);
                const selectedOption = e.target as HTMLSelectElement;
                setPo(selectedOption.options[selectedOption.selectedIndex].text);
                setName("");
                setIsVerified(false);
                break;
            case "number":
                setNumber(value);
                if (value.length >= 10) {
                    handleVerifyAccount(value);
                } else {
                    setName("");
                    setIsVerified(false);
                }
                break;
            case "amount":
                setAmount(value);
                break;
        }
    };

    const handleSubmit = async (): Promise<void> => {
        if (!isVerified || !amount || !number || !network) {
            setError("Please fill all fields and verify account details");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response: AxiosResponse<ApiResponse> = await axios.post(
                API_ENDPOINTS.withdraw,
                {
                    userId,
                    bank: po,
                    code: network,
                    name,
                    amount,
                    number,
                    refid: refId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success === "0") {
                await swal({
                    title: "Transaction Failed",
                    text: response.data.message,
                    icon: "error",
                    buttons: {
                        confirm: {
                            text: "OK",
                            value: true,
                            visible: true,
                            className: "btn-danger",
                            closeModal: true
                        }
                    }
                });
                window.location.href = "/withdraw";
            } else {
                await swal({
                    title: "Withdrawal Successful",
                    text: response.data.message,
                    icon: "success",
                    buttons: {
                        confirm: {
                            text: "Continue",
                            value: true,
                            visible: true,
                            className: "btn-success",
                            closeModal: true
                        }
                    }
                });
                window.location.href = "/dashboard";
            }
        } catch (err) {
            setError("Transaction failed. Please try again.");
            console.error("Withdrawal error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = isVerified && amount && number && network && !isLoading;

    return (
        <div className="min-h-screen flex bg-[#050B1E] text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen}/>

                <main className="flex-1 overflow-y-auto p-6 sm:p-10">
                    <div className="min-h-screen bg-gradient-to-br from-[#050B1E] via-[#0A1128] to-[#0F1629] py-8">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div
                                    className="inline-flex items-center justify-center w-16 h-16 bg-blue-900/30 border border-blue-500/20 rounded-full mb-4">
                                    <CreditCard className="w-8 h-8 text-blue-400"/>
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    Secure Withdrawal
                                </h1>
                                <p className="text-gray-400">Transfer funds safely to your bank account</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Form */}
                                <div className="lg:col-span-2">
                                    <div
                                        className="bg-gradient-to-br from-[#0F1629] to-[#1A2332] rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
                                        {/* Form Header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-semibold text-white">Withdrawal Details</h2>
                                                <div
                                                    className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                                                    <Lock className="w-4 h-4 text-blue-100"/>
                                                    <span className="text-blue-100 text-sm font-medium">Secure</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Error Display */}
                                        {error && (
                                            <div
                                                className="mx-6 mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0"/>
                                                <p className="text-red-300 text-sm">{error}</p>
                                            </div>
                                        )}

                                        {/* Form Content */}
                                        <div className="p-6 space-y-6">
                                            {/* Bank Selection */}
                                            <div className="space-y-2">
                                                <label
                                                    className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                                    <Building2 className="w-4 h-4 text-blue-400"/>
                                                    Select Bank
                                                </label>
                                                <select
                                                    id="network"
                                                    value={network}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    required
                                                >
                                                    <option value="" className="bg-gray-800">Choose your bank</option>
                                                    {banks.map((bank) => (
                                                        <option key={bank.code} value={bank.code}
                                                                className="bg-gray-800">
                                                            {bank.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Account Number */}
                                            <div className="space-y-2">
                                                <label
                                                    className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                                    <CreditCard className="w-4 h-4 text-blue-400"/>
                                                    Account Number
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="number"
                                                        value={number}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter 10-digit account number"
                                                        className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                        maxLength={10}
                                                    />
                                                    {isVerifying && (
                                                        <div
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin"/>
                                                        </div>
                                                    )}
                                                    {isVerified && (
                                                        <div
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <CheckCircle className="w-5 h-5 text-green-400"/>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Account Name */}
                                            <div className="space-y-2">
                                                <label
                                                    className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                                    <User className="w-4 h-4 text-blue-400"/>
                                                    Account Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    readOnly
                                                    placeholder="Account name will appear here"
                                                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                                                        isVerified
                                                            ? 'border-green-500/50 bg-green-900/20 text-green-300'
                                                            : 'border-gray-600 bg-gray-800/30 text-gray-400 placeholder-gray-500'
                                                    }`}
                                                />
                                            </div>

                                            {/* Amount */}
                                            <div className="space-y-2">
                                                <label
                                                    className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                                    <DollarSign className="w-4 h-4 text-blue-400"/>
                                                    Amount (₦)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="amount"
                                                    value={amount}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter amount to withdraw"
                                                    className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    min="100"
                                                    required
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={!isFormValid}
                                                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                                                    isFormValid
                                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
                                                        : 'bg-gray-700 cursor-not-allowed opacity-50'
                                                }`}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin"/>
                                                        Processing Withdrawal...
                                                    </>
                                                ) : (
                                                    <>
                                                        Process Withdrawal
                                                        <ArrowRight className="w-5 h-5"/>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Security Info */}
                                    <div
                                        className="bg-gradient-to-br from-[#0F1629] to-[#1A2332] rounded-2xl shadow-xl border border-gray-700/50 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className="w-10 h-10 bg-green-900/30 border border-green-500/20 rounded-full flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-green-400"/>
                                            </div>
                                            <h3 className="font-semibold text-white">Security Features</h3>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-300">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400"/>
                                                Bank-grade encryption
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400"/>
                                                Real-time verification
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400"/>
                                                Instant processing
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400"/>
                                                24/7 monitoring
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Transaction Info */}
                                    <div
                                        className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl border border-blue-500/20 p-6">
                                        <h3 className="font-semibold text-white mb-4">Transaction Details</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Reference ID:</span>
                                                <span
                                                    className="font-mono text-xs bg-gray-800/50 border border-gray-600/50 text-gray-300 px-2 py-1 rounded">
                                            {refId.slice(0, 12)}...
                                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Processing Time:</span>
                                                <span className="text-white">Instant</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Transaction Fee:</span>
                                                <span className="text-white">₦0.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Help */}
                                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-600/50 p-6">
                                        <h3 className="font-semibold text-white mb-2">Need Help?</h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Contact our support team if you encounter any issues.
                                        </p>
                                        <button className="w-full py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-200 text-sm font-medium border border-gray-600/50">
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
