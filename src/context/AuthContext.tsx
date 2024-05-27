import * as React from "react";
import { getCookie } from "../helper/Cookies";

type Props = {
    children?: React.ReactNode;
};

type User = {
    role: "admin" | "viewer" | "";
    email: string;
};

type IAuthContext = {
    authenticated: User;
    setAuthenticated: (newState: User) => void;
};

const AuthContext = React.createContext<IAuthContext>({
    authenticated: {
        role: "",
        email: ""
    },
    setAuthenticated: () => {}
});

const AuthProvider = ({ children }: Props) => {
    // initialize with cookie
    const email = getCookie("email");
    const role = getCookie("role");

    // initialize context with cookie values
    const [authenticated, setAuthenticated] = React.useState({
        role: role as User["role"],
        email: email as User["email"]
    });

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
