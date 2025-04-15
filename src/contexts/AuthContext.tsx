
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь в localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === 'admin');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // В реальном приложении здесь должен быть запрос на сервер
    // Для демонстрации создаем простую имитацию
    if (username && password) {
      // Проверяем, является ли пользователь администратором (для демо)
      const isAdminUser = username.toLowerCase() === 'admin';
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email: `${username}@example.com`,
        role: isAdminUser ? 'admin' : 'user'
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setIsAdmin(isAdminUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // В реальном приложении здесь должен быть запрос на сервер
    if (username && email && password) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        role: 'user' // По умолчанию все новые пользователи имеют роль "user"
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
