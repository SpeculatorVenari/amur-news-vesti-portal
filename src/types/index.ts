
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
  parentId?: string; // ID родительского комментария, если это ответ
  replies?: Comment[]; // ответы на комментарий
  articleId?: string; // ID статьи (для профиля пользователя)
  articleTitle?: string; // Заголовок статьи (для профиля пользователя)
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

export interface SiteSettings {
  contacts: {
    address: string;
    phone: string;
    email: string;
  };
  about: {
    text: string;
    imageUrl: string;
  };
  privacy: string;
  ads: string;
}
