import express from 'express';
import { ingestAllGamesForCurrentWeek } from '../services/ingestService.js';

const router = express.Router();

router.post('/run-ingestion', async (req, res) => {
    try {
        // Verify secret token
        const token = req.headers['x-internal-token'];
        if (token !== process.env.INTERNAL_INGEST_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await ingestAllGamesForCurrentWeek(); // Your ESPN logic here
        return res.json({ success: true });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
});

export default router;
