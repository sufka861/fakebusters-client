import React, { useState, useEffect } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import {
    IconButton, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tooltip, InputAdornment, TextField, Collapse, Box, TableSortLabel, Select, MenuItem
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import axios from 'axios';

type ResultLPA = {
    "Corpus 1": string;
    "Corpus 2": string;
    "Value": string;
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
    const [profileData, setProfileData] = useState<{ [key: string]: ProfileData }>({});

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value.toLowerCase());
    };

    const fetchProfileData = async (username: string) => {
        if (!profileData[username]) {
            try {
                const response = await axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${username}`);
                const data = response.data[0].data[0];
                setProfileData(prev => ({
                    ...prev,
                    [username]: {
                        username: data.username,
                        description: data.description,
                        followers_count: data.public_metrics.followers_count,
                        following_count: data.public_metrics.following_count,
                        tweet_count: data.public_metrics.tweet_count,
                        listed_count: data.public_metrics.listed_count,
                        like_count: data.public_metrics.like_count,
                        verified: data.verified,
                        verified_type: data.verified_type,
                        profile_image_url: data.profile_image_url
                    }
                }));
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        }
    };

    const filteredData = resultsLPA.filter((item) =>
        Object.values(item).some(val => String(val).toLowerCase().includes(filter))
    );

    const sortedData = React.useMemo(() => {
        if (sortConfig !== null) {
            return [...filteredData].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredData;
    }, [filteredData, sortConfig]);

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
        setVerifiedSelections(prev => ({ ...prev, [index]: value }));
    };

    const handleCommentChange = (index: number, value: string) => {
        setComments(prev => ({ ...prev, [index]: value }));
    };

    return (
        <>
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
                    ),
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
                            <TableCell onClick={() => requestSort('Value')}>
                                <TableSortLabel active={sortConfig?.key === 'Value'} direction={sortConfig?.direction}>
                                    SockPuppet Distance
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>Comments</TableCell>
                            <TableCell>Expand</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <React.Fragment key={index}>
                                <TableRow hover onClick={() => handleRowClick(index, row["Corpus 1"], row["Corpus 2"])}>
                                    <TableCell>{row["Corpus 1"]}</TableCell>
                                    <TableCell>{row["Corpus 2"]}</TableCell>
                                    <TableCell>{row["Value"]}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={verifiedSelections[index] || 'no'}
                                            onChange={(e) => handleVerifiedChange(index, e.target.value as string)}
                                            fullWidth
                                        >
                                            <MenuItem value="no">No</MenuItem>
                                            <MenuItem value="sockpuppet">Sockpuppet</MenuItem>
                                            <MenuItem value="innocent">Innocent</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={comments[index] || ''}
                                            onChange={(e) => handleCommentChange(index, e.target.value)}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton>
                                            {expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                {profileData[row["Corpus 1"]] && profileData[row["Corpus 2"]] ? (
                                                    <Box display="flex" justifyContent="space-around">
                                                        <Box>
                                                            <h3>{profileData[row["Corpus 1"]].name}</h3>
                                                            <p>@{profileData[row["Corpus 1"]].username}</p>
                                                            <img src={profileData[row["Corpus 1"]].profile_image_url} alt="Profile" />
                                                            <p>{profileData[row["Corpus 1"]].description}</p>
                                                            <p>Followers: {profileData[row["Corpus 1"]].followers_count}</p>
                                                            <p>Following: {profileData[row["Corpus 1"]].following_count}</p>
                                                            <p>Tweets: {profileData[row["Corpus 1"]].tweet_count}</p>
                                                            <p>Likes: {profileData[row["Corpus 1"]].like_count}</p>
                                                            <p>Verified: {profileData[row["Corpus 1"]].verified ? "Yes" : "No"} ({profileData[row["Corpus 1"]].verified_type})</p>
                                                        </Box>
                                                        <Box>
                                                            <h3>{profileData[row["Corpus 2"]].name}</h3>
                                                            <p>@{profileData[row["Corpus 2"]].username}</p>
                                                            <img src={profileData[row["Corpus 2"]].profile_image_url} alt="Profile" />
                                                            <p>{profileData[row["Corpus 2"]].description}</p>
                                                            <p>Followers: {profileData[row["Corpus 2"]].followers_count}</p>
                                                            <p>Following: {profileData[row["Corpus 2"]].following_count}</p>
                                                            <p>Tweets: {profileData[row["Corpus 2"]].tweet_count}</p>
                                                            <p>Likes: {profileData[row["Corpus 2"]].like_count}</p>
                                                            <p>Verified: {profileData[row["Corpus 2"]].verified ? "Yes" : "No"} ({profileData[row["Corpus 2"]].verified_type})</p>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ResultsLPA;
