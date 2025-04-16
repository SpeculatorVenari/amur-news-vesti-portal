
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Info, Phone, Shield, Image } from 'lucide-react';

type AboutSection = 'about' | 'contacts' | 'privacy' | 'ads';

const AboutPage = () => {
  const { section = 'about' } = useParams<{ section: AboutSection }>();
  const [settings, setSettings] = useState({
    contacts: {
      address: '',
      phone: '',
      email: '',
    },
    about: {
      text: '',
      imageUrl: '/placeholder.svg',
    },
    privacy: '',
    ads: '',
  });

  useEffect(() => {
    // Загрузка настроек из localStorage
    const storedSettings = localStorage.getItem('siteSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const renderContent = () => {
    switch (section) {
      case 'contacts':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium">Наш адрес</h3>
                <p className="mt-2">{settings.contacts.address || 'Не указан'}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Телефон</h3>
                <p className="mt-2">{settings.contacts.phone || 'Не указан'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Email для связи</h3>
              <p className="mt-2">{settings.contacts.email || 'Не указан'}</p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="prose max-w-none">
            <div className="whitespace-pre-line">
              {settings.privacy || 'Политика конфиденциальности не определена'}
            </div>
          </div>
        );
      case 'ads':
        return (
          <div className="prose max-w-none">
            <div className="whitespace-pre-line">
              {settings.ads || 'Информация о рекламе не определена'}
            </div>
          </div>
        );
      case 'about':
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img 
                  src={settings.about.imageUrl || '/placeholder.svg'} 
                  alt="О проекте" 
                  className="w-full h-auto rounded-md shadow-md"
                />
              </div>
              <div className="md:w-2/3 whitespace-pre-line">
                {settings.about.text || 'Информация о проекте не определена'}
              </div>
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (section) {
      case 'contacts': return 'Контакты';
      case 'privacy': return 'Политика конфиденциальности';
      case 'ads': return 'Реклама на сайте';
      case 'about':
      default: return 'О проекте';
    }
  };

  const getIcon = () => {
    switch (section) {
      case 'contacts': return <Phone className="h-5 w-5" />;
      case 'privacy': return <Shield className="h-5 w-5" />;
      case 'ads': return <Image className="h-5 w-5" />;
      case 'about':
      default: return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="news-container py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-amur-blue hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          На главную
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          </div>
          <CardDescription>
            Информация о проекте АмурВести
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Link 
              to="/about/about" 
              className={`inline-flex items-center px-3 py-2 rounded-md ${
                section === 'about' ? 'bg-amur-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Info className="mr-2 h-4 w-4" />
              О проекте
            </Link>
            <Link 
              to="/about/contacts" 
              className={`inline-flex items-center px-3 py-2 rounded-md ${
                section === 'contacts' ? 'bg-amur-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Phone className="mr-2 h-4 w-4" />
              Контакты
            </Link>
            <Link 
              to="/about/privacy" 
              className={`inline-flex items-center px-3 py-2 rounded-md ${
                section === 'privacy' ? 'bg-amur-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Shield className="mr-2 h-4 w-4" />
              Политика конфиденциальности
            </Link>
            <Link 
              to="/about/ads" 
              className={`inline-flex items-center px-3 py-2 rounded-md ${
                section === 'ads' ? 'bg-amur-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Image className="mr-2 h-4 w-4" />
              Реклама
            </Link>
          </div>
          
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
