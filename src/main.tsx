import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from './pages/AuthPages/AuthContext.tsx';

let deferredPrompt: BeforeInstallPromptEvent | null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log(`'beforeinstallprompt' event was fired.`);
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
   <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <App />
     <Toaster />
     </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
    prompt(): Promise<void>;
  }
}
