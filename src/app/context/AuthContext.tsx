import React, { createContext, useContext, useState, ReactNode } from "react";
import { USERS, User } from "../data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    const user = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, message: "Login successful" };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
