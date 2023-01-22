import React from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

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
            <h1>Sign up for an Account</h1>
            <Input onChange={(e) => setEmail(e.target.value)} placeholder="Email..." />
            <Input onInput={handleChange} placeholder="password..."/>
            <Button colorScheme='blue' onClick={handleSubmit}>Sign Up</Button>
        </div>
    );
}