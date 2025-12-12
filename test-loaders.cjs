const puppeteer = require("puppeteer-core");

async function testLoaders() {
  console.log("🚀 Starting BrowserBase session...");

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://connect.browserbase.com?apiKey=bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE&projectId=ec860b83-22ca-4178-ad1d-c92db14f01b2`,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // Load website
    console.log("\n📍 Loading website...");
    await page.goto("https://marketing-mastery.vercel.app/", { waitUntil: "networkidle2", timeout: 60000 });
    await page.screenshot({ path: "test-1-initial.png" });
    console.log("✅ Website loaded");

    // Login
    console.log("\n📍 Logging in...");
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });

    // Clear and type
    await page.click('input[type="text"]');
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.type('input[type="text"]', 'isha');

    await page.click('input[type="password"]');
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.type('input[type="password"]', 'isha123');

    await page.screenshot({ path: "test-2-before-login.png" });
    await page.click('button[type="submit"]');

    // Wait for navigation or error
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: "test-3-after-login.png" });

    // Check if we're on home page
    const isHomePage = await page.evaluate(() => {
      return document.body.textContent.includes('Your Learning Journey') ||
             document.body.textContent.includes('Modules');
    });

    if (!isHomePage) {
      console.log("⚠️ Login may have failed, checking page content...");
      const pageText = await page.evaluate(() => document.body.textContent.substring(0, 500));
      console.log("Page content:", pageText);
    } else {
      console.log("✅ Logged in successfully");
    }

    // Try to expand a module and click on a topic
    console.log("\n📍 Looking for a topic row...");

    // First expand module 1
    const expandClicked = await page.evaluate(() => {
      const accordions = document.querySelectorAll('[class*="accordion"], [class*="module"]');
      console.log("Found accordions:", accordions.length);

      // Find any clickable element with "Module" or "1" text
      const allButtons = document.querySelectorAll('button, div[role="button"]');
      for (const btn of allButtons) {
        const text = btn.textContent || '';
        if (text.includes('Grounding') || text.includes('First Principles') || text.includes('Module 1')) {
          btn.click();
          return 'Clicked module header';
        }
      }
      return 'No module found';
    });
    console.log("Expand result:", expandClicked);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: "test-4-expanded.png" });

    // Now find and click Learn/Continue button
    const learnClicked = await page.evaluate(() => {
      const allElements = document.querySelectorAll('button, a, div');
      for (const el of allElements) {
        const text = (el.textContent || '').toLowerCase();
        if ((text.includes('learn') || text.includes('continue') || text.includes('start')) && text.length < 50) {
          el.click();
          return 'Clicked: ' + text.substring(0, 30);
        }
      }
      return 'No learn button found';
    });
    console.log("Learn click result:", learnClicked);

    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: "test-5-hamster-loader.png" });
    console.log("📸 Potential hamster loader screenshot captured");

    await new Promise(r => setTimeout(r, 12000));
    await page.screenshot({ path: "test-6-content-loaded.png" });
    console.log("📸 Content loaded screenshot saved");

    // Try quiz
    console.log("\n📍 Looking for quiz button...");
    const quizClicked = await page.evaluate(() => {
      const allElements = document.querySelectorAll('button, a, div');
      for (const el of allElements) {
        const text = (el.textContent || '').toLowerCase();
        if (text.includes('quiz') && text.length < 50) {
          el.click();
          return 'Clicked: ' + text.substring(0, 30);
        }
      }
      return 'No quiz button found';
    });
    console.log("Quiz click result:", quizClicked);

    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: "test-7-cube-loader.png" });
    console.log("📸 Potential cube loader screenshot captured");

    await new Promise(r => setTimeout(r, 8000));
    await page.screenshot({ path: "test-8-quiz-loaded.png" });
    console.log("📸 Quiz loaded screenshot saved");

    console.log("\n✅ Loader test complete!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    await page.screenshot({ path: "test-error.png" });
  } finally {
    await browser.close();
    console.log("\n🔒 Browser closed");
  }
}

testLoaders();
