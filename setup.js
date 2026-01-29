const fs = require("fs");
const path = require("path");

console.log("🛠️ Build uyarıları için iyileştirmeler yapılıyor...");

// 1. next.config.ts içindeki geçersiz 'eslint' anahtarını kaldır
const nextConfigPath = path.join(process.cwd(), "next.config.ts");
if (fs.existsSync(nextConfigPath)) {
  let nextConfig = fs.readFileSync(nextConfigPath, "utf8");
  // Vercel uyarısı: Unrecognized key(s) in object: 'eslint'
  if (nextConfig.includes("eslint: {")) {
    nextConfig = nextConfig.replace(/eslint:\s*{[\s\S]*?},/g, "");
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log("✅ next.config.ts: 'eslint' anahtarı kaldırıldı.");
  }
}

// 2. middleware.ts dosyasının adını proxy.ts olarak değiştirmeyi önerir (Opsiyonel)
// Next.js 16 uyarısı: The "middleware" file convention is deprecated.
const oldMiddlewarePath = path.join(process.cwd(), "middleware.ts");
const newProxyPath = path.join(process.cwd(), "proxy.ts");
if (fs.existsSync(oldMiddlewarePath)) {
  // fs.renameSync(oldMiddlewarePath, newProxyPath); // Gelecekteki sürümler için aktif edilebilir
  console.log(
    "⚠️ Bilgi: 'middleware.ts' yerine 'proxy.ts' kullanımı öneriliyor.",
  );
}

// 3. Edge Runtime kullanan sayfadaki statik üretim uyarısını kontrol et
// opengraph-image.tsx dosyasındaki runtime ayarı bu uyarıya sebep olur.
const ogImagePath = path.join(
  process.cwd(),
  "app/ilan/[id]/opengraph-image.tsx",
);
if (fs.existsSync(ogImagePath)) {
  console.log(
    "ℹ️ Bilgi: opengraph-image 'edge' runtime kullandığı için statik üretim devre dışı bırakıldı (Beklenen davranış).",
  );
}

console.log("🚀 İyileştirmeler tamamlandı. Mevcut build zaten başarılı.");
