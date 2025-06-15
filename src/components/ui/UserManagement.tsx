import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { getAuthToken } from "@/utils/auth";   // ⚠️ update if your path differs

// ──────────────────── Interfaces ────────────────────
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
    username?: string;          // added
    address?: string;
    [key: string]: any;
}
interface UserManagementProps {
    userdetail?: UserDetail | null;
    allbill?: Bill[];
    alldeposit?: Deposit[];
}
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// ──────────────────── API ENDPOINTS ────────────────────
const CREDIT_URL     = `${baseUrl}credit`;
const DEBIT_URL      = `${baseUrl}debit`;
const UPDATE_URL     = `${baseUrl}update`;
const REGENERATE_URL = `${baseUrl}newaccount1`;
const SENDMAIL_URL   = `${baseUrl}sendmail`; // <‑‑ adjust if different
// ──────────────────────────────────────────────────────

const UserManagement = ({
                            userdetail = {
                                username: "",
                                name: "",
                                phone: "",
                                email: "",
                                address: ""
                            },
                            allbill = [],
                            alldeposit = [],
                        }: UserManagementProps) => {

    const [activeTab, setActiveTab] = useState<"bills" | "deposits">("bills");
    const [showEdit, setShowEdit] = useState(false);
    const [showCredit, setShowCredit] = useState(false);
    const [showDebit, setShowDebit] = useState(false);
    const [showMail, setShowMail] = useState(false);

    const [userForm, setUserForm] = useState<UserDetail>({ ...userdetail });
    const [creditAmount, setCreditAmount] = useState("");
    const [creditRefId, setCreditRefId] = useState("");
    const [debitAmount, setDebitAmount] = useState("");
    const [debitRefId, setDebitRefId] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = getAuthToken();
    const generateRefId = () => {
        const random = Math.random().toString(36).substring(2, 10).toUpperCase();
        return `REF-${Date.now().toString().slice(-6)}-${random}`;
    };

    const handleUserChange = (e: ChangeEvent<HTMLInputElement>) =>
        setUserForm({ ...userForm, [e.target.name]: e.target.value });

    const postWithAuth = (url: string, body: any) =>
        axios.post(url, body, { headers: { Authorization: `Bearer ${token}` } });

    const onEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await postWithAuth(UPDATE_URL, { ...userForm });
            swal(data.status === "0" ? "Fail" : "Success", data.message, data.status === "0" ? "error" : "success");
            if (data.status !== "0") setShowEdit(false);
        } catch {
            swal("Error", "Could not update user.", "error");
        } finally {
            setLoading(false);
        }
    };

    const onMailSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await postWithAuth(SENDMAIL_URL, {
                username: userForm.username,
                message: emailMessage,
            });
            toast[data.success === false ? "error" : "success"](data.message);
            if (data.success !== true) setShowMail(false);
        } catch {
            toast.error("Failed to send email.");
        } finally {
            setLoading(false);
        }
    };

    const regenerateAccount = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(REGENERATE_URL, { username: userForm.username });
            toast[data.status === "0" ? "error" : "success"](data.message);
        } catch {
            toast.error("Unable to regenerate account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-7xl mx-auto bg-gray-900 text-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">
                User Management – {userForm?.name || "Unknown User"}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">
                <ActionBtn text="Edit User" color="blue" onClick={() => setShowEdit(true)} />
                <ActionBtn text="Credit" color="green" onClick={() => setShowCredit(true)} />
                <ActionBtn text="Debit" color="red" onClick={() => setShowDebit(true)} />
                <ActionBtn text="Send Email" color="purple" onClick={() => setShowMail(true)} />
                <ActionBtn text="Regenerate Account" color="yellow" onClick={regenerateAccount} />
            </div>

            <TabNav
                counts={{ bills: allbill.length, deposits: alldeposit.length }}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === "bills" ? <BillsTable bills={allbill} /> : <DepositsTable deposits={alldeposit} />}

            {showEdit && (
                <Modal title="Edit User" onClose={() => setShowEdit(false)} loading={loading}>
                    <form onSubmit={onEditSubmit} className="space-y-4">
                        {["name", "phone", "email", "address"].map((field) => (
                            <Input
                                key={field}
                                label={field}
                                value={userForm[field] || ""}
                                onChange={handleUserChange}
                            />
                        ))}
                        <button className="btn-primary" type="submit">Save</button>
                    </form>
                </Modal>
            )}

            {showCredit && (
                <Modal title="Credit User" onClose={() => setShowCredit(false)} loading={loading}>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);
                            try {
                                const { data } = await postWithAuth(CREDIT_URL, {
                                    username: userForm.username,
                                    amount: creditAmount,
                                    refid: creditRefId,
                                });
                                swal(data.status === "0" ? "Fail" : "Success", data.message, data.status === "0" ? "error" : "success");
                                if (data.success === true) {
                                    setShowCredit(false);
                                    window.location.reload();
                                }
                            } catch {
                                swal("Error", "Credit failed.", "error");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="space-y-4"
                    >
                        <Input
                            label="Amount"
                            type="number"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(e.target.value)}
                            min={1}
                        />
                        <div className="flex gap-2">
                            <Input
                                label="Ref ID"
                                value={creditRefId}
                                onChange={(e) => setCreditRefId(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setCreditRefId(generateRefId())}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded text-sm"
                            >
                                Generate
                            </button>
                        </div>
                        <button className="btn-green w-full mt-2" type="submit">Credit</button>
                    </form>
                </Modal>
            )}

            {showDebit && (
                <Modal title="Debit User" onClose={() => setShowDebit(false)} loading={loading}>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);
                            try {
                                const { data } = await postWithAuth(DEBIT_URL, {
                                    username: userForm.username,
                                    amount: debitAmount,
                                    refid: debitRefId,
                                });
                                swal(data.status === "0" ? "Fail" : "Success", data.message, data.status === "0" ? "error" : "success");
                                if (data.success === true) {
                                    setShowDebit(false);
                                    window.location.reload();
                                }
                            } catch {
                                swal("Error", "Debit failed.", "error");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="space-y-4"
                    >
                        <Input
                            label="Amount"
                            type="number"
                            value={debitAmount}
                            onChange={(e) => setDebitAmount(e.target.value)}
                            min={1}
                        />
                        <div className="flex gap-2">
                            <Input
                                label="Ref ID"
                                value={debitRefId}
                                onChange={(e) => setDebitRefId(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setDebitRefId(generateRefId())}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded text-sm"
                            >
                                Generate
                            </button>
                        </div>
                        <button className="btn-red w-full mt-2" type="submit">Debit</button>
                    </form>
                </Modal>
            )}

            {showMail && (
                <Modal title="Send Email" onClose={() => setShowMail(false)} loading={loading}>
                    <form onSubmit={onMailSubmit} className="space-y-4">
                        <textarea
                            className="input w-full h-32"
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            placeholder="Your message"
                            required
                        />
                        <button className="btn-purple" type="submit">Send</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};


export default UserManagement;

/*──────────────────── Small helper components ───────────────────*/
const Input = ({
                   label, type = "text", value, onChange, min
               }: {
    label: string; type?: string; value: any; onChange: (e: ChangeEvent<any>) => void; min?: number;
}) => (
    <div>
        <input
            type={type}
            name={label}
            value={value}
            onChange={onChange}
            placeholder={label}
            min={min}
            required
            className="input w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded"
        />
    </div>
);

const ActionBtn = ({ text, color, onClick }: { text: string; color: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded`}
        type="button"
    >
        {text}
    </button>
);

const TabNav = ({
                    counts, active, onChange
                }: {
    counts: { bills: number; deposits: number };
    active: "bills" | "deposits";
    onChange: (tab: "bills" | "deposits") => void;
}) => (
    <div className="mb-4 border-b border-gray-700">
        {(["bills", "deposits"] as const).map((tab) => (
            <button
                key={tab}
                onClick={() => onChange(tab)}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                    active === tab
                        ? "border-indigo-500 text-indigo-400"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                }`}
            >
                {tab === "bills" ? "Bills" : "Deposits"} ({counts[tab]})
            </button>
        ))}
    </div>
);

