-- ⚠️ BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN ⚠️

-- 1. CONVERSATIONS Tablosu için Politikalar (Temizle ve Yeniden Oluştur)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;

-- Görüntüleme: Alıcı veya Satıcı ise görebilir
CREATE POLICY "Users can view their own conversations"
ON conversations FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Ekleme: Sadece oturum açmış kullanıcılar (alıcı olarak) ekleyebilir
CREATE POLICY "Users can insert conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Güncelleme: (Mesaj atıldığında updated_at değişir)
CREATE POLICY "Users can update their own conversations"
ON conversations FOR UPDATE
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);


-- 2. MESSAGES Tablosu için Politikalar
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;

-- Görüntüleme
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE id = messages.conversation_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
);

-- Ekleme
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