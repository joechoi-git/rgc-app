import * as React from "react";
import { getCookie } from "../helper/Cookies";

type Props = {
    children?: React.ReactNode;
};

type User = {
    role: "admin" | "viewer" | "";
    username: string;
};

type IAuthContext = {
    authenticated: User;
    setAuthenticated: (newState: User) => void;
};

const AuthContext = React.createContext<IAuthContext>({
    authenticated: {
        role: "",
        username: ""
    },
    setAuthenticated: () => {}
});

const AuthProvider = ({ children }: Props) => {
    // initialize with cookie
    const username = getCookie("username");
    const role = getCookie("role");
    console.log("username", username, "role", role);

    //Initializing an auth state with false value (unauthenticated)
    const [authenticated, setAuthenticated] = React.useState({
        role: role as User["role"],
        username: username as User["username"]
    });

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
