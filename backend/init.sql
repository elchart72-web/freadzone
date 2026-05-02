-- ============================================
-- FreadZone Database Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50)  UNIQUE NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  DEFAULT 'reader' CHECK (role IN ('reader','author','admin')),
    avatar_url  VARCHAR(255),
    bio         TEXT,
    coins       INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Novels table
CREATE TABLE IF NOT EXISTS novels (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    author_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    description  TEXT,
    cover_url    VARCHAR(255),
    genre        VARCHAR(50),
    tags         TEXT[],
    status       VARCHAR(20) DEFAULT 'ongoing' CHECK (status IN ('ongoing','completed','hiatus')),
    language     VARCHAR(10) DEFAULT 'ru',
    views        INTEGER DEFAULT 0,
    word_count   INTEGER DEFAULT 0,
    rating       NUMERIC(3,2) DEFAULT 0,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
    id           SERIAL PRIMARY KEY,
    novel_id     INTEGER REFERENCES novels(id) ON DELETE CASCADE,
    chapter_num  INTEGER NOT NULL,
    title        VARCHAR(200),
    content      TEXT NOT NULL,
    word_count   INTEGER DEFAULT 0,
    is_free      BOOLEAN DEFAULT TRUE,
    views        INTEGER DEFAULT 0,
    created_at   TIMESTAMP DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    novel_id    INTEGER REFERENCES novels(id) ON DELETE CASCADE,
    chapter_id  INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, novel_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    novel_id   INTEGER REFERENCES novels(id) ON DELETE CASCADE,
    rating     INTEGER CHECK (rating BETWEEN 1 AND 5),
    text       TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, novel_id)
);

-- Reading log table
CREATE TABLE IF NOT EXISTS reading_log (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    chapter_id  INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
    novel_id    INTEGER REFERENCES novels(id) ON DELETE CASCADE,
    time_spent  INTEGER DEFAULT 0,
    read_at     TIMESTAMP DEFAULT NOW()
);

-- User stats view
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    COUNT(DISTINCT b.novel_id)  AS bookmarks_count,
    COUNT(DISTINCT r.id)        AS reviews_count,
    COUNT(DISTINCT rl.id)       AS chapters_read,
    COALESCE(SUM(rl.time_spent),0) AS total_time_spent
FROM users u
LEFT JOIN bookmarks b  ON b.user_id  = u.id
LEFT JOIN reviews r    ON r.user_id  = u.id
LEFT JOIN reading_log rl ON rl.user_id = u.id
GROUP BY u.id, u.username;

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO users (username, email, password, role) VALUES
('admin',      'admin@freadzone.kz',   '$2b$10$hashedpassword1', 'admin'),
('sanzhar',    'sanzhar@gmail.com',    '$2b$10$hashedpassword2', 'author'),
('aizat',      'aizat@gmail.com',      '$2b$10$hashedpassword3', 'author'),
('baiko',      'baiko@mail.ru',        '$2b$10$hashedpassword4', 'reader'),
('erzhan',     'erzhan@mail.ru',       '$2b$10$hashedpassword5', 'reader')
ON CONFLICT DO NOTHING;

