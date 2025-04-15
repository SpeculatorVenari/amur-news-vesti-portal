
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Comment, User } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import CommentLikeDislike from './CommentLikeDislike';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

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

  // Сортируем комментарии по количеству лайков (самые залайканные выше)
  const sortedComments = [...comments].sort((a, b) => 
    (b.likes?.length || 0) - (a.likes?.length || 0)
  );

  // Функция для обработки лайка комментария
  const handleLikeComment = (commentId: string) => {
    if (onLikeComment) {
      onLikeComment(commentId);
    }
  };

  // Функция для обработки дизлайка комментария
  const handleDislikeComment = (commentId: string) => {
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

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Комментарии ({comments.filter(c => !c.hidden || canSeeHiddenComment(c)).length})</h2>
      
      {isAuthenticated ? (
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
      ) : (
        <div className="bg-amur-gray p-4 rounded-md mb-8">
          <p className="text-gray-700">
            Чтобы оставить комментарий, необходимо <a href="/login" className="text-amur-blue hover:underline">войти</a> или <a href="/register" className="text-amur-blue hover:underline">зарегистрироваться</a>.
          </p>
        </div>
      )}
      
      {sortedComments.length > 0 ? (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            canSeeHiddenComment(comment) && (
              <div key={comment.id} className={`bg-white p-4 rounded-md shadow-sm ${comment.hidden ? 'border-l-4 border-orange-400' : ''}`}>
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
                      <div className="font-semibold">{comment.author.username}</div>
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
                
                <p className="text-gray-700 mb-3">{comment.content}</p>
                
                {comment.hidden && (
                  <div className="text-sm text-orange-500 mb-3">
                    {isAdmin ? 'Этот комментарий скрыт для обычных пользователей' : 'Этот комментарий скрыт администратором'}
                  </div>
                )}
                
                <CommentLikeDislike
                  commentId={comment.id}
                  likes={comment.likes || []}
                  dislikes={comment.dislikes || []}
                  onLike={() => handleLikeComment(comment.id)}
                  onDislike={() => handleDislikeComment(comment.id)}
                />
              </div>
            )
          ))}
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
