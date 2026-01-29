const fs = require("fs");
const path = require("path");

const servicesPath = path.join(process.cwd(), "lib/services.ts");

console.log(
  "🛠️ Fixing build errors: Adding missing exports to lib/services.ts...",
);

// Mevcut dosyayı oku
let content = fs.readFileSync(servicesPath, "utf8");

// Eksik olan fonksiyon tanımları
const missingFunctions = `
// --- MISSING FUNCTIONS ADDED BY SETUP.JS ---

export async function addReviewClient(targetId: string, rating: number, comment: string, reviewerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        target_user_id: targetId,
        rating,
        comment,
        reviewer_id: reviewerId
      }])
      .select()
      .single();
    return { data, error };
}

export async function getReviewsClient(targetId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, reviewer:profiles!reviewer_id(full_name, avatar_url)')
      .eq('target_user_id', targetId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
}

export async function getAdminAdsClient() {
    const { data, error } = await supabase
      .from('ads')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
}

export async function getAllUsersClient() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
}

export async function updateUserStatusClient(userId: string, status: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId);
    return { data, error };
}

export async function updateUserRoleeClient(userId: string, role: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    return { data, error };
}
`;

// Eğer fonksiyonlar zaten yoksa ekle
if (!content.includes("export async function addReviewClient")) {
  content += missingFunctions;
  fs.writeFileSync(servicesPath, content);
  console.log("✅ lib/services.ts updated successfully.");
} else {
  console.log("ℹ️ lib/services.ts already contains necessary exports.");
}

// package.json'da eslint hatalarını görmezden gelmek için build komutunu güncelleme (Opsiyonel ama önerilir)
const pkgPath = path.join(process.cwd(), "package.json");
let pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.scripts.build = "next build"; // Zaten böyleyse dokunma
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log("🚀 Fix completed. You can now deploy to Vercel.");
