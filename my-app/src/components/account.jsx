import React, { useEffect } from 'react';
import { Button } from '@chakra-ui/react'
import { UserAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { set, ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";
import Navbar from './navbar';

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
            <Navbar />
            <h1>Account</h1>
            <h2>User Email: {user && user.email}</h2>
            <Button onClick={handleClick} colorScheme='blue'>Logout</Button>
        </div>
    );
}