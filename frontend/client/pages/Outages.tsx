import Layout from "@/components/Layout";
import { useState, useEffect, useCallback } from "react";

export default function Outages() {
  const [outages, setOutages] = useState([]);
  const [filteredOutages, setFilteredOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    utility: "all"
  });

  const API_BASE_URL = 'http://localhost:3000';

  const getRandomHouses = () => Math.floor(Math.random() * 200) + 1;

  // Функция для генерации случайного времени отключения
  const getRandomTime = () => {
    const startHour = Math.floor(Math.random() * 6) + 8; 
    const endHour = startHour + Math.floor(Math.random() * 6) + 4; 
    return `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
  };

  // Функция для определения типа отключения
  const getOutageType = (description) => {
    if (!description) return "unknown";
    const desc = description.toLowerCase();
    if (desc.includes('плановые') || desc.includes('плановое') || desc.includes('плановый')) return "planned";
    if (desc.includes('авария') || desc.includes('аварийные') || desc.includes('аварийный')) return "emergency";
    return "unknown";
  };

  const getUtilityInfo = (type) => {
    switch (type) {
      case 'electricity':
        return {
          utility: 'Электричество',
          icon: 'electricity'
        };
      case 'hot_water':
        return {
          utility: 'Горячая вода',
          icon: 'water'
        };
      case 'cold_water':
        return {
          utility: 'Холодная вода',
          icon: 'water'
        };
      case 'heating':
        return {
          utility: 'Отопление',
          icon: 'heating'
        };
      default:
        return {
          utility: 'Неизвестно',
          icon: 'unknown'
        };
    }
  };

  // Получение всех отключений
  const fetchAllOutages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrls = [
        `${API_BASE_URL}/blackouts-map-info/december-2019`,
        '/blackouts-map-info/december-2019'
      ];
      
      let response;
      let lastError;
      
      for (const url of apiUrls) {
        try {
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            
            const formattedOutages = data.map((outage, index) => {
              const type = getOutageType(outage.description);
              const utilityInfo = getUtilityInfo(outage.type);
              
              return {
                id: index,
                address: outage.fullAddress,
                type: type,
                houses: getRandomHouses(),
                time: getRandomTime(),
                utility: utilityInfo.utility,
                icon: utilityInfo.icon,
                iconColor: type === 'emergency' ? 'red' : 
                         type === 'planned' ? 'orange' : 'gray',
                description: outage.description,
                originalType: outage.type 
              };
            });

            setOutages(formattedOutages);
            setFilteredOutages(formattedOutages);
            return;
          } else {
            if (response.status !== 404) {
              lastError = new Error(`HTTP ${response.status}`);
            }
          }
        } catch (err) {
          lastError = err;
        }
      }
      
      if (lastError) {
        throw lastError;
      }
      
      throw new Error('Сервис временно недоступен');
      
    } catch (err) {
      const fallbackData = [
        {
          id: 1,
          address: "ул. Ленина, 45",
          type: "planned",
          houses: 12,
          time: "08:00 - 18:00",
          utility: "Электричество",
          icon: "electricity",
          iconColor: "orange",
          originalType: "electricity"
        },
        {
          id: 2,
          address: "пр. Победы, 23-67",
          type: "emergency",
          houses: 156,
          time: "06:00 - 20:00",
          utility: "Горячая вода",
          icon: "water",
          iconColor: "red",
          originalType: "hot_water"
        },
        {
          id: 3,
          address: "ул. Центральная, 15",
          type: "emergency",
          houses: 89,
          time: "09:00 - 17:00",
          utility: "Холодная вода",
          icon: "water",
          iconColor: "red",
          originalType: "cold_water"
        },
        {
          id: 4,
          address: "ул. Теплая, 34",
          type: "planned",
          houses: 45,
          time: "10:00 - 16:00",
          utility: "Отопление",
          icon: "heating",
          iconColor: "orange",
          originalType: "heating"
        }
      ];
      setOutages(fallbackData);
      setFilteredOutages(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Поиск 
  const searchOutages = async (query: string) => {
    if (!query.trim()) {
      fetchAllOutages();
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      
      const apiUrls = [
        `${API_BASE_URL}/blackouts-map-info/december-2019/search?address=${encodeURIComponent(query)}`,
        `/blackouts-map-info/december-2019/search?address=${encodeURIComponent(query)}`
      ];
      
      let response;
      
      for (const url of apiUrls) {
        try {
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            
            const formattedOutages = data.map((outage, index) => {
              const type = getOutageType(outage.description);
              const utilityInfo = getUtilityInfo(outage.type);
              
              return {
                id: index,
                address: outage.fullAddress,
                type: type,
                houses: getRandomHouses(),
                time: getRandomTime(),
                utility: utilityInfo.utility,
                icon: utilityInfo.icon,
                iconColor: type === 'emergency' ? 'red' : 
                         type === 'planned' ? 'orange' : 'gray',
                description: outage.description,
                originalType: outage.type
              };
            });

            setOutages(formattedOutages);
            setFilteredOutages(formattedOutages);
            return;
          } else if (response.status === 404) {
            setOutages([]);
            setFilteredOutages([]);
            return;
          }
        } catch (err) {
          continue;
        }
      }
      
      setOutages([]);
      setFilteredOutages([]);
      
    } catch (err) {
      setOutages([]);
      setFilteredOutages([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchAllOutages();
      return;
    }

    const timeoutId = setTimeout(() => {
      searchOutages(searchQuery);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchAllOutages]);

  useEffect(() => {
    let result = outages;

    if (filters.type !== "all") {
      result = result.filter(outage => outage.type === filters.type);
    }

    if (filters.utility !== "all") {
      result = result.filter(outage => {
        if (filters.utility === "Вода") {
          return outage.originalType === "hot_water" || outage.originalType === "cold_water";
        }
        return outage.utility === filters.utility;
      });
    }

    setFilteredOutages(result);
  }, [filters, outages]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      type: "all",
      utility: "all"
    });
    fetchAllOutages();
  };

  useEffect(() => {
    fetchAllOutages();
  }, [fetchAllOutages]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-4 lg:py-8 space-y-4 lg:space-y-6">
          <div className="space-y-2 px-2 lg:px-0">
            <h1 className="text-2xl lg:text-3xl font-semibold text-dark-text tracking-tight">
              Текущие отключения
            </h1>
            <p className="text-sm lg:text-base text-gray-text">
              Загрузка данных...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-4 lg:py-8 space-y-4 lg:space-y-6">
        <div className="space-y-2 px-2 lg:px-0">
          <h1 className="text-2xl lg:text-3xl font-semibold text-dark-text tracking-tight">
            Текущие отключения
          </h1>
          <p className="text-sm lg:text-base text-gray-text">
            Активные и плановые работы
          </p>
        </div>

          <div className="space-y-3 lg:space-y-4">
            {/* Мобильная версия */}
            <div className="block lg:hidden space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Поиск по адресу..."
                  className="w-full px-4 py-3 text-base rounded-lg border border-gray-border bg-gray-light text-dark-text placeholder-gray-text focus:outline-none focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                  disabled={loading}
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-text"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                    stroke="currentColor"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 17.5L13.875 13.875"
                    stroke="currentColor"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3">
  <div className="relative">
    <label htmlFor="type-filter-mobile" className="block text-sm font-medium text-dark-text mb-2">
      Тип отключения
    </label>
    <select
      id="type-filter-mobile"
      value={filters.type}
      onChange={(e) => handleFilterChange('type', e.target.value)}
      className="w-full px-3 py-2 pr-10 border border-gray-border rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm appearance-none bg-white"
    >
      <option value="all">Все типы</option>
      <option value="planned">Плановые</option>
      <option value="emergency">Аварийные</option>
      <option value="unknown">Не определено</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-6">
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>

  <div className="relative">
    <label htmlFor="utility-filter-mobile" className="block text-sm font-medium text-dark-text mb-2">
      Услуга
    </label>
    <select
      id="utility-filter-mobile"
      value={filters.utility}
      onChange={(e) => handleFilterChange('utility', e.target.value)}
      className="w-full px-3 py-2 pr-10 border border-gray-border rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm appearance-none bg-white"
    >
      <option value="all">Все услуги</option>
      <option value="Электричество">Электричество</option>
      <option value="Вода">Вода</option>
      <option value="Горячая вода">Горячая вода</option>
      <option value="Холодная вода">Холодная вода</option>
      <option value="Отопление">Отопление</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-6">
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
</div>

              {(searchQuery || filters.type !== "all" || filters.utility !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full px-4 py-3 text-gray-text text-base hover:text-dark-text transition-colors border border-gray-border rounded-lg"
                  disabled={loading}
                >
                  Сбросить фильтры
                </button>
              )}
            </div>

            {/* Десктопная версия */}
            <div className="hidden lg:flex items-end gap-4">
  <div className="flex-1">
    <label htmlFor="search-desktop" className="block text-sm font-medium text-dark-text mb-2">
      Поиск по адресу
    </label>
    <div className="relative">
      <input
        id="search-desktop"
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Введите адрес..."
        className="w-full px-4 py-3 rounded-lg border border-gray-border bg-gray-light text-dark-text placeholder-gray-text focus:outline-none focus:ring-2 focus:ring-orange-primary focus:border-transparent"
        disabled={loading}
      />
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-text"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
          stroke="currentColor"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 17.5L13.875 13.875"
          stroke="currentColor"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
  
  <div className="relative">
    <label htmlFor="type-filter-desktop" className="block text-sm font-medium text-dark-text mb-2">
      Тип отключения
    </label>
    <select
      id="type-filter-desktop"
      value={filters.type}
      onChange={(e) => handleFilterChange('type', e.target.value)}
      className="px-4 py-3 pr-10 border border-gray-border rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent min-w-[140px] appearance-none bg-white"
    >
      <option value="all">Все типы</option>
      <option value="planned">Плановые</option>
      <option value="emergency">Аварийные</option>
      <option value="unknown">Не определено</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-8">
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>

  <div className="relative">
    <label htmlFor="utility-filter-desktop" className="block text-sm font-medium text-dark-text mb-2">
      Коммунальная услуга
    </label>
    <select
      id="utility-filter-desktop"
      value={filters.utility}
      onChange={(e) => handleFilterChange('utility', e.target.value)}
      className="px-4 py-3 pr-10 border border-gray-border rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent min-w-[160px] appearance-none bg-white"
    >
      <option value="all">Все услуги</option>
      <option value="Электричество">Электричество</option>
      <option value="Вода">Вода</option>
      <option value="Горячая вода">Горячая вода</option>
      <option value="Холодная вода">Холодная вода</option>
      <option value="Отопление">Отопление</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-8">
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
  
  {(searchQuery || filters.type !== "all" || filters.utility !== "all") && (
    <button
      type="button"
      onClick={clearFilters}
      className="px-4 py-3 text-gray-text hover:text-dark-text transition-colors whitespace-nowrap mb-2"
      disabled={loading}
    >
      Сбросить
    </button>
  )}
</div>
          </div>

        {/* Состояние загрузки */}
        {(loading || searchLoading) && (
          <div className="space-y-4 px-2 lg:px-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-border bg-white shadow-sm p-4 lg:p-6 animate-pulse"
              >
                <div className="flex items-start gap-4 lg:gap-6">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-3 flex-1">
                    <div className="space-y-2">
                      <div className="h-5 lg:h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex flex-wrap gap-4 lg:gap-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Сообщение об ошибке */}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 mx-2 lg:mx-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 text-sm lg:text-base">{error}</span>
              </div>
              <button
                onClick={fetchAllOutages}
                className="px-3 py-2 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors whitespace-nowrap self-start lg:self-auto"
              >
                Повторить
              </button>
            </div>
          </div>
        )}

        {/* Результаты поиска */}
        {!loading && !searchLoading && !error && (
          <div className="space-y-4 lg:space-y-6 px-2 lg:px-0">
            {filteredOutages.length === 0 ? (
              <div className="rounded-xl border border-gray-border bg-white shadow-sm p-6 lg:p-8 text-center">
                <svg
                  className="mx-auto w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mb-3 lg:mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-base lg:text-lg font-medium text-dark-text mb-2">
                  Отключения не найдены
                </h3>
                <p className="text-gray-text text-sm lg:text-base">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить запрос.`
                    : 'Нет данных об отключениях.'
                  }
                </p>
              </div>
            ) : (
              filteredOutages.map((outage) => (
                <div
                  key={outage.id}
                  className="rounded-xl border border-gray-border bg-white shadow-sm p-4 lg:p-6"
                >
                  <div className="flex items-start gap-4 lg:gap-6">
                    {(outage.icon === 'electricity' || outage.icon === 'water' || outage.icon === 'heating') && (
                      <div
                        className={`p-3 rounded-xl ${
                          outage.iconColor === "red"
                            ? "bg-red-light"
                            : outage.iconColor === "orange"
                            ? "bg-orange-light"
                            : "bg-gray-200"
                        }`}
                      >
                        {outage.icon === "electricity" && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M4 14C3.811 14.001 3.625 13.948 3.465 13.847C3.305 13.747 3.176 13.603 3.095 13.432C3.013 13.261 2.981 13.071 3.003 12.883C3.026 12.695 3.101 12.517 3.22 12.37L13.12 2.17C13.194 2.084 13.296 2.027 13.407 2.006C13.519 1.985 13.634 2.003 13.734 2.057C13.834 2.11 13.913 2.196 13.957 2.3C14.002 2.404 14.01 2.521 13.98 2.63L12.06 8.65C12.003 8.802 11.984 8.965 12.005 9.125C12.025 9.286 12.084 9.439 12.176 9.572C12.268 9.704 12.392 9.813 12.535 9.887C12.679 9.962 12.838 10.001 13 10H20C20.189 10 20.375 10.053 20.535 10.153C20.695 10.254 20.824 10.398 20.905 10.569C20.987 10.739 21.019 10.93 20.997 11.117C20.974 11.305 20.899 11.483 20.78 11.63L10.88 21.83C10.806 21.916 10.704 21.974 10.593 21.994C10.481 22.015 10.366 21.997 10.266 21.944C10.166 21.89 10.087 21.804 10.043 21.7C9.998 21.596 9.99 21.479 10.02 21.37L11.94 15.35C11.997 15.199 12.016 15.036 11.995 14.875C11.975 14.714 11.916 14.562 11.824 14.429C11.732 14.296 11.608 14.188 11.465 14.113C11.321 14.038 11.162 14 11 14H4Z"
                              stroke={outage.iconColor === "red" ? "#EF4343" : outage.iconColor === "orange" ? "#FA893D" : "#6B7280"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {outage.icon === "water" && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 22C13.857 22 15.637 21.263 16.95 19.95C18.263 18.637 19 16.857 19 15C19 13 18 11.1 16 9.5C14 7.9 12.5 5.5 12 3C11.5 5.5 10 7.9 8 9.5C6 11.1 5 13 5 15C5 16.857 5.738 18.637 7.05 19.95C8.363 21.263 10.143 22 12 22Z"
                              stroke={outage.iconColor === "red" ? "#EF4343" : "#FA893D"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {outage.icon === "heating" && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 22C13.857 22 15.637 21.263 16.95 19.95C18.263 18.637 19 16.857 19 15C19 13 18 11.1 16 9.5C14 7.9 12.5 5.5 12 3C11.5 5.5 10 7.9 8 9.5C6 11.1 5 13 5 15C5 16.857 5.738 18.637 7.05 19.95C8.363 21.263 10.143 22 12 22Z"
                              stroke={outage.iconColor === "red" ? "#EF4343" : "#FA893D"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    )}

                    <div className="flex-1 space-y-2 lg:space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base lg:text-lg font-semibold text-dark-text break-words">
                          {outage.address}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            outage.type === "emergency"
                              ? "bg-red-alert text-white"
                              : outage.type === "planned"
                              ? "bg-dark-text text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {outage.type === "emergency" ? "Авария" : 
                           outage.type === "planned" ? "Плановое" : "Не определено"}
                        </span>
                      </div>

                      {outage.description && (
                        <p className="text-sm text-gray-text">
                          {outage.description}
                        </p>
                      )}

                      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 text-sm text-gray-text">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M8.75 12.25V7.583C8.75 7.429 8.689 7.28 8.579 7.171C8.47 7.061 8.321 7 8.167 7H5.833C5.679 7 5.53 7.061 5.421 7.171C5.311 7.28 5.25 7.429 5.25 7.583V12.25" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1.75 5.833C1.75 5.664 1.787 5.496 1.858 5.342C1.93 5.188 2.034 5.052 2.164 4.942L6.247 1.443C6.457 1.265 6.724 1.167 7 1.167C7.276 1.167 7.543 1.265 7.753 1.443L11.836 4.942C11.966 5.052 12.07 5.188 12.142 5.342C12.213 5.496 12.25 5.664 12.25 5.833V11.083C12.25 11.393 12.127 11.69 11.908 11.908C11.69 12.127 11.393 12.25 11.083 12.25H2.917C2.607 12.25 2.311 12.127 2.092 11.908C1.873 11.69 1.75 11.393 1.75 11.083V5.833Z" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{outage.houses} домов</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 12.833C10.222 12.833 12.833 10.222 12.833 7C12.833 3.778 10.222 1.167 7 1.167C3.778 1.167 1.167 3.778 1.167 7C1.167 10.222 3.778 12.833 7 12.833Z" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 3.5V7L9.333 8.167" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{outage.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M8.575 3.675C8.468 3.784 8.408 3.931 8.408 4.083C8.408 4.236 8.468 4.383 8.575 4.492L9.508 5.425C9.617 5.532 9.764 5.592 9.917 5.592C10.069 5.592 10.216 5.532 10.325 5.425L12.524 3.226C12.818 3.874 12.906 4.596 12.779 5.296C12.651 5.996 12.314 6.641 11.81 7.144C11.307 7.647 10.663 7.985 9.963 8.112C9.263 8.24 8.541 8.151 7.893 7.858L3.862 11.888C3.63 12.12 3.315 12.251 2.987 12.251C2.659 12.251 2.344 12.12 2.112 11.888C1.88 11.656 1.749 11.342 1.749 11.013C1.749 10.685 1.88 10.37 2.112 10.138L6.143 6.108C5.849 5.459 5.76 4.737 5.888 4.037C6.015 3.337 6.353 2.693 6.856 2.19C7.359 1.687 8.004 1.349 8.704 1.221C9.404 1.094 10.126 1.183 10.774 1.476L8.581 3.669L8.575 3.675Z" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{outage.utility}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}