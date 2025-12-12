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
    console.log("\n📍 Fetching main loading animation...");
    await page.goto("https://uiverse.io/Nawsome/wet-mayfly-23", { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("pre", { timeout: 10000 });

    const allCode1 = await page.evaluate(() => {
      const codes = [];
      document.querySelectorAll("pre").forEach(pre => {
        codes.push(pre.textContent);
      });
      return codes;
    });

    console.log("=== MAIN LOADING ANIMATION (wet-mayfly-23) ===");
    console.log("All code blocks found:", allCode1.length);
    allCode1.forEach((code, idx) => {
      console.log("\n--- Code Block " + (idx + 1) + " ---");
      console.log(code);
    });

    // Take screenshot
    await page.screenshot({ path: "uiverse-main-loading.png" });

    // Fetch second animation (small loading)
    console.log("\n\n📍 Fetching small loading animation...");
    await page.goto("https://uiverse.io/alexruix/white-cat-50", { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("pre", { timeout: 10000 });

    const allCode2 = await page.evaluate(() => {
      const codes = [];
      document.querySelectorAll("pre").forEach(pre => {
        codes.push(pre.textContent);
      });
      return codes;
    });

    console.log("\n=== SMALL LOADING ANIMATION (white-cat-50) ===");
    console.log("All code blocks found:", allCode2.length);
    allCode2.forEach((code, idx) => {
      console.log("\n--- Code Block " + (idx + 1) + " ---");
      console.log(code);
    });

    // Take screenshot
    await page.screenshot({ path: "uiverse-small-loading.png" });

    console.log("\n✅ Screenshots saved");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
    console.log("\n🔒 Browser closed");
  }
}

fetchUIverse();
