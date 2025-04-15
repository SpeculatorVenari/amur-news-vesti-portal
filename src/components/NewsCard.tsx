
import React from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../types';
import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
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
    </div>
  );
};

export default NewsCard;
