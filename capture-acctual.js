import Browserbase from "@browserbasehq/sdk";
import puppeteer from "puppeteer-core";
import fs from 'fs';

const BROWSERBASE_PROJECT_ID = "ec860b83-22ca-4178-ad1d-c92db14f01b2";
const BROWSERBASE_API_KEY = "bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE";

async function captureAcctual() {
  console.log("🚀 Starting BrowserBase session to capture Acctual...");

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
    console.log("\n📍 Loading Acctual website...");
    await page.goto("https://www.acctual.com/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for animations to settle
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("✅ Website loaded");

    // Take hero screenshot
    await page.screenshot({
      path: 'acctual-hero.png',
      fullPage: false
    });
    console.log("✅ Hero section screenshot saved as acctual-hero.png");

    // Scroll down to capture more content
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.screenshot({
      path: 'acctual-features.png',
      fullPage: false
    });
    console.log("✅ Features section screenshot saved as acctual-features.png");

    // Take full page screenshot
    await page.screenshot({
      path: 'acctual-full.png',
      fullPage: true
    });
    console.log("✅ Full page screenshot saved as acctual-full.png");

    // Extract CSS animations and styles
    console.log("\n📍 Extracting CSS styles and animations...");
    const styles = await page.evaluate(() => {
      const results = {
        animations: [],
        colors: [],
        fonts: [],
        keyElements: []
      };

      // Get all stylesheets
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            const ruleText = rule.cssText;
            // Look for animations, transitions, transforms, gradients
            if (ruleText.includes('@keyframes') ||
                ruleText.includes('animation') ||
                ruleText.includes('transition') ||
                ruleText.includes('transform') ||
                ruleText.includes('gradient') ||
                ruleText.includes('blur') ||
                ruleText.includes('shadow')) {
              results.animations.push(ruleText.substring(0, 600));
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
        results.keyElements.push({
          element: 'h1',
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight,
          letterSpacing: computed.letterSpacing,
          color: computed.color
        });
      }

      // Get body background
      const body = document.body;
      if (body) {
        const computed = getComputedStyle(body);
        results.keyElements.push({
          element: 'body',
          background: computed.backgroundColor,
          color: computed.color,
          fontFamily: computed.fontFamily
        });
      }

      // Get any buttons
      const btn = document.querySelector('button, a[href]');
      if (btn) {
        const computed = getComputedStyle(btn);
        results.keyElements.push({
          element: 'button',
          background: computed.backgroundColor,
          color: computed.color,
          borderRadius: computed.borderRadius,
          padding: computed.padding
        });
      }

      // Extract all unique colors from the page
      const allElements = document.querySelectorAll('*');
      const colorSet = new Set();
      allElements.forEach(el => {
        const style = getComputedStyle(el);
        if (style.color) colorSet.add(style.color);
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colorSet.add(style.backgroundColor);
        }
      });
      results.colors = Array.from(colorSet).slice(0, 20);

      return results;
    });

    console.log(`   Found ${styles.animations.length} animation/style rules`);
    console.log(`   Found ${styles.colors.length} unique colors`);
    console.log(`   Found ${styles.keyElements.length} key element styles`);

    // Get page content structure
    const structure = await page.evaluate(() => {
      const nav = document.querySelector('nav, header');
      const hero = document.querySelector('h1');
      const subtitle = document.querySelector('h1 + p, .hero p, main p');
      const buttons = document.querySelectorAll('button, a[class*="btn"], a[class*="button"]');

      return {
        navText: nav ? nav.innerText.substring(0, 200) : '',
        heroText: hero ? hero.innerText : '',
        subtitleText: subtitle ? subtitle.innerText.substring(0, 300) : '',
        buttonCount: buttons.length,
        buttonTexts: Array.from(buttons).slice(0, 5).map(b => b.innerText.trim()).filter(t => t)
      };
    });

    console.log("\n📍 Page structure:");
    console.log(`   Hero: "${structure.heroText}"`);
    console.log(`   Subtitle: "${structure.subtitleText.substring(0, 100)}..."`);
    console.log(`   Buttons: ${structure.buttonTexts.join(', ')}`);

    // Save all extracted data
    const extractedData = {
      styles,
      structure,
      capturedAt: new Date().toISOString()
    };

    fs.writeFileSync('acctual-data.json', JSON.stringify(extractedData, null, 2));
    console.log("\n✅ All data saved to acctual-data.json");

    console.log(`\n🔗 View session replay: https://browserbase.com/sessions/${session.id}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
    console.log("\n🔒 Browser session closed");
  }
}

captureAcctual().catch(console.error);
