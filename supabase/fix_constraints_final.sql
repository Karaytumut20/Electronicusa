-- ⚠️ BU KODU SUPABASE SQL EDITOR'DE CALISTIRIN ⚠️
-- Bu kod, bir ilan silindiğinde mesajların çökmesini engeller ve favorileri yönetir.

-- 1. CONVERSATIONS tablosundaki ad_id ilişkisini güncelle
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_ad_id_fkey;

ALTER TABLE conversations
  ADD CONSTRAINT conversations_ad_id_fkey
  FOREIGN KEY (ad_id)
  REFERENCES ads(id)
  ON DELETE SET NULL; -- İlan silinirse mesaj durur, ad_id NULL olur.

-- 2. FAVORITES tablosundaki ad_id ilişkisini güncelle
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_ad_id_fkey;

ALTER TABLE favorites
  ADD CONSTRAINT favorites_ad_id_fkey
  FOREIGN KEY (ad_id)
  REFERENCES ads(id)
  ON DELETE CASCADE; -- İlan silinirse favorilerden otomatik düşsün (Hata vermemesi için en temizi).
  -- Eğer favorilerde "Silindi" yazsın istiyorsan burayı ON DELETE SET NULL yapabiliriz ama genelde favori temizlenir.

-- 3. MESSAGES tablosunu sağlama al
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;

ALTER TABLE messages
  ADD CONSTRAINT messages_conversation_id_fkey
  FOREIGN KEY (conversation_id)
  REFERENCES conversations(id)
  ON DELETE CASCADE; -- Konuşma silinirse mesajları da sil.