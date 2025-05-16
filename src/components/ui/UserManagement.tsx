import { useState, ChangeEvent, FormEvent } from "react";

interface Bill {
    id: number;
    plan: string;
    amount: number;
    phone: string;
    refid: string;
    date: string;
    result: string;
}

interface Deposit {
    id: number;
    payment_ref: string;
    amount: number;
    iwallet: number;
    fwallet: number;
    narration: string;
    date: string;
    status: string;
}

interface UserDetail {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    [key: string]: any;
}

interface UserManagementProps {
    userdetail?: UserDetail | null;
    allbill?: Bill[];
    alldeposit?: Deposit[];
}

const UserManagement = ({
                            userdetail = {},
                            allbill = [],
                            alldeposit = []
                        }: UserManagementProps) => {
    const [activeTab, setActiveTab] = useState<"bills" | "deposits">("bills");
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [showDebitModal, setShowDebitModal] = useState(false);
    const [showMailModal, setShowMailModal] = useState(false);

    const [userForm, setUserForm] = useState<UserDetail>(userdetail ?? {});
    const [creditAmount, setCreditAmount] = useState<string>("");
    const [debitAmount, setDebitAmount] = useState<string>("");
    const [emailMessage, setEmailMessage] = useState<string>("");

    const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditUserSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert("User details updated");
        setShowEditUserModal(false);
    };

    const handleCreditSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert(`Credited amount: ${creditAmount}`);
        setShowCreditModal(false);
    };

    const handleDebitSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert(`Debited amount: ${debitAmount}`);
        setShowDebitModal(false);
    };

    const handleSendMailSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert(`Mail sent with message: ${emailMessage}`);
        setShowMailModal(false);
    };

    return (
        <div className="p-4 max-w-7xl mx-auto bg-gray-900 text-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">
                User Management - {userForm?.name || "Unknown User"}
            </h1>

            {/* Buttons */}
            <div className="space-x-3 mb-4">
                <button onClick={() => setShowEditUserModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit User Details</button>
                <button onClick={() => setShowCreditModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Credit User</button>
                <button onClick={() => setShowDebitModal(true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Debit User</button>
                <button onClick={() => setShowMailModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Send Email</button>
            </div>

            {/* Tabs */}
            <div className="mb-4 border-b border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("bills")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "bills" ? "border-indigo-500 text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"}`}
                    >
                        Bills ({allbill.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("deposits")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "deposits" ? "border-indigo-500 text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"}`}
                    >
                        Deposits ({alldeposit.length})
                    </button>
                </nav>
            </div>

            {/* Bills Table */}
            {activeTab === "bills" && (
                <table className="min-w-full border border-gray-700 bg-gray-800 rounded overflow-hidden">
                    <thead className="bg-gray-700">
                    <tr>
                        <th className="border px-3 py-2 text-left">ID</th>
                        <th className="border px-3 py-2 text-left">Plan</th>
                        <th className="border px-3 py-2 text-left">Amount</th>
                        <th className="border px-3 py-2 text-left">Phone</th>
                        <th className="border px-3 py-2 text-left">Ref ID</th>
                        <th className="border px-3 py-2 text-left">Date</th>
                        <th className="border px-3 py-2 text-left">Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allbill?.map((bill) => (
                        <tr key={bill.id} className="hover:bg-gray-700">
                            <td className="border px-3 py-2">{bill.id}</td>
                            <td className="border px-3 py-2">{bill.plan}</td>
                            <td className="border px-3 py-2">{bill.amount}</td>
                            <td className="border px-3 py-2">{bill.phone}</td>
                            <td className="border px-3 py-2">{bill.refid}</td>
                            <td className="border px-3 py-2">{new Date(bill.date).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{bill.result === "1" ? "Success" : "Failed"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {activeTab === "deposits" && (
                <table className="min-w-full border border-gray-700 bg-gray-800 rounded overflow-hidden">
                    <thead className="bg-gray-700">
                    <tr>
                        <th className="border px-3 py-2 text-left">ID</th>
                        <th className="border px-3 py-2 text-left">Payment Ref</th>
                        <th className="border px-3 py-2 text-left">Amount</th>
                        <th className="border px-3 py-2 text-left">Initial Wallet</th>
                        <th className="border px-3 py-2 text-left">Final Wallet</th>
                        <th className="border px-3 py-2 text-left">Narration</th>
                        <th className="border px-3 py-2 text-left">Date</th>
                        <th className="border px-3 py-2 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {alldeposit?.map((dep) => (
                        <tr key={dep.id} className="hover:bg-gray-700">
                            <td className="border px-3 py-2">{dep.id}</td>
                            <td className="border px-3 py-2">{dep.payment_ref}</td>
                            <td className="border px-3 py-2">{dep.amount}</td>
                            <td className="border px-3 py-2">{dep.iwallet}</td>
                            <td className="border px-3 py-2">{dep.fwallet}</td>
                            <td className="border px-3 py-2">{dep.narration}</td>
                            <td className="border px-3 py-2">{new Date(dep.date).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{dep.status === "1" ? "Success" : "Pending"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Modals */}
            {showEditUserModal && (
                <Modal onClose={() => setShowEditUserModal(false)} title="Edit User Details">
                    <form onSubmit={handleEditUserSubmit} className="space-y-4">
                        <input type="text" name="name" value={userForm?.name || ""} onChange={handleUserChange} placeholder="Name" required className="input" />
                        <input type="text" name="phone" value={userForm?.phone || ""} onChange={handleUserChange} placeholder="Phone" required className="input" />
                        <input type="email" name="email" value={userForm?.email || ""} onChange={handleUserChange} placeholder="Email" required className="input" />
                        <input type="text" name="address" value={userForm?.address || ""} onChange={handleUserChange} placeholder="Address" className="input" />
                        <button type="submit" className="btn-primary">Save</button>
                    </form>
                </Modal>
            )}

            {showCreditModal && (
                <Modal onClose={() => setShowCreditModal(false)} title="Credit User">
                    <form onSubmit={handleCreditSubmit} className="space-y-4">
                        <input type="number" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} placeholder="Amount" min={1} required className="input" />
                        <button type="submit" className="btn-green">Credit</button>
                    </form>
                </Modal>
            )}

            {showDebitModal && (
                <Modal onClose={() => setShowDebitModal(false)} title="Debit User">
                    <form onSubmit={handleDebitSubmit} className="space-y-4">
                        <input type="number" value={debitAmount} onChange={(e) => setDebitAmount(e.target.value)} placeholder="Amount" min={1} required className="input" />
                        <button type="submit" className="btn-red">Debit</button>
                    </form>
                </Modal>
            )}

            {showMailModal && (
                <Modal onClose={() => setShowMailModal(false)} title="Send Email">
                    <form onSubmit={handleSendMailSubmit} className="space-y-4">
                        <textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} placeholder="Email Message" rows={5} required className="input" />
                        <button type="submit" className="btn-purple">Send</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// Reusable Modal component
const Modal = ({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
        <div className="bg-gray-800 text-gray-100 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            {children}
        </div>
    </div>
);


export default UserManagement;
