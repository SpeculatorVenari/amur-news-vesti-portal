
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsByCategory } from '../data/newsData';
import NewsList from '../components/NewsList';
import { NewsCategory } from '../types';
import { Folder, ChevronLeft } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const validCategory = (category as NewsCategory) || 'Все';
  const articles = getNewsByCategory(validCategory);
  
  return (
    <div className="news-container py-8">
      <Link to="/" className="inline-flex items-center text-amur-blue hover:underline mb-6">
        <ChevronLeft size={16} className="mr-1" />
        Вернуться на главную
      </Link>
      
      <div className="flex items-center mb-8">
        <Folder className="text-amur-blue mr-2" size={24} />
        <h1 className="text-3xl font-bold text-amur-dark">Новости: {validCategory}</h1>
      </div>
      
      {articles.length > 0 ? (
        <NewsList articles={articles} />
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-xl text-gray-500">В данной категории пока нет новостей</p>
          <Link to="/" className="mt-4 inline-block text-amur-blue hover:underline">
            Вернуться на главную
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
