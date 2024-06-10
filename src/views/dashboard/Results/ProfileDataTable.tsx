import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';

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
    const [profileData, setProfileData] = useState<ProfileData | string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!profileData) {
                try {
                    const response = await axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${username}`);
                    const data = response.data[0];
                    if (data.errors) {
                        if (data.errors[0].title === 'Not Found Error') {
                            setProfileData('User not found');
                        } else if (data.errors[0].title === 'Forbidden') {
                            setProfileData('User suspended');
                        }
                    } else {
                        const profile = data.data[0];
                        setProfileData({
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
                        });
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    setProfileData('Error fetching profile data');
                }
            }
        };

        fetchProfileData();
    }, [username]);

    if (profileData === 'User not found' || profileData === 'User suspended' || profileData === 'Error fetching profile data') {
        return <Typography>{profileData}</Typography>;
    } else if (profileData) {
        return (
            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{profileData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>{profileData.username}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>{profileData.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Followers</TableCell>
                        <TableCell>{profileData.followers_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Following</TableCell>
                        <TableCell>{profileData.following_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tweets</TableCell>
                        <TableCell>{profileData.tweet_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Likes</TableCell>
                        <TableCell>{profileData.like_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Listed</TableCell>
                        <TableCell>{profileData.listed_count}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Verified</TableCell>
                        <TableCell>{profileData.verified ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Verified Type</TableCell>
                        <TableCell>{profileData.verified_type}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Profile Image</TableCell>
                        <a href={`https://x.com/${profileData.username}`} target="_blank" rel="noreferrer">
                            <TableCell>
                                <img src={profileData.profile_image_url} alt="Profile" />
                            </TableCell>
                        </a>
                    </TableRow>
                    <TableRow>
                        <TableCell>Created At</TableCell>
                        <TableCell>{profileData.created_at}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
    return <Typography>Loading...</Typography>;
};

export { ProfileDataTable };
export type { ProfileData };
