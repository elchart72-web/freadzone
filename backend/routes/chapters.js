const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const auth    = require('../middleware/auth');

// GET /api/chapters/novel/:novelId
router.get('/novel/:novelId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, chapter_num, title, word_count, is_free, views, created_at
       FROM chapters WHERE novel_id = $1 ORDER BY chapter_num ASC`,
      [req.params.novelId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// GET /api/chapters/:id
router.get('/:id', async (req, res) => {
  try {
    await pool.query('UPDATE chapters SET views = views + 1 WHERE id = $1', [req.params.id]);
    const result = await pool.query(
      `SELECT c.*, n.title AS novel_title,
              LAG(c.id)  OVER (PARTITION BY c.novel_id ORDER BY c.chapter_num) AS prev_id,
              LEAD(c.id) OVER (PARTITION BY c.novel_id ORDER BY c.chapter_num) AS next_id
       FROM chapters c
       JOIN novels n ON n.id = c.novel_id
       WHERE c.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Chapter not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// POST /api/chapters - add chapter (author)
router.post('/', auth, async (req, res) => {
  const { novel_id, chapter_num, title, content } = req.body;
  const word_count = content ? content.split(/\s+/).length : 0;
  try {
    const result = await pool.query(
      `INSERT INTO chapters (novel_id, chapter_num, title, content, word_count)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [novel_id, chapter_num, title, content, word_count]
    );
    // Update novel word_count
    await pool.query(
      'UPDATE novels SET word_count = (SELECT SUM(word_count) FROM chapters WHERE novel_id = $1) WHERE id = $1',
      [novel_id]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to add chapter' });
  }
});

module.exports = router;
