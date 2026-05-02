const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const auth    = require('../middleware/auth');

// GET /api/novels - list with filters
router.get('/', async (req, res) => {
  const { genre, status, sort = 'views', page = 1, limit = 20, search } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  let where = [];

  if (genre)  { params.push(genre);  where.push(`n.genre = $${params.length}`); }
  if (status) { params.push(status); where.push(`n.status = $${params.length}`); }
  if (search) { params.push(`%${search}%`); where.push(`n.title ILIKE $${params.length}`); }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const orderMap = { views: 'n.views DESC', rating: 'n.rating DESC', newest: 'n.created_at DESC' };
  const orderBy = orderMap[sort] || 'n.views DESC';

  try {
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT n.*, u.username AS author_name,
              (SELECT COUNT(*) FROM chapters c WHERE c.novel_id = n.id) AS chapter_count
       FROM novels n
       LEFT JOIN users u ON u.id = n.author_id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM novels n ${whereClause}`,
      params.slice(0, params.length - 2)
    );
    res.json({ novels: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch novels' });
  }
});

// GET /api/novels/:id
router.get('/:id', async (req, res) => {
  try {
    await pool.query('UPDATE novels SET views = views + 1 WHERE id = $1', [req.params.id]);
    const result = await pool.query(
      `SELECT n.*, u.username AS author_name,
              (SELECT COUNT(*) FROM chapters c WHERE c.novel_id = n.id) AS chapter_count,
              (SELECT AVG(r.rating) FROM reviews r WHERE r.novel_id = n.id) AS avg_rating
       FROM novels n
       LEFT JOIN users u ON u.id = n.author_id
       WHERE n.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Novel not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch novel' });
  }
});

// POST /api/novels - create (author only)
router.post('/', auth, async (req, res) => {
  const { title, description, genre, tags, cover_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO novels (title, author_id, description, genre, tags, cover_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, req.user.id, description, genre, tags, cover_url]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create novel' });
  }
});

// GET /api/novels/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.username FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.novel_id = $1 ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/novels/:id/reviews
router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, text } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, novel_id, rating, text)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, novel_id) DO UPDATE SET rating = $3, text = $4
       RETURNING *`,
      [req.user.id, req.params.id, rating, text]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

module.exports = router;
