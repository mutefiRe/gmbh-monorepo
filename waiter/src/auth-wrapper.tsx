import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useUser } from "./types/queries";
import { LoadingScreen } from "./ui/loading-screen";
import type { User } from "./types/models";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  isLoading: boolean;
  userId: string | null | undefined;
  eventId: string | null | undefined;
  token: string;
  user?: User;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [jwt, setJwt] = useLocalStorage<string>("gmbh-auth-jwt", "") || "";
  const decodedJwt = jwt ? JSON.parse(atob(jwt.split(".")[1])) : null;

  const userId = decodedJwt?.id;
  const eventId = decodedJwt?.eventId;

  const user = useUser(userId ?? "", { enabled: !!userId });

  if (user.isLoading) {
    return (
      <LoadingScreen
        title="Anmeldung wird geprüft"
        subtitle="Benutzerdaten werden geladen."
      />
    );
  }

  function logout() {
    setJwt("");
  }

  console.log(user?.data?.user);


  const auth: AuthContextType = {
    isLoading: user.isLoading,
    userId: userId,
    eventId: eventId,
    token: jwt,
    user: user?.data?.user,
    setToken: setJwt,
    logout,
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}


function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext, useAuth };
