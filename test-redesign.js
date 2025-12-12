import Browserbase from "@browserbasehq/sdk";
import puppeteer from "puppeteer-core";

const BROWSERBASE_PROJECT_ID = "ec860b83-22ca-4178-ad1d-c92db14f01b2";
const BROWSERBASE_API_KEY = "bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE";

async function testRedesign() {
  console.log("🚀 Starting BrowserBase session...");

  const bb = new Browserbase({
    apiKey: BROWSERBASE_API_KEY,
  });

  const session = await bb.sessions.create({
    projectId: BROWSERBASE_PROJECT_ID,
  });

  console.log(`✅ Session created: ${session.id}`);

  const browser = await puppeteer.connect({
    browserWSEndpoint: session.connectUrl,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // Load the website
    console.log("\n📍 Loading website...");
    await page.goto("https://marketing-mastery.vercel.app/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    console.log("✅ Website loaded");

    // Take screenshot of login page
    await page.screenshot({ path: 'test-login-redesign.png', fullPage: true });
    console.log("📸 Login page screenshot saved");

    // Login
    console.log("\n📍 Logging in...");
    await page.type('input#username', 'Isha');
    await page.type('input#password', 'isha@123');
    await page.click('button[type="submit"]');

    // Wait for home page to load (using nav text instead of h1)
    await page.waitForFunction(
      () => document.body.textContent?.includes('Marketing Mastery') && 
            document.querySelector('nav') !== null,
      { timeout: 15000 }
    );
    await new Promise(resolve => setTimeout(resolve, 3000)); // Extra time for animations

    console.log("✅ Home page loaded");

    // Take screenshot of redesigned home page
    await page.screenshot({ path: 'test-home-redesign.png', fullPage: true });
    console.log("📸 Home page screenshot saved as test-home-redesign.png");

    // Check for key Design 6 elements
    const hasFloatingCards = await page.evaluate(() => {
      return document.querySelector('.float-card') !== null;
    });
    console.log(hasFloatingCards ? "✅ Float cards found" : "⚠️ Float cards not found");

    const hasBgColor = await page.evaluate(() => {
      const body = document.body;
      const bgColor = window.getComputedStyle(body).backgroundColor;
      // Check if it's the light #f7fafc color (rgb(247, 250, 252))
      return bgColor.includes('247') || body.innerHTML.includes('bg-[#f7fafc]');
    });
    console.log(hasBgColor ? "✅ Light theme background detected" : "⚠️ Background color check");

    const hasNav = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return nav !== null && nav.textContent?.includes('Marketing Mastery');
    });
    console.log(hasNav ? "✅ Clean navigation found" : "⚠️ Navigation not found");

    // Check progress cards
    const pageContent = await page.content();
    const hasProgressCards = pageContent.includes('Overall') && pageContent.includes('Progress');
    console.log(hasProgressCards ? "✅ Progress stats cards found" : "⚠️ Progress cards not found");

    // Check modules
    const hasModules = pageContent.includes('Modules') && pageContent.includes('topics');
    console.log(hasModules ? "✅ Modules section found" : "⚠️ Modules not found");

    console.log("\n✅ Redesign verification complete!");
    console.log(`\n🔗 Session replay: https://browserbase.com/sessions/${session.id}`);

  } catch (error) {
    console.error("❌ Test error:", error.message);
    await page.screenshot({ path: 'test-error-screenshot.png', fullPage: true });
    console.log("📸 Error screenshot saved");
  } finally {
    await browser.close();
    console.log("🔒 Browser closed");
  }
}

testRedesign().catch(console.error);
