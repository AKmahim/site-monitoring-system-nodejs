// import puppeteer from 'puppeteer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Fix for `__dirname` in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export async function captureScreenshot(url, device) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     if (device === 'mobile') {
//         const mobileViewport = puppeteer.devices['iPhone X'];
//         await page.emulate(mobileViewport);
//     } else {
//         await page.setViewport({ width: 1920, height: 1080 });
//     }

//     const screenshotPath = path.join(__dirname, '../public/screenshots', `${device}-${Date.now()}.png`);
//     await page.goto(url, { waitUntil: 'networkidle2' });
//     await page.screenshot({ path: screenshotPath });
//     await browser.close();

//     return screenshotPath;
// }


import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to capture screenshots
async function captureScreenshot(url, device) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Define custom viewport settings for mobile and desktop
    if (device === "mobile") {
        await page.setViewport({
            width: 375,    // iPhone X width
            height: 812,   // iPhone X height
            isMobile: true,
            hasTouch: true,
        });
    } else {
        await page.setViewport({
            width: 1920,   // Desktop width
            height: 1080,  // Desktop height
        });
    }

    // Ensure the screenshots directory exists
    const screenshotDir = path.join(__dirname, "../public/screenshots");
    const screenshotPath = path.join(screenshotDir, `${device}-${Date.now()}.png`);

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    return screenshotPath;
}

export { captureScreenshot };
