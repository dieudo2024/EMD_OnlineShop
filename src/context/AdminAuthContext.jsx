import { createContext, useContext, useMemo, useState } from "react";
import { sanitizeString } from "../utils/security";

const STORAGE_KEY = "adminAuth";
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  const login = (passcode) => {
    const expected = import.meta.env.VITE_ADMIN_PASSCODE || "letmein";
    const safeInput = sanitizeString(passcode, { maxLength: 128 });
    const success = safeInput === expected;
    if (success) {
      window.localStorage.setItem(STORAGE_KEY, "1");
      setIsAuthed(true);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
      setIsAuthed(false);
    }
    return success;
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setIsAuthed(false);
  };

  const value = useMemo(
    () => ({ isAuthed, login, logout }),
    [isAuthed]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
