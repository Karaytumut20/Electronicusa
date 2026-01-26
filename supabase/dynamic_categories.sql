
-- Kategoriler Tablosunu Sıfırla ve Yapılandır
TRUNCATE TABLE categories CASCADE;

-- Eğer yoksa parent_id sütununu ekle
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id bigint REFERENCES categories(id) ON DELETE CASCADE;

-- Başlangıç Kategorilerini Ekle (Görseldekiler)
INSERT INTO categories (id, title, slug, icon) VALUES
(1, 'Amazon & Google', 'amazon-google', 'Zap'),
(2, 'Apple', 'apple', 'Smartphone'),
(3, 'Audio', 'audio', 'Headphones'),
(4, 'Camera', 'camera', 'Camera'),
(5, 'Computer', 'computer', 'Monitor'),
(6, 'Consumer', 'consumer', 'Plug'),
(7, 'Gaming', 'gaming', 'Gamepad2');

SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories));
