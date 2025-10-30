import Layout from "@/components/Layout";
import React, { useState, useCallback, useEffect, useRef } from 'react';

export default function Map() {
  const [legendData, setLegendData] = useState([
    { label: "Электричество - 0 точек", color: "#EF4343", type: "electricity" },
    { label: "Вода - 0 точек", color: "#FA893D", type: "water" },
    { label: "Отопление - 0 точек", color: "#F1F2F4", type: "heating" },
  ]);
  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isDataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const iframeRef = useRef(null);

  // загрузка данных с бэкенда
  const fetchBlackoutsData = useCallback(async () => {
    try {
      setDataLoading(true);
      setDataError(null);
      const response = await fetch('http://localhost:3000/current-blackouts/date/2019-12-04');
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные с бэкенда:', data);
      
      const electricityCount = data.filter(item => item.type === 'electricity').length;
      const waterCount = data.filter(item => item.type === 'cold_water' || item.type === 'hot_water').length;
      const heatingCount = data.filter(item => item.type === 'heat').length;

      console.log(`Результаты подсчета: электричество=${electricityCount}, вода=${waterCount}, отопление=${heatingCount}`);

      setLegendData([
        { label: `Электричество - ${electricityCount} точек`, color: "#EF4343", type: "electricity" },
        { label: `Вода - ${waterCount} точек`, color: "#FA893D", type: "water" },
        { label: `Отопление - ${heatingCount} точек`, color: "#F1F2F4", type: "heating" },
      ]);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setDataError(error.message);
      // данные в случае ошибки
      setLegendData([
        { label: "Электричество - 5 точек", color: "#EF4343", type: "electricity" },
        { label: "Вода - 790 точек", color: "#FA893D", type: "water" },
        { label: "Отопление - 0 точек", color: "#F1F2F4", type: "heating" },
      ]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  const handleLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    fetchBlackoutsData();
  }, [fetchBlackoutsData]);

  return (
    <Layout>
      <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-dark-text tracking-tight">
            Карта отключений
          </h1>
          <p className="text-base text-gray-text">
            Интерактивная карта Владивостока
          </p>
          <p className="text-sm text-gray-text">
            Данные за 4 декабря 2019 года
          </p>
        </div>

        <div className="rounded-xl border border-gray-border bg-white shadow-sm p-5">
          <div
            className="bg-gray-bg flex items-center justify-center"
            style={{ height: "500px", position: 'relative', overflow: 'hidden', borderRadius: '5px'}}
          >
            {!isMapLoaded && (
              <div
                className="absolute"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.85)',
                  zIndex: 2,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                }}
              >
                Карта загружается...
              </div>
            )}

            <iframe
              ref={iframeRef}
              src="https://www.vl.ru/off/map/common?stop-fullscreen-on-mobile=1&iframe="
              style={{ border: 'none', width: '100%', height: '100%' }}
              title="Карта отключений Владивостока"
              loading="lazy"
              onLoad={handleLoad}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {dataError && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4">
            <p className="text-red-700 text-sm">
              Ошибка загрузки данных: {dataError}. Показаны данные по умолчанию.
            </p>
          </div>
        )}

        {isDataLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="text-gray-text">Загрузка данных...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legendData.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-border bg-white shadow-sm p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-dark-text">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}