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
    "\n🛡️  USA DEPLOYMENT: EXECUTING ULTIMATE LANGUAGE PURGE...\n" +
    colors.reset,
);

const finalCleanupTasks = [
  // 1. Dashboard & Wallet (Cüzdan) - app/bana-ozel klasörü (dashboard olarak varsayılmıştır)
  {
    file: "app/bana-ozel/cuzdan/page.tsx",
    replacements: [
      { search: "Cüzdanım", replace: "My Wallet" },
      {
        search: "Cüzdan bilgisi alınamadı.",
        replace: "Could not retrieve wallet info.",
      },
      {
        search: "Cüzdan bakiyeniz ile doping satın alabilir",
        replace: "You can use your balance to buy listing boosts.",
      },
      {
        search: "Tüm işlemler SSL güvencesi altındadır.",
        replace: "All transactions are secured with SSL.",
      },
    ],
  },
  // 2. Wallet Actions - lib/actions/wallet-actions.ts
  {
    file: "lib/actions/wallet-actions.ts",
    replacements: [
      { search: "Kredi Kartı ile Yükleme", replace: "Deposit via Credit Card" },
      { search: "Cüzdan bulunamadı", replace: "Wallet not found" },
      { search: "Giriş yapmalısınız", replace: "You must be logged in" },
      { search: "Bakiye Yükle", replace: "Add Balance" },
      {
        search: "En az 10 TL yükleyebilirsiniz",
        replace: "Minimum deposit is $10",
      },
    ],
  },
  // 3. Admin Logs & Activity - app/admin/logs/page.tsx
  {
    file: "app/admin/logs/page.tsx",
    replacements: [
      { search: "Sistem Kayıtları", replace: "System Logs" },
      { search: "Son 100 işlem", replace: "Last 100 activities" },
      { search: "Henüz kayıt yok.", replace: "No logs available." },
      { search: "Kullanıcı", replace: "User" },
      { search: "İşlem (Action)", replace: "Action" },
      { search: "Detaylar (Metadata)", replace: "Details (Metadata)" },
      { search: "Zaman", replace: "Timestamp" },
    ],
  },
  // 4. Moderasyon & Hata Mesajları - lib/moderation/engine.ts
  {
    file: "lib/moderation/engine.ts",
    replacements: [
      {
        search: "Yasaklı içerik tespit edildi:",
        replace: "Prohibited content detected:",
      },
    ],
  },
  // 5. Ad Details & Technical Specs - components/AdDetail/TechnicalSpecsTab.tsx
  {
    file: "components/AdDetail/TechnicalSpecsTab.tsx",
    replacements: [
      { search: "Teknik Özellikler", replace: "Technical Specifications" },
      { search: "Veri bulunamadı", replace: "No data found" },
    ],
  },
  // 6. Favorites UI - app/bana-ozel/favoriler/page.tsx
  {
    file: "app/bana-ozel/favoriler/page.tsx",
    replacements: [
      { search: "Favori İlanlarım", replace: "My Favorite Ads" },
      { search: "Favori İlanınız Yok", replace: "No Favorite Ads" },
      {
        search: "Beğendiğiniz ilanları favoriye ekleyerek",
        replace: "Add ads to favorites to track price changes.",
      },
      { search: "İlanlara Göz At", replace: "Browse Ads" },
    ],
  },
  // 7. Messaging UI - app/bana-ozel/mesajlarim/page.tsx
  {
    file: "app/bana-ozel/mesajlarim/page.tsx",
    replacements: [
      { search: "Sohbet Başlatın", replace: "Start a Conversation" },
      {
        search: "Mesajlaşmak için sol menüden bir konuşma seçin",
        replace: "Select a conversation from the sidebar to start messaging",
      },
      { search: "Mesaj gönderilemedi", replace: "Message could not be sent" },
      { search: "Sohbet Başlangıcı", replace: "Conversation Started" },
    ],
  },
];

finalCleanupTasks.forEach((task) => {
  const filePath = path.join(process.cwd(), task.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanged = false;

    task.replacements.forEach((rep) => {
      if (content.includes(rep.search)) {
        const regex = new RegExp(rep.search, "g");
        content = content.replace(regex, rep.replace);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      fs.writeFileSync(filePath, content);
      console.log(
        colors.green + `✔ Purged Turkish from: ${task.file}` + colors.reset,
      );
    }
  }
});

// Para birimi sembollerini TL'den USD'ye zorla ($)
const currencyFixFiles = [
  "components/wallet/WalletOverview.tsx",
  "components/wallet/TransactionHistory.tsx",
];

currencyFixFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (content.includes(" TL")) {
      content = content.replace(/ TL/g, " $");
      fs.writeFileSync(filePath, content);
      console.log(
        colors.green + `✔ Currency symbol updated in ${file}` + colors.reset,
      );
    }
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ FINAL PURGE COMPLETE. READY FOR USA DEPLOYMENT.\n" +
    colors.reset,
);
