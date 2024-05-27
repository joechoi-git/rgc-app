// import { createContext, ReactNode, useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    children?: React.ReactNode;
};

type IAuthContext = {
    authenticated: boolean;
    setAuthenticated: (newState: boolean) => void;
};

const initialValue = {
    authenticated: false,
    setAuthenticated: () => {}
};

const AuthContext = React.createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
    //Initializing an auth state with false value (unauthenticated)
    const [authenticated, setAuthenticated] = React.useState(initialValue.authenticated);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
