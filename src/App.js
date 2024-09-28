import React from 'react';
import './App.css';
import Bulb from './Bulb'; // Importa la classe Bulb

// Componente App
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Bulb />
      </header>
    </div>
  );
}

export default App;