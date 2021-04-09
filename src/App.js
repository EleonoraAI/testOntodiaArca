//Components
import * as React from 'react';
import AppOntodiaGraph from './components/OntodiaGraph'
import Rectangle, { ConnectedRectangle } from './components/rectangle';

import './styles/app.css';

function App() {


  return (
    <div className="App">
      <AppOntodiaGraph/>
      <Rectangle/>
      
    </div>
  );
}

export default App;
