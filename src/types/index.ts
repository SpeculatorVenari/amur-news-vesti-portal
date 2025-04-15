
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: NewsCategory;
  date: string;
  author?: string;
  comments: Comment[];
}

export type NewsCategory = 'Общество' | 'Экономика' | 'Культура' | 'Спорт' | 'Все';
