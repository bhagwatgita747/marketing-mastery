import Browserbase from "@browserbasehq/sdk";
import puppeteer from "puppeteer-core";

const BROWSERBASE_PROJECT_ID = "ec860b83-22ca-4178-ad1d-c92db14f01b2";
const BROWSERBASE_API_KEY = "bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE";

async function testWebsite() {
  console.log("🚀 Starting BrowserBase session...");

  const bb = new Browserbase({
    apiKey: BROWSERBASE_API_KEY,
  });

  // Create a session
  const session = await bb.sessions.create({
    projectId: BROWSERBASE_PROJECT_ID,
  });

  console.log(`✅ Session created: ${session.id}`);

  // Connect with Puppeteer
  const browser = await puppeteer.connect({
    browserWSEndpoint: session.connectUrl,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Test 1: Load the website
    console.log("\n📍 Test 1: Loading website...");
    await page.goto("https://marketing-mastery.vercel.app/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    console.log("✅ Website loaded successfully");

    // Test 2: Check login page elements
    console.log("\n📍 Test 2: Checking login page...");
    const title = await page.title();
    console.log(`   Page title: ${title}`);

    const usernameInput = await page.$('input#username');
    const passwordInput = await page.$('input#password');
    const submitButton = await page.$('button[type="submit"]');

    if (usernameInput && passwordInput && submitButton) {
      console.log("✅ Login form elements found");
    } else {
      console.log("❌ Login form elements missing");
    }

    // Test 3: Perform login
    console.log("\n📍 Test 3: Logging in as Isha...");
    await page.type('input#username', 'Isha');
    await page.type('input#password', 'isha@123');
    await page.click('button[type="submit"]');

    // Wait for navigation to home page
    await page.waitForSelector('h1', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Extra wait for content

    const pageContent = await page.content();
    if (pageContent.includes('Marketing Mastery') || pageContent.includes('Welcome back')) {
      console.log("✅ Login successful - Home page loaded");
    } else {
      console.log("❌ Login may have failed");
    }

    // Test 4: Check modules are displayed
    console.log("\n📍 Test 4: Checking modules...");
    const modules = await page.$$('button'); // Module accordions are buttons
    console.log(`   Found ${modules.length} clickable elements`);

    // Look for module content
    const hasModules = pageContent.includes('Grounding') || pageContent.includes('Module');
    if (hasModules) {
      console.log("✅ Modules are displayed");
    } else {
      console.log("⚠️ Modules may not be visible yet");
    }

    // Test 5: Click on Module 4 (Social & Distribution) for fresh content
    console.log("\n📍 Test 5: Expanding Module 4 (Social & Distribution)...");

    // Find and click Module 4 accordion button for fresh content
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && text.includes('Social & Distribution')) {
        await button.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("✅ Clicked on 'Social & Distribution' module");
        break;
      }
    }

    // Test 6: Check if topics are visible after expansion
    console.log("\n📍 Test 6: Checking topics visibility...");
    const expandedContent = await page.content();
    if (expandedContent.includes('North Star Metric') || expandedContent.includes('Basic')) {
      console.log("✅ Topics are visible after expansion");
    } else {
      console.log("⚠️ Topics may not be visible");
    }

    // Test 7: Click on Basic button and measure content generation time
    console.log("\n📍 Test 7: Testing content generation speed...");
    console.log("   ========== TIMING BREAKDOWN ==========");
    const basicButtons = await page.$$('button');
    let clicked = false;
    for (const button of basicButtons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && text.includes('Basic') && !text.includes('Completed')) {
        const clickTime = Date.now();
        await button.click();
        console.log(`   [T+0.00s] Button clicked`);

        // Wait for modal to appear first
        await page.waitForSelector('.fixed.inset-0', { timeout: 60000 });
        const modalTime = Date.now();
        console.log(`   [T+${((modalTime - clickTime) / 1000).toFixed(2)}s] Modal opened (UI rendering)`);

        // Check for loading spinner - this means API call started
        const hasSpinner = await page.$('.animate-spin');
        const spinnerTime = Date.now();
        if (hasSpinner) {
          console.log(`   [T+${((spinnerTime - clickTime) / 1000).toFixed(2)}s] Loading spinner visible (API call in progress)`);
        }

        // Wait for actual content to load (markdown-content appears when content is ready)
        await page.waitForSelector('.markdown-content', { timeout: 120000 });
        const contentTime = Date.now();

        console.log(`   [T+${((contentTime - clickTime) / 1000).toFixed(2)}s] Content rendered`);
        console.log(`   =====================================`);
        console.log(`   📊 BREAKDOWN:`);
        console.log(`      • Modal open time: ${((modalTime - clickTime) / 1000).toFixed(2)}s (React state + render)`);
        console.log(`      • API wait time:   ${((contentTime - modalTime) / 1000).toFixed(2)}s (xAI API call)`);
        console.log(`      • TOTAL:           ${((contentTime - clickTime) / 1000).toFixed(2)}s`);
        clicked = true;

        // Take screenshot of content
        await page.screenshot({ path: 'test-content-screenshot.png', fullPage: false });
        console.log("   Screenshot saved as test-content-screenshot.png");

        // Also grab a snippet of the content for verification
        const contentSnippet = await page.evaluate(() => {
          const el = document.querySelector('.markdown-content');
          return el ? el.textContent?.substring(0, 200) : 'No content found';
        });
        console.log(`   Content preview: ${contentSnippet}...`);
        break;
      }
    }
    if (!clicked) {
      console.log("⚠️ No Basic button found to click");
    }

    // Take a screenshot
    console.log("\n📍 Taking screenshot...");
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    console.log("✅ Screenshot saved as test-screenshot.png");

    console.log("\n✅ All tests completed!");
    console.log(`\n🔗 View session replay: https://browserbase.com/sessions/${session.id}`);

  } catch (error) {
    console.error("❌ Test error:", error.message);
  } finally {
    await browser.close();
    console.log("\n🔒 Browser session closed");
  }
}

testWebsite().catch(console.error);
