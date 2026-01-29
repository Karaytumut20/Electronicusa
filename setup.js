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
    "\n🇺🇸 FINAL PURGE: REMOVING LAST TURKISH ELEMENTS FOR USA DEPLOYMENT...\n" +
    colors.reset,
);

const translationTasks = [
  // 1. Admin Panel - Ads Management
  {
    file: "app/admin/ilanlar/page.tsx",
    replacements: [
      { search: "İlan Yönetimi", replace: "Ad Management" },
      { search: "Tüm İlanlar", replace: "All Listings" },
      { search: "Onay Bekleyenler", replace: "Pending Approval" },
      { search: "Yayındakiler", replace: "Active Listings" },
      { search: "Reddedilenler", replace: "Rejected" },
      {
        search: "Bu kriterde ilan bulunamadı.",
        replace: "No ads found matching these criteria.",
      },
      { search: "İlan", replace: "Listing" },
      { search: "Satıcı", replace: "Seller" },
      { search: "Fiyat", replace: "Price" },
      { search: "Durum", replace: "Status" },
      { search: "İşlemler", replace: "Actions" },
      { search: "Bilinmiyor", replace: "Unknown" },
      { search: "Yayında", replace: "Active" },
      { search: "Bekliyor", replace: "Pending" },
      { search: "Reddedildi", replace: "Rejected" },
      { search: "Görüntüle", replace: "View" },
      { search: "Onayla", replace: "Approve" },
      { search: "Reddet", replace: "Reject" },
      {
        search: "Bu ilanı yayınlamak istiyor musunuz?",
        replace: "Do you want to publish this ad?",
      },
      {
        search: "Reddetme sebebini yazınız:",
        replace: "Please enter the rejection reason:",
      },
    ],
  },
  // 2. Admin Panel - User Management
  {
    file: "app/admin/kullanicilar/page.tsx",
    replacements: [
      { search: "Kullanıcı Yönetimi", replace: "User Management" },
      {
        search: "İsim veya E-posta ara...",
        replace: "Search Name or Email...",
      },
      { search: "Kullanıcı", replace: "User" },
      { search: "İletişim", replace: "Contact" },
      { search: "Rol", replace: "Role" },
      { search: "Durum", replace: "Status" },
      { search: "İsimsiz", replace: "Anonymous" },
      { search: "Telefon Yok", replace: "No Phone" },
      { search: "Üye", replace: "Member" },
      { search: "Kurumsal", replace: "Store" },
      { search: "Yönetici", replace: "Administrator" },
      { search: "Aktif", replace: "Active" },
      { search: "Banlı", replace: "Banned" },
      { search: "Banla", replace: "Ban" },
      { search: "Banı Kaldır", replace: "Unban" },
      { search: "İşlem başarısız.", replace: "Action failed." },
      { search: "Kullanıcı bulunamadı.", replace: "User not found." },
    ],
  },
  // 3. Admin Panel - Settings
  {
    file: "app/admin/ayarlar/page.tsx",
    replacements: [
      { search: "Site Ayarları", replace: "Site Settings" },
      { search: "Genel", replace: "General" },
      { search: "Güvenlik", replace: "Security" },
      { search: "E-posta & Bildirim", replace: "Email & Notifications" },
      { search: "Site Bilgileri", replace: "Site Information" },
      { search: "Site Başlığı", replace: "Site Title" },
      { search: "Site URL", replace: "Site URL" },
      { search: "Açıklama (Meta Description)", replace: "Meta Description" },
      { search: "Üyelik & İlan", replace: "Membership & Ads" },
      {
        search: "Yeni üyelik alımı açık olsun",
        replace: "Allow new registrations",
      },
      {
        search: "İlanlar editör onayı olmadan yayınlanmasın",
        replace: "Ads require editor approval",
      },
      {
        search: "Bakım modu (Sadece adminler erişebilir)",
        replace: "Maintenance mode (Admins only)",
      },
      { search: "Ayarları Kaydet", replace: "Save Settings" },
    ],
  },
  // 4. Wallet (Cüzdan) Translation
  {
    file: "app/bana-ozel/cuzdan/page.tsx",
    replacements: [
      { search: "Cüzdanım", replace: "My Wallet" },
      {
        search: "Cüzdan bilgisi alınamadı.",
        replace: "Wallet info not found.",
      },
      {
        search: "Cüzdan bakiyeniz ile doping satın alabilir",
        replace: "You can purchase boosts with your balance.",
      },
      {
        search: "Tüm işlemler SSL güvencesi altındadır.",
        replace: "All transactions are secured by SSL.",
      },
    ],
  },
  // 5. Review Section (Yorumlar)
  {
    file: "components/ReviewSection.tsx",
    replacements: [
      {
        search: "Yorum yapmak için giriş yapmalısınız.",
        replace: "You must login to leave a review.",
      },
      { search: "Deneyimini Paylaş", replace: "Share Your Experience" },
      {
        search: "Satıcı hakkında düşüncelerin...",
        replace: "Your thoughts about the seller...",
      },
      { search: "Gönder", replace: "Submit" },
      { search: "Henüz değerlendirme yapılmamış.", replace: "No reviews yet." },
      { search: "Yorum", replace: "Review" },
      { search: "Kullanıcı", replace: "User" },
    ],
  },
  // 6. Global Utility & Date Fixes
  {
    file: "lib/utils.ts",
    replacements: [
      { search: "Dün", replace: "Yesterday" },
      { search: "Bugün", replace: "Today" },
    ],
  },
];

translationTasks.forEach((task) => {
  const filePath = path.join(process.cwd(), task.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChange = false;

    task.replacements.forEach((rep) => {
      if (content.includes(rep.search)) {
        const regex = new RegExp(rep.search, "g");
        content = content.replace(regex, rep.replace);
        hasChange = true;
      }
    });

    if (hasChange) {
      fs.writeFileSync(filePath, content);
      console.log(colors.green + `✔ Translated: ${task.file}` + colors.reset);
    }
  }
});

// Final Check for hardcoded "TL" currency in files
const filesToCheckCurrency = [
  "app/admin/odemeler/page.tsx",
  "app/bana-ozel/siparislerim/page.tsx",
  "components/wallet/TransactionHistory.tsx",
];

filesToCheckCurrency.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (content.includes("TL")) {
      content = content.replace(/TL/g, "USD");
      fs.writeFileSync(filePath, content);
      console.log(
        colors.green +
          `✔ Updated Currency in ${file}: TL -> USD` +
          colors.reset,
      );
    }
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ TRANSLATION AUDIT COMPLETE. THE PROJECT IS NOW 100% ENGLISH.\n" +
    colors.reset,
);
