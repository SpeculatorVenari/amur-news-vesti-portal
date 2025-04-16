
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

interface StoredUser extends User {
  password: string;
  registrationDate?: string; // Добавляем дату регистрации
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

  // Инициализация хранилища данных при первой загрузке
  useEffect(() => {
    const initializeStorage = () => {
      // Проверяем, инициализировано ли уже хранилище
      if (!localStorage.getItem('storageInitialized')) {
        // Очищаем данные о пользователях
        localStorage.removeItem('users');
        localStorage.removeItem('user');
        
        // Текущая дата для регистрации
        const currentDate = new Date().toLocaleDateString('ru-RU');
        
        // Создаем аккаунт администратора
        const adminUser: StoredUser = {
          id: 'admin-id',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          password: 'admin228',
          registrationDate: currentDate
        };
        
        localStorage.setItem('users', JSON.stringify([adminUser]));
        localStorage.setItem('storageInitialized', 'true');
        
        // Инициализируем настройки сайта
        if (!localStorage.getItem('siteSettings')) {
          const defaultSettings = {
            contacts: {
              address: 'г. Благовещенск, ул. Ленина, 1',
              phone: '+7 (4162) 12-34-56',
              email: 'info@amurvesti.ru'
            },
            about: {
              text: 'АмурВести - информационный портал Амурской области. Мы предоставляем свежие новости региона.',
              imageUrl: '/placeholder.svg'
            },
            privacy: 'Политика конфиденциальности АмурВести...',
            ads: 'Информация о рекламе на сайте АмурВести...'
          };
          
          localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
        }
      }
    };
    
    initializeStorage();
    
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
    if (!username || !password) return false;
    
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) return false;
    
    const users: StoredUser[] = JSON.parse(storedUsers);
    const foundUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      // Убираем пароль из данных пользователя перед сохранением в state
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Проверяем, забанен ли пользователь
      if (foundUser.banned) {
        return false;
      }
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setIsAdmin(userWithoutPassword.role === 'admin');
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    if (!username || !email || !password) return false;
    
    // Получаем список всех пользователей
    const storedUsers = localStorage.getItem('users');
    let users: StoredUser[] = [];
    
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      
      // Проверяем, что имя пользователя и email уникальны
      const isUsernameTaken = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      const isEmailTaken = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      
      if (isUsernameTaken || isEmailTaken) {
        return false;
      }
    }
    
    // Текущая дата для регистрации
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    // Создаем нового пользователя
    const newUser: StoredUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      role: 'user',
      password,
      registrationDate: currentDate
    };
    
    // Добавляем пользователя в список и сохраняем
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Авторизуем пользователя
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    setIsAdmin(false);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return true;
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
