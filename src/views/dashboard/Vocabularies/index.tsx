import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Vocabulary from './Vocabulary';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface VocabularyData {
  id: string;
  name: string;
  date_modified: string;
  terms: string[];
}

const Vocabularies: React.FC = () => {
  const [vocabularies, setVocabularies] = useState<VocabularyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/api/vocabularies');
        const data = result.data.map((vocabulary: any) => ({
          id: vocabulary._id,
          name: vocabulary.name,
          date_modified: vocabulary.date_modified,
          terms: Array.isArray(vocabulary.terms) ? vocabulary.terms : [vocabulary.terms]
        }));
        setVocabularies(data);
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
    <div>
      {vocabularies.map(vocabulary => (
        <Vocabulary
          key={vocabulary.id}
          name={vocabulary.name}
          date_modified={vocabulary.date_modified}
          terms={vocabulary.terms}
        />
      ))}
    </div>
  );
};

export default Vocabularies;
