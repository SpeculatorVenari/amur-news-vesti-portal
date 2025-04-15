
import React from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../types';
import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LikeDislikeButtons from './LikeDislikeButtons';
import { getNewsById } from '../data/newsData';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const handleLike = () => {
    const updatedArticle = { ...article };
    const existingNews = localStorage.getItem('newsArticles');
    let newsArray = [];
    
    if (existingNews) {
      newsArray = JSON.parse(existingNews);
    }
    
    // Получаем текущую версию статьи из localStorage, если она там есть
    const storedArticleIndex = newsArray.findIndex((a: NewsArticle) => a.id === article.id);
    
    if (storedArticleIndex !== -1) {
      updatedArticle.likes = [...newsArray[storedArticleIndex].likes];
      updatedArticle.dislikes = [...newsArray[storedArticleIndex].dislikes];
    }
    
    // Используем оригинальные данные, если статьи нет в localStorage
    const originalArticle = getNewsById(article.id);
    if (!updatedArticle.likes && originalArticle) {
      updatedArticle.likes = originalArticle.likes || [];
      updatedArticle.dislikes = originalArticle.dislikes || [];
    }
    
    // Если массивов всё ещё нет, создаём их
    if (!updatedArticle.likes) updatedArticle.likes = [];
    if (!updatedArticle.dislikes) updatedArticle.dislikes = [];
    
    // Обновляем лайки
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    if (!userId) return;
    
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
    
    // Сохраняем обновленную статью
    if (storedArticleIndex !== -1) {
      newsArray[storedArticleIndex] = updatedArticle;
    } else {
      newsArray.push(updatedArticle);
    }
    
    localStorage.setItem('newsArticles', JSON.stringify(newsArray));
    
    // Принудительно перерисовываем компонент
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleDislike = () => {
    const updatedArticle = { ...article };
    const existingNews = localStorage.getItem('newsArticles');
    let newsArray = [];
    
    if (existingNews) {
      newsArray = JSON.parse(existingNews);
    }
    
    // Получаем текущую версию статьи из localStorage, если она там есть
    const storedArticleIndex = newsArray.findIndex((a: NewsArticle) => a.id === article.id);
    
    if (storedArticleIndex !== -1) {
      updatedArticle.likes = [...newsArray[storedArticleIndex].likes];
      updatedArticle.dislikes = [...newsArray[storedArticleIndex].dislikes];
    }
    
    // Используем оригинальные данные, если статьи нет в localStorage
    const originalArticle = getNewsById(article.id);
    if (!updatedArticle.dislikes && originalArticle) {
      updatedArticle.likes = originalArticle.likes || [];
      updatedArticle.dislikes = originalArticle.dislikes || [];
    }
    
    // Если массивов всё ещё нет, создаём их
    if (!updatedArticle.likes) updatedArticle.likes = [];
    if (!updatedArticle.dislikes) updatedArticle.dislikes = [];
    
    // Обновляем дизлайки
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    if (!userId) return;
    
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
    
    // Сохраняем обновленную статью
    if (storedArticleIndex !== -1) {
      newsArray[storedArticleIndex] = updatedArticle;
    } else {
      newsArray.push(updatedArticle);
    }
    
    localStorage.setItem('newsArticles', JSON.stringify(newsArray));
    
    // Принудительно перерисовываем компонент
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className={`overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${featured ? 'col-span-2' : ''}`}>
      <Link to={`/news/${article.id}`}>
        <div className="relative">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className={`w-full object-cover ${featured ? 'h-64' : 'h-48'}`}
          />
          <Badge className="absolute top-3 right-3 bg-amur-blue text-white">
            {article.category}
          </Badge>
        </div>
        
        <div className="p-4">
          <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold text-amur-dark line-clamp-2 mb-2`}>
            {article.title}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
          
          <div className="flex items-center text-gray-500 text-sm">
            <CalendarIcon size={14} className="mr-1" />
            <span className="mr-3">{article.date}</span>
            {article.author && <span>Автор: {article.author}</span>}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <LikeDislikeButtons 
          articleId={article.id}
          likes={article.likes || []}
          dislikes={article.dislikes || []}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      </div>
    </div>
  );
};

export default NewsCard;
