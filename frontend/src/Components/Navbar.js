import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Switch, IconButton, Drawer, List, ListItem, ListItemText, Box, Grid, Card, CardContent } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Burger menu icon
import { useAuth } from "../AuthContext";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false); // Drawer visibility
  const [notes, setNotes] = useState([]);

  // Toggle Drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fetching user notes (from backend)
  useEffect(() => {
    if (user) {
      const fetchNotes = async () => {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) return;

        try {
          const response = await fetch("http://localhost:8080/notes", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setNotes(data); // Set fetched notes
          } else {
            console.error("Failed to fetch notes");
          }
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };

      fetchNotes();
    }
  }, [user]); // Only run when `user` changes (e.g., login/logout)

  // Drawer content
  const drawer = (
    <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Add Note Button */}
      <Button variant="contained" color="primary" component={Link} to="/add-note" sx={{ margin: 2 }}>
        Add Note
      </Button>
      <List>
        {user ? (
          <>
            <ListItem button component={Link} to="/display">
              <ListItemText primary="Display Notes" />
            </ListItem>
            <ListItem button onClick={logout} component={Link} to="/logout">
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
          {/* Burger Menu Icon */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ display: { xs: "block", sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Notes Dashboard
          </Typography>
          <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Improves performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" }, // Only show Drawer on mobile
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Navbar - only visible on larger screens */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/add-note">
              Add Note
            </Button>
            <Button color="inherit" component={Link} to="/display">
              Display Notes
            </Button>
            <Button color="inherit" onClick={logout} component={Link} to="/logout">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Box>

      {/* Welcome Message and Notes */}
      {user ? (
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4">Welcome to the Notes Dashboard</Typography>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Manage your notes efficiently with this beautiful dashboard.
          </Typography>

          {/* Display Notes */}
          <Grid container spacing={3}>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">{note.title}</Typography>
                      <Typography variant="body2">{note.content}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">You don't have any notes yet!</Typography>
            )}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">
            Please login to see your notes and manage them effectively.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Navbar;
