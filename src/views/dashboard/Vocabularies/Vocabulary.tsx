import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface Term {
  id: string;
  term: string;
}

interface VocabularyProps {
  name: string;
  date_modified: string;
  terms: string[]; // Assuming terms is an array of strings
}

const Vocabulary: React.FC<VocabularyProps> = ({ name, date_modified, terms }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="subtitle1">{date_modified}</Typography>
        <List>
          {terms.map((term, index) => (
            <ListItem key={index}>
              <ListItemText primary={term} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default Vocabulary;
