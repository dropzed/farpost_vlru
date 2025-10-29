import Layout from "@/components/Layout";
import { useState, useEffect } from "react";

interface BlackoutStats {
  electricity: number;
  cold_water: number;
  hot_water: number;
  heat: number;
}

interface StatItem {
  title: string;
  value: string;
  subtitle: string;
  icon: "electricity" | "water" | "cold-water" | "heating";
  color: "red" | "orange" | "gray";
}

export default function Index() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlackoutStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Начинаем запрос к API...');
      
      // Пробуем разные варианты URL для отладки
      const apiUrls = [
        '/count-blackouts/types',
        'http://localhost:3000/count-blackouts/types',
        'http://backend:3000/count-blackouts/types'
      ];
      
      let response;
      let lastError;
      
      for (const url of apiUrls) {
        try {
          console.log(`Пробуем URL: ${url}`);
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          console.log(`Ответ от ${url}:`, response.status, response.statusText);
          
          if (response.ok) {
            const data: BlackoutStats = await response.json();
            console.log('Получены данные:', data);
            
            const transformedStats: StatItem[] = [
              {
                title: "Нет электричества",
                value: data.electricity.toLocaleString(),
                subtitle: "аварий",
                icon: "electricity",
                color: data.electricity > 0 ? "red" : "gray",
              },
              {
                title: "Нет горячей воды",
                value: data.hot_water.toLocaleString(),
                subtitle: "аварий",
                icon: "water",
                color: data.hot_water > 0 ? "orange" : "gray",
              },
              {
                title: "Холодная вода",
                value: data.cold_water.toLocaleString(),
                subtitle: data.cold_water === 0 ? "у всех есть" : "аварий",
                icon: "cold-water",
                color: data.cold_water > 0 ? "orange" : "gray",
              },
              {
                title: "Отопление",
                value: data.heat.toLocaleString(),
                subtitle: data.heat === 0 ? "Включается" : "аварий",
                icon: "heating",
                color: data.heat > 0 ? "orange" : "gray",
              },
            ];
            
            setStats(transformedStats);
            return;
          } else {
            // Пробуем получить текст ошибки
            const errorText = await response.text();
            console.error(`Ошибка ${response.status} для ${url}:`, errorText);
            lastError = new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } catch (err) {
          console.error(`Ошибка для ${url}:`, err);
          lastError = err;
        }
      }
      
      throw lastError || new Error('Все попытки подключения не удались');
      
    } catch (err) {
      console.error('Финальная ошибка при загрузке данных:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      
      // Fallback данные
      setStats([
        {
          title: "Нет электричества",
          value: "5",
          subtitle: "домов",
          icon: "electricity",
          color: "red",
        },
        {
          title: "Нет горячей воды",
          value: "790",
          subtitle: "домов",
          icon: "water",
          color: "orange",
        },
        {
          title: "Холодная вода",
          value: "0",
          subtitle: "у всех есть",
          icon: "cold-water",
          color: "gray",
        },
        {
          title: "Отопление",
          value: "0",
          subtitle: "Включается",
          icon: "heating",
          color: "gray",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlackoutStats();
  }, []);

  const electricityData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: Math.random() * 64,
  }));

  const waterData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: Math.random() * 63,
  }));

  return (
    <Layout>
      <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-8 space-y-8">
        <div className="rounded-xl border border-orange-primary/20 bg-orange-light/10  shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 14.6667L28 8V24L4 18.6667V14.6667Z" stroke="#FA893D" strokeWidth="2.67" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.467 22.4C15.327 22.908 15.088 23.383 14.764 23.799C14.44 24.214 14.038 24.562 13.58 24.822C13.122 25.082 12.617 25.249 12.094 25.314C11.571 25.379 11.041 25.34 10.533 25.2C10.026 25.06 9.55 24.821 9.135 24.497C8.719 24.174 8.372 23.771 8.112 23.313C7.852 22.855 7.684 22.35 7.619 21.827C7.555 21.305 7.593 20.774 7.733 20.267" stroke="#FA893D" strokeWidth="2.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-text">
                  Рекламное место
                </h3>
                <p className="text-sm text-gray-text">
                  Разместите здесь свою рекламу
                </p>
              </div>
            </div>
            <button className="px-4 py-2.5 rounded-lg border border-gray-border bg-gray-light text-sm font-medium text-dark-text hover:bg-gray-border transition-colors">
              Узнать подробнее
            </button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold text-dark-text tracking-tight">
            Аварийность по жалобам
          </h1>
          <p className="text-lg text-gray-text">
            Актуальная статистика отключений во Владивостоке
          </p>
        </div>

        {/* Состояние загрузки */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-border shadow-sm p-6 bg-white animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Сообщение об ошибке */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800">Ошибка загрузки данных: {error}</span>
              </div>
              <button
                onClick={fetchBlackoutStats}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
              >
                Повторить
              </button>
            </div>
          </div>
        )}

        {/* Статистика */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`rounded-xl border shadow-sm p-6 bg-white ${
                  stat.color === "red"
                    ? "border-l-4 border-l-red-alert border-t border-r border-b border-red-alert"
                    : stat.color === "orange"
                    ? "border-l-4 border-l-orange-primary border-t border-r border-b border-orange-primary"
                    : "border-l-4 border-l-gray-bg border-t border-r border-b border-gray-bg"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-text">
                      {stat.title}
                    </div>
                    <div className="text-3xl font-semibold text-dark-text">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-text">{stat.subtitle}</div>
                  </div>
                  <div>
                    {stat.icon === "electricity" && (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M6.667 23.333C6.351 23.335 6.042 23.246 5.775 23.078C5.508 22.911 5.294 22.671 5.158 22.386C5.021 22.102 4.969 21.784 5.006 21.471C5.043 21.158 5.168 20.862 5.367 20.617L21.867 3.617C21.99 3.474 22.159 3.377 22.345 3.343C22.531 3.309 22.723 3.338 22.89 3.428C23.056 3.517 23.188 3.66 23.262 3.834C23.337 4.007 23.35 4.201 23.3 4.383L20.1 14.417C20.006 14.669 19.974 14.941 20.008 15.209C20.041 15.476 20.139 15.731 20.294 15.953C20.447 16.174 20.653 16.354 20.892 16.479C21.131 16.603 21.397 16.668 21.667 16.667H33.333C33.649 16.666 33.958 16.754 34.225 16.922C34.492 17.09 34.706 17.33 34.842 17.614C34.979 17.899 35.031 18.216 34.994 18.529C34.957 18.842 34.832 19.139 34.633 19.383L18.133 36.383C18.01 36.526 17.841 36.623 17.655 36.657C17.469 36.692 17.277 36.662 17.11 36.573C16.944 36.483 16.812 36.34 16.738 36.167C16.663 35.993 16.65 35.799 16.7 35.617L19.9 25.583C19.994 25.331 20.026 25.059 19.992 24.792C19.959 24.524 19.861 24.269 19.706 24.048C19.552 23.826 19.347 23.646 19.108 23.521C18.869 23.397 18.603 23.333 18.333 23.333H6.667Z" stroke="#EF4343" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {stat.icon === "water" && (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20 36.667C23.094 36.667 26.062 35.438 28.25 33.25C30.437 31.062 31.667 28.094 31.667 25C31.667 21.667 30 18.5 26.667 15.833C23.333 13.167 20.833 9.167 20 5C19.167 9.167 16.667 13.167 13.333 15.833C10 18.5 8.333 21.667 8.333 25C8.333 28.094 9.563 31.062 11.75 33.25C13.938 35.438 16.906 36.667 20 36.667Z" stroke="#FA893D" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {stat.icon === "cold-water" && (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M11.667 27.167C15.333 27.167 18.333 24.117 18.333 20.417C18.333 18.483 17.383 16.65 15.483 15.1C13.583 13.55 12.15 11.25 11.667 8.833C11.183 11.25 9.767 13.567 7.85 15.1C5.933 16.633 5 18.5 5 20.417C5 24.117 8 27.167 11.667 27.167Z" stroke="#6B7280" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.933 11C22.08 9.168 22.892 7.148 23.333 5.033C24.167 9.2 26.667 13.2 30 15.867C33.333 18.533 35 21.7 35 25.033C35.01 27.337 34.335 29.592 33.061 31.512C31.788 33.432 29.973 34.93 27.847 35.817C25.721 36.705 23.379 36.941 21.119 36.495C18.858 36.05 16.781 34.944 15.15 33.317" stroke="#6B7280" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {stat.icon === "heating" && (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M14.167 24.167C15.272 24.167 16.332 23.728 17.113 22.946C17.894 22.165 18.333 21.105 18.333 20C18.333 17.7 17.5 16.667 16.667 15C14.88 11.428 16.293 8.243 20 5C20.833 9.167 23.333 13.167 26.667 15.833C30 18.5 31.667 21.667 31.667 25C31.667 26.532 31.365 28.049 30.779 29.465C30.192 30.88 29.333 32.166 28.25 33.25C27.166 34.333 25.88 35.192 24.465 35.779C23.049 36.365 21.532 36.667 20 36.667C18.468 36.667 16.951 36.365 15.535 35.779C14.12 35.192 12.834 34.333 11.75 33.25C10.667 32.166 9.808 30.88 9.221 29.465C8.635 28.049 8.333 26.532 8.333 25C8.333 23.078 9.055 21.177 10 20C10 21.105 10.439 22.165 11.22 22.946C12.002 23.728 13.062 24.167 14.167 24.167Z" stroke="#6B7280" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Остальная часть кода с графиками остается без изменений */}
        <div className="rounded-xl border border-gray-border bg-white shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text">
            График отключений за 30 дней
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-dark-text">Электричество</span>
                <span className="text-gray-text">24 аварии</span>
              </div>
              <div className="flex items-end justify-center gap-1 h-16">
                {electricityData.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-red-alert/20 rounded-t"
                    style={{ height: `${item.value}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-dark-text">Горячая вода</span>
                <span className="text-gray-text">156 аварий</span>
              </div>
              <div className="flex items-end justify-center gap-1 h-16">
                {waterData.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-orange-primary/20 rounded-t"
                    style={{ height: `${item.value}px` }}
                  />
                ))}
              </div>
              
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-dark-text">Холодная вода</span>
                <span className="text-gray-text">16 аварий</span>
              </div>
              <div className="flex items-end justify-center gap-1 h-16">
                {waterData.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-300/60 rounded-t"
                    style={{ height: `${item.value}px` }}
                  />
                ))}
              </div>
              
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-dark-text">Отопление</span>
                <span className="text-gray-text">0 аварий</span>
              </div>
              <div className="flex items-end justify-center gap-1 h-16">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gray-bg rounded-t"
                    style={{ height: "3px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}