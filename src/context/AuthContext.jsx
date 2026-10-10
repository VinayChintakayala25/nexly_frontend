import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("nexly_token")
    );

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("nexly_user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const login = async (email, password) => {

        const response = await loginUser({
            email,
            password,
        });

        const receivedToken = response.token;

        if (!receivedToken) {
            throw new Error("Login token was not received");
        }

        localStorage.setItem(
            "nexly_token",
            receivedToken
        );

        setToken(receivedToken);

        /*
         * Decode the JWT payload.
         * This lets us read information such as
         * email, role and user ID if they are
         * included by the backend.
         */
        try {

            const payload = JSON.parse(
                atob(
                    receivedToken
                        .split(".")[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

            const loggedInUser = {
                id: payload.userId || payload.id || null,
                email: payload.sub || payload.email || email,
                role:
                    payload.role ||
                    payload.roles?.[0] ||
                    payload.authorities?.[0] ||
                    null,
            };

            localStorage.setItem(
                "nexly_user",
                JSON.stringify(loggedInUser)
            );

            setUser(loggedInUser);

            return loggedInUser;

        } catch (error) {

            console.error(
                "Unable to decode login token:",
                error
            );

            const fallbackUser = {
                email,
                role: null,
            };

            localStorage.setItem(
                "nexly_user",
                JSON.stringify(fallbackUser)
            );

            setUser(fallbackUser);

            return fallbackUser;
        }
    };

    const logout = () => {

        logoutUser();

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};