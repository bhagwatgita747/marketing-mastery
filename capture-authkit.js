import Browserbase from "@browserbasehq/sdk";
import puppeteer from "puppeteer-core";

const BROWSERBASE_PROJECT_ID = "ec860b83-22ca-4178-ad1d-c92db14f01b2";
const BROWSERBASE_API_KEY = "bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE";

async function captureAuthKit() {
  console.log("🚀 Starting BrowserBase session to capture AuthKit...");

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
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log("\n📍 Loading AuthKit website...");
    await page.goto("https://www.authkit.com/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for animations to settle
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("✅ Website loaded");

    // Take full page screenshot
    await page.screenshot({
      path: 'authkit-screenshot.png',
      fullPage: true
    });
    console.log("✅ Full page screenshot saved as authkit-screenshot.png");

    // Take viewport screenshot
    await page.screenshot({
      path: 'authkit-hero.png',
      fullPage: false
    });
    console.log("✅ Hero section screenshot saved as authkit-hero.png");

    // Extract CSS animations and key styles
    console.log("\n📍 Extracting CSS animations...");
    const styles = await page.evaluate(() => {
      const results = {
        animations: [],
        keyStyles: []
      };

      // Get all stylesheets
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            const ruleText = rule.cssText;
            // Look for animations and keyframes
            if (ruleText.includes('@keyframes') ||
                ruleText.includes('animation') ||
                ruleText.includes('transition') ||
                ruleText.includes('transform')) {
              results.animations.push(ruleText.substring(0, 500));
            }
          }
        } catch (e) {
          // Cross-origin stylesheets will throw
        }
      }

      // Get computed styles of key elements
      const hero = document.querySelector('h1');
      if (hero) {
        const computed = getComputedStyle(hero);
        results.keyStyles.push({
          element: 'h1',
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight,
          letterSpacing: computed.letterSpacing
        });
      }

      return results;
    });

    console.log(`   Found ${styles.animations.length} animation-related CSS rules`);

    // Save extracted styles
    const fs = await import('fs');
    fs.writeFileSync('authkit-styles.json', JSON.stringify(styles, null, 2));
    console.log("✅ Styles saved to authkit-styles.json");

    console.log(`\n🔗 View session replay: https://browserbase.com/sessions/${session.id}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
    console.log("\n🔒 Browser session closed");
  }
}

captureAuthKit().catch(console.error);
