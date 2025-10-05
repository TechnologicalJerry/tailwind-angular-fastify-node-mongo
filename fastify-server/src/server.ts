import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tailwind-angular-fastify-node-mongo";

// Console styling
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = {
    info: (message: string) => console.log(`${colors.cyan}[INFO]${colors.reset} ${message}`),
    success: (message: string) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
    error: (message: string) => console.error(`${colors.red}[ERROR]${colors.reset} ${message}`),
    warning: (message: string) => console.warn(`${colors.yellow}[WARNING]${colors.reset} ${message}`),
    server: (message: string) => console.log(`${colors.magenta}[SERVER]${colors.reset} ${message}`)
};

// Connect MongoDB
log.info("Connecting to MongoDB...");
mongoose.connect(MONGODB_URI)
    .then(() => {
        log.success("MongoDB connected successfully");
    })
    .catch(err => {
        log.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1);
    });

// Start server
log.info("Starting Fastify server...");
app.listen({ port: Number(PORT), host: '0.0.0.0' }, (err: Error | null, address: string) => {
    if (err) {
        log.error(`Server failed to start: ${err.message}`);
        process.exit(1);
    }

    log.success(`🚀 Server running at ${address}`);
    log.info(`📚 API Documentation: ${address}/docs`);
    log.info(`🔍 Health Check: ${address}/health`);
    log.info(`📊 API Info: ${address}/api/info`);
    log.server(`Environment: ${process.env.NODE_ENV || 'development'}`);
    log.server(`Process ID: ${process.pid}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    log.warning('Received SIGINT, shutting down gracefully...');
    mongoose.connection.close().then(() => {
        log.info('MongoDB connection closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    log.warning('Received SIGTERM, shutting down gracefully...');
    mongoose.connection.close().then(() => {
        log.info('MongoDB connection closed');
        process.exit(0);
    });
});
