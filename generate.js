const fs = require('fs');
const path = require('path');

const NUM_REPOS = 10000;
const BASE_DIR = __dirname;

// Replace with your own selection of most popular npm packages
const popularPackages = [
    "react", "axios", "express", "moment", "chalk", "uuid",
    "dayjs", "commander", "debug", "dotenv", "mongoose",
    "bluebird", "async", "cors", "jest", "prettier"
];

function getRandomPackages(excludeList, count) {
    const available = popularPackages.filter(pkg => !excludeList.includes(pkg));
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

for (let i = 1; i <= NUM_REPOS; i++) {
    const dirName = `repo${String(i).padStart(4, '0')}`;
    const dirPath = path.join(BASE_DIR, dirName);
    const pkgPath = path.join(dirPath, 'package.json');

    if (!fs.existsSync(pkgPath)) continue;

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const existingDeps = Object.keys(pkg.dependencies || {});
    const numToAdd = Math.floor(Math.random() * 3); // 0, 1, or 2

    const newPackages = getRandomPackages(existingDeps, numToAdd);
    newPackages.forEach(name => {
        pkg.dependencies[name] = "*"; // Or set to latest version if you prefer
    });

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

console.log(`✅ Updated ${NUM_REPOS} repos with random packages`);
