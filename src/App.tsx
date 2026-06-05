import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Extension from "./pages/Extension";

import AppShell from "./components/shell/AppShell";
import Dashboard from "./pages/app/Dashboard";
import CRM from "./pages/app/CRM";
import Workers from "./pages/app/Workers";
import Approvals from "./pages/app/Approvals";
import Communications from "./pages/app/Communications";
import Tasks from "./pages/app/Tasks";
import Integrations from "./pages/app/Integrations";
import Settings from "./pages/app/Settings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={120}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/extension" element={<Extension />} />

          {/* Authenticated shell */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<CRM />} />
            <Route path="workers" element={<Workers />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="communications" element={<Communications />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Source aliases */}
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/crm" element={<Navigate to="/app/leads" replace />} />
          <Route path="/worker" element={<Navigate to="/app/workers" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
