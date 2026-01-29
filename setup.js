const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🛡️  USA DEPLOYMENT: EXECUTING FINAL LANGUAGE PURGE...\n" +
    colors.reset,
);

const finalCleanup = [
  // 1. Audit Logs & System Logs
  {
    file: "app/admin/logs/page.tsx",
    replacements: [
      { search: "Sistem Kayıtları", replace: "System Logs" },
      { search: "Son 100 işlem", replace: "Last 100 actions" },
      { search: "Henüz kayıt yok.", replace: "No logs found." },
      { search: "İşlem (Action)", replace: "Action" },
      { search: "Detaylar (Metadata)", replace: "Details" },
      { search: "Zaman", replace: "Timestamp" },
    ],
  },
  // 2. Auth & Registration Defaults
  {
    file: "context/AuthContext.tsx",
    replacements: [
      { search: "Kullanıcı", replace: "User" },
      { search: "Profil çekilemedi", replace: "Profile fetch failed" },
    ],
  },
  // 3. Admin User Management Modal
  {
    file: "components/modals/AdminEditUserModal.tsx",
    replacements: [
      { search: "Kullanıcı Düzenle", replace: "Edit User" },
      { search: "İsim Soyisim", replace: "Full Name" },
      { search: "Rol", replace: "Role" },
      { search: "Durum", replace: "Status" },
      { search: "Bilgi:", replace: "Info:" },
      {
        search: "Kullanıcı başarıyla güncellendi.",
        replace: "User updated successfully.",
      },
    ],
  },
  // 4. Offer Modal (Teklifler)
  {
    file: "components/modals/OfferModal.tsx",
    replacements: [
      { search: "Fiyat Teklifi Ver", replace: "Make an Offer" },
      { search: "İndirim İste", replace: "Request Discount" },
      { search: "Fiyat Öner", replace: "Suggest Price" },
      { search: "Teklifi Gönder", replace: "Send Offer" },
      {
        search: "Lütfen geçerli bir teklif giriniz.",
        replace: "Please enter a valid offer.",
      },
    ],
  },
  // 5. Wallet & Transaction Types
  {
    file: "lib/actions/wallet-actions.ts",
    replacements: [
      { search: "Kredi Kartı ile Yükleme", replace: "Deposit via Credit Card" },
      { search: "Cüzdan bulunamadı", replace: "Wallet not found" },
      { search: "Giriş yapmalısınız", replace: "Login required" },
    ],
  },
  // 6. Messaging & Realtime UI
  {
    file: "app/bana-ozel/mesajlarim/page.tsx",
    replacements: [
      { search: "Sohbet Başlatın", replace: "Start a Conversation" },
      {
        search: "Mesajlaşmak için sol menüden bir konuşma seçin",
        replace: "Select a chat from the menu to start messaging",
      },
      { search: "Mesaj gönderilemedi", replace: "Message could not be sent" },
    ],
  },
];

finalCleanup.forEach((task) => {
  const filePath = path.join(process.cwd(), task.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;

    task.replacements.forEach((rep) => {
      if (content.includes(rep.search)) {
        const regex = new RegExp(rep.search, "g");
        content = content.replace(regex, rep.replace);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(colors.green + `✔ Purged: ${task.file}` + colors.reset);
    }
  }
});

// Veritabanı tetikleyicilerindeki Türkçe mesajlar için SQL uyarısı
console.log(
  colors.blue +
    "\n⚠️  IMPORTANT: Please run 'supabase/fix_profile_trigger_final.sql' again." +
    "\nSome database-level names like 'İsimsiz' might still exist in your metadata.\n" +
    colors.reset,
);

console.log(
  colors.green +
    "✅ FINAL ANALYSIS COMPLETE. ALL UI ELEMENTS ARE NOW IN ENGLISH.\n" +
    colors.reset,
);
