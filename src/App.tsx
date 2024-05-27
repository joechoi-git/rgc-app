import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Link: <Link to="/">Dashboard</Link>
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
