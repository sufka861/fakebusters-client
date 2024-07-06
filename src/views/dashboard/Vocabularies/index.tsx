import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Vocabulary from './Vocabulary';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Container, Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

interface VocabularyData {
  id: string;
  name: string;
  date_modified: string;
  terms: string[];
}

const Vocabularies: React.FC = () => {
  const [defaultVocabulary, setDefaultVocabulary] = useState<VocabularyData | null>(null);
  const [vocabularies, setVocabularies] = useState<VocabularyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [defaultResult, vocabulariesResult] = await Promise.all([
          axios.get('https://fakebusters-server.onrender.com/api/vocabularies/vocabularyDefault/12345674'),
          axios.get('https://fakebusters-server.onrender.com/api/vocabularies/vocabularyNonDefault/12345674')
        ]);
        const defaultData = {
          id: defaultResult.data._id,
          name: defaultResult.data.name,
          date_modified: defaultResult.data.date_modified,
          terms: Array.isArray(defaultResult.data.terms) ? defaultResult.data.terms : [defaultResult.data.terms]
        };

        const vocabulariesData = vocabulariesResult.data.map((vocabulary: any) => ({
          id: vocabulary._id,
          name: vocabulary.name,
          date_modified: vocabulary.date_modified,
          terms: Array.isArray(vocabulary.terms) ? vocabulary.terms : [vocabulary.terms]
        }));

        setDefaultVocabulary(defaultData);
        setVocabularies(vocabulariesData);
      } catch (error) {
        setError('Error fetching vocabularies');
        console.error('Error fetching vocabularies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
    <Grid item xs={12} sm={6} md={4}></Grid>
    <Grid item xs={12} lg={12} md={12}>
        <Grid item xs={12} >
          {defaultVocabulary && (
            <MainCard title="Default Stop-Words">
              <Vocabulary
                key={defaultVocabulary.id}
                name={defaultVocabulary.name}
                date_modified={defaultVocabulary.date_modified}
                terms={defaultVocabulary.terms}
              />
            </MainCard>
          )}
        </Grid>
        
        <Grid container spacing={gridSpacing} style={{ marginTop: '20px' }}  >
          {vocabularies.map((vocabulary) => (
            <Grid item xs={12} sm={6} md={4} key={vocabulary.id} >
              <Card>
                <CardContent>
                  <Vocabulary
                    name={vocabulary.name}
                    date_modified={vocabulary.date_modified}
                    terms={vocabulary.terms}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
                <Grid item>
                <IconButton sx={{ backgroundColor: '#5e35b1', color: 'white','&:hover': {
                  backgroundColor: '#ede7f6',
                  color: 'black'
                } }} size="large" aria-label="add icon">
              <AddIcon />
            </IconButton>
                </Grid>
        </Grid>
        </Grid>
        </Grid>
        
  );
};

export default Vocabularies;