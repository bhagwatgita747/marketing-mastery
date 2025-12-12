import Browserbase from "@browserbasehq/sdk";
import puppeteer from "puppeteer-core";

const BROWSERBASE_PROJECT_ID = "ec860b83-22ca-4178-ad1d-c92db14f01b2";
const BROWSERBASE_API_KEY = "bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE";

async function testThemeToggle() {
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

    // Login
    console.log("\n📍 Logging in...");
    await page.type('input#username', 'Isha');
    await page.type('input#password', 'isha@123');
    await page.click('button[type="submit"]');

    // Wait for home page
    await page.waitForFunction(
      () => document.body.textContent?.includes('Marketing Mastery') && 
            document.querySelector('nav') !== null,
      { timeout: 15000 }
    );
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("✅ Home page loaded");

    // Screenshot LIGHT theme
    console.log("\n📍 Testing LIGHT theme...");
    await page.screenshot({ path: 'test-light-theme.png', fullPage: true });
    console.log("📸 Light theme screenshot saved");

    // Check for theme toggle button
    const themeToggle = await page.$('.theme-toggle');
    if (!themeToggle) {
      console.log("❌ Theme toggle button not found");
    } else {
      console.log("✅ Theme toggle button found");

      // Click to switch to DARK theme
      console.log("\n📍 Switching to DARK theme...");
      await themeToggle.click();
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for transition

      // Screenshot DARK theme
      await page.screenshot({ path: 'test-dark-theme.png', fullPage: true });
      console.log("📸 Dark theme screenshot saved");

      // Check for dark mode elements
      const hasDarkBg = await page.evaluate(() => {
        const html = document.documentElement;
        return html.classList.contains('dark');
      });
      console.log(hasDarkBg ? "✅ Dark class applied to HTML" : "⚠️ Dark class not found");

      // Check for blobs (dark theme background)
      const hasBlobs = await page.evaluate(() => {
        return document.querySelector('.blob') !== null;
      });
      console.log(hasBlobs ? "✅ Animated blobs visible in dark mode" : "⚠️ Blobs not found");

      // Check for glass effect
      const hasGlass = await page.evaluate(() => {
        return document.querySelector('.glass') !== null || 
               document.querySelector('.glass-strong') !== null;
      });
      console.log(hasGlass ? "✅ Glass effect cards present" : "⚠️ Glass effect not found");

      // Toggle back to light
      console.log("\n📍 Switching back to LIGHT theme...");
      await themeToggle.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isLightAgain = await page.evaluate(() => {
        return !document.documentElement.classList.contains('dark');
      });
      console.log(isLightAgain ? "✅ Successfully toggled back to light" : "⚠️ Still in dark mode");
    }

    console.log("\n✅ Theme toggle test complete!");
    console.log(`\n🔗 Session replay: https://browserbase.com/sessions/${session.id}`);

  } catch (error) {
    console.error("❌ Test error:", error.message);
    await page.screenshot({ path: 'test-error-theme.png', fullPage: true });
  } finally {
    await browser.close();
    console.log("🔒 Browser closed");
  }
}

testThemeToggle().catch(console.error);
