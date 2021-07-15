const fs = require('fs');
const puppeteer = require('puppeteer');
const Parser = require('node-html-parser');

const name = 'FishyFred';
const tag = 'bait';

(async () => {
  let wins = 0;
  let losses = 0;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://tracker.gg/valorant/profile/riot/${name}%23${tag}/matches`);
  await page.waitForSelector('.trn-gamereport-list');
  const title = await (await page.$('.trn-gamereport-list__group h3')).evaluate(node => node.innerText);
  if (title.includes('Today')) {
    const todayGames = await page.$('.trn-gamereport-list__group-entries');
    const data = await todayGames.evaluate(node => node.innerHTML);
    Parser.parse(data).childNodes.forEach(node => {
        node.rawAttrs.includes('match--won') ? wins++ : losses++;
    });
  }
  await browser.close();
  fs.writeFileSync('wolo.txt', `W ${wins} L ${losses}`);
})();