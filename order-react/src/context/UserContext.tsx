import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  printer?: any;
  // Add other fields as needed
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isCashier: (user: User) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function isCashier(user: User): boolean {
  return !!user.printer;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser, isCashier }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
