
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Comment } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import CommentLikeDislike from './CommentLikeDislike';
import { Eye, EyeOff, Trash2, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: string) => void;
  onHideComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDislikeComment?: (commentId: string) => void;
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  onAddComment, 
  onHideComment, 
  onDeleteComment,
  onLikeComment,
  onDislikeComment,
  articleId
}) => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [commentText, setCommentText] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему, чтобы оставить комментарий",
        variant: "destructive",
      });
      return;
    }
    
    if (user?.banned) {
      toast({
        title: "Доступ ограничен",
        description: "Вы не можете оставлять комментарии, так как ваша учетная запись заблокирована",
        variant: "destructive",
      });
      return;
    }
    
    if (!commentText.trim()) {
      toast({
        title: "Ошибка",
        description: "Комментарий не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    onAddComment(commentText);
    setCommentText('');
    
    toast({
      title: "Успешно",
      description: "Ваш комментарий добавлен",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  // Функция для обработки лайка комментария
  const handleLikeComment = (commentId: string) => {
    if (user?.banned) {
      toast({
        title: "Доступ ограничен",
        description: "Вы не можете оценивать комментарии, так как ваша учетная запись заблокирована",
        variant: "destructive",
      });
      return;
    }
    
    if (onLikeComment) {
      onLikeComment(commentId);
    }
  };

  // Функция для обработки дизлайка комментария
  const handleDislikeComment = (commentId: string) => {
    if (user?.banned) {
      toast({
        title: "Доступ ограничен",
        description: "Вы не можете оценивать комментарии, так как ваша учетная запись заблокирована",
        variant: "destructive",
      });
      return;
    }
    
    if (onDislikeComment) {
      onDislikeComment(commentId);
    }
  };

  // Определяем, должен ли пользователь видеть скрытый комментарий
  const canSeeHiddenComment = (comment: Comment) => {
    if (!comment.hidden) return true;
    if (isAdmin) return true;
    if (user && comment.author.id === user.id) return true;
    return false;
  };

  // Компонент для отображения комментария
  const CommentItem = ({ comment }: { comment: Comment }) => {
    if (!canSeeHiddenComment(comment)) return null;
    
    return (
      <div className={`bg-white p-4 rounded-md shadow-sm ${comment.hidden ? 'border-l-4 border-orange-400' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              {comment.author.avatar ? (
                <img src={comment.author.avatar} alt={comment.author.username} />
              ) : (
                <AvatarFallback>{getInitials(comment.author.username)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-semibold">{comment.author.username}</span>
                {comment.author.role === 'admin' && (
                  <Badge variant="outline" className="ml-2 text-purple-500 border-purple-300 flex items-center">
                    <UserCog className="h-3 w-3 mr-1" />
                    Админ
                  </Badge>
                )}
                {comment.author.banned && (
                  <Badge variant="outline" className="ml-2 text-red-500 border-red-300">
                    Заблокирован
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-500">{comment.createdAt}</div>
            </div>
          </div>
          
          {/* Админ-функции для комментариев */}
          {isAdmin && (
            <div className="flex space-x-2">
              {onHideComment && (
                <Button 
                  variant="outline" 
                  size="sm"
                  title={comment.hidden ? "Показать комментарий" : "Скрыть комментарий"}
                  onClick={() => onHideComment(comment.id)}
                >
                  {comment.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              )}
              
              {onDeleteComment && (
                <Button 
                  variant="outline" 
                  size="sm"
                  title="Удалить комментарий"
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
        
        {comment.hidden && (
          <div className="text-sm text-orange-500 mb-3">
            {isAdmin ? 'Этот комментарий скрыт для обычных пользователей' : 'Этот комментарий скрыт администратором'}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <CommentLikeDislike
            commentId={comment.id}
            likes={comment.likes || []}
            dislikes={comment.dislikes || []}
            onLike={() => handleLikeComment(comment.id)}
            onDislike={() => handleDislikeComment(comment.id)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Комментарии ({comments.filter(c => !c.hidden || canSeeHiddenComment(c)).length})</h2>
      
      {isAuthenticated ? (
        user?.banned ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-8">
            <p className="text-red-600">
              Ваша учетная запись заблокирована. Вы не можете оставлять комментарии.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-8">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Напишите ваш комментарий..."
              className="w-full mb-3 h-24"
            />
            <Button type="submit" className="bg-amur-blue hover:bg-amur-lightBlue">
              Отправить комментарий
            </Button>
          </form>
        )
      ) : (
        <div className="bg-amur-gray p-4 rounded-md mb-8">
          <p className="text-gray-700">
            Чтобы оставить комментарий, необходимо <a href="/login" className="text-amur-blue hover:underline">войти</a> или <a href="/register" className="text-amur-blue hover:underline">зарегистрироваться</a>.
          </p>
        </div>
      )}
      
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments
            .filter(comment => !comment.parentId) // Только корневые комментарии
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)) // Сортируем по количеству лайков
            .map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          }
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-md">
          <p className="text-gray-500">Комментариев пока нет. Будьте первым!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
