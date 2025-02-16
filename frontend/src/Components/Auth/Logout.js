// Importiere das Logout-Icon von MUI
import { Logout as LogoutIcon } from "@mui/icons-material";

// Importiere die `useNavigate`-Hook von React Router für das Routing
import { useNavigate } from "react-router-dom";

// Logout-Komponente
function Logout() {
    // `useNavigate` für die Navigation nach dem Logout
    const navigate = useNavigate();

    // Funktion, die beim Klicken auf den Logout-Button ausgeführt wird
    const handleLogout = () => {
        // Entfernt das Token aus dem lokalen Speicher
        localStorage.removeItem("token");

        // Sendet eine Logout-Anfrage an den Server
        fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Token im Header der Anfrage senden
            }
        });

        // Navigiert den Benutzer zur Login-Seite nach erfolgreichem Logout
        navigate("/login");
    };

    return (
        // Button, der die Logout-Funktion ausführt
        <button onClick={handleLogout}>
            <LogoutIcon /> Logout
        </button>
    );
}

export default Logout;
