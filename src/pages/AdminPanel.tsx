
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User } from '../types';
import { Ban, UserCheck, Search, UserX, Users, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
      setFilteredUsers(parsedUsers);
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
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, banned: !user.banned };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const user = updatedUsers.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.banned ? "Пользователь заблокирован" : "Пользователь разблокирован",
        description: `Пользователь ${user.username} успешно ${user.banned ? "заблокирован" : "разблокирован"}`,
      });
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
          <CardDescription>Управление пользователями и контентом сайта</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Пользователи
              </TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
            </TabsList>
            
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
            
            <TabsContent value="stats">
              <div className="text-center py-10">
                <p className="text-gray-500">Статистика пользователей и контента будет добавлена в будущих обновлениях.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
