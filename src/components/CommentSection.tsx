
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Comment, User } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import CommentLikeDislike from './CommentLikeDislike';
import { Eye, EyeOff, Trash2, Reply, X, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: string, parentId?: string, replyingTo?: string) => void;
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
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyingToUsername, setReplyingToUsername] = useState<string>('');
  const { toast } = useToast();
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the reply textarea when it appears
  useEffect(() => {
    if (replyToId && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [replyToId]);

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

  const handleReply = (commentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему, чтобы ответить на комментарий",
        variant: "destructive",
      });
      return;
    }
    
    if (user?.banned) {
      toast({
        title: "Доступ ограничен",
        description: "Вы не можете отвечать на комментарии, так как ваша учетная запись заблокирована",
        variant: "destructive",
      });
      return;
    }
    
    if (!replyText.trim()) {
      toast({
        title: "Ошибка",
        description: "Ответ не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    onAddComment(replyText, commentId, replyingToUsername);
    setReplyText('');
    setReplyToId(null);
    setReplyingToUsername('');
    
    toast({
      title: "Успешно",
      description: "Ваш ответ добавлен",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  // Преобразуем комментарии в древовидную структуру
  const organizeComments = (flatComments: Comment[]) => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];
    
    // Сначала создаем карту для всех комментариев
    flatComments.forEach(comment => {
      // Клонируем комментарий и убеждаемся, что у него есть массив replies
      const commentCopy = { ...comment, replies: [] };
      commentMap.set(comment.id, commentCopy);
    });
    
    // Затем организуем комментарии в древовидную структуру
    flatComments.forEach(comment => {
      if (comment.parentId && commentMap.has(comment.parentId)) {
        // Это ответный комментарий, добавляем его к родительскому
        const parentComment = commentMap.get(comment.parentId)!;
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(commentMap.get(comment.id)!);
      } else {
        // Это корневой комментарий
        rootComments.push(commentMap.get(comment.id)!);
      }
    });
    
    // Сортируем комментарии по количеству лайков (самые залайканные выше)
    return rootComments.sort((a, b) => 
      (b.likes?.length || 0) - (a.likes?.length || 0)
    );
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

  // Организуем комментарии в древовидную структуру
  const organizedComments = organizeComments(comments);

  // Компонент для отображения комментария
  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
    if (!canSeeHiddenComment(comment)) return null;
    
    return (
      <div className={`${isReply ? 'ml-8 mt-3 border-l-4 border-gray-200 pl-4' : ''} bg-white p-4 rounded-md shadow-sm ${comment.hidden ? 'border-l-4 border-orange-400' : ''}`}>
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
        
        {comment.replyingTo && (
          <div className="text-sm text-gray-500 mb-2 flex items-center">
            <Reply size={14} className="mr-1 rotate-180" />
            Ответ пользователю <span className="font-medium ml-1">{comment.replyingTo}</span>
          </div>
        )}
        
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
          
          {isAuthenticated && !user?.banned && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-amur-blue"
              onClick={() => {
                if (replyToId === comment.id) {
                  setReplyToId(null);
                  setReplyingToUsername('');
                } else {
                  setReplyToId(comment.id);
                  setReplyingToUsername(comment.author.username);
                }
              }}
            >
              <Reply size={16} className="mr-1" />
              {replyToId === comment.id ? "Отмена" : "Ответить"}
            </Button>
          )}
        </div>
        
        {/* Форма для ответа на комментарий */}
        {replyToId === comment.id && (
          <div className="mt-3 border-t pt-3">
            <div className="flex items-start space-x-2">
              <Textarea
                ref={replyTextareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Ответ для ${comment.author.username}...`}
                className="flex-1 text-sm"
                rows={2}
              />
              <div className="flex flex-col space-y-2">
                <Button 
                  size="sm" 
                  className="bg-amur-blue hover:bg-amur-lightBlue"
                  onClick={() => handleReply(comment.id)}
                >
                  Отправить
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => {
                    setReplyToId(null);
                    setReplyText('');
                    setReplyingToUsername('');
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Отображаем ответы на комментарий */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
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
      
      {organizedComments.length > 0 ? (
        <div className="space-y-6">
          {organizedComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
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
