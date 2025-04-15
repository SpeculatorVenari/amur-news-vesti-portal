
import React from 'react';
import NewsCard from './NewsCard';
import { NewsArticle } from '../types';

interface NewsListProps {
  articles: NewsArticle[];
  featured?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ articles, featured = false }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">Новостей по данной категории не найдено</p>
      </div>
    );
  }

  if (featured) {
    const [mainArticle, ...otherArticles] = articles;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <NewsCard article={mainArticle} featured={true} />
        </div>
        {otherArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default NewsList;
