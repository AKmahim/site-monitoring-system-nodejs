import fetch from 'node-fetch';
import schedule from 'node-schedule';
import { captureScreenshot } from './screenshotHelper.js';
import { logIssue, updateStatus } from '../database/db.js';

// List of websites to monitor
const websites = [
    'https://www.topsim.co.uk/',
    'http://call4free.co.uk/',
    'http://phonate.co.uk/'
];

// Function to check website status
async function checkWebsite(url) { 
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Status Code: ${response.status}`);
        }
        return { status: 'UP' };
    } catch (error) {
        return { status: 'DOWN', error: error.message };
    }
}

// Function to schedule monitoring
export function scheduleMonitoring() {
    // Run every 5 minutes
    schedule.scheduleJob('*/5 * * * *', async () => {
        for (const site of websites) {
            try {
                console.log(`Checking site: ${site}`);

                // Capture screenshots for desktop and mobile
                const desktopScreenshot = await captureScreenshot(site, 'desktop');
                const mobileScreenshot = await captureScreenshot(site, 'mobile');

                // Check website status
                const desktopStatus = await checkWebsite(site);
                console.log(`Desktop status for ${site}: ${desktopStatus.status}`);

                // Log issues if site is down
                if (desktopStatus.status === 'DOWN') {
                    await logIssue(site, desktopStatus.error);
                    console.error(`Issue logged for ${site}: ${desktopStatus.error}`);
                }

                // Update status and screenshot paths in the database
                await updateStatus(site, desktopStatus.status, desktopScreenshot, mobileScreenshot);
                console.log(`Status updated for ${site}`);
            } catch (error) {
                console.error(`Error processing site ${site}:`, error);
            }
        }
    });
}
