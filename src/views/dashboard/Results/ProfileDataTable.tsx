import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

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

const ProfileDataTable: React.FC<{ username: string }> = ({ username }) => {
    const [profileData, setProfileData] = useState<{ [key: string]: ProfileData | string }>({});
    
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

    fetchProfileData(username);

    if (typeof profileData[username] === 'string') {
        return <Typography>{JSON.stringify(profileData[username])}</Typography>;
    } else if (profileData[username]) {
        return (
            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.username}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Followers</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.followers_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Following</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.following_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tweets</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.tweet_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Likes</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.like_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Listed</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.listed_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Verified</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.verified ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Verified Type</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.verified_type}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Profile Image</TableCell>
                        <a href={`https://x.com/${profileData[username]?.username}`} target="_blank" rel="noreferrer">
                            <TableCell>
                                <img src={(profileData[username] as ProfileData)?.profile_image_url} alt="Profile" />
                            </TableCell>
                        </a>
                    </TableRow>
                    <TableRow>
                        <TableCell>Created At</TableCell>
                        <TableCell>{(profileData[username] as ProfileData)?.created_at}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
    return <Typography>Loading...</Typography>;
};

export { ProfileDataTable };
export type { ProfileData };
