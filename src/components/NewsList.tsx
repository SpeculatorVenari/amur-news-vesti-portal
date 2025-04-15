
import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import { NewsArticle } from '../types';
import AdminButton from './AdminButton';

interface NewsListProps {
  articles: NewsArticle[];
  featured?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ articles: propArticles, featured = false }) => {
  const [articles, setArticles] = useState<NewsArticle[]>(propArticles);
  
  // Функция для сортировки статей по количеству лайков
  const sortArticlesByLikes = (articlesToSort: NewsArticle[]) => {
    return [...articlesToSort].sort((a, b) => {
      const aLikes = a.likes?.length || 0;
      const bLikes = b.likes?.length || 0;
      return bLikes - aLikes;
    });
  };
  
  useEffect(() => {
    // Проверяем localStorage на наличие новостей, добавленных администратором
    const storedArticles = localStorage.getItem('newsArticles');
    let updatedArticles = [...propArticles];
    
    if (storedArticles) {
      const parsedArticles = JSON.parse(storedArticles);
      
      // Для каждой статьи из пропсов проверяем, есть ли обновленная версия в localStorage
      updatedArticles = propArticles.map(propArticle => {
        const storedArticle = parsedArticles.find((a: NewsArticle) => a.id === propArticle.id);
        return storedArticle || propArticle;
      });
      
      // Добавляем статьи из localStorage, которых нет в пропсах
      const newArticles = parsedArticles.filter((storedArticle: NewsArticle) => 
        !propArticles.some(propArticle => propArticle.id === storedArticle.id)
      );
      
      updatedArticles = [...updatedArticles, ...newArticles];
    }
    
    // Сортируем статьи по количеству лайков
    const sortedArticles = sortArticlesByLikes(updatedArticles);
    setArticles(sortedArticles);
  }, [propArticles]);
  
  // Слушаем события обновления localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedArticles = localStorage.getItem('newsArticles');
      if (storedArticles) {
        const parsedArticles = JSON.parse(storedArticles);
        
        // Обновляем статьи с учётом данных из localStorage
        let updatedArticles = articles.map(article => {
          const storedArticle = parsedArticles.find((a: NewsArticle) => a.id === article.id);
          return storedArticle || article;
        });
        
        // Добавляем новые статьи из localStorage
        const newArticles = parsedArticles.filter((storedArticle: NewsArticle) => 
          !articles.some(article => article.id === storedArticle.id)
        );
        
        updatedArticles = [...updatedArticles, ...newArticles];
        
        // Сортируем статьи по количеству лайков
        const sortedArticles = sortArticlesByLikes(updatedArticles);
        setArticles(sortedArticles);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [articles]);

  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">Новостей по данной категории не найдено</p>
        <div className="mt-4">
          <AdminButton />
        </div>
      </div>
    );
  }

  if (featured) {
    const [mainArticle, ...otherArticles] = articles;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-amur-dark">Главные новости</h2>
          <AdminButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <NewsCard article={mainArticle} featured={true} />
          </div>
          {otherArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amur-dark">Новости</h2>
        <AdminButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsList;
