import { VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const submitHandler = () => {
    console.log('Submitting');
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
      <Button variant={'solid'} colorScheme='red' width='100%' onClick={() => {
        setEmail('guest@example.com');
        setPassword('123456');
      }}>
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login;