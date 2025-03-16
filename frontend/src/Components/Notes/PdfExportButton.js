import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { extractToPdf } from "../../api";

// PdfExportButton-Komponente
const PdfExportButton = ({ note }) => {
    // Behandelt die Export-Aktion, wenn der Button geklickt wird
    const handleExport = () => {
        console.log('Exportiere Notiz:', note); // Loggt die Notiz, die exportiert wird
        extractToPdf(note.id);  // Ruft die Funktion extractToPdf mit der ID der Notiz auf
    };

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport} // Klick-Handler für den Button
            sx={{
                borderRadius: 2, // Wendet Material UI Styling auf den Button an
                marginLeft: "2 px", // Richtet den Button nach rechts aus
            }}
        >
            Exportieren
        </Button>
    );
};

export default PdfExportButton;
