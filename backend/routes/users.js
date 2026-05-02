const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const auth    = require('../middleware/auth');

// GET /api/users/:id/profile
router.get('/:id/profile', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, role, avatar_url, bio, coins, created_at FROM users WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// GET /api/users/me/stats
router.get('/me/stats', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_stats WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/users/me/bookmarks
router.get('/me/bookmarks', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, n.title, n.cover_url, n.genre, n.status,
              u.username AS author_name,
              (SELECT COUNT(*) FROM chapters c WHERE c.novel_id = n.id) AS chapter_count
       FROM bookmarks b
       JOIN novels n ON n.id = b.novel_id
       JOIN users u  ON u.id = n.author_id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// POST /api/users/me/bookmarks
router.post('/me/bookmarks', auth, async (req, res) => {
  const { novel_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO bookmarks (user_id, novel_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user.id, novel_id]
    );
    res.json({ message: 'Bookmarked' });
  } catch {
    res.status(500).json({ error: 'Failed to bookmark' });
  }
});

// DELETE /api/users/me/bookmarks/:novelId
router.delete('/me/bookmarks/:novelId', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND novel_id = $2',
      [req.user.id, req.params.novelId]
    );
    res.json({ message: 'Removed' });
  } catch {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

module.exports = router;
