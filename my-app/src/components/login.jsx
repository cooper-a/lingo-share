import React from 'react';
import { ChakraProvider, Input, Button, Text } from '@chakra-ui/react';
import PasswordInput from './passwordinput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';
import Navbar from './navbar';

export default function Login() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);
    const { login } = UserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/account');
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
            <ChakraProvider>
                <Navbar />
                <div className='welcome-pg'>
                    <Text fontSize='5xl'>Login</Text>
                    <Input onChange={(e) => setEmail(e.target.value)} width={'300px'} placeholder="Email..." />
                    <PasswordInput onChange={handleChange} placeholder="password..." />
                    <Button variant='outline' onClick={handleSubmit}>Sign In</Button>
                </div>
            </ChakraProvider>
        </div>
    );
}