import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {LanguageProvider} from './i18n/LanguageContext.tsx';
import {AuthProvider} from './context/AuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </AuthProvider>
);
