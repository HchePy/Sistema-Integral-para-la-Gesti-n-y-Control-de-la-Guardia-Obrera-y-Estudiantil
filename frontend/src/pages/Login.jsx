import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, User, ShieldAlert, GraduationCap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    try {
      setError('');
      setLoading(true);
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleUser) => {
    setUsername(roleUser);
    setPassword('password');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-uho/20 blur-[120px] pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[130px] pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-lg relative z-10">
        {/* Branding Title */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-uho to-emerald-700 text-white shadow-xl shadow-uho/10 mb-4 animate-bounce">
            <GraduationCap className="h-10 w-10 text-uho-accent" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-uho-accent to-yellow-400 bg-clip-text text-transparent">
            SIGCGOE
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            Sistema Integral para la Gestión y Control de la Guardia Obrera y Estudiantil
          </p>
        </div>
 
        {/* Card Form */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800">
          <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <LogIn className="h-5 w-5 text-uho-accent" />
            Acceder al Sistema
          </h2>
 
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-sm flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                Usuario / Correo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. superadmin, jefe_seguridad, resp_area"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl focus:outline-none focus:border-uho-accent focus:ring-1 focus:ring-uho-accent text-slate-100 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
 
            <div>
              <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl focus:outline-none focus:border-uho-accent focus:ring-1 focus:ring-uho-accent text-slate-100 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-uho to-emerald-700 hover:from-emerald-700 hover:to-uho text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-uho/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Ingresar</span>
                  <LogIn className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
 
          {/* Quick Login Section */}
          <div className="mt-8 pt-6 border-t border-slate-800/60">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Simulador de Acceso Rápido (Contraseña: password)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: 'Superadmin', role: 'superadmin' },
                { name: 'Jefe Seguridad', role: 'jefe_seguridad' },
                { name: 'Resp. Área', role: 'resp_area' },
                { name: 'Resp. Depto', role: 'resp_depto' },
                { name: 'Trabajador', role: 'trabajador' },
                { name: 'Estudiante', role: 'estudiante' },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleQuickLogin(item.role)}
                  className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg text-xs text-slate-300 transition-colors text-left font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
