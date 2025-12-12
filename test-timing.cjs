const puppeteer = require("puppeteer-core");

async function testTiming() {
  console.log("🚀 Starting BrowserBase session to capture timing logs...\n");

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://connect.browserbase.com?apiKey=bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE&projectId=ec860b83-22ca-4178-ad1d-c92db14f01b2`,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Capture console logs
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    // Print timing logs immediately
    if (text.includes('⏱️')) {
      console.log(text);
    }
  });

  try {
    // Wait for Vercel deployment
    console.log("📍 Loading website (waiting for latest deployment)...");
    await new Promise(r => setTimeout(r, 30000)); // Wait 30s for deployment

    await page.goto("https://marketing-mastery.vercel.app/", { waitUntil: "networkidle2", timeout: 60000 });
    console.log("✅ Website loaded\n");

    // Login
    console.log("📍 Logging in...");
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
    await page.type('input[type="text"]', 'isha');
    await page.type('input[type="password"]', 'isha123');
    await page.click('button[type="submit"]');

    // Wait for home page
    await new Promise(r => setTimeout(r, 5000));

    // Check if logged in
    const pageContent = await page.evaluate(() => document.body.textContent);
    if (pageContent.includes('Invalid')) {
      console.log("❌ Login failed - credentials may be incorrect");
      console.log("Trying to proceed anyway...\n");
    } else {
      console.log("✅ Logged in\n");
    }

    // Find and click first Learn button
    console.log("📍 Looking for a Learn button...");
    console.log("=" .repeat(60));
    console.log("TIMING LOGS FROM BROWSER:");
    console.log("=" .repeat(60) + "\n");

    const startTime = Date.now();

    // Click on first available Learn/Start button
    const clicked = await page.evaluate(() => {
      // First try to find a topic row and click it
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = (btn.textContent || '').toLowerCase();
        if (text.includes('learn') || text.includes('start') || text.includes('continue')) {
          btn.click();
          return btn.textContent.trim();
        }
      }
      return null;
    });

    if (clicked) {
      console.log(`Clicked button: "${clicked}"`);

      // Wait for content to load (up to 30 seconds)
      console.log("Waiting for content generation...\n");
      await new Promise(r => setTimeout(r, 20000));

      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;

      console.log("\n" + "=" .repeat(60));
      console.log(`WALL CLOCK TIME: ${totalTime.toFixed(2)}s`);
      console.log("=" .repeat(60));

      // Take screenshot
      await page.screenshot({ path: "test-timing-result.png" });
      console.log("\n📸 Screenshot saved to test-timing-result.png");
    } else {
      console.log("❌ Could not find Learn button");
      await page.screenshot({ path: "test-timing-debug.png" });
    }

    // Print all timing-related logs
    console.log("\n" + "=" .repeat(60));
    console.log("ALL TIMING LOGS CAPTURED:");
    console.log("=" .repeat(60));
    consoleLogs.filter(log => log.includes('⏱️')).forEach(log => console.log(log));

  } catch (error) {
    console.error("❌ Error:", error.message);
    await page.screenshot({ path: "test-timing-error.png" });
  } finally {
    await browser.close();
    console.log("\n🔒 Browser closed");
  }
}

testTiming();
