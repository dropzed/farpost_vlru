import Layout from "@/components/Layout";
import { useState, useEffect, useCallback } from "react";

interface Company {
  initiatorName: string;
  phoneNumber: string;
  email: string;
}

interface CompanyWithHouses extends Company {
  houses: number;
}

export default function Organizations() {
  const [organizations, setOrganizations] = useState<CompanyWithHouses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:3000';

  // генерация случайного количества домов
  const generateRandomHouses = () => Math.floor(Math.random() * 1000);

  // Получение всех компаний
  const fetchAllCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrls = [
        `${API_BASE_URL}/management-companies/initiators`,
        '/management-companies/initiators'
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
            const data: Company[] = await response.json();
            
            // Добавляем случайное количество домов к каждой компании
            const companiesWithHouses: CompanyWithHouses[] = data.map(company => ({
              ...company,
              houses: generateRandomHouses()
            }));
            
            setOrganizations(companiesWithHouses);
            return;
          } else {
            if (response.status !== 404) {
              lastError = new Error(`HTTP ${response.status}`);
            }
          }
        } catch (err) {
          // Игнорируем ошибки подключения для поиска
          lastError = err;
        }
      }
      
      if (lastError) {
        throw lastError;
      }
      
      throw new Error('Сервис временно недоступен');
      
    } catch (err) {
      // Fallback данные
      const fallbackCompanies: CompanyWithHouses[] = [
        {
          initiatorName: "МУПВ ВПЭС",
          houses: generateRandomHouses(),
          phoneNumber: "+7 (423) 240-00-00",
          email: "info@vpes.ru",
        },
        {
          initiatorName: 'ООО "Дальневосточные Электрические Сети"',
          houses: generateRandomHouses(),
          phoneNumber: "+7 (423) 245-12-34",
          email: "support@des.ru",
        },
        {
          initiatorName: 'АО "Оборонэнерго"',
          houses: generateRandomHouses(),
          phoneNumber: "+7 (423) 231-45-67",
          email: "contact@oboron.ru",
        },
      ];
      setOrganizations(fallbackCompanies);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Поиск компаний
  const searchCompanies = async (query: string) => {
    if (!query.trim()) {
      fetchAllCompanies();
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      
      const apiUrls = [
        `${API_BASE_URL}/management-companies/initiators/search?name=${encodeURIComponent(query)}`,
        `/management-companies/initiators/search?name=${encodeURIComponent(query)}`
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
            const data: Company[] = await response.json();
            
            const companiesWithHouses: CompanyWithHouses[] = data.map(company => ({
              ...company,
              houses: generateRandomHouses()
            }));
            
            setOrganizations(companiesWithHouses);
            return;
          } else if (response.status === 404) {
            setOrganizations([]);
            return;
          }
        } catch (err) {
          continue;
        }
      }
      
      setOrganizations([]);
      
    } catch (err) {
      setOrganizations([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Дебаунс для поиска
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchAllCompanies();
      return;
    }

    const timeoutId = setTimeout(() => {
      searchCompanies(searchQuery);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchAllCompanies]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchCompanies(searchQuery);
    }
  };

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  // склонение слова дом, пусть будет
  const getHouseWord = (count: number) => {
    if (count === 1) return 'дом';
    if (count < 5) return 'дома';
    return 'домов';
  };

  return (
    <Layout>
      <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-4 lg:py-8 space-y-4 lg:space-y-6">
        <div className="space-y-2 px-2 lg:px-0">
          
          <h1 className="text-2xl lg:text-3xl font-semibold text-dark-text tracking-tight">
            Управляющие организации
          </h1>
          <p className="text-sm lg:text-base text-gray-text">
            Контакты служб и количество обслуживаемых домов
          </p>
        </div>

          <form onSubmit={handleSearchSubmit} className="space-y-3 lg:space-y-4">
            <div className="block lg:hidden space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Поиск компании..."
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
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={searchLoading || loading}
                  className="flex-1 px-4 py-3 bg-orange-primary text-white text-base font-medium rounded-lg hover:bg-orange-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? 'Поиск...' : 'Найти'}
                </button>
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      fetchAllCompanies();
                    }}
                    className="px-4 py-3 text-gray-text text-base hover:text-dark-text transition-colors border border-gray-border rounded-lg"
                    disabled={loading}
                  >
                    Сброс
                  </button>
                )}
              </div>
            </div>

            {/* Десктопная версия */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Поиск по названию компании..."
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
              
              <button
                type="submit"
                disabled={searchLoading || loading}
                className="px-6 py-3 bg-orange-primary text-white rounded-lg hover:bg-orange-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {searchLoading ? 'Поиск...' : 'Найти'}
              </button>
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    fetchAllCompanies();
                  }}
                  className="px-4 py-3 text-gray-text hover:text-dark-text transition-colors whitespace-nowrap"
                  disabled={loading}
                >
                  Сбросить
                </button>
              )}
            </div>
          </form>

        {/* Состояние загрузки */}
        {(loading || searchLoading) && (
          <div className="space-y-4 px-2 lg:px-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-border bg-white shadow-sm p-4 lg:p-6 animate-pulse"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 lg:h-6 bg-gray-200 rounded w-3/4 lg:w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 lg:w-1/4"></div>
                    </div>
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="border-t border-gray-border pt-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
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
                onClick={fetchAllCompanies}
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
            {organizations.length === 0 ? (
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
                  Компании не найдены
                </h3>
                <p className="text-gray-text text-sm lg:text-base">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить запрос.`
                    : 'Нет данных об управляющих компаниях.'
                  }
                </p>
              </div>
            ) : (
              organizations.map((org, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-border bg-white shadow-sm p-4 lg:p-6"
                >
                  <div className="space-y-4 lg:space-y-6">
                    <div className="flex items-start justify-between gap-3 lg:gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="text-base lg:text-lg font-semibold text-dark-text break-words">
                          {org.initiatorName}
                        </h3>
                        <p className="text-sm text-gray-text">
                          Обслуживает {org.houses} {getHouseWord(org.houses)}
                        </p>
                      </div>

                      <svg
                        className="flex-shrink-0"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <path
                          d="M8 29.333V5.333C8 4.626 8.281 3.948 8.781 3.448C9.281 2.947 9.959 2.667 10.667 2.667H21.333C22.041 2.667 22.719 2.947 23.219 3.448C23.719 3.948 24 4.626 24 5.333V29.333H8Z"
                          stroke="#6B7280"
                          strokeWidth="2.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 16H5.333C4.626 16 3.948 16.281 3.448 16.781C2.947 17.281 2.667 17.959 2.667 18.667V26.667C2.667 27.374 2.947 28.052 3.448 28.552C3.948 29.052 4.626 29.333 5.333 29.333H8"
                          stroke="#6B7280"
                          strokeWidth="2.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M24 12H26.667C27.374 12 28.052 12.281 28.552 12.781C29.052 13.281 29.333 13.959 29.333 14.667V26.667C29.333 27.374 29.052 28.052 28.552 28.552C28.052 29.052 27.374 29.333 26.667 29.333H24"
                          stroke="#6B7280"
                          strokeWidth="2.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.333 8H18.667"
                          stroke="#6B7280"
                          strokeWidth="2.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.333 13.333H18.667"
                          stroke="#6B7280"
                          strokeWidth="2.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.333 18.667H18.667"
                          stroke="#6B7280"
                          strokeWidth="2.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.333 24H18.667"
                          stroke="#6B7280"
                          strokeWidth="2.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="border-t border-gray-border pt-3 lg:pt-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                        <a
                          href={`tel:${org.phoneNumber}`}
                          className="flex items-center gap-2 text-orange-primary hover:text-orange-primary/80 transition-colors text-sm lg:text-base"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M14.667 11.28V13.28C14.667 13.466 14.629 13.65 14.555 13.82C14.48 13.99 14.371 14.143 14.235 14.268C14.098 14.394 13.936 14.489 13.76 14.549C13.584 14.608 13.398 14.63 13.213 14.614C11.162 14.391 9.191 13.69 7.46 12.567C5.849 11.543 4.483 10.178 3.46 8.567C2.333 6.828 1.632 4.848 1.413 2.787C1.396 2.603 1.418 2.417 1.477 2.241C1.537 2.066 1.632 1.905 1.756 1.768C1.881 1.631 2.033 1.522 2.202 1.447C2.372 1.372 2.555 1.334 2.74 1.334H4.74C5.063 1.33 5.377 1.445 5.622 1.656C5.868 1.867 6.028 2.16 6.073 2.48C6.158 3.12 6.314 3.749 6.54 4.354C6.629 4.592 6.649 4.852 6.596 5.101C6.543 5.35 6.419 5.579 6.24 5.76L5.393 6.607C6.342 8.276 7.724 9.658 9.393 10.607L10.24 9.76C10.421 9.581 10.65 9.457 10.899 9.404C11.149 9.351 11.408 9.371 11.647 9.46C12.251 9.686 12.88 9.842 13.52 9.927C13.844 9.973 14.139 10.136 14.351 10.385C14.562 10.635 14.675 10.953 14.667 11.28Z"
                              stroke="currentColor"
                              strokeWidth="1.33"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="break-all">{org.phoneNumber}</span>
                        </a>

                        <a
                          href={`mailto:${org.email}`}
                          className="flex items-center gap-2 text-orange-primary hover:text-orange-primary/80 transition-colors text-sm lg:text-base"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.333 2.667H2.667C1.93 2.667 1.333 3.263 1.333 4V12C1.333 12.736 1.93 13.333 2.667 13.333H13.333C14.07 13.333 14.667 12.736 14.667 12V4C14.667 3.263 14.07 2.667 13.333 2.667Z"
                              stroke="currentColor"
                              strokeWidth="1.33"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.667 4.667L8.687 8.467C8.481 8.595 8.243 8.664 8 8.664C7.757 8.664 7.519 8.595 7.313 8.467L1.333 4.667"
                              stroke="currentColor"
                              strokeWidth="1.33"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="break-all">{org.email}</span>
                        </a>
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