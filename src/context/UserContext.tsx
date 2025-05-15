import { createContext, useContext, useState, ReactNode } from "react";

// Updated interface to match your API response
interface AdminStats {
  id: number;
  username: string;
  email: string;
  wallet: number;
  totalbill: number;
  totaldeposit: number;
  allock: number;
  users: number;
  newusers: number;
  paylonybalance: number;
  paylonypendingbalance: number;
  pendingtransaction: number;
  dataprofit: number;
  allcharges: number;
  todaypurchase: number;
  todaydeposit: number;
  noti: string;
  mcdbalance: number;
  mcdcom: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  balance: string;
  earning: string;
  telegram_id: string;
  telegram_verified: 1 | 0;
  email_verified: 1 | 0;
  country: string;
  profile_photo_path: string | null;
  ref_code: string;
  referral: string;
  status: string;
  bep_address: string | null;
  telegram_otp?: string;
  online?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  admin: AdminStats | null;
  setAdmin: (admin: AdminStats) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminStats | null>(null);

  return (
      <UserContext.Provider value={{ user, setUser, admin, setAdmin }}>
        {children}
      </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
