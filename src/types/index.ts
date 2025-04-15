
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  banned?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes?: string[]; // массив ID пользователей, которые поставили лайк
  dislikes?: string[]; // массив ID пользователей, которые поставили дизлайк
  hidden?: boolean; // скрыт ли комментарий администратором
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
  likes: string[]; // массив ID пользователей, которые поставили лайк
  dislikes: string[]; // массив ID пользователей, которые поставили дизлайк
}

export type NewsCategory = 'Главное' | 'Экономика' | 'Культура' | 'Спорт' | 'Все';
