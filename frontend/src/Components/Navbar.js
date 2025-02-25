// Importiere notwendige React-Module und Hooks
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    IconButton,
    Drawer,
    Box,
    Avatar,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../context/AuthContext"; // Authentifizierungskontext importieren
import nmicIcon from "../assets/iconNM.png"; // App-Logo
import SearchBar from "./Notes/SearchBar"; // Suchleiste
import { logoutUser } from "../api"; // Logout-Funktion importieren

// Navbar-Komponente mit Dark-Mode-Umschaltung und Suchleiste
const Navbar = ({ toggleDarkMode, darkMode, setSearchTerm, searchTerm }) => {
    const { user, setUser } = useAuth(); // Authentifizierten Benutzer abrufen

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();

    // Öffnet oder schließt das mobile Menü
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    // Funktion zum Abmelden des Benutzers
    const handleLogout = () => {
        logoutUser(); // Token löschen
        setUser(null); // Benutzerstatus zurücksetzen
        navigate("/login"); // Weiterleitung zur Login-Seite
    };

    // Seitenmenü für mobile Ansicht
    const drawer = (
        <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Avatar src={nmicIcon} sx={{ width: 200, height: 120, mx: "auto" }} />
                {user && <Typography variant="subtitle1" sx={{ mt: 1 }}>{user.email}</Typography>}
            </Box>
            <Divider />
            {user && (
                <Box sx={{ p: 2 }}>
                    <Button fullWidth variant="contained" color="secondary" onClick={() => { handleLogout(); handleDrawerToggle(); }}>
                        Abmelden
                    </Button>
                </Box>
            )}
        </Box>
    );

    // Klick-Handler für das Benutzer-Avatar-Icon
    const cli = () => {
        alert("Willkommen bei Nmic");
    };

    return (
        <>
            {/* Haupt-Navigationsleiste */}
            <AppBar position="static" color="primary" enableColorOnDark sx={{ width: "100%" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3, width: "100%" }}>
                    {/* Menü-Icon für mobile Ansicht */}
                    <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ display: { xs: "flex", sm: "none" } }}>
                        <MenuIcon /> 
                    </IconButton>

                    {/* Logo und Startseiten-Link */}
                    <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                        <img src={nmicIcon} alt="Logo" style={{ height: 80, width: 120, marginRight: 8 }} />
                    </Box>

                    {/* Suchleiste wird nur angezeigt, wenn ein Benutzer eingeloggt ist */}
                    {user && (
                        <Box sx={{
                            flexGrow: 1,
                            maxWidth: 600,
                            mx: 'auto', // Zentriert die Suchleiste horizontal
                            marginTop: '.3cm', // Abstand nach oben
                        }}>
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </Box>
                    )}

                    {/* Navigationsoptionen für eingeloggte Benutzer */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
                        {user && (
                            <>
                                {/* Logout-Button */}
                                <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "none", fontWeight: 500 }}>
                                    Logout
                                </Button>

                                {/* Benutzer-Avatar */}
                                <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40, ml: 2, cursor: "pointer" }} onClick={cli}>
                                    {user?.email?.charAt(0).toUpperCase()}
                                </Avatar>

                                {/* Button zum Hinzufügen einer neuen Notiz */}
                                <Button color="inherit" component={Link} to="/add-note" sx={{ textTransform: "none", fontWeight: 500 }}>
                                    Neue Notiz
                                </Button>
                            </>
                        )}

                        {/* Umschalter für Dark-/Light-Mode */}
                        <IconButton color="inherit" onClick={toggleDarkMode}>
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Seitliches Menü für mobile Geräte */}
            <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}>
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
