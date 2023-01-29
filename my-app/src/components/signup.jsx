import React from 'react';
import { Input, Button, ChakraProvider, Text } from '@chakra-ui/react';
import PasswordInput from './passwordinput';
import { useState } from 'react';
import { link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';
import "../styles/homepage.css";
import Navbar from './navbar';

export default function Signup() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);
    const { createUser } = UserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUser(email, password);
            console.log('successfully added user');
            navigate("/account");
        } catch (e) {
            setError(e.message);
            console.log(e.message);
        }
    }

    const handleChange = (event) => {
        setPassword(event.target.value)
    }

    return (
        <div>
            <Navbar />
            <ChakraProvider>
                <div className='welcome-pg'>
                    <Text fontSize='4xl'>Sign Up</Text>
                    <Input onChange={(e) => setEmail(e.target.value)} width={'300px'} placeholder="Email..." />
                    <PasswordInput onChange={handleChange} placeholder="password..." />
                    <Button variant='outline' onClick={handleSubmit}>Sign Up</Button>
                </div>
            </ChakraProvider>
        </div>
    );
}