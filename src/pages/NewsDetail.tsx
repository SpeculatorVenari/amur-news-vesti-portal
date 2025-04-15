
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getNewsById } from '../data/newsData';
import { NewsArticle, Comment } from '../types';
import { CalendarIcon, ChevronLeft, User, Edit, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LikeDislikeButtons from '../components/LikeDislikeButtons';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const loadArticle = () => {
    if (id) {
      // Сначала ищем статью в localStorage
      const storedArticles = localStorage.getItem('newsArticles');
      if (storedArticles) {
        const parsedArticles = JSON.parse(storedArticles);
        const storedArticle = parsedArticles.find((a: NewsArticle) => a.id === id);
        if (storedArticle) {
          setArticle(storedArticle);
          setIsLoading(false);
          return;
        }
      }
      
      // Если в localStorage не найдено, берем из исходных данных
      const newsArticle = getNewsById(id);
      if (newsArticle) {
        // Инициализируем массивы лайков и дизлайков, если их нет
        if (!newsArticle.likes) newsArticle.likes = [];
        if (!newsArticle.dislikes) newsArticle.dislikes = [];
        setArticle(newsArticle);
      }
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadArticle();
  }, [id]);
  
  // Слушаем события обновления localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      loadArticle();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [id]);
  
  const handleEdit = () => {
    if (article) {
      // Сохраняем статью во временное хранилище для редактирования
      localStorage.setItem('editingArticle', JSON.stringify(article));
      navigate(`/edit-news/${article.id}`);
    }
  };
  
  const handleLike = () => {
    if (!article || !user) return;
    
    const updatedArticle = { ...article };
    const userId = user.id;
    
    const likeIndex = updatedArticle.likes.indexOf(userId);
    const dislikeIndex = updatedArticle.dislikes.indexOf(userId);
    
    if (likeIndex === -1) {
      updatedArticle.likes.push(userId);
      if (dislikeIndex !== -1) {
        updatedArticle.dislikes.splice(dislikeIndex, 1);
      }
    } else {
      updatedArticle.likes.splice(likeIndex, 1);
    }
    
    // Сохраняем обновленную статью в localStorage
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
    setArticle(updatedArticle);
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleDislike = () => {
    if (!article || !user) return;
    
    const updatedArticle = { ...article };
    const userId = user.id;
    
    const dislikeIndex = updatedArticle.dislikes.indexOf(userId);
    const likeIndex = updatedArticle.likes.indexOf(userId);
    
    if (dislikeIndex === -1) {
      updatedArticle.dislikes.push(userId);
      if (likeIndex !== -1) {
        updatedArticle.likes.splice(likeIndex, 1);
      }
    } else {
      updatedArticle.dislikes.splice(dislikeIndex, 1);
    }
    
    // Сохраняем обновленную статью в localStorage
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
    setArticle(updatedArticle);
    window.dispatchEvent(new Event('storage'));
  };
  
  if (isLoading) {
    return (
      <div className="news-container py-12">
        <div className="text-center">
          <p className="text-xl">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="news-container py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Новость не найдена</h1>
          <p className="mb-6">Запрашиваемая новость не существует или была удалена.</p>
          <Link to="/" className="text-amur-blue hover:underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }
  
  const addComment = (content: string) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: user,
      createdAt: new Date().toLocaleDateString('ru-RU'),
    };
    
    const updatedArticle = {
      ...article,
      comments: [...article.comments, newComment],
    };
    
    setArticle(updatedArticle);
    
    // Сохраняем комментарий в localStorage
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
  };
  
  return (
    <div className="news-container py-8">
      <Link to="/" className="inline-flex items-center text-amur-blue hover:underline mb-6">
        <ChevronLeft size={16} className="mr-1" />
        Вернуться на главную
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-amur-blue text-white">
                {article.category}
              </Badge>
              <div className="flex items-center text-gray-500">
                <CalendarIcon size={16} className="mr-1" />
                <span>{article.date}</span>
              </div>
              {article.author && (
                <div className="flex items-center text-gray-500">
                  <User size={16} className="mr-1" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleEdit}
              >
                <Edit size={16} />
                <span>Редактировать</span>
              </Button>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-amur-dark mb-4">{article.title}</h1>
          <p className="text-xl text-gray-700 mb-6">{article.summary}</p>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          <div className="mt-8">
            <LikeDislikeButtons 
              articleId={article.id}
              likes={article.likes || []}
              dislikes={article.dislikes || []}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          </div>
          
          <CommentSection comments={article.comments} onAddComment={addComment} />
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
