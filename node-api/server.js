import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import espnRoutes from './routes/espn.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.NODE_API_PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Fantasy Football Node API'
    });
});

// API Routes
app.use('/api/espn', espnRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n=€ Fantasy Football Node API Server running on port ${PORT}`);
    console.log(`=Í Health check: http://localhost:${PORT}/health`);
    console.log(`= ESPN API routes: http://localhost:${PORT}/api/espn\n`);
});

export default app;
