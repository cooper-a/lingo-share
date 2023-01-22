import React from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

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
            <h1>Sign in for an Account</h1>
            <Input onChange={(e) => setEmail(e.target.value)} placeholder="Email..." />
            <Input onInput={handleChange} placeholder="password..."/>
            <Button colorScheme='blue' onClick={handleSubmit}>Sign In</Button>
        </div>
    );
}