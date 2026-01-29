const fs = require("fs");
const path = require("path");

console.log("🛠️ Build iyileştirmeleri yapılıyor...");

// 1. next.config.ts dosyasındaki geçersiz 'eslint' anahtarını temizle
const nextConfigPath = path.join(process.cwd(), "next.config.ts");
if (fs.existsSync(nextConfigPath)) {
  let nextConfig = fs.readFileSync(nextConfigPath, "utf8");
  // 'eslint' anahtarını ve içeriğini regex ile kaldırır
  if (nextConfig.includes("eslint:")) {
    nextConfig = nextConfig.replace(/eslint:\s*{[\s\S]*?},/g, "");
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log(
      "✅ next.config.ts: Artık desteklenmeyen 'eslint' bloğu kaldırıldı.",
    );
  }
}

// 2. sitemap.ts dosyasının build sırasında hata vermemesi için dinamik hale getir
const sitemapPath = path.join(process.cwd(), "app/sitemap.ts");
if (fs.existsSync(sitemapPath)) {
  let sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemapContent.includes("export const dynamic = 'force-dynamic'")) {
    sitemapContent =
      "export const dynamic = 'force-dynamic';\n" + sitemapContent;
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(
      "✅ sitemap.ts: 'force-dynamic' eklendi (Build hatasını önlemek için).",
    );
  }
}

console.log("🚀 Yapılandırma güncellendi. Vercel'e push yapabilirsiniz.");
