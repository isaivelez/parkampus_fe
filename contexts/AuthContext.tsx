/**
 * Contexto de Autenticación
 * Maneja el estado global del usuario autenticado
 */

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
    user: User | null;
    token: string | null;
    setUser: (user: User | null, token?: string) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        // Cargar usuario y token guardados al iniciar
        const loadStorageData = async () => {
            try {
                const [storedUser, storedToken] = await Promise.all([
                    AsyncStorage.getItem("user"),
                    AsyncStorage.getItem("authToken")
                ]);

                if (storedUser && storedToken) {
                    setUserState(JSON.parse(storedUser));
                    setTokenState(storedToken);
                }
            } catch (error) {
                console.error("Error cargando datos de sesión:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStorageData();
    }, []);

    const setUser = (userData: User | null, authToken?: string) => {
        setUserState(userData);

        if (userData && authToken) {
            setTokenState(authToken);
            AsyncStorage.setItem("user", JSON.stringify(userData));
            AsyncStorage.setItem("authToken", authToken);
        } else {
            setTokenState(null);
            AsyncStorage.removeItem("user");
            AsyncStorage.removeItem("authToken");
        }
    };

    const logout = async () => {
        setUserState(null);
        setTokenState(null);
        await Promise.all([
            AsyncStorage.removeItem("user"),
            AsyncStorage.removeItem("authToken")
        ]);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                setUser,
                logout,
                isAuthenticated: !!user && !!token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
