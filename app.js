import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import statusRoutes from './routes/status.js';
import { scheduleMonitoring } from './helpers/siteChecker.js';

const app = express();

// Fix for `__dirname` in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for serving static files
app.use('/screenshots', express.static(path.join(__dirname, 'public/screenshots')));

// Routes
app.use('/status', statusRoutes);

// Start monitoring
scheduleMonitoring();

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
