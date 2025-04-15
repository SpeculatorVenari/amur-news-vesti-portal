
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NewsForm from '../components/NewsForm';
import { getNewsById } from '../data/newsData';
import { toast } from '@/hooks/use-toast';

const CreateNews = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast({
        title: "Доступ запрещен",
        description: "Только администраторы могут создавать новости.",
        variant: "destructive",
      });
    }
  }, [isAdmin, navigate]);

  const handleCreateNews = (formData: any) => {
    // В реальном приложении здесь должен быть запрос к API
    // Для демонстрации просто показываем сообщение
    console.log('Новая новость:', formData);
    
    // Добавляем данные, которые обычно генерируются сервером
    const newArticle = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('ru-RU'),
      comments: [],
    };
    
    // В настоящем приложении здесь должно быть сохранение в базу данных
    // Для демо сохраняем в localStorage
    const existingNews = localStorage.getItem('newsArticles');
    let newsArray = [];
    
    if (existingNews) {
      newsArray = JSON.parse(existingNews);
    } else {
      // Если нет сохраненных новостей, используем демо-данные
      newsArray = Object.values(getNewsById('dummy') || {}).filter(Boolean);
    }
    
    newsArray.unshift(newArticle);
    localStorage.setItem('newsArticles', JSON.stringify(newsArray));
    
    // Перенаправляем на страницу созданной новости
    navigate('/');
  };

  if (!isAdmin) {
    return null; // Не рендерим ничего, если пользователь не админ
  }

  return (
    <div className="news-container py-8">
      <h1 className="text-3xl font-bold mb-6 text-amur-dark">Создание новости</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <NewsForm onSubmit={handleCreateNews} />
      </div>
    </div>
  );
};

export default CreateNews;
