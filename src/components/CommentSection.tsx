
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Comment, User } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const { isAuthenticated, user } = useAuth();
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

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Комментарии ({comments.length})</h2>
      
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
      
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex items-center mb-3">
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
              <p className="text-gray-700">{comment.content}</p>
            </div>
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
