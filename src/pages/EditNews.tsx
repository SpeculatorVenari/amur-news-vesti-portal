
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NewsForm from '../components/NewsForm';
import { NewsArticle } from '../types';
import { toast } from '@/hooks/use-toast';

const EditNews = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast({
        title: "Доступ запрещен",
        description: "Только администраторы могут редактировать новости.",
        variant: "destructive",
      });
      return;
    }

    // Получаем статью из временного хранилища
    const editingArticle = localStorage.getItem('editingArticle');
    if (editingArticle) {
      setArticle(JSON.parse(editingArticle));
    } else {
      // Если нет во временном хранилище, ищем в основном хранилище
      const storedArticles = localStorage.getItem('newsArticles');
      if (storedArticles) {
        const parsedArticles = JSON.parse(storedArticles);
        const foundArticle = parsedArticles.find((a: NewsArticle) => a.id === id);
        if (foundArticle) {
          setArticle(foundArticle);
        }
      }
    }
  }, [id, isAdmin, navigate]);

  const handleUpdateNews = (formData: any) => {
    if (!article) return;
    
    // Сохраняем исходные данные, которые не изменяются в форме
    const updatedArticle = {
      ...article,
      ...formData,
      id: article.id,
      date: article.date,
      comments: article.comments,
      likes: article.likes,
      dislikes: article.dislikes
    };
    
    // Обновляем статью в localStorage
    const storedArticles = localStorage.getItem('newsArticles');
    let newsArray = [];
    
    if (storedArticles) {
      newsArray = JSON.parse(storedArticles);
      const articleIndex = newsArray.findIndex((a: NewsArticle) => a.id === article.id);
      
      if (articleIndex !== -1) {
        newsArray[articleIndex] = updatedArticle;
      } else {
        newsArray.push(updatedArticle);
      }
    } else {
      newsArray.push(updatedArticle);
    }
    
    localStorage.setItem('newsArticles', JSON.stringify(newsArray));
    
    // Очищаем временное хранилище
    localStorage.removeItem('editingArticle');
    
    // Показываем уведомление и перенаправляем на страницу новости
    toast({
      title: "Новость обновлена",
      description: "Изменения успешно сохранены",
    });
    
    navigate(`/news/${article.id}`);
  };

  if (!isAdmin || !article) {
    return null;
  }

  return (
    <div className="news-container py-8">
      <h1 className="text-3xl font-bold mb-6 text-amur-dark">Редактирование новости</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <NewsForm onSubmit={handleUpdateNews} initialData={article as any} />
      </div>
    </div>
  );
};

export default EditNews;
