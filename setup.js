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
    "\n🎨 UI REFINEMENT: SETTING PURE WHITE CARDS AND OPTIMIZING LAYOUT...\n" +
    colors.reset,
);

const optimizationTasks = [
  // 1. Kart arka planını saf beyaz yap ve resimlerin kesilmesini engelle
  {
    file: "components/AdCard.tsx",
    replacements: [
      {
        // Mavimsi arka planı beyaza çevir
        search: "overflow-hidden bg-slate-50",
        replace: "overflow-hidden bg-white",
      },
      {
        // Resmin tamamını göster (contain) ve biraz boşluk (p-2) ekle
        search:
          'className="object-cover group-hover:scale-110 transition-transform duration-700"',
        replace:
          'className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"',
      },
    ],
  },
  // 2. Ana sayfa grid yapısını 5'ten 4'e düşür
  {
    file: "components/HomeFeed.tsx",
    replacements: [
      {
        search:
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6",
        replace:
          "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8",
      },
    ],
  },
  // 3. Arama sayfası grid yapısını 4'e sabitle
  {
    file: "app/search/page.tsx",
    replacements: [
      {
        search:
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4",
        replace:
          "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",
      },
    ],
  },
];

optimizationTasks.forEach((task) => {
  const filePath = path.join(process.cwd(), task.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanged = false;

    task.replacements.forEach((rep) => {
      if (content.includes(rep.search)) {
        content = content.replace(new RegExp(rep.search, "g"), rep.replace);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      fs.writeFileSync(filePath, content);
      console.log(colors.green + `✔ Updated: ${task.file}` + colors.reset);
    }
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ SUCCESS: Cards are now pure white and layout is optimized for 4 columns.\n" +
    colors.reset,
);
