-- ⚠️ BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN ⚠️

-- 1. CONVERSATIONS Tablosu için Politikalar
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle (çakışma olmaması için)
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;

-- Görüntüleme Politikası: Alıcı veya Satıcı ise görebilir
CREATE POLICY "Users can view their own conversations"
ON conversations FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Ekleme Politikası: Sadece oturum açmış kullanıcılar ekleyebilir (buyer_id kendisi olmalı)
CREATE POLICY "Users can insert conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Güncelleme Politikası: (Örn: updated_at güncellemek için)
CREATE POLICY "Users can update their own conversations"
ON conversations FOR UPDATE
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);


-- 2. MESSAGES Tablosu için Politikalar
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;

-- Görüntüleme Politikası: Konuşmanın tarafıysa mesajları görebilir
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE id = messages.conversation_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
);

-- Ekleme Politikası: Konuşmanın tarafıysa mesaj atabilir
CREATE POLICY "Users can insert messages in their conversations"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations
    WHERE id = conversation_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
);