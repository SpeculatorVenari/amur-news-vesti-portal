
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommentLikeDislikeProps {
  commentId: string;
  likes: string[];
  dislikes: string[];
  onLike: () => void;
  onDislike: () => void;
}

const CommentLikeDislike: React.FC<CommentLikeDislikeProps> = ({
  commentId,
  likes,
  dislikes,
  onLike,
  onDislike
}) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const userLiked = user && likes.includes(user.id);
  const userDisliked = user && dislikes.includes(user.id);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему, чтобы оценить комментарий",
        variant: "destructive",
      });
      return;
    }
    onLike();
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему, чтобы оценить комментарий",
        variant: "destructive",
      });
      return;
    }
    onDislike();
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center ${userLiked ? 'bg-green-100 border-green-500' : ''}`}
        onClick={handleLike}
      >
        <ThumbsUp size={16} className={`mr-1 ${userLiked ? 'text-green-500' : ''}`} />
        <span>{likes.length}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center ${userDisliked ? 'bg-red-100 border-red-500' : ''}`}
        onClick={handleDislike}
      >
        <ThumbsDown size={16} className={`mr-1 ${userDisliked ? 'text-red-500' : ''}`} />
        <span>{dislikes.length}</span>
      </Button>
    </div>
  );
};

export default CommentLikeDislike;
