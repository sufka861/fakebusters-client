import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import '../../../../src/assets/scss/style.scss'; 

interface VocabularyProps {
  name: string;
  date_modified: string;
  terms: string[];
}

const Vocabulary: React.FC<VocabularyProps> = ({ name, date_modified, terms }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ position: 'relative' }}>
        <Typography variant="h4">{name}</Typography>
        <List>
          {terms.slice(0, 5).map((term, index) => (
            <ListItem key={index}>
              <ListItemText primary={term} />
            </ListItem>
          ))}
        </List>
        {terms.length > 5 && (
          <IconButton
            style={{ position: 'absolute', top: 0, right: 0 }}
            onClick={handleOpen}
          >
            <MoreVertIcon />
          </IconButton>
        )}
        <Typography variant="subtitle2" style={{ position: 'absolute', bottom: 0, right: 0, margin: '8px' }}>
          Modified: {date_modified}
        </Typography>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Paper
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          <Typography variant="h4" gutterBottom>
            {name}
          </Typography>
          <List>
            {terms.map((term, index) => (
              <ListItem key={index}>
                <ListItemText primary={term} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>
    </Grid>
  );
};

export default Vocabulary;
