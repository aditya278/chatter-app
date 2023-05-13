import { VStack, useToast } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const [picture, setPicture] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();
  const toast = useToast();

  // const postDetails = (picture?: File | null) => {
  //   setLoading(true);
  //   if (!picture) {
  //     toast({
  //       title: 'Please select an image',
  //       status: 'warning',
  //       duration: 5000,
  //       isClosable: true,
  //       position: 'bottom',
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  //   const data = new FormData();
  //   data.append('file', picture);
  //   data.append('upload_preset', 'chatter-app');
  //   fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/uplaod`, {
  //     method: 'post',
  //     body: data,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPicture(data.url.toString());
  //     })
  //     .catch((err) => {
  //       console.error('Error: ', err);
  //     })
  //     .finally(() => setLoading(false));
  // };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/user`, { name, email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);

      window.location.reload();
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter You Name" onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter You Email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter You Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword((show) => !show)}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword((show) => !show)}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* <FormControl id="picture" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <InputGroup>
          <Input type={'file'} p={1.5} accept="image/*" onChange={(e) => postDetails(e.target?.files?.[0])} />
        </InputGroup>
      </FormControl> */}

      <Button colorScheme="blue" width={'100%'} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
