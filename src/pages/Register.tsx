
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MAX_USERNAME_LENGTH = 15;

const Register = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  // Проверка доступности имени пользователя
  const checkUsernameAvailability = (username: string) => {
    if (username.length === 0) {
      setUsernameError('');
      return;
    }
    
    if (username.length > MAX_USERNAME_LENGTH) {
      setUsernameError(`Имя пользователя не должно превышать ${MAX_USERNAME_LENGTH} символов`);
      return;
    }
    
    setIsCheckingUsername(true);
    
    // Проверка имени пользователя в базе данных
    setTimeout(() => {
      const storedUsers = localStorage.getItem('users');
      let isUsernameTaken = false;
      
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        isUsernameTaken = users.some((user: any) => user.username.toLowerCase() === username.toLowerCase());
      }
      
      setUsernameError(isUsernameTaken ? 'Это имя пользователя уже занято' : '');
      setIsCheckingUsername(false);
    }, 500);
  };
  
  // Проверка доступности email
  const checkEmailAvailability = (email: string) => {
    if (email.length === 0) {
      setEmailError('');
      return;
    }
    
    if (!email.includes('@')) {
      setEmailError('Email должен содержать символ @');
      return;
    }
    
    setIsCheckingEmail(true);
    
    // Проверка email в базе данных
    setTimeout(() => {
      const storedUsers = localStorage.getItem('users');
      let isEmailTaken = false;
      
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        isEmailTaken = users.some((user: any) => user.email && user.email.toLowerCase() === email.toLowerCase());
      }
      
      setEmailError(isEmailTaken ? 'Этот email уже зарегистрирован' : '');
      setIsCheckingEmail(false);
    }, 500);
  };
  
  // Проверка имени пользователя при вводе
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    
    if (newUsername.length > MAX_USERNAME_LENGTH) {
      setUsernameError(`Имя пользователя не должно превышать ${MAX_USERNAME_LENGTH} символов`);
    } else {
      checkUsernameAvailability(newUsername);
    }
  };
  
  // Проверка email при вводе
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (!newEmail.includes('@')) {
      setEmailError('Email должен содержать символ @');
    } else {
      checkEmailAvailability(newEmail);
    }
  };
  
  useEffect(() => {
    // Запускаем проверку имени пользователя
    const usernameTimeoutId = setTimeout(() => {
      if (username && !isCheckingUsername) {
        checkUsernameAvailability(username);
      }
    }, 500);
    
    // Запускаем проверку email
    const emailTimeoutId = setTimeout(() => {
      if (email && !isCheckingEmail) {
        checkEmailAvailability(email);
      }
    }, 500);
    
    return () => {
      clearTimeout(usernameTimeoutId);
      clearTimeout(emailTimeoutId);
    };
  }, [username, email]);
  
  const validatePassword = (pass: string) => {
    if (pass.length < 12 || pass.length > 16) {
      return "Пароль должен содержать от 12 до 16 символов";
    }
    
    if (!/[a-zA-Z]/.test(pass)) {
      return "Пароль должен содержать латинские буквы";
    }
    
    if (!/\d/.test(pass)) {
      return "Пароль должен содержать цифры";
    }
    
    return "";
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем доступность имени пользователя и email
    if (usernameError) {
      toast({
        title: "Ошибка",
        description: usernameError,
        variant: "destructive",
      });
      return;
    }
    
    if (emailError) {
      toast({
        title: "Ошибка",
        description: emailError,
        variant: "destructive",
      });
      return;
    }
    
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast({
        title: "Ошибка валидации",
        description: passwordValidationError,
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(username, email, password);
      
      if (success) {
        toast({
          title: "Регистрация прошла успешно",
          description: "Ваш аккаунт был создан",
        });
        navigate('/');
      } else {
        toast({
          title: "Ошибка регистрации",
          description: "Не удалось зарегистрировать пользователя",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="news-container py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Регистрация</CardTitle>
          <CardDescription className="text-center">
            Создайте аккаунт для доступа к сайту
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите имя пользователя"
                value={username}
                onChange={handleUsernameChange}
                required
                maxLength={MAX_USERNAME_LENGTH}
                className={usernameError ? "border-red-500" : ""}
              />
              {isCheckingUsername && (
                <p className="text-sm text-gray-500">Проверка доступности...</p>
              )}
              {usernameError && (
                <p className="text-red-500 text-sm">{usernameError}</p>
              )}
              <p className="text-xs text-gray-500">
                Имя пользователя должно быть уникальным и не превышать {MAX_USERNAME_LENGTH} символов.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={handleEmailChange}
                required
                className={emailError ? "border-red-500" : ""}
              />
              {isCheckingEmail && (
                <p className="text-sm text-gray-500">Проверка доступности...</p>
              )}
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={handlePasswordChange}
                required
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <p className="text-xs text-gray-500">
                Пароль должен содержать от 12 до 16 символов, включая латинские буквы и цифры.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amur-blue hover:bg-amur-lightBlue"
              disabled={isLoading || !!passwordError || !!emailError || !!usernameError || isCheckingUsername || isCheckingEmail}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-amur-blue hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
