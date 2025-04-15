
import React from 'react';
import { getLatestNews, getNewsByCategory } from '../data/newsData';
import NewsList from '../components/NewsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsCategory } from '../types';
import { Newspaper } from 'lucide-react';

const Index = () => {
  const latestNews = getLatestNews(5);
  const mainNews = getNewsByCategory('Главное');
  const categories: NewsCategory[] = ['Экономика', 'Культура', 'Спорт'];
  
  return (
    <div className="news-container py-8">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Newspaper className="text-amur-blue mr-2" size={24} />
          <h1 className="text-3xl font-bold text-amur-dark">Главное</h1>
        </div>
        <NewsList articles={mainNews} featured={true} />
      </div>
      
      <Tabs defaultValue="Экономика" className="mt-12">
        <TabsList className="mb-6 bg-white border-b border-gray-200 w-full justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="text-base px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amur-blue"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amur-dark">{category}</h2>
              <a href={`/category/${category}`} className="text-amur-blue hover:underline">
                Все новости
              </a>
            </div>
            <NewsList articles={getNewsByCategory(category).slice(0, 3)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Index;
