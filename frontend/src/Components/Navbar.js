// Navbar.js
import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Button, Avatar, Typography, Drawer, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SearchBar from "./Notes/SearchBar";  // Assuming you have this component
import { Link } from "react-router-dom";
import nmicIcon from '../assets/nmic.ico';

const Navbar = ({ toggleDarkMode, darkMode, searchTerm, setSearchTerm, logout, user }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
        <AppBar position="static" color="primary" enableColorOnDark>
            <Toolbar sx={{ gap: 2 }}>
                {/* Mobile Menu Button */}
                <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ display: { xs: "flex", sm: "none" }, mr: 1 }}>
                    <MenuIcon />
                </IconButton>

                {/* Brand Logo */}
                <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                    <img src={nmicIcon} alt="Logo" style={{ height: 40, width: 40, marginRight: 8 }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                        Notes App
                    </Typography>
                </Box>

                {/* Search Bar */}
                <Box sx={{ flexGrow: 1, maxWidth: 600, mx: { xs: 0, sm: 3 } }}>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </Box>

                {/* Desktop Navigation */}
                <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
                    <Button color="inherit" component={Link} to="/add-note" sx={{ textTransform: "none", fontWeight: 500 }}>
                        New Note
                    </Button>
                    <Button color="inherit" component={Link} to="/display" sx={{ textTransform: "none", fontWeight: 500 }}>
                        My Notes
                    </Button>
                    <IconButton color="inherit" onClick={toggleDarkMode} sx={{ ml: 1 }}>
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40, ml: 2, cursor: "pointer" }} onClick={logout}>
                        {user?.email?.charAt(0).toUpperCase()}
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
