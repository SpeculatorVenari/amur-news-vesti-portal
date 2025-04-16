
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-amur-dark text-white mt-10">
      <div className="news-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">АмурВести</h3>
            <p className="text-gray-300">
              Новостной портал Амурской области. Самые актуальные и важные новости региона.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Рубрики</h3>
            <ul className="space-y-2">
              <li><Link to="/category/Главное" className="text-gray-300 hover:text-white">Главное</Link></li>
              <li><Link to="/category/Экономика" className="text-gray-300 hover:text-white">Экономика</Link></li>
              <li><Link to="/category/Культура" className="text-gray-300 hover:text-white">Культура</Link></li>
              <li><Link to="/category/Спорт" className="text-gray-300 hover:text-white">Спорт</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">О нас</h3>
            <ul className="space-y-2">
              <li><Link to="/about/about" className="text-gray-300 hover:text-white">О проекте</Link></li>
              <li><Link to="/about/contacts" className="text-gray-300 hover:text-white">Контакты</Link></li>
              <li><Link to="/about/ads" className="text-gray-300 hover:text-white">Реклама</Link></li>
              <li><Link to="/about/privacy" className="text-gray-300 hover:text-white">Политика конфиденциальности</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <p className="text-gray-300 mb-2">г. Благовещенск, ул. Ленина, 139</p>
            <p className="text-gray-300 mb-2">Телефон: +7 (4162) 99-99-99</p>
            <p className="text-gray-300 mb-2">Email: info@amurvesti.ru</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} АмурВести. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
