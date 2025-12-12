const puppeteer = require("puppeteer-core");

async function fetchUIverse() {
  console.log("🚀 Starting BrowserBase session...");

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://connect.browserbase.com?apiKey=bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE&projectId=ec860b83-22ca-4178-ad1d-c92db14f01b2`,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // Fetch first animation (main loading)
    console.log("\n📍 Fetching main loading animation HTML...");
    await page.goto("https://uiverse.io/Nawsome/wet-mayfly-23", { waitUntil: "networkidle2", timeout: 30000 });

    // Click on HTML tab if exists
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent && btn.textContent.includes('HTML')) {
          btn.click();
        }
      });
    });

    await new Promise(r => setTimeout(r, 1000));

    const allCode1 = await page.evaluate(() => {
      const codes = [];
      document.querySelectorAll("pre").forEach(pre => {
        codes.push(pre.textContent);
      });
      return codes;
    });

    console.log("=== MAIN LOADING ANIMATION HTML ===");
    allCode1.forEach((code, idx) => {
      console.log("\n--- Code Block " + (idx + 1) + " ---");
      console.log(code);
    });

    // Fetch second animation
    console.log("\n\n📍 Fetching small loading animation HTML...");
    await page.goto("https://uiverse.io/alexruix/white-cat-50", { waitUntil: "networkidle2", timeout: 30000 });

    // Click on HTML tab if exists
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent && btn.textContent.includes('HTML')) {
          btn.click();
        }
      });
    });

    await new Promise(r => setTimeout(r, 1000));

    const allCode2 = await page.evaluate(() => {
      const codes = [];
      document.querySelectorAll("pre").forEach(pre => {
        codes.push(pre.textContent);
      });
      return codes;
    });

    console.log("\n=== SMALL LOADING ANIMATION HTML ===");
    allCode2.forEach((code, idx) => {
      console.log("\n--- Code Block " + (idx + 1) + " ---");
      console.log(code);
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
    console.log("\n🔒 Browser closed");
  }
}

fetchUIverse();
