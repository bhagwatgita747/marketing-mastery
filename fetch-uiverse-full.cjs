const puppeteer = require("puppeteer-core");

async function fetchUIverse() {
  console.log("🚀 Starting BrowserBase session...");

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://connect.browserbase.com?apiKey=bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE&projectId=ec860b83-22ca-4178-ad1d-c92db14f01b2`,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // ===== MAIN LOADING (HAMSTER) =====
    console.log("\n📍 Fetching HAMSTER animation...");
    await page.goto("https://uiverse.io/Nawsome/wet-mayfly-23", { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Click HTML tab
    console.log("Clicking HTML tab...");
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.trim() === 'HTML') {
          btn.click();
          break;
        }
      }
    });
    await new Promise(r => setTimeout(r, 1000));

    // Get HTML
    const hamsterHtml = await page.evaluate(() => {
      const preTags = document.querySelectorAll("pre");
      for (const pre of preTags) {
        const text = pre.textContent;
        if (text && text.includes("<div") && !text.includes("{")) {
          return text;
        }
      }
      // Return all code
      return Array.from(preTags).map(p => p.textContent).join("\n---\n");
    });
    console.log("\n=== HAMSTER HTML ===");
    console.log(hamsterHtml);

    // Click light theme toggle
    console.log("\nSwitching to LIGHT theme...");
    await page.evaluate(() => {
      // Find the theme toggle (sun/moon icon near the color code)
      const toggles = document.querySelectorAll('button');
      for (const toggle of toggles) {
        const svg = toggle.querySelector('svg');
        if (svg && toggle.className && toggle.className.includes('rounded')) {
          // Check if it's near color code
          const parent = toggle.parentElement;
          if (parent && parent.textContent && parent.textContent.includes('#')) {
            toggle.click();
            break;
          }
        }
      }
    });
    await new Promise(r => setTimeout(r, 500));

    // Also try clicking on specific toggle area
    await page.click('div[aria-label="Toggle theme"]').catch(() => {});
    await new Promise(r => setTimeout(r, 500));

    // Take light theme screenshot
    await page.screenshot({ path: "hamster-light.png" });

    // Click CSS tab to get light theme CSS
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.trim() === 'CSS') {
          btn.click();
          break;
        }
      }
    });
    await new Promise(r => setTimeout(r, 1000));

    const hamsterCssLight = await page.evaluate(() => {
      const preTags = document.querySelectorAll("pre");
      for (const pre of preTags) {
        return pre.textContent;
      }
      return null;
    });
    console.log("\n=== HAMSTER CSS (after toggle) ===");
    console.log(hamsterCssLight ? hamsterCssLight.substring(0, 500) + "..." : "Not found");


    // ===== SMALL LOADING (CUBE) =====
    console.log("\n\n📍 Fetching CUBE animation...");
    await page.goto("https://uiverse.io/alexruix/white-cat-50", { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Click HTML tab
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.trim() === 'HTML') {
          btn.click();
          break;
        }
      }
    });
    await new Promise(r => setTimeout(r, 1000));

    // Get HTML
    const cubeHtml = await page.evaluate(() => {
      const preTags = document.querySelectorAll("pre");
      for (const pre of preTags) {
        const text = pre.textContent;
        if (text && text.includes("<") && !text.includes("{")) {
          return text;
        }
      }
      return Array.from(preTags).map(p => p.textContent).join("\n---\n");
    });
    console.log("\n=== CUBE HTML ===");
    console.log(cubeHtml);

    // Take screenshot
    await page.screenshot({ path: "cube-loader.png" });

    console.log("\n✅ All data fetched");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
    console.log("\n🔒 Browser closed");
  }
}

fetchUIverse();
