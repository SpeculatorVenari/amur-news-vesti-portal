import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Comment } from '@/types';
import { Pencil, Check, X, Eye, EyeOff, Lock, Reply } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [editing, setEditing] = useState<'username' | 'email' | 'password' | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [registrationDate, setRegistrationDate] = useState<string>('');
  
  const MAX_USERNAME_LENGTH = 15;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setNewUsername(user.username);
      setNewEmail(user.email || '');
      
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const foundUser = users.find((u: any) => u.id === user.id);
        if (foundUser && foundUser.registrationDate) {
          setRegistrationDate(foundUser.registrationDate);
        } else {
          setRegistrationDate('01.01.2024');
        }
      }
      
      loadUserComments();
    }
  }, [isAuthenticated, user, navigate]);

  const loadUserComments = () => {
    if (!user) return;
    
    const articlesData = localStorage.getItem('articles');
    if (!articlesData) return;
    
    try {
      const articles = JSON.parse(articlesData);
      const allComments: Comment[] = [];
      
      articles.forEach((article: any) => {
        if (article.comments && Array.isArray(article.comments)) {
          const collectComments = (comments: Comment[], articleInfo: any) => {
            comments.forEach((comment: Comment) => {
              if (comment.author.id === user.id) {
                allComments.push({
                  ...comment,
                  articleId: article.id,
                  articleTitle: article.title
                });
              }
              
              if (comment.replies && comment.replies.length > 0) {
                collectComments(comment.replies, articleInfo);
              }
            });
          };
          
          collectComments(article.comments, {
            id: article.id,
            title: article.title
          });
        }
      });
      
      setUserComments(allComments);
    } catch (error) {
      console.error('Error loading user comments:', error);
    }
  };

  const checkUsernameAvailability = (username: string) => {
    if (username === user?.username) {
      setUsernameError('');
      return true;
    }
    
    if (username.length === 0) {
      setUsernameError('Имя пользователя не может быть пустым');
      return false;
    }
    
    if (username.length > MAX_USERNAME_LENGTH) {
      setUsernameError(`Имя пользователя не должно превышать ${MAX_USERNAME_LENGTH} символов`);
      return false;
    }
    
    setIsCheckingUsername(true);
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const isUsernameTaken = users.some((u: any) => 
        u.username.toLowerCase() === username.toLowerCase() && u.id !== user?.id
      );
      
      setIsCheckingUsername(false);
      
      if (isUsernameTaken) {
        setUsernameError('Это имя пользователя уже занято');
        return false;
      }
    } else {
      setIsCheckingUsername(false);
    }
    
    setUsernameError('');
    return true;
  };

  const checkEmailAvailability = (email: string) => {
    if (email === user?.email) {
      setEmailError('');
      return true;
    }
    
    if (email.length === 0) {
      setEmailError('Email не может быть пустым');
      return false;
    }
    
    if (!email.includes('@')) {
      setEmailError('Email должен содержать символ @');
      return false;
    }
    
    setIsCheckingEmail(true);
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const isEmailTaken = users.some((u: any) => 
        u.email && u.email.toLowerCase() === email.toLowerCase() && u.id !== user?.id
      );
      
      setIsCheckingEmail(false);
      
      if (isEmailTaken) {
        setEmailError('Этот email уже зарегистрирован');
        return false;
      }
    } else {
      setIsCheckingEmail(false);
    }
    
    setEmailError('');
    return true;
  };

  const verifyCurrentPassword = () => {
    if (!currentPassword) {
      setPasswordError('Введите текущий пароль');
      return false;
    }
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers && user) {
      const users = JSON.parse(storedUsers);
      const foundUser = users.find((u: any) => u.id === user.id);
      
      if (foundUser && foundUser.password === currentPassword) {
        return true;
      }
    }
    
    setPasswordError('Неверный текущий пароль');
    return false;
  };

  const validateNewPassword = () => {
    if (!newPassword) {
      setPasswordError('Введите новый пароль');
      return false;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return false;
    }
    
    return true;
  };

  const handleSaveUsername = () => {
    if (!checkUsernameAvailability(newUsername)) {
      return;
    }
    
    updateUserData({ username: newUsername });
    setEditing(null);
    
    toast({
      title: "Успешно",
      description: "Имя пользователя обновлено",
    });
  };

  const handleSaveEmail = () => {
    if (!checkEmailAvailability(newEmail)) {
      return;
    }
    
    updateUserData({ email: newEmail });
    setEditing(null);
    
    toast({
      title: "Успешно",
      description: "Email обновлен",
    });
  };

  const handleSavePassword = () => {
    if (!verifyCurrentPassword() || !validateNewPassword()) {
      return;
    }
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers && user) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      setEditing(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      
      toast({
        title: "Успешно",
        description: "Пароль успешно изменен",
      });
    }
  };

  const updateUserData = (updatedFields: {[key: string]: any}) => {
    if (!user) return;
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, ...updatedFields };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const updatedUser = { ...currentUser, ...updatedFields };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        window.location.reload();
      }
    }
  };

  const navigateToArticle = (articleId: string) => {
    navigate(`/news/${articleId}`);
  };

  return (
    <div className="news-container py-8">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="comments">Мои комментарии</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Личный профиль</CardTitle>
              <CardDescription>Здесь вы можете управлять своим профилем</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="username">Имя пользователя</Label>
                  {editing === 'username' ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSaveUsername}
                        disabled={isCheckingUsername || !!usernameError}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditing(null);
                          setNewUsername(user?.username || '');
                          setUsernameError('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setEditing('username')}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {editing === 'username' ? (
                  <div>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        checkUsernameAvailability(e.target.value);
                      }}
                      maxLength={MAX_USERNAME_LENGTH}
                      className={usernameError ? "border-red-500" : ""}
                    />
                    {isCheckingUsername && (
                      <p className="text-sm text-gray-500 mt-1">Проверка доступности...</p>
                    )}
                    {usernameError && (
                      <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Имя пользователя должно быть уникальным и не превышать {MAX_USERNAME_LENGTH} символов
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-medium">{user?.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="email">Email</Label>
                  {editing === 'email' ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSaveEmail}
                        disabled={isCheckingEmail || !!emailError}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditing(null);
                          setNewEmail(user?.email || '');
                          setEmailError('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setEditing('email')}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {editing === 'email' ? (
                  <div>
                    <Input
                      id="email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        checkEmailAvailability(e.target.value);
                      }}
                      className={emailError ? "border-red-500" : ""}
                    />
                    {isCheckingEmail && (
                      <p className="text-sm text-gray-500 mt-1">Проверка доступности...</p>
                    )}
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-medium">{user?.email || 'Не указан'}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Пароль</Label>
                  {editing === 'password' ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSavePassword}
                        disabled={!!passwordError && (passwordError !== 'Введите текущий пароль')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditing(null);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setEditing('password')}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {editing === 'password' ? (
                  <div className="space-y-3">
                    <div>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Текущий пароль"
                          className={passwordError === 'Неверный текущий пароль' ? "border-red-500 pr-10" : "pr-10"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Новый пароль"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Подтвердите новый пароль"
                    />
                    
                    {passwordError && (
                      <p className="text-red-500 text-sm">{passwordError}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Пароль должен содержать минимум 6 символов
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-medium">••••••••</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Дата регистрации</Label>
                <p className="text-lg font-medium">{registrationDate || 'Не указана'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Мои комментарии</CardTitle>
              <CardDescription>История всех ваших комментариев</CardDescription>
            </CardHeader>
            <CardContent>
              {userComments.length > 0 ? (
                <div className="space-y-4">
                  {userComments.map(comment => (
                    <div key={comment.id} className={`border rounded-md p-4 ${comment.hidden ? 'border-orange-300' : ''}`}>
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold">
                          <span 
                            className="text-amur-blue hover:underline cursor-pointer"
                            onClick={() => navigateToArticle(comment.articleId)}
                          >
                            {comment.articleTitle}
                          </span>
                        </h4>
                        <span className="text-sm text-gray-500">{comment.createdAt}</span>
                      </div>
                      
                      {comment.replyingTo && (
                        <div className="text-sm text-gray-500 mb-2 flex items-center">
                          <Reply size={14} className="mr-1 rotate-180" />
                          Ответ пользователю <span className="font-medium ml-1">{comment.replyingTo}</span>
                        </div>
                      )}
                      
                      <p className="text-gray-700">{comment.content}</p>
                      {comment.hidden && (
                        <p className="text-orange-500 text-sm mt-2">
                          Этот комментарий скрыт администратором
                        </p>
                      )}
                      <div className="mt-2 text-sm text-gray-500">
                        {comment.likes?.length || 0} лайков • {comment.dislikes?.length || 0} дизлайков
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">У вас еще нет комментариев</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
