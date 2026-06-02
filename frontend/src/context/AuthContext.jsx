import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Restaurar sesión guardada al iniciar
    const savedUser = localStorage.getItem('uho_user');
    const token = localStorage.getItem('uho_access_token');
    
    if (savedUser && token) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.isMock) {
        setIsMockMode(true);
      }
    }
    setLoading(false);

    // Escuchar eventos de logout del interceptor de Axios
    const handleLogout = () => {
      logout();
    };
    window.addEventListener('auth_logout', handleLogout);
    return () => window.removeEventListener('auth_logout', handleLogout);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // Intentar login real con el Backend Django
      const response = await API.post('auth/login/', { username, password });
      const { access, refresh, role, email, first_name, last_name, departamento } = response.data;
      
      localStorage.setItem('uho_access_token', access);
      localStorage.setItem('uho_refresh_token', refresh);
      
      const userData = {
        username,
        email,
        role,
        first_name,
        last_name,
        departamento,
        isMock: false
      };
      
      localStorage.setItem('uho_user', JSON.stringify(userData));
      setUser(userData);
      setIsMockMode(false);
      return { success: true };
    } catch (error) {
      console.warn("Backend no disponible o credenciales incorrectas. Activando simulación local...");
      
      // MOCK LOGIN FALLBACK (Simulación de Roles de Guardia para demostración instantánea)
      const mockRoles = {
        superadmin: { role: 'SUPERADMIN', name: 'Ing. Carlos Leyva', dept: 'Dirección de Informatización' },
        jefe_seguridad: { role: 'JEFE_SEGURIDAD', name: 'Lic. Ramón Valdés', dept: 'Departamento de Seguridad y Protección' },
        resp_area: { role: 'RESPONSABLE_AREA', name: 'Dra. Elena Rost', dept: 'Facultad de Informática y Matemática' },
        resp_depto: { role: 'RESPONSABLE_DEPARTAMENTO', name: 'MSc. Alejandro Silva', dept: 'Departamento de Ingeniería Informática' },
        trabajador: { role: 'TRABAJADOR', name: 'Roberto Pérez', dept: 'Especialista en Redes' },
        estudiante: { role: 'ESTUDIANTE', name: 'Carlos Gómez', dept: 'Ingeniería Informática - 4to Año' }
      };

      const matchedUser = mockRoles[username.toLowerCase()];

      if (matchedUser && password === 'password') {
        const userData = {
          username: username.toLowerCase(),
          email: `${username}@uho.edu.cu`,
          role: matchedUser.role,
          first_name: matchedUser.name.split(' ').slice(1).join(' '), // Extrae el nombre después del título académico (Ing., Lic., Dra., etc.)
          last_name: matchedUser.name.split(' ').slice(2).join(' ') || matchedUser.name.split(' ').slice(1).join(' '),
          departamento: matchedUser.dept,
          isMock: true
        };

        localStorage.setItem('uho_access_token', 'mock-jwt-token-key');
        localStorage.setItem('uho_refresh_token', 'mock-jwt-refresh-key');
        localStorage.setItem('uho_user', JSON.stringify(userData));
        
        setUser(userData);
        setIsMockMode(true);
        setLoading(false);
        return { success: true, isMock: true };
      }

      setLoading(false);
      throw new Error(error.response?.data?.detail || "Usuario o contraseña incorrectos.");
    }
  };

  const logout = () => {
    localStorage.removeItem('uho_access_token');
    localStorage.removeItem('uho_refresh_token');
    localStorage.removeItem('uho_user');
    setUser(null);
    setIsMockMode(false);
  };

  const changeRoleSimulated = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem('uho_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isMockMode, changeRoleSimulated }}>
      {children}
    </AuthContext.Provider>
  );
};
