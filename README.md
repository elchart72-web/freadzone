# FreadZone 📚
**Ашық онлайн веб-роман платформасы**

## Стек
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + prom-client
- **БД**: PostgreSQL 15
- **AI**: Google Gemini API + N8n
- **Мониторинг**: Prometheus + Grafana + Telegram Bot Alert
- **CI/CD**: Jenkins
- **Инфраструктура**: Terraform + Ansible + Bash
- **Контейнерлеу**: Docker + Docker Compose
- **Reverse Proxy**: Nginx + SSL

## Жылдам іске қосу

### 1. .env жасау
```bash
cp .env.example .env
# .env файлын өңдеп, API кілттерін енгізіңіз
```

### 2. SSL сертификат жасау
```bash
bash deploy.sh ssl
```

### 3. Іске қосу
```bash
docker compose up -d
```

### 4. Немесе Ansible арқылы
```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

## Сервистер

| Сервис       | URL                        |
|--------------|----------------------------|
| Frontend     | http://localhost:3001       |
| Backend API  | http://localhost:3000       |
| Nginx        | http://localhost:80         |
| Prometheus   | http://localhost:9090       |
| Grafana      | http://localhost:3002       |
| Jenkins      | http://localhost:8081       |
| N8n          | http://localhost:5678       |
| AlertManager | http://localhost:9093       |

## API Маршруттары

```
POST /api/auth/register     — Тіркелу
POST /api/auth/login        — Кіру
GET  /api/auth/me           — Ағымдағы пайдаланушы

GET  /api/novels            — Романдар тізімі
GET  /api/novels/:id        — Роман мәліметі
POST /api/novels/:id/reviews — Пікір қалдыру

GET  /api/chapters/novel/:id — Тараулар тізімі
GET  /api/chapters/:id       — Тарауды оқу

GET  /api/users/me/bookmarks — Бетбелгілер
POST /api/users/me/bookmarks — Бетбелгіге қосу

POST /api/ai/recommend       — AI ұсыныстар
POST /api/ai/summarize       — Тарауды қорытындылау
POST /api/ai/chat            — AI чат

GET  /metrics                — Prometheus метрикалары
GET  /health                 — Health check
```

## GitHub
```bash
git init
git add .
git commit -m "Initial commit: FreadZone web novel platform"
git remote add origin https://github.com/USERNAME/freadzone.git
git push -u origin main
```
