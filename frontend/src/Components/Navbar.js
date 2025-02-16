import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import nmicIcon from '../assets/nmic.ico';
import SearchBar from "./Notes/SearchBar";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");  // ✅ Add search state

  // Toggle Drawer (Burger menu)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer content for mobile view
  const drawer = (
    <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column" }}>
      <Button variant="contained" color="primary" component={Link} to="/add-note" sx={{ margin: 2 }}>
        Add Note
      </Button>
      <List>
        {user ? (
          <>
            <ListItem button component={Link} to="/display">
              <ListItemText primary="Display Notes" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Hamburger Icon (Mobile Menu) */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Home Icon */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img src={nmicIcon} alt="Home Icon" style={{ width: "50px", height: "50px", marginLeft: "-23px", marginBottom: "0.003%" }} />
            </Link>
          </Typography>

          {/* 🔹 Search Bar */}
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Dark Mode Toggle Button */}
          <Button color="inherit" onClick={toggleDarkMode}>
            Toggle Dark/Light Mode
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
