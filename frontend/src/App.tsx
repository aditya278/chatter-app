import './App.css';
import { Route, Switch } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <>
      <div className='App'>
        <Switch>
          <Route path='/' component={Homepage} exact />
          <Route path='/chats' component={ChatPage} />
        </Switch>
      </div>
    </>
  )
}

export default App
