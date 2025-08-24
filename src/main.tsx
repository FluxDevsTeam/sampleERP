import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import FloatingActions from './components/FloatingActions';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner"
import '@/utils/apiProxy';

// beforeinstallprompt handling removed (not used)

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
  <QueryClientProvider client={queryClient}>
    <App />
    <FloatingActions />
    <Toaster />
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
