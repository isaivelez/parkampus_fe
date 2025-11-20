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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);

    const setUser = (userData: User | null) => {
        setUserState(userData);
        if (userData) {
            // Guardar usuario en AsyncStorage
            AsyncStorage.setItem("user", JSON.stringify(userData));
        } else {
            // Eliminar usuario de AsyncStorage
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
                isAuthenticated: user !== null,
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
