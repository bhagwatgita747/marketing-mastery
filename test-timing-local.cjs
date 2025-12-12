const puppeteer = require("puppeteer-core");

async function testTiming() {
  console.log("🚀 Starting BrowserBase session to test LOCAL dev server...\n");

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
    // Try localhost first, then Vercel
    console.log("📍 Trying localhost:5173...");

    let url = "http://localhost:5173/";
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });
      console.log("✅ Connected to localhost\n");
    } catch {
      console.log("❌ Localhost not accessible from BrowserBase (expected - it's local)");
      console.log("📍 Using Vercel deployment instead...\n");
      url = "https://marketing-mastery.vercel.app/";
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

    // Login
    console.log("📍 Logging in...");
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });

    // Clear fields first
    await page.evaluate(() => {
      document.querySelector('input[type="text"]').value = '';
      document.querySelector('input[type="password"]').value = '';
    });

    await page.type('input[type="text"]', 'isha', { delay: 50 });
    await page.type('input[type="password"]', 'isha123', { delay: 50 });

    await page.screenshot({ path: "test-timing-1-login.png" });
    await page.click('button[type="submit"]');

    // Wait longer for login
    await new Promise(r => setTimeout(r, 8000));
    await page.screenshot({ path: "test-timing-2-after-login.png" });

    // Check page content
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Page contains 'Modules':", bodyText.includes('Modules'));
    console.log("Page contains 'Invalid':", bodyText.includes('Invalid'));

    if (bodyText.includes('Modules') || bodyText.includes('Learning Journey')) {
      console.log("✅ Successfully logged in!\n");

      // Find and click first Learn button
      console.log("📍 Looking for a topic button...");
      console.log("=".repeat(60));
      console.log("TIMING LOGS:");
      console.log("=".repeat(60) + "\n");

      const startTime = Date.now();

      // Expand first module if needed and click Learn
      const clicked = await page.evaluate(() => {
        // Find all buttons
        const allButtons = Array.from(document.querySelectorAll('button'));

        // Look for Learn, Start, or Continue buttons
        for (const btn of allButtons) {
          const text = (btn.textContent || '').trim().toLowerCase();
          if (text === 'learn' || text === 'start' || text === 'continue' ||
              text.includes('learn') || text.includes('start')) {
            btn.click();
            return `Clicked: ${btn.textContent.trim()}`;
          }
        }

        // If no Learn button, try clicking a topic row
        const rows = document.querySelectorAll('[class*="row"], [class*="topic"]');
        if (rows.length > 0) {
          rows[0].click();
          return 'Clicked first row';
        }

        return null;
      });

      if (clicked) {
        console.log(clicked);
        console.log("Waiting for content to load...\n");

        // Wait for content generation
        await new Promise(r => setTimeout(r, 25000));

        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;

        await page.screenshot({ path: "test-timing-3-content.png" });

        console.log("\n" + "=".repeat(60));
        console.log(`WALL CLOCK TIME: ${totalTime.toFixed(2)}s`);
        console.log("=".repeat(60));
      } else {
        console.log("❌ Could not find topic button");
        // List all buttons for debugging
        const buttons = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('button'))
            .map(b => b.textContent.trim())
            .filter(t => t.length > 0 && t.length < 50);
        });
        console.log("Available buttons:", buttons.slice(0, 10));
      }
    } else {
      console.log("❌ Login appears to have failed");
      console.log("Page text preview:", bodyText.substring(0, 300));
    }

    // Print all timing logs
    const timingLogs = consoleLogs.filter(log => log.includes('⏱️'));
    if (timingLogs.length > 0) {
      console.log("\n" + "=".repeat(60));
      console.log("ALL TIMING LOGS:");
      console.log("=".repeat(60));
      timingLogs.forEach(log => console.log(log));
    } else {
      console.log("\n⚠️ No timing logs captured (console.log may be stripped in production)");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    await page.screenshot({ path: "test-timing-error.png" });
  } finally {
    await browser.close();
    console.log("\n🔒 Browser closed");
  }
}

testTiming();
