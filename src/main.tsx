import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAppMonitoring } from './loadCustomScripts.ts'

createRoot(document.getElementById("root")!).render(<App />);
initializeAppMonitoring();