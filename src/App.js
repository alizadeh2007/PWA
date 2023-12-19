import React from 'react';
import logo from './logo.svg';
import './App.css';
import img1 from "./pcmod new.jpg"
import PWAInitailizer from './PWA';

function App() {
  return (
    <div className="App">
      <PWAInitailizer/>
      <img src={img1} />
    </div>
  );
}

export default App;
