import express from 'express';
import { getStatusesFromDatabase } from '../database/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const statuses = await getStatusesFromDatabase();
        res.json({ success: true, data: statuses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
