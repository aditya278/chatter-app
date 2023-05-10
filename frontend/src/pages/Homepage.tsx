import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const _userInfo = localStorage.getItem('userInfo');
    if (_userInfo) {
      history.push('/chats');
      return;
    }
  }, [history]);

  return (
    <Container maxW={'xl'} centerContent>
      <Box
        display={'flex'}
        justifyContent={'center'}
        p={3}
        bg={'white'}
        w={'100%'}
        m={'40px 0 15px 0'}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >
        <Text fontSize={'4xl'} fontFamily={'Work Sans'} color={'black'}>
          Chatter
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius={'lg'} borderWidth={'1px'}>
        <Tabs variant="soft-rounded">
          <TabList marginBottom={'1em'}>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
