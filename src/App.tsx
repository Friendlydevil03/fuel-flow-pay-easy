
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Scanner App Routes
import ScannerApp from "./pages/scanner/ScannerApp";
import ScanQR from "./pages/scanner/ScanQR";
import Transaction from "./pages/scanner/Transaction";
import ScannerSuccess from "./pages/scanner/ScannerSuccess";

// Wallet App Routes
import WalletApp from "./pages/wallet/WalletApp";
import Dashboard from "./pages/wallet/Dashboard";
import TopUp from "./pages/wallet/TopUp";
import Settings from "./pages/wallet/Settings";
import ProfileSettings from "./pages/wallet/ProfileSettings";
import Transactions from "./pages/wallet/Transactions";
import WalletSuccess from "./pages/wallet/WalletSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Scanner App Routes */}
          <Route path="/scanner" element={<ScannerApp />}>
            <Route index element={<ScanQR />} />
            <Route path="transaction/:id" element={<Transaction />} />
            <Route path="success" element={<ScannerSuccess />} />
          </Route>
          
          {/* Wallet App Routes */}
          <Route path="/wallet" element={<WalletApp />}>
            <Route index element={<Dashboard />} />
            <Route path="top-up" element={<TopUp />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="success" element={<WalletSuccess />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
