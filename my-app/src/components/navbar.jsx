import { Button, ChakraProvider, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const {user, logout} = UserAuth();
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate("/" + path);
    }

    const handleLogout = async () => {
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
            <ChakraProvider>
                <div className='navbar'>
                    <div className='logo' onClick={() => handleClick('')}>
                        <Text fontSize={'4xl'}>LingoShare</Text>
                    </div>
                    <Button className='logout-btn' onClick={handleLogout} variant='link'>
                        Logout
                    </Button>
                </div>
            </ChakraProvider>
        </div>
    );
}