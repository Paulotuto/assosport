import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './HomePage'
import Login from './Login'
import Select from './Select'
import Groupes from './Groupes';
import Groupe from './Groupe';

const App = () => {
  const [isConnected,setIsConnected]= useState(false)
  const [token,setToken]= useState(null)
  

    
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<HomePage isConnected={isConnected} token={token}/>} />
    <Route path='/login' element={<Login isConnected={setIsConnected} setToken={setToken}/>} />
    <Route path='/select' element={<Select isConnected={setIsConnected} setToken={setToken}/>} />
    <Route path='/groupes' element={<Groupes isConnected={setIsConnected} setToken={setToken}/>} />
    <Route path='/groupe' element={<Groupe/>} />
    </Routes>
    {/* 
      <Layout isAuthenticated={isLoggedIn}>
        <Routes>
          <Route path="view/:slug" element={<Review/>}/>
          <Route path="/:category?" element={<ReviewList />}>
            <Route path="view/:slug" element={<Review/>}/>
          </Route>
          
          <Route path='*' element={<NotFound />} />
          <Route path='/login' element={<Login onLogin={handleLogin} isAuthenticated={isLoggedIn} />} />
          <Route path='/logout' element={<Logout onLogout={handleLogout} isAuthenticated={isLoggedIn}/>}/>
          <Route path="/add" element={<AddReview isAuthenticated={isLoggedIn} />} />
        </Routes>
      </Layout>
      */}
    </BrowserRouter>
  );
}

export default App;