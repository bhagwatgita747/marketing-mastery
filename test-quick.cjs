const puppeteer = require("puppeteer");

async function test() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    await page.goto("https://marketing-mastery.vercel.app/", { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
    await page.type('input[type="text"]', 'Isha', { delay: 20 });
    await page.type('input[type="password"]', 'isha@123', { delay: 20 });
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 4000));

    // Click Basic
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      btns.find(b => b.textContent?.trim() === 'Basic')?.click();
    });
    await new Promise(r => setTimeout(r, 12000));

    // Click Memorize This
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      btns.find(b => b.textContent?.includes('Memorize This'))?.click();
    });

    // Wait for onboarding to finish or skip
    await new Promise(r => setTimeout(r, 15000));

    // Try clicking Skip if visible
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      btns.find(b => b.textContent?.includes('Skip'))?.click();
    });
    await new Promise(r => setTimeout(r, 3000));

    await page.screenshot({ path: "test-result.png" });

    const text = await page.evaluate(() => document.body.innerText);
    if (text.includes('not configured') || text.includes('API error')) {
      console.log("❌ ERROR FOUND:");
      const lines = text.split('\n').filter(l => l.includes('API') || l.includes('configured') || l.includes('error'));
      lines.forEach(l => console.log("   " + l));
    } else if (text.includes('Explain these') || text.includes('Start Recording')) {
      console.log("✅ Feature is working! Keywords loaded.");
    } else {
      console.log("⚠️ Check screenshot: test-result.png");
    }
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await browser.close();
  }
}
test();
