import { Content } from './Routes';
import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toolbar } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';
import { AuthProvider } from './Components/AuthContext';
import * as c from './utils/Constants'
import { useState } from 'react';

axios.defaults.baseURL = `${c.BACKEND_HTTP_URL}`


function App() {
  const [showSidebar, setShowSidebar] = useState(false)
  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar)
  }
  return (
    <SnackbarProvider
      autoHideDuration={3000}
      anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
    >
      <Router>
          <AuthProvider>
            <div id="main-container">
              <Navbar handleSidebarToggle={handleSidebarToggle}/>
              <Toolbar />
              <Content showSidebar={showSidebar} handleSidebarToggle={handleSidebarToggle} />
            </div>
          </AuthProvider>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
