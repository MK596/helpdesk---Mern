import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userFromStorage = localStorage.getItem("user");
        if (userFromStorage) {
            setUser(JSON.parse(userFromStorage));
        }
        setIsLoading(false);
    }, []);

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post("/api/users", userData);
            setIsLoading(false);
            return response.data;
        } catch (err) {
            setIsLoading(false);
            const message =
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                err.toString();
            setError(message);
            throw new Error(message);
        }
    };

    const login = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post("/api/users/login", userData);
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data);
            }
            setIsLoading(false);
            return response.data;
        } catch (err) {
            setIsLoading(false);
            const message =
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                err.toString();
            setError(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
