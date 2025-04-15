
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
  
  useEffect(() => {
    // Проверяем localStorage на наличие новостей, добавленных администратором
    const storedArticles = localStorage.getItem('newsArticles');
    if (storedArticles) {
      const parsedArticles = JSON.parse(storedArticles);
      // Объединяем статьи из пропсов с сохраненными статьями
      setArticles([...parsedArticles, ...propArticles]);
    } else {
      setArticles(propArticles);
    }
  }, [propArticles]);

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
