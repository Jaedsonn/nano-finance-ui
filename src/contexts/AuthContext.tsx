import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User, LoginResponse } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, age?: number) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
      try {
        const response = await api.get<{ user: User }>("/user/info");
        if (response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.debug(error);
      }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      if (response.data) {
        
        setUser(response.data.user);
        toast({
          title: "Bem-vindo!",
          description: `Olá, ${response.data.user.name}`,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, age?: number) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post<LoginResponse>("/auth/register", {
        name,
        email,
        password,
        age,
      });

      if (response.data) {
        setUser(response.data.user);
        toast({
          title: "Conta criada!",
          description: "Sua conta foi criada com sucesso.",
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      toast({
        title: "Até logo!",
        description: "Você foi desconectado.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
