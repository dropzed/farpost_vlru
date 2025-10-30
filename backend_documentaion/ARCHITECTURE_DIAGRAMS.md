# 📐 Архитектурные диаграммы Backend системы

> Визуализация архитектуры VL.ru Blackouts System с использованием Mermaid диаграмм

---

## 📋 Содержание

1. [Общая архитектура системы](#общая-архитектура-системы)
2. [Структура модулей NestJS](#структура-модулей-nestjs)
3. [Поток обработки запроса](#поток-обработки-запроса)
4. [Система кеширования](#система-кеширования)
5. [Жизненный цикл приложения](#жизненный-цикл-приложения)

---

## Общая архитектура системы

```mermaid
graph TB
    subgraph "Client Layer"
        A[API Client]
    end

    subgraph "Application Layer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        D[API Gateway / Controllers]
        E[Business Logic / Services]
        F[Data Access / Repositories]
        G[Cache Service]
    end

    subgraph "Data Layer"
        H[(PostgreSQL<br/>Primary Database)]
        I[(Redis<br/>Cache Layer)]
    end

    subgraph "Infrastructure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        K[Backup System]
        L[Health Monitoring]
    end

    A --> D
    D --> E
    E --> G
    G --> I
    E --> F
    F --> H
    H --> K
    I --> L
    H --> L

    style D fill:#e74c3c,color:#fff
    style E fill:#3498db,color:#fff
    style F fill:#2ecc71,color:#fff
    style H fill:#9b59b6,color:#fff
    style I fill:#e67e22,color:#fff
```

---

## Структура модулей NestJS

```mermaid
graph LR
    subgraph "App Module (Root)"
        A[AppModule]
    end
    
    subgraph "Feature Modules"
        B[BlackoutsMapInfoModule]
        C[CurrentBlackoutsModule]
        D[CountBlackoutsModule]
        E[ManagementCompaniesModule]
    end
    
    subgraph "Shared Modules"
        F[CommonModule]
        G[ConfigModule]
        H[TypeOrmModule]
        I[CacheModule]
    end
    
    subgraph "Services"
        J[CacheWarmingService]
        K[RedisHealthService]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    
    B -.import.-> H
    C -.import.-> H
    D -.import.-> H
    E -.import.-> H
    
    B -.import.-> I
    C -.import.-> I
    D -.import.-> I
    E -.import.-> I
    
    F --> J
    F --> K
    
    style A fill:#e74c3c,color:#fff
    style F fill:#3498db,color:#fff
```

---

## Система кеширования

```mermaid
graph TB
    subgraph "Client Request Flow"
        A[HTTP Request] --> B{Cache Check}
    end

```

```mermaid
graph TB
    
    subgraph "Cache Warming"
        H[App Startup] --> I[CacheWarmingService]
        I --> J[Preload Heavy Queries]
        J --> K[December 2019 Data]
        J --> L[Initiators List]
        J --> M[Statistics]
        K --> N[(Redis)]
        L --> N
        M --> N
    end
```

```mermaid
graph TB
    subgraph "Cache Monitoring"
        O[RedisHealthService]
        O --> P{Memory Check}
        O --> Q{Connection Check}
        O --> R{Hit Rate Check}

        P -->|> 90%| S[🔴 Alert: High Memory]
        Q -->|Fail| T[🔴 Alert: Disconnected]
        R -->|< 50%| U[⚠️ Warning: Low Hit Rate]
end
```

---

## Жизненный цикл приложения

```mermaid
stateDiagram-v2
    [*] --> Bootstrap: npm start
    
    Bootstrap --> LoadConfig: Load .env
    LoadConfig --> ConnectDB: Connect PostgreSQL
    ConnectDB --> ConnectRedis: Connect Redis
    
    ConnectRedis --> RunMigrations: Check migrations
    RunMigrations --> WarmCache: Warmup cache
    
    WarmCache --> InitModules: Initialize NestJS modules
    InitModules --> RegisterMiddleware: Register global pipes/filters
    RegisterMiddleware --> StartSwagger: Setup Swagger docs
    
    StartSwagger --> ListenPort: Listen on port 3000
    ListenPort --> Ready: ✓ Application Ready
    
    Ready --> HandleRequests: Handle HTTP requests
    HandleRequests --> HandleRequests: Process requests
    
    Ready --> HealthChecks: Background health checks
    HealthChecks --> HealthChecks: Monitor every 30s
    
    HandleRequests --> Shutdown: SIGTERM / SIGINT
    HealthChecks --> Shutdown
    
    Shutdown --> CloseConnections: Close DB connections
    CloseConnections --> FlushCache: Flush Redis cache
    FlushCache --> [*]: Exit gracefully
    
    note right of WarmCache
        Preload:
        - December 2019 blackouts
        - All initiators
        - Statistics
    end note
    
    note right of HealthChecks
        Monitor:
        - Redis connection
        - Memory usage
        - Hit rate
    end note
```


---

## Error Handling Flow

```mermaid
flowchart TD
    A[HTTP Request] --> B{ValidationPipe}
    
    B -->|Valid| C[Controller]
    B -->|Invalid| D[ValidationException]
    
    C --> E{Service Logic}
    
    E -->|Success| F[Return Data]
    E -->|Error| G{Error Type}
    
    G -->|HttpException| H[AllExceptionsFilter]
    G -->|Unexpected Error| I[AllExceptionsFilter]
    
    H --> J[Log Error]
    I --> J
    
    J --> K{Error Level}
    
    K -->|400 Bad Request| L[Client Error Response]
    K -->|404 Not Found| M[Not Found Response]
    K -->|500 Server Error| N[Server Error Response<br/>+ Alert]
    
    D --> O[400 Validation Error]
    
    O --> P[Return Error JSON]
    L --> P
    M --> P
    N --> P
    
    P --> Q[Client receives error]
    F --> R[Client receives data]
    
    style D fill:#e74c3c,color:#fff
    style G fill:#e67e22,color:#fff
    style N fill:#c0392b,color:#fff
    style F fill:#2ecc71,color:#fff
```

---

## Как вручную посмотреть эти диаграммы

**Для Mermaid Live Editor:**
1. Откройте https://mermaid.live/

**Для GitHub/GitLab:**
- Диаграммы автоматически рендерятся в Markdown

---

**Версия:** 1.0.0

**Автор:** Dropz