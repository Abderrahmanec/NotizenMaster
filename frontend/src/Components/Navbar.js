import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Drawer,
    Box,
    Avatar,
    Divider,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../context/AuthContext";
import nmicIcon from "../assets/iconNM.png";
import SearchBar from "./Notes/SearchBar";
import { logoutUser } from "../api";

const Navbar = ({ toggleDarkMode, darkMode, setSearchTerm, searchTerm }) => {
    const { user, setUser } = useAuth();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleLogout = () => {
        logoutUser();
        setUser(null);
        navigate("/login");
    };

    const cli = () => {
        alert("Willkommen bei Nmic");
    };

    // Detect if screen width is less than 600px (mobile)
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <>
            <AppBar position="static" color="primary" enableColorOnDark sx={{ width: "100%" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3, width: "100%" }}>
                    {/* Mobile Menu Icon */}
                    <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ display: { xs: "flex", sm: "none" } }}>
                        <MenuIcon />
                    </IconButton>

                    {/* Logo */}
                    <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                        <img src={nmicIcon} alt="Logo" style={{ height: 80, width: 120, marginRight: 8 }} />
                    </Box>

                    {/* Hide Search Bar on Mobile */}
                    {!isMobile && user && (
                        <Box sx={{ flexGrow: 1, maxWidth: 600, mx: "auto", marginTop: ".3cm" }}>
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </Box>
                    )}

                    {/* Right-side Buttons */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {user && (
                            <>
                                {/* Show "Neue Notiz" button ONLY on mobile */}
                                {isMobile && (
                                    <Button color="inherit" component={Link} to="/add-note" sx={{ textTransform: "none", fontWeight: 500 }}>
                                        Neue Notiz
                                    </Button>
                                )}

                                {/* Logout Button (only visible on desktop) */}
                                <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "none", fontWeight: 500, display: { xs: "none", sm: "flex" } }}>
                                    Logout
                                </Button>

                                {/* Avatar (only visible on desktop) */}
                                <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40, ml: 2, cursor: "pointer", display: { xs: "none", sm: "flex" } }} onClick={cli}>
                                    {user?.username?.charAt(0).toUpperCase()}
                                </Avatar>

                                {/* Hide Dark Mode Toggle on Mobile */}
                                {!isMobile && (
                                    <IconButton color="inherit" onClick={toggleDarkMode}>
                                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                                    </IconButton>
                                )}
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer Menu */}
            <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}>
                <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ p: 2, textAlign: "center" }}>
                        <Avatar src={nmicIcon} sx={{ width: 200, height: 120, mx: "auto" }} />
                        {user && <Typography variant="subtitle1" sx={{ mt: 1 }}>{user.email}</Typography>}
                    </Box>
                    <Divider />
                    {user && (
                        <Box sx={{ p: 2 }}>
                            {/* Add New Note Button in Mobile Menu */}
                            <Button fullWidth variant="contained" color="primary" component={Link} to="/add-note" onClick={handleDrawerToggle}>
                                Neue Notiz
                            </Button>

                            {/* Logout Button */}
                            <Button fullWidth variant="contained" color="secondary" onClick={() => { handleLogout(); handleDrawerToggle(); }} sx={{ mt: 1 }}>
                                Abmelden
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;