
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, SiteSettings } from '../types';
import { Ban, UserCheck, Search, UserX, Users, Settings, User as UserIcon, Info, Phone, Shield, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState<SiteSettings>({
    contacts: {
      address: '',
      phone: '',
      email: ''
    },
    about: {
      text: '',
      imageUrl: ''
    },
    privacy: '',
    ads: ''
  });

  // Инициализация формы настроек сайта
  const settingsForm = useForm<SiteSettings>({
    defaultValues: settings
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast({
        title: "Доступ запрещен",
        description: "Только администраторы могут получить доступ к этой странице",
        variant: "destructive",
      });
      return;
    }
    
    // Загружаем пользователей из localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      // Удаляем пароли из отображаемых данных
      const parsedUsers = JSON.parse(storedUsers).map((user: any) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      setUsers(parsedUsers);
      setFilteredUsers(parsedUsers);
    }

    // Загружаем настройки сайта
    const storedSettings = localStorage.getItem('siteSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings(parsedSettings);
      settingsForm.reset(parsedSettings);
    }
  }, [isAdmin, navigate]);

  // Фильтрация пользователей при изменении поискового запроса
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Функция для бана/разбана пользователя
  const toggleBanUser = (userId: string) => {
    // Обновляем список отображаемых пользователей
    const updatedDisplayUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, banned: !user.banned };
      }
      return user;
    });
    setUsers(updatedDisplayUsers);
    
    // Обновляем данные в localStorage (сохраняя пароли)
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const updatedStoredUsers = parsedUsers.map((user: any) => {
        if (user.id === userId) {
          return { ...user, banned: !user.banned };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedStoredUsers));
    }
    
    const user = updatedDisplayUsers.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.banned ? "Пользователь заблокирован" : "Пользователь разблокирован",
        description: `Пользователь ${user.username} успешно ${user.banned ? "заблокирован" : "разблокирован"}`,
      });
    }
  };

  // Сохранение настроек сайта
  const saveSettings = (data: SiteSettings) => {
    localStorage.setItem('siteSettings', JSON.stringify(data));
    setSettings(data);
    toast({
      title: "Настройки сохранены",
      description: "Настройки сайта успешно обновлены",
    });
  };

  // Обработчик изменения изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedSettings = { 
          ...settingsForm.getValues(),
          about: {
            ...settingsForm.getValues().about,
            imageUrl: base64String
          }
        };
        settingsForm.setValue('about.imageUrl', base64String);
        setSettings(updatedSettings);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="news-container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Панель администратора</CardTitle>
          <CardDescription>Управление пользователями и настройками сайта</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Главная
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Пользователи
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Контакты
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                О проекте
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Политика
              </TabsTrigger>
              <TabsTrigger value="ads" className="flex items-center">
                <Image className="mr-2 h-4 w-4" />
                Реклама
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveTab('users')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Управление пользователями сайта
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveTab('contacts')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Контактные данные</CardTitle>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Настройка</div>
                    <p className="text-xs text-muted-foreground">
                      Адрес, телефон, почта
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveTab('about')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">О проекте</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Информация</div>
                    <p className="text-xs text-muted-foreground">
                      Редактирование основной информации
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Имя пользователя</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Роль</th>
                      <th className="p-3 text-left">Статус</th>
                      <th className="p-3 text-left">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200">
                          <td className="p-3">{user.username}</td>
                          <td className="p-3">{user.email || 'Н/Д'}</td>
                          <td className="p-3">{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.banned ? (
                                <>
                                  <UserX size={12} className="mr-1" />
                                  Заблокирован
                                </>
                              ) : (
                                <>
                                  <UserCheck size={12} className="mr-1" />
                                  Активен
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-3">
                            {user.role !== 'admin' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleBanUser(user.id)}
                                className={`flex items-center space-x-1 ${
                                  user.banned 
                                    ? 'text-green-600 hover:bg-green-50' 
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                              >
                                {user.banned ? (
                                  <>
                                    <UserCheck size={16} />
                                    <span>Разблокировать</span>
                                  </>
                                ) : (
                                  <>
                                    <Ban size={16} />
                                    <span>Заблокировать</span>
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-gray-500">
                          {searchTerm ? 'Пользователи не найдены' : 'Нет зарегистрированных пользователей'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <form onSubmit={settingsForm.handleSubmit(saveSettings)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      value={settingsForm.watch('contacts.address')}
                      onChange={(e) => settingsForm.setValue('contacts.address', e.target.value)}
                      placeholder="Введите адрес организации"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={settingsForm.watch('contacts.phone')}
                      onChange={(e) => settingsForm.setValue('contacts.phone', e.target.value)}
                      placeholder="Введите номер телефона"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email для связи</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settingsForm.watch('contacts.email')}
                    onChange={(e) => settingsForm.setValue('contacts.email', e.target.value)}
                    placeholder="Введите email для обратной связи"
                  />
                </div>
                
                <Button type="submit">Сохранить контактные данные</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="about">
              <form onSubmit={settingsForm.handleSubmit(saveSettings)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="about-text">Информация о проекте</Label>
                  <Textarea
                    id="about-text"
                    value={settingsForm.watch('about.text')}
                    onChange={(e) => settingsForm.setValue('about.text', e.target.value)}
                    placeholder="Описание проекта"
                    rows={8}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about-image">Изображение</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Input
                        id="about-image"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Рекомендуемый формат: JPG или PNG
                      </p>
                    </div>
                    <div className="flex justify-center items-center border rounded">
                      {settingsForm.watch('about.imageUrl') ? (
                        <img 
                          src={settingsForm.watch('about.imageUrl')} 
                          alt="О проекте" 
                          className="max-h-40 object-contain"
                        />
                      ) : (
                        <p className="text-gray-400 p-4">Изображение не выбрано</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button type="submit">Сохранить информацию</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="privacy">
              <form onSubmit={settingsForm.handleSubmit(saveSettings)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="privacy-text">Политика конфиденциальности</Label>
                  <Textarea
                    id="privacy-text"
                    value={settingsForm.watch('privacy')}
                    onChange={(e) => settingsForm.setValue('privacy', e.target.value)}
                    placeholder="Введите текст политики конфиденциальности"
                    rows={15}
                  />
                </div>
                
                <Button type="submit">Сохранить политику конфиденциальности</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="ads">
              <form onSubmit={settingsForm.handleSubmit(saveSettings)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ads-text">Информация о рекламе</Label>
                  <Textarea
                    id="ads-text"
                    value={settingsForm.watch('ads')}
                    onChange={(e) => settingsForm.setValue('ads', e.target.value)}
                    placeholder="Введите информацию о рекламе на сайте"
                    rows={10}
                  />
                </div>
                
                <Button type="submit">Сохранить информацию о рекламе</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
