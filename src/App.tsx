import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"; // Link: <Link to="/">Dashboard</Link>
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";

const PrivateRoutes = () => {
    const { authenticated } = React.useContext(AuthContext);
    if (authenticated.role === "") return <Navigate to="/login" replace />;
    return <Outlet />;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<PrivateRoutes />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
