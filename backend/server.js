require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const client = require('prom-client');

const authRoutes    = require('./routes/auth');
const novelRoutes   = require('./routes/novels');
const chapterRoutes = require('./routes/chapters');
const userRoutes    = require('./routes/users');
const aiRoutes      = require('./routes/ai');

const app = express();

// ── Security middleware ──────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// ── Prometheus metrics ───────────────────────────────
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// ── Health check ─────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'freadzone-backend', time: new Date() });
});

// ── Routes ───────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/novels',   novelRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/ai',       aiRoutes);

// ── 404 handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FreadZone backend running on port ${PORT}`);
});
