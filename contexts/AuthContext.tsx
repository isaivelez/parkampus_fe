/**
 * Contexto de Autenticación
 * Maneja el estado global del usuario autenticado
 */

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        // Cargar usuario guardado al iniciar
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUserState(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error cargando usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const setUser = (userData: User | null) => {
        setUserState(userData);
        if (userData) {
            AsyncStorage.setItem("user", JSON.stringify(userData));
        } else {
            AsyncStorage.removeItem("user");
        }
    };

    const logout = async () => {
        setUserState(null);
        await AsyncStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                isAuthenticated: !!user,
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
