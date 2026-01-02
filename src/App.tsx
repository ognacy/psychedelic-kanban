import { CRTEffect } from './components/CRTEffect/CRTEffect';
import { Board } from './components/Board/Board';
import './styles/global.css';

function App() {
  return (
    <CRTEffect>
      <Board />
    </CRTEffect>
  );
}

export default App;
