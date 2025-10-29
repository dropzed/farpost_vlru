import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1368px] mx-auto px-4 lg:px-0">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex-shrink-0">
              <img src="/vlru-logo.svg" alt="" style={{marginTop: '-10px'}}/>
            </Link>

            {/* Десктопная навигация */}
            <nav className="hidden md:flex items-center gap-12">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text"
                }`}
              >
                Главная
              </Link>
              <Link
                to="/outages"
                className={`px-7 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/outages")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text"
                }`}
              >
                Отключения
              </Link>
              <Link
                to="/map"
                className={`px-7 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/map")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text"
                }`}
              >
                Карта
              </Link>
              <Link
                to="/organizations"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/organizations")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text"
                }`}
              >
                Организации
              </Link>
            </nav>

            {/* Кнопка мобильного меню */}
            <div className="flex items-center gap-2">
              <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-border bg-gray-light text-sm font-medium text-dark-text hover:bg-gray-border transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.6667 14V12.6667C12.6667 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7072 10 10 10H6C5.29276 10 4.61448 10.281 4.11438 10.781C3.61429 11.2811 3.33333 11.9594 3.33333 12.6667V14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 7.33333C9.47276 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47276 2 8 2C6.52724 2 5.33333 3.19391 5.33333 4.66667C5.33333 6.13943 6.52724 7.33333 8 7.33333Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Войти
              </button>

              <button 
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-border bg-gray-light text-dark-text hover:bg-gray-border transition-colors"
                onClick={toggleMobileMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isMobileMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Мобильная навигация */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-66 opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text hover:bg-gray-100"
                }`}
              >
                Главная
              </Link>
              <Link
                to="/outages"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/outages")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text hover:bg-gray-100"
                }`}
              >
                Отключения
              </Link>
              <Link
                to="/map"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/map")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text hover:bg-gray-100"
                }`}
              >
                Карта
              </Link>
              <Link
                to="/organizations"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/organizations")
                    ? "bg-orange-primary text-white"
                    : "text-gray-text hover:text-dark-text hover:bg-gray-100"
                }`}
              >
                Организации
              </Link>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-border bg-gray-light text-sm font-medium text-dark-text hover:bg-gray-border transition-colors mt-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.6667 14V12.6667C12.6667 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7072 10 10 10H6C5.29276 10 4.61448 10.281 4.11438 10.781C3.61429 11.2811 3.33333 11.9594 3.33333 12.6667V14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 7.33333C9.47276 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47276 2 8 2C6.52724 2 5.33333 3.19391 5.33333 4.66667C5.33333 6.13943 6.52724 7.33333 8 7.33333Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Войти
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Остальной код остается без изменений */}
      <div className="bg-orange-light border-t border-b border-orange-primary/20">
        <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FA893D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12" stroke="#FA893D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16H12.01" stroke="#FA893D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div className="text-dark-text font-semibold text-base">
                  Знаете об отключении?
                </div>
                <div className="text-gray-text text-sm">
                  Сообщите нам и помогите жителям
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-primary text-white text-sm font-medium hover:bg-orange-primary/90 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 1.33333H4C3.64638 1.33333 3.30724 1.47381 3.05719 1.72386C2.80714 1.97391 2.66667 2.31304 2.66667 2.66667V13.3333C2.66667 13.687 2.80714 14.0261 3.05719 14.2761C3.30724 14.5262 3.64638 14.6667 4 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V4.66667L10 1.33333Z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.33333 1.33333V4C9.33333 4.35362 9.47381 4.69276 9.72386 4.94281C9.97391 5.19286 10.313 5.33333 10.6667 5.33333H13.3333" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.66667 6H5.33333" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 8.66667H5.33333" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 11.3333H5.33333" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Сообщить об отключении
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-border mt-auto">
        <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-sm text-black mb-2">Разделы</div>
              <div className="space-y-1 text-sm text-black underline">
                <Link to="/" className="block hover:text-orange-primary">Главная</Link>
                <div className="block">Показания счетчиков</div>
                <div className="block">Уведомления об отключениях в мобильный</div>
                <Link to="/organizations" className="block hover:text-orange-primary">Управляющие организации Владивостока</Link>
                <div className="block">Посты</div>
              </div>
              <div className="mt-4 text-sm text-gray-text">
                © ООО «Фарпост», 2003 — 2025 При любом использовании материалов{" "}
                <span className="underline">ссылка на VL.ru</span> обязательна. Цитирование в Интернете возможно только при наличии гиперссылки. Все права защищены.
              </div>
            </div>
            <div className="flex justify-end">
              <div className="text-sm text-gray-text">
                По вопросам, предложениям или ошибкам пишите на почту:{" "}
                <a href="mailto:off@vl.ru" className="underline hover:text-orange-primary">
                  off@vl.ru
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}