import * as React from "react";
import { useNavigate } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../context/AuthContext";
import { deleteCookie } from "../helper/Cookies";

export default function Sidebar() {
    const { setAuthenticated } = React.useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = () => {
        deleteCookie("email");
        deleteCookie("role");

        setAuthenticated({
            role: "",
            email: ""
        });

        navigate("/");
    };

    return (
        <React.Fragment>
            {/*}
            <ListSubheader component="div" inset>
                Welcome Admin
            </ListSubheader>
            {*/}
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Log Out" onClick={handleLogout} />
            </ListItemButton>
        </React.Fragment>
    );
}
