import { VStack, useToast } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const history = useHistory();
  const toast = useToast();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/user/login`, { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    }
    catch(err: any) {
      console.log('Error: ', err);
      toast({
        title: err?.response?.data?.error || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={'5px'}>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder='Enter You Email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter You Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h='1.75rem' size='sm' onClick={() => setShowPassword(show => !show)}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button colorScheme='blue' width={'100%'} style={{ marginTop: 15 }} onClick={submitHandler}>
        Login
      </Button>
      <Button variant={'solid'} colorScheme='red' width='100%' isLoading={loading} onClick={() => {
        setEmail('guest@example.com');
        setPassword('123456');
      }}>
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login;