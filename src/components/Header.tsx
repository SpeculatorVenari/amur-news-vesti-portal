
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  Search as SearchIcon,
  Settings,
  Users,
  Info,
  Phone,
  Shield,
  Image
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-amur-blue text-white shadow-md sticky top-0 z-50">
      <div className="news-container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold">АмурВести</Link>
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/" className="px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors">
                Главное
              </Link>
              <Link to="/category/Экономика" className="px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors">
                Экономика
              </Link>
              <Link to="/category/Культура" className="px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors">
                Культура
              </Link>
              <Link to="/category/Спорт" className="px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors">
                Спорт
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-amur-lightBlue flex items-center">
                    О нас
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/about/about" className="flex items-center">
                      <Info className="mr-2 h-4 w-4" />
                      <span>О проекте</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about/contacts" className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>Контакты</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about/privacy" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Политика конфиденциальности</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about/ads" className="flex items-center">
                      <Image className="mr-2 h-4 w-4" />
                      <span>Реклама</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {isAdmin && (
                <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors flex items-center">
                  <Settings className="mr-1 h-4 w-4" />
                  Управление
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Поиск..." 
                className="pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-amur-lightBlue">
                    {user?.username}
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Панель управления</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button asChild variant="secondary" className="bg-white text-amur-blue hover:bg-gray-100">
                  <Link to="/login">Войти</Link>
                </Button>
                <Button asChild className="bg-amur-lightBlue hover:bg-blue-600 text-white">
                  <Link to="/register">Регистрация</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={24} />
              </Button>
            ) : (
              <>
                <Button asChild variant="secondary" size="sm" className="bg-white text-amur-blue">
                  <Link to="/login">Войти</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <Menu size={24} />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Главное
              </Link>
              <Link 
                to="/category/Экономика" 
                className="block px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Экономика
              </Link>
              <Link 
                to="/category/Культура" 
                className="block px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Культура
              </Link>
              <Link 
                to="/category/Спорт" 
                className="block px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Спорт
              </Link>
              
              <div className="px-3 py-2 text-white/80">О нас:</div>
              <Link 
                to="/about/about" 
                className="block px-6 py-2 rounded-md hover:bg-amur-lightBlue transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info className="mr-1 h-4 w-4" />
                О проекте
              </Link>
              <Link 
                to="/about/contacts" 
                className="block px-6 py-2 rounded-md hover:bg-amur-lightBlue transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="mr-1 h-4 w-4" />
                Контакты
              </Link>
              <Link 
                to="/about/privacy" 
                className="block px-6 py-2 rounded-md hover:bg-amur-lightBlue transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="mr-1 h-4 w-4" />
                Политика
              </Link>
              <Link 
                to="/about/ads" 
                className="block px-6 py-2 rounded-md hover:bg-amur-lightBlue transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image className="mr-1 h-4 w-4" />
                Реклама
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 rounded-md hover:bg-amur-lightBlue transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="mr-1 h-4 w-4" />
                  Управление
                </Link>
              )}
            </div>
            
            <div className="mt-4">
              <div className="relative mb-4">
                <Input 
                  type="text" 
                  placeholder="Поиск..." 
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="px-3 py-1">{user?.username}</p>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-amur-lightBlue">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </Button>
                  
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white hover:bg-amur-lightBlue"
                      asChild
                    >
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Панель управления</span>
                      </Link>
                    </Button>
                  )}
                  
                  <Button variant="ghost" onClick={logout} className="w-full justify-start text-white hover:bg-amur-lightBlue">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button asChild variant="secondary" className="w-full bg-white text-amur-blue hover:bg-gray-100">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Войти</Link>
                  </Button>
                  <Button asChild className="w-full bg-amur-lightBlue hover:bg-blue-600 text-white">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Регистрация</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
