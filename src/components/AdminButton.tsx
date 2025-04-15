
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

const AdminButton = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <Link to="/create-news">
      <Button variant="outline" className="flex items-center gap-2 bg-amur-blue text-white hover:bg-amur-blue/90">
        <PlusCircle size={16} />
        <span>Добавить новость</span>
      </Button>
    </Link>
  );
};

export default AdminButton;