const BillsTable = ({ bills }: { bills: Bill[] }) => (
    <table className="min-w-full border border-gray-700 bg-gray-800 rounded overflow-hidden">
        <thead className="bg-gray-700">
        <tr>
            {["ID", "Plan", "Amount", "Phone", "Ref ID", "Date", "Result"].map((h) => (
                <th key={h} className="border px-3 py-2">{h}</th>
            ))}
        </tr>
        </thead>
        <tbody>
        {bills.map((b) => (
            <tr key={b.id} className="hover:bg-gray-700">
                <td className="border px-3 py-2">{b.id}</td>
                <td className="border px-3 py-2">{b.plan}</td>
                <td className="border px-3 py-2">{b.amount}</td>
                <td className="border px-3 py-2">{b.phone}</td>
                <td className="border px-3 py-2">{b.refid}</td>
                <td className="border px-3 py-2">{new Date(b.date).toLocaleDateString()}</td>
                <td className="border px-3 py-2">{b.result === "1" ? "Success" : "Failed"}</td>
            </tr>
        ))}
        </tbody>
    </table>
);

const DepositsTable = ({ deposits }: { deposits: Deposit[] }) => (
    <table className="min-w-full border border-gray-700 bg-gray-800 rounded overflow-hidden">
        <thead className="bg-gray-700">
        <tr>
            {["ID", "Ref", "Amount", "Init Wallet", "Final Wallet", "Narration", "Date", "Status"].map((h) => (
                <th key={h} className="border px-3 py-2">{h}</th>
            ))}
        </tr>
        </thead>
        <tbody>
        {deposits.map((d) => (
            <tr key={d.id} className="hover:bg-gray-700">
                <td className="border px-3 py-2">{d.id}</td>
                <td className="border px-3 py-2">{d.payment_ref}</td>
                <td className="border px-3 py-2">{d.amount}</td>
                <td className="border px-3 py-2">{d.iwallet}</td>
                <td className="border px-3 py-2">{d.fwallet}</td>
                <td className="border px-3 py-2">{d.narration}</td>
                <td className="border px-3 py-2">{new Date(d.date).toLocaleDateString()}</td>
                <td className="border px-3 py-2">{d.status === "1" ? "Success" : "Pending"}</td>
            </tr>
        ))}
        </tbody>
    </table>
);

const Modal = ({
                   title,
                   children,
                   onClose,
                   loading,
               }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    loading?: boolean;
}) => (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={onClose}>
        <div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-gray-100"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button className="text-gray-400 hover:text-white text-xl" onClick={onClose}>
                    &times;
                </button>
            </div>
            {children}
            {loading && <p className="text-yellow-400 mt-3 text-center text-sm">Processing...</p>}
        </div>
    </div>
);
