import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
    const {user, logout} = UserAuth();
    const navigate = useNavigate();
    const handleClick = async () => {
        try
        {
            await logout();
            navigate('/')
            console.log('logged out');
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    return (
        <div>
            <h1>Account</h1>
            <h2>User Email: {user && user.email}</h2>
            <Button onClick={handleClick} colorScheme='blue'>Logout</Button>
        </div>
    );
}