const fs = require('fs');
const path = require('path');

const NUM_REPOS = 491;
const BASE_DIR = __dirname;

const weightedVersions = (() => {
    const weights = {
        "2.0.3": 33.88,
        "2.0.2": 17.41,
        "2.0.1":  9.67,
        "1.5.1":  6.77,
        "1.5.0":  4.84,
        "1.4.2":  3.87,
        "1.4.1":  3.39,
        "1.4.0":  2.91,
        "1.3.1":  2.42,
        "1.3.0":  2.13,
        "1.2.2":  1.94,
        "1.2.1":  1.74,
        "1.2.0":  1.55,
        "1.1.0":  1.35,
        "1.0.2":  1.16,
        "1.0.1":  1.06,
        "1.0.0":  0.97,
        "0.0.4":  0.87,
        "0.0.3":  0.77,
        "0.0.2":  0.68,
        "0.0.1":  0.65
    };

    const list = [];
    for (const [version, weight] of Object.entries(weights)) {
        for (let i = 0; i < Math.round(weight * 10); i++) {
            list.push(version);
        }
    }
    return list;
})();

// Random package version for ai-embed-search
function getRandomAiEmbedSearchVersion() {
    const index = Math.floor(Math.random() * weightedVersions.length);
    return weightedVersions[index];
}

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

    // Ensure dependencies object
    pkg.dependencies = pkg.dependencies || {};

    // Always overwrite ai-embed-search with random version
    pkg.dependencies["ai-embed-search"] = getRandomAiEmbedSearchVersion();

    const existingDeps = Object.keys(pkg.dependencies);
    const numToAdd = Math.floor(Math.random() * 3); // 0, 1, or 2
    const newPackages = getRandomPackages(existingDeps, numToAdd);

    newPackages.forEach(name => {
        pkg.dependencies[name] = "*"; // or choose specific versions
    });

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

console.log(`✅ Updated ${NUM_REPOS} repos with random ai-embed-search versions and dependencies.`);
