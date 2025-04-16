
import React from 'react';
import { Ban, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

interface AdminCommentActionsProps {
  commentAuthor: User;
  isHidden: boolean;
  onHideComment: () => void;
  onDeleteComment: () => void;
  onBanUser: () => void;
}

const AdminCommentActions: React.FC<AdminCommentActionsProps> = ({
  commentAuthor,
  isHidden,
  onHideComment,
  onDeleteComment,
  onBanUser
}) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Действия администратора</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Действия администратора</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onHideComment}>
          {isHidden ? (
            <>
              <Eye className="mr-2 h-4 w-4" />
              <span>Показать комментарий</span>
            </>
          ) : (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              <span>Скрыть комментарий</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDeleteComment} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Удалить комментарий</span>
        </DropdownMenuItem>
        {!commentAuthor.banned && commentAuthor.role !== 'admin' && (
          <DropdownMenuItem onClick={onBanUser} className="text-red-600">
            <Ban className="mr-2 h-4 w-4" />
            <span>Заблокировать пользователя</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminCommentActions;
