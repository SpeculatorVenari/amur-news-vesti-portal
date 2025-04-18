import React from 'react';
import { Comment } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface UserCommentsListProps {
  comments: Comment[];
}

const UserCommentsList: React.FC<UserCommentsListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">У пользователя нет комментариев</p>
      </div>
    );
  }

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Функция для безопасного преобразования строковой даты в объект Date
  const safeParseDate = (dateString: string) => {
    try {
      // Проверяем, является ли дата форматом ISO
      if (dateString.includes('T') || dateString.includes('-')) {
        return parseISO(dateString);
      }
      
      // Пробуем распарсить из локализованного формата DD.MM.YYYY
      if (dateString.includes('.')) {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day);
      }
      
      // Если ничего не сработало, возвращаем текущую дату
      return new Date();
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return new Date();
    }
  };

  return (
    <div className="space-y-4 w-full max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
      {sortedComments.map(comment => (
        <Card key={comment.id} className={comment.hidden ? 'border-orange-300' : ''}>
          <CardContent className="pt-4">
            <div className="flex justify-between mb-2">
              <Link 
                to={`/news/${comment.articleId}`} 
                className="font-medium text-blue-600 hover:underline"
              >
                {comment.articleTitle}
              </Link>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(safeParseDate(comment.createdAt), { 
                  addSuffix: true,
                  locale: ru 
                })}
              </div>
            </div>
            
            <div className="flex space-x-2 mb-1">
              {comment.hidden && (
                <Badge variant="outline" className="text-orange-500 border-orange-300">
                  Скрыт
                </Badge>
              )}
            </div>
            
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>{comment.likes?.length || 0} лайков</span>
                <span>{comment.dislikes?.length || 0} дизлайков</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserCommentsList;