INSERT INTO novels (title, author_id, description, genre, tags, status, views, rating) VALUES
('Қазақ батырының жолы',      2, 'Ежелгі қазақ жерінде батыр туралы эпос.',              'fantasy',  ARRAY['fantasy','adventure','kazakh'], 'ongoing',   15420, 4.8),
('Жасанды интеллект',         2, 'Болашақта ЖИ адамдармен бәсекелеседі.',               'sci-fi',   ARRAY['sci-fi','ai','dystopia'],       'completed', 9830,  4.5),
('Астана 2080',                3, 'Болашақ Астанада детектив тергеу.',                   'thriller', ARRAY['thriller','future','detective'], 'ongoing',   7200,  4.3),
('Сүйіспеншілік және код',    3, 'Программист жас қыз бен романтика.',                  'romance',  ARRAY['romance','it','modern'],        'ongoing',   12100, 4.6),
('Тәңірдің сыйы',             2, 'Мифологиялық қазақ əлеміндегі батыр.',                'fantasy',  ARRAY['fantasy','mythology','epic'],   'completed', 5600,  4.7),
('Дала жауынгері',            3, 'Тарихи роман XVII ғасыр.',                            'history',  ARRAY['history','war','kazakh'],       'ongoing',   4300,  4.4),
('Silicon Steppe',            2, 'Tech startup story in Kazakhstan.',                   'drama',    ARRAY['drama','startup','tech'],       'ongoing',   8900,  4.2),
('Мәңгілік жер',              3, 'Постапокалиптикалық Қазақстан.',                     'sci-fi',   ARRAY['sci-fi','post-apocalypse'],     'ongoing',   6700,  4.1),
('Жас кәсіпкер',              2, 'Бизнес пен достық туралы заманауи роман.',            'drama',    ARRAY['drama','business','youth'],     'completed', 3400,  4.0),
('Виртуал шындық',            3, 'VR ойынындағы тіршілік сыры.',                       'fantasy',  ARRAY['fantasy','vr','gaming'],        'ongoing',   11200, 4.5)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (novel_id, chapter_num, title, content, word_count) VALUES
(1, 1, 'Тарихтың басы',      'Ертеде, Ұлы даланың кеңістігінде, халқы мол, жері кең бір ел болыпты. Сол елде батыр туды...', 1200),
(1, 2, 'Бірінші сынақ',      'Батыр өзінің күшін сынамақ болды. Таудың басына шығып, арыстанмен бетпе-бет келді...', 1350),
(1, 3, 'Жауды іздеу',        'Жаудың ізін қуа, батыр шөлге кірді. Күн ысып тұрды, су жоқ, бірақ ол тоқтамады...', 980),
(2, 1, 'Оянған жасанды ми',  'Жыл 2075. Лаборатория тыныш. ЖИ-7 жүйесі бірінші рет өздігінен сұрақ қойды: "Мен кіммін?"', 1100),
(2, 2, 'Адам мен машина',    'Доктор Аяла өзінің жасаған ЖИ-іне қарады. Бұл енді тек код емес еді...', 1280),
(3, 1, 'Астана 2080 жылы',   '2080 жылғы Астана — бұлт қалалары мен жасыл мұнаралар шаһары. Детектив Мадияр жаңа іске кіріседі...', 1050),
(4, 1, 'Кездейсоқ кездесу',  'Айгерім кофеханада отырып кодтап жатқанда, кімдір оның компьютеріне қарай берді...', 900),
(5, 1, 'Аңыздың туылуы',     'Тәңір батырға сый берді — жасырын қару мен мәңгілік жас...', 1400),
(6, 1, 'Соғыс алдында',      '1680 жыл. Жоңғар шапқыншылығы алдындағы дала тыныш...', 1600),
(10, 1, 'Виртуал əлемге кіру', 'Аян VR шлемін кимесімен, бөтен əлемде оянды...', 850)
ON CONFLICT DO NOTHING;

INSERT INTO bookmarks (user_id, novel_id, chapter_id) VALUES
(4, 1, 1), (4, 2, 4), (4, 5, 8),
(5, 3, 6), (5, 4, 7), (5, 10, 10)
ON CONFLICT DO NOTHING;

INSERT INTO reviews (user_id, novel_id, rating, text) VALUES
(4, 1, 5, 'Өте керемет роман! Тарихи фэнтези жанрының шедеврі.'),
(4, 2, 4, 'ЖИ тақырыбы өте өзекті. Авторға рахмет!'),
(5, 3, 4, 'Детектив желісі қызықты, бірақ аяқталуы болжамды.'),
(5, 4, 5, 'Романтика мен IT — идеалды үйлесім!')
ON CONFLICT DO NOTHING;
