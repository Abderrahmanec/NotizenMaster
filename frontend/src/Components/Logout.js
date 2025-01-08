import { Logout as LogoutIcon } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");

        fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        navigate("/login");
    };

    return (
        <button onClick={handleLogout}>
            <LogoutIcon /> Logout
        </button>
    );
}

export default Logout;
