import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    Divider,
    Chip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const NoteCard = ({ note, expandedNoteIds, handleToggleContent, handleDelete, navigate }) => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [open, setOpen] = useState(false);

    const truncateContent = (content) => {
        return content?.length > 25 ? content.substring(0, 25) + "..." : content;
    };

    const handleImageClick = () => {
        setSelectedNote(note);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedNote(null);
    };

    return (
        <>
            <Card style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "box-shadow 0.3s ease",
                ":hover": {
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
            }}>
                {/* Image Grid */}
                {note.images?.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        padding: '8px',
                        paddingBottom: 0
                    }}>
                        {note.images.map((image, index) => (
                            <CardMedia
                                key={index}
                                component="img"
                                alt={`Note image ${index + 1}`}
                                image={image.url}
                                style={{
                                    width: 'calc(50% - 4px)',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    flexGrow: 1,
                                    cursor: 'pointer'
                                }}
                                onClick={handleImageClick}
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        ))}
                    </div>
                )}

                {/* Card Content */}
                <CardContent style={{ flex: 1 }}>
                    <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "10px" }}>
                        {note.title}
                    </Typography>

                    <Typography variant="body1" style={{ marginBottom: "10px" }}>
                        {note.content?.length <= 25 || expandedNoteIds.includes(note.id)
                            ? note.content
                            : truncateContent(note.content)}
                    </Typography>

                    {note.content?.length > 25 && (
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => handleToggleContent(note.id)}
                            style={{ padding: 0, marginBottom: "10px" }}
                        >
                            {expandedNoteIds.includes(note.id) ? "Show Less" : "Show More"}
                        </Button>
                    )}

                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: "10px" }}>
                        <strong>Tags:</strong> {note.tags?.join(", ") || "No tags available"}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        Created at: {new Date(note.createdAt).toLocaleString()}
                    </Typography>
                </CardContent>

                <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/edit-note/${note.id}`)}
                        style={{ marginRight: "10px" }}
                    >
                        Edit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(note.id)}>
                        Delete
                    </Button>
                </div>
            </Card>

            {/* Detail Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>
                    Note Details
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {selectedNote && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <img
                                    src={selectedNote.images[0]?.url}
                                    alt="Full size preview"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '60vh',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom>
                                    {selectedNote.title}
                                </Typography>

                                <Typography variant="body1" paragraph>
                                    {selectedNote.content}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle2" gutterBottom>
                                    Tags:
                                </Typography>
                                <div style={{ marginBottom: '16px' }}>
                                    {selectedNote.tags?.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}
                                </div>

                                <Typography variant="caption" color="text.secondary">
                                    Created at: {new Date(selectedNote.createdAt).toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NoteCard;