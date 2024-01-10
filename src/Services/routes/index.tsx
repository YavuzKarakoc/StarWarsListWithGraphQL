import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
  } from "react-router-dom";
import Home from '../../Pages/home';
import StarWarsList from '../../Pages/StarWarsList/inedx';


const PageRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route  path="/" element={<Home />} />
        <Route path="/starwarslist" element={<StarWarsList />} />
      </Routes>
    </Router>
  )
}

export default PageRoutes