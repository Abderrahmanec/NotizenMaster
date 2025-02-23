import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Avatar,
    Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../context/AuthContext";
import nmicIcon from '../assets/nmic.ico';
import SearchBar from "./Notes/SearchBar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { searchNotes, getNotes } from "../api";

const Navbar = ({ toggleDarkMode, darkMode }) => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    // Drawer content for mobile view
    const drawer = (
        <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Avatar src={nmicIcon} sx={{ width: 60, height: 60, mx: 'auto' }} />
                {user && <Typography variant="subtitle1" sx={{ mt: 1 }}>{user.email}</Typography>}
            </Box>
            <Divider />

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        logout();
                        handleDrawerToggle();
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar position="static" color="primary" enableColorOnDark>
                <Toolbar sx={{ gap: 2 }}>
                    {/* Mobile Menu Button */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleDrawerToggle}
                        sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Brand Logo */}
                    <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
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
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/add-note"
                            sx={{ textTransform: 'none', fontWeight: 500 }}
                        >
                            New Note
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/display"
                            sx={{ textTransform: 'none', fontWeight: 500 }}
                        >
                            My Notes
                        </Button>
                        <IconButton
                            color="inherit"
                            onClick={toggleDarkMode}
                            sx={{ ml: 1 }}
                        >
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <Avatar
                            sx={{
                                bgcolor: 'secondary.main',
                                width: 40,
                                height: 40,
                                ml: 2,
                                cursor: 'pointer'
                            }}
                            onClick={logout}
                        >
                            {user?.email?.charAt(0).toUpperCase()}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                        bgcolor: darkMode ? 'background.default' : 'background.paper'
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;