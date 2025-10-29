import Layout from "@/components/Layout";
import React, { useState, useCallback, useEffect, useRef } from 'react';

export default function Map() {
  const legend = [  
    { label: "Электричество - 5 точек", color: "#EF4343" },
    { label: "Вода - 790 точек", color: "#FA893D" },
    { label: "Отопление - 0 точек", color: "#F1F2F4" },
  ];
  const [isMapLoaded, setMapLoaded] = useState(false);
  const iframeRef = useRef(null);

  const handleLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    let interval;
    if (!isMapLoaded) {
      interval = setInterval(() => {
        const el = iframeRef.current;
        if (el && el.contentWindow && el.contentWindow.document && el.contentWindow.document.readyState === 'complete') {
          setMapLoaded(true);
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMapLoaded]);
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
        </div>
<div className="rounded-xl border border-gray-border bg-white shadow-sm p-5" style={{ position: 'relative' }}>
      <div
        className=" bg-gray-bg flex items-center justify-center"
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
          title="Карта"
          loading="lazy"
          onLoad={handleLoad}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legend.map((item, i) => (
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
      </div>
    </Layout>
  );
}
