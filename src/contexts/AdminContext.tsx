
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  initializing: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Usa a RPC de sessão (cria e retorna token + admin)
      const { data, error } = await supabase.rpc('admin_create_session', {
        admin_email: email,
        admin_password: password,
      });

      if (error) {
        console.error('Authentication error:', error);
        return { success: false, message: 'Erro ao fazer login' };
      }

      const result = data as any;
      if (result?.success && result?.token && result?.admin) {
        const adminData = result.admin as AdminUser;
        const sessionToken = result.token as string;

        setAdmin(adminData);
        setToken(sessionToken);

        sessionStorage.setItem('admin_user', JSON.stringify(adminData));
        sessionStorage.setItem('admin_token', sessionToken);

        return { success: true };
      } else {
        return { success: false, message: result?.message || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = sessionStorage.getItem('admin_token');
    try {
      if (currentToken) {
        await supabase.rpc('admin_logout', { p_token: currentToken });
      }
    } catch (e) {
      console.warn('Erro ao encerrar sessão admin (continuando logout local):', e);
    } finally {
      setAdmin(null);
      setToken(null);
      sessionStorage.removeItem('admin_user');
      sessionStorage.removeItem('admin_token');
    }
  };

  useEffect(() => {
    console.log('AdminContext - Initializing...');
    const savedAdmin = sessionStorage.getItem('admin_user');
    const savedToken = sessionStorage.getItem('admin_token');
    
    console.log('AdminContext - savedAdmin:', !!savedAdmin);
    console.log('AdminContext - savedToken:', !!savedToken);
    
    if (savedAdmin && savedToken) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin(adminData);
        setToken(savedToken);
        console.log('AdminContext - Session restored:', adminData.email);
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
      }
    }
    
    setInitializing(false);
    console.log('AdminContext - Initialization complete');
  }, []);

  const value: AdminContextType = {
    admin,
    token,
    isAuthenticated: !!admin && !!token,
    login,
    logout,
    loading,
    initializing,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
