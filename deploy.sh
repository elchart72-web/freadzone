#!/bin/bash
# FreadZone Deploy Script

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"
DATE=$(date +%Y-%m-%d_%H-%M)

log() { echo "[$(date '+%H:%M:%S')] $1"; }

start() {
    log "FreadZone іске қосылуда..."
    docker compose up -d
    log "Барлық контейнерлер іске қосылды!"
    docker compose ps
}

stop() {
    log "FreadZone тоқтатылуда..."
    docker compose down
    log "Тоқтатылды."
}

restart() {
    stop
    sleep 2
    start
}

backup() {
    mkdir -p "$BACKUP_DIR"
    log "Дерекқор резервтік көшірмесі жасалуда..."
    docker exec freadzone_db pg_dump -U fread_user freadzone > "$BACKUP_DIR/freadzone_$DATE.sql"
    log "Резервтік көшірме: $BACKUP_DIR/freadzone_$DATE.sql"
    # Ескі көшірмелерді жою (7 күннен ескілер)
    find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
    log "7 күннен ескі көшірмелер жойылды."
}

ssl() {
    log "SSL сертификат жасалуда..."
    mkdir -p "$PROJECT_DIR/nginx/ssl"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$PROJECT_DIR/nginx/ssl/key.pem" \
        -out "$PROJECT_DIR/nginx/ssl/cert.pem" \
        -subj "/C=KZ/ST=Astana/L=Astana/O=FreadZone/CN=localhost"
    log "SSL сертификат жасалды: nginx/ssl/"
}

status() {
    log "Контейнер статустары:"
    docker compose ps
    echo ""
    log "Health check:"
    curl -s http://localhost:3000/health | python3 -m json.tool 2>/dev/null || echo "Backend offline"
}

logs() {
    docker compose logs -f --tail=50 "${2:-backend}"
}

case "$1" in
    start)   start   ;;
    stop)    stop    ;;
    restart) restart ;;
    backup)  backup  ;;
    ssl)     ssl     ;;
    status)  status  ;;
    logs)    logs    ;;
    *)
        echo "Пайдалану: $0 {start|stop|restart|backup|ssl|status|logs}"
        echo ""
        echo "  start   — контейнерлерді іске қосу"
        echo "  stop    — контейнерлерді тоқтату"
        echo "  restart — қайта іске қосу"
        echo "  backup  — дерекқор резервтік көшірмесі"
        echo "  ssl     — SSL сертификат жасау"
        echo "  status  — статусты тексеру"
        echo "  logs    — логтарды көру"
        ;;
esac
