# 🗺️ Полная ERD диаграмма Backend системы VL.ru Blackouts

> Комплексная Entity-Relationship диаграмма с описанием работы всей системы

---

## 📊 Полная ERD диаграмма с описанием всех связей

```mermaid
erDiagram
    %% ═══════════════════════════════════════════════════════════════
    %% ГЕОГРАФИЧЕСКИЕ СУЩНОСТИ (Geographic Entities)
    %% ═══════════════════════════════════════════════════════════════
    
    CITIES ||--o{ STREETS : "содержит улицы"
    CITIES ||--o{ BUILDINGS : "содержит здания"
    
    CITIES {
        varchar(50) id PK "Уникальный ID города"
        varchar(255) name UK "Название города (уникальное)"
    }
    
    STREETS ||--o{ BUILDINGS : "содержит здания"
    STREETS }o--|| CITIES : "принадлежит городу"
    
    STREETS {
        varchar(50) id PK "Уникальный ID улицы"
        varchar(255) name "Название улицы"
        varchar(50) city_id FK "Ссылка на город"
    }
    
    DISTRICTS ||--o{ BUILDINGS : "содержит здания"
    
    DISTRICTS {
        varchar(50) id PK "Уникальный ID района"
        varchar(255) name UK "Название района (уникальное)"
    }
    
    FOLK_DISTRICTS ||--o{ BUILDINGS : "содержит здания"
    
    FOLK_DISTRICTS {
        varchar(50) id PK "Уникальный ID микрорайона"
        varchar(255) name "Название микрорайона"
    }
    
    BIG_FOLK_DISTRICTS ||--o{ BUILDINGS : "содержит здания"
    
    BIG_FOLK_DISTRICTS {
        varchar(50) id PK "Уникальный ID большого микрорайона"
        varchar(255) name UK "Название (уникальное)"
    }
    
    %% ═══════════════════════════════════════════════════════════════
    %% ЗДАНИЯ (Buildings) - Центральная сущность
    %% ═══════════════════════════════════════════════════════════════
    
    BUILDINGS }o--|| STREETS : "расположено на улице"
    BUILDINGS }o--|| DISTRICTS : "в районе"
    BUILDINGS }o--|| FOLK_DISTRICTS : "в микрорайоне"
    BUILDINGS }o--|| BIG_FOLK_DISTRICTS : "в большом микрорайоне"
    BUILDINGS }o--|| CITIES : "в городе"
    BUILDINGS ||--o{ BLACKOUTS_BUILDINGS : "затронуто авариями"
    BUILDINGS ||--o{ COMPLAINTS : "имеет жалобы"
    
    BUILDINGS {
        varchar(50) id PK "Уникальный ID здания"
        varchar(50) street_id FK "Улица"
        varchar(50) number "Номер дома (15А, 23/1)"
        varchar(50) district_id FK "Административный район"
        varchar(50) folk_district_id FK "Микрорайон"
        varchar(50) big_folk_district_id FK "Большой микрорайон"
        varchar(50) city_id FK "Город"
        varchar(100) type "Тип здания (жилой, коммерческий)"
        decimal(11-8) latitude "Широта для карты"
        decimal(11-8) longitude "Долгота для карты"
        boolean is_fake "Фиктивное здание (для группировок)"
    }
    
    %% ═══════════════════════════════════════════════════════════════
    %% АВАРИИ И ОТКЛЮЧЕНИЯ (Blackouts)
    %% ═══════════════════════════════════════════════════════════════
    
    BLACKOUTS ||--o{ BLACKOUTS_BUILDINGS : "затрагивает здания"
    BLACKOUTS }o--|| INITIATORS : "инициирована компанией"
    
    BLACKOUTS {
        varchar(50) id PK "Уникальный ID аварии"
        timestamp start_date "Дата и время начала"
        timestamp end_date "Фактическая дата окончания"
        timestamp predicted_end_date "Прогнозируемое окончание"
        text description "Описание работ"
        varchar(50) type "Тип: electricity, cold_water, hot_water, heat"
        text source "Источник информации (URL)"
        varchar(50) work_type "Плановый ремонт / Авария"
        int initiator_id FK "Управляющая компания"
    }
    
    %% ═══════════════════════════════════════════════════════════════
    %% СВЯЗЬ АВАРИЙ И ЗДАНИЙ (Many-to-Many)
    %% ═══════════════════════════════════════════════════════════════
    
    BLACKOUTS_BUILDINGS }o--|| BLACKOUTS : "относится к аварии"
    BLACKOUTS_BUILDINGS }o--|| BUILDINGS : "относится к зданию"
    
    BLACKOUTS_BUILDINGS {
        bigint id PK "Автоинкремент ID"
        varchar(50) blackout_id FK "Ссылка на аварию"
        varchar(50) building_id FK "Ссылка на здание"
    }
    
    %% ═══════════════════════════════════════════════════════════════
    %% УПРАВЛЯЮЩИЕ КОМПАНИИ (Management Companies)
    %% ═══════════════════════════════════════════════════════════════
    
    INITIATORS ||--o{ BLACKOUTS : "инициирует аварии"
    
    INITIATORS {
        int id PK "Автоинкремент ID"
        text initiator_name "Название компании"
        varchar(50) phone_number "Телефон для связи"
        varchar(255) email "Email для связи"
    }
    
    %% ═══════════════════════════════════════════════════════════════
    %% ЖАЛОБЫ ЖИТЕЛЕЙ (Complaints)
    %% ═══════════════════════════════════════════════════════════════
    
    COMPLAINTS }o--|| BUILDINGS : "относится к зданию"
    
    COMPLAINTS {
        bigint id PK "Автоинкремент ID"
        varchar(50) building_id FK "Здание с проблемой"
        varchar(50) blackout_type "Тип проблемы: electricity, cold_water, hot_water, heat"
    }
```

---

**Документ:** ERD Backend системы (ее базы данных)

**Версия:** 1.0.0  

**Автор:** Dropz
