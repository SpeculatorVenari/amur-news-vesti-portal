
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsById } from '../data/newsData';
import { NewsArticle, Comment } from '../types';
import { CalendarIcon, ChevronLeft, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      const newsArticle = getNewsById(id);
      if (newsArticle) {
        setArticle(newsArticle);
      }
      setIsLoading(false);
    }
  }, [id]);
  
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
    
    setArticle({
      ...article,
      comments: [...article.comments, newComment],
    });
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
          <div className="flex flex-wrap items-center gap-3 mb-4">
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
          
          <h1 className="text-3xl font-bold text-amur-dark mb-4">{article.title}</h1>
          <p className="text-xl text-gray-700 mb-6">{article.summary}</p>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          <CommentSection comments={article.comments} onAddComment={addComment} />
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
