import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '48648',
    database: 'monitoring',
});

export async function logIssue(site, error) {
    const query = 'INSERT INTO issues (site, error, timestamp) VALUES (?, ?, NOW())';
    await db.execute(query, [site, error]);
}

export async function updateStatus(site, status, screenshotDesktop, screenshotMobile) {
    const query = `
        INSERT INTO statuses (site, status, last_checked, screenshot_mobile, screenshot_desktop)
        VALUES (?, ?, NOW(), ?, ?)
        ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        last_checked = VALUES(last_checked),
        screenshot_mobile = VALUES(screenshot_mobile),
        screenshot_desktop = VALUES(screenshot_desktop)
    `;
    await db.execute(query, [site, status, screenshotMobile, screenshotDesktop]);
}

export async function getStatusesFromDatabase() {
    const [rows] = await db.execute('SELECT * FROM statuses');
    return rows;
}
