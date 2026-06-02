import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function MainApp() {
  const { user, loading } = useAuth();

  // Pantalla de carga premium durante la verificación de token JWT
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-uho border-t-uho-accent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pulse-glow">
            Iniciando Entorno UHO...
          </p>
        </div>
      </div>
    );
  }

  // Enrutamiento inteligente basado en estado de autenticación JWT
  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
