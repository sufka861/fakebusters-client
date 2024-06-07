import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    InputAdornment,
    TextField,
    Collapse,
    Box,
    TableSortLabel,
    Select,
    MenuItem,
    Typography,
    Button
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import axios from 'axios';

type ResultLPA = {
    'Corpus 1': string;
    'Corpus 2': string;
    value: string;
};

type ProfileData = {
    username: string;
    description: string;
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count: number;
    verified: boolean;
    verified_type: string;
    profile_image_url: string;
    created_at: string;
    name: string;
};

type ResultsLPAProps = {
    resultsLPA: ResultLPA[];
};

const ResultsLPA: React.FC<ResultsLPAProps> = ({ resultsLPA }) => {
    const theme = useTheme();
    const [filter, setFilter] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ResultLPA; direction: 'asc' | 'desc' } | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [verifiedSelections, setVerifiedSelections] = useState<{ [key: number]: string }>({});
    const [comments, setComments] = useState<{ [key: number]: string }>({});
    const [profileData, setProfileData] = useState<{ [key: string]: ProfileData | string }>({});

    const location = useLocation();
    const state = location.state || {};
    const { responseFerqData } = state;

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value.toLowerCase());
    };

    const fetchProfileData = async (username: string) => {
        if (!profileData[username]) {
            try {
                const response = await axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${username}`);
                const data = response.data[0];
                if (data.errors) {
                    console.log(`Errors for ${username}:`, data.errors);
                    if (data.errors[0].title === 'Not Found Error') {
                        setProfileData((prev) => ({ ...prev, [username]: 'User not found' }));
                    } else if (data.errors[0].title === 'Forbidden') {
                        setProfileData((prev) => ({ ...prev, [username]: 'User suspended' }));
                    }
                } else {
                    const profile = data.data[0];
                    setProfileData((prev) => ({
                        ...prev,
                        [username]: {
                            username: profile.username,
                            description: profile.description,
                            followers_count: profile.public_metrics.followers_count,
                            following_count: profile.public_metrics.following_count,
                            tweet_count: profile.public_metrics.tweet_count,
                            listed_count: profile.public_metrics.listed_count,
                            like_count: profile.public_metrics.like_count,
                            verified: profile.verified,
                            verified_type: profile.verified_type,
                            profile_image_url: profile.profile_image_url,
                            created_at: profile.created_at,
                            name: profile.name
                        }
                    }));
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        }
    };

    const filteredData = resultsLPA.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(filter)));

    const sortedData = React.useMemo(() => {
        if (sortConfig !== null) {
            return [...filteredData]
                .sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                })
                .map((item, index) => ({
                    ...item,
                    verifiedSelection: verifiedSelections[index] || 'Not Verified',
                    comment: comments[index] || ''
                }));
        }
        return filteredData.map((item, index) => ({
            ...item,
            verifiedSelection: verifiedSelections[index] || 'Not Verified',
            comment: comments[index] || ''
        }));
    }, [filteredData, sortConfig, verifiedSelections, comments]);

    const requestSort = (key: keyof ResultLPA) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleRowClick = (index: number, username1: string, username2: string) => {
        if (expandedRow === index) {
            setExpandedRow(null);
        } else {
            setExpandedRow(index);
            fetchProfileData(username1);
            fetchProfileData(username2);
        }
    };

    const handleVerifiedChange = (index: number, value: string) => {
        setVerifiedSelections((prev) => ({ ...prev, [index]: value }));
    };

    const handleCommentChange = (index: number, value: string) => {
        setComments((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const aggregatedData = sortedData.map((item, index) => ({
            ...item,
            verifiedSelection: verifiedSelections[index] || 'Not Verified',
            comment: comments[index] || ''
        }));

        try {
            console.log('Saving data:', aggregatedData, responseFerqData?.FrequencyFile);

            const url = `https://fakebusters-server.onrender.com/api/lpa/${responseFerqData?.FrequencyFile}`;
            const response = await axios.put(
                url,
                {
                    LPA_results: aggregatedData
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Data saved:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error response:', error.response);
            } else {
                console.error('Error saving data:', error);
            }
        }
    };

    const renderProfileData = (username: string) => {
        if (typeof profileData[username] === 'string') {
            return <Typography>{profileData[username]}</Typography>;
        } else if (profileData[username]) {
            return (
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{profileData[username]?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>{profileData[username]?.username}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>{profileData[username]?.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Followers</TableCell>
                            <TableCell>{profileData[username]?.followers_count}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Following</TableCell>
                            <TableCell>{profileData[username]?.following_count}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tweets</TableCell>
                            <TableCell>{profileData[username]?.tweet_count}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Likes</TableCell>
                            <TableCell>{profileData[username]?.like_count}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Listed</TableCell>
                            <TableCell>{profileData[username]?.listed_count}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Verified</TableCell>
                            <TableCell>{profileData[username]?.verified ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Verified Type</TableCell>
                            <TableCell>{profileData[username]?.verified_type}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Profile Image</TableCell>
                            <a href={`https://x.com/${profileData[username]?.username}`} target="_blank" rel="noreferrer">
                                <TableCell>
                                    <img src={profileData[username]?.profile_image_url} alt="Profile" width="50" height="50" />
                                </TableCell>
                            </a>
                        </TableRow>
                        <TableRow>
                            <TableCell>Created At</TableCell>
                            <TableCell>{profileData[username]?.created_at}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }
        return <Typography>Loading profile data...</Typography>;
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    placeholder="Filter results..."
                    margin="normal"
                    fullWidth
                    onChange={handleFilterChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => requestSort('Corpus 1')}>
                                    <TableSortLabel active={sortConfig?.key === 'Corpus 1'} direction={sortConfig?.direction}>
                                        Username 1
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell onClick={() => requestSort('Corpus 2')}>
                                    <TableSortLabel active={sortConfig?.key === 'Corpus 2'} direction={sortConfig?.direction}>
                                        Username 2
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell onClick={() => requestSort('value')}>
                                    <TableSortLabel active={sortConfig?.key === 'value'} direction={sortConfig?.direction}>
                                        Distance
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Verified</TableCell>
                                <TableCell>Comments</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.map((row, index) => (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell>{row['Corpus 1']}</TableCell>
                                        <TableCell>{row['Corpus 2']}</TableCell>
                                        <TableCell>{row.value}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={verifiedSelections[index] || 'Not Verified'}
                                                onChange={(e) => handleVerifiedChange(index, e.target.value as string)}
                                            >
                                                <MenuItem value="Not Verified">Not Verified</MenuItem>
                                                <MenuItem value="Sockpuppet">Sockpuppet</MenuItem>
                                                <MenuItem value="Innocent">Innocent</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={comments[index] || ''}
                                                onChange={(e) => handleCommentChange(index, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleRowClick(index, row['Corpus 1'], row['Corpus 2'])}>
                                                {expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRow === index && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="h6">Profile Details for {row['Corpus 1']}</Typography>
                                                        {renderProfileData(row['Corpus 1'])}
                                                        <Typography variant="h6">Profile Details for {row['Corpus 2']}</Typography>
                                                        {renderProfileData(row['Corpus 2'])}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box marginTop={2}>
                    <Button variant="contained" color="primary" type="submit">
                        Save Changes
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default ResultsLPA;
