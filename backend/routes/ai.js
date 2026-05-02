const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST /api/ai/recommend  — novel recommendations
router.post('/recommend', async (req, res) => {
  const { preferences, userId } = req.body;
  try {
    const novelsResult = await pool.query(
      'SELECT title, genre, description, rating FROM novels ORDER BY rating DESC LIMIT 10'
    );
    const novels = novelsResult.rows;

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'models/gemini-2.5-flash' });
    const prompt = `
Сен FreadZone платформасындағы AI кітап кеңесшісісің.
Пайдаланушының қалауы: ${preferences || 'фэнтези, приключение'}

Қолжетімді романдар:
${novels.map(n => `- ${n.title} (${n.genre}, рейтинг: ${n.rating}): ${n.description}`).join('\n')}

Пайдаланушыға 3 роман ұсын. Қысқаша неге ұсынып отырғаныңды түсіндір. Қазақ тілінде жауап бер.
    `.trim();

    const result = await model.generateContent(prompt);
    const text   = result.response.text();
    res.json({ recommendation: text, novels });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// POST /api/ai/summarize  — chapter summary
router.post('/summarize', async (req, res) => {
  const { chapterId } = req.body;
  try {
    const ch = await pool.query('SELECT title, content FROM chapters WHERE id = $1', [chapterId]);
    if (!ch.rows[0]) return res.status(404).json({ error: 'Chapter not found' });

    const model  = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'models/gemini-2.5-flash' });
    const prompt = `Мына тарауды қысқаша 3-4 сөйлеммен қорытындыла:\n\nТақырып: ${ch.rows[0].title}\n\n${ch.rows[0].content}`;

    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// POST /api/ai/chat  — general AI assistant
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const model  = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'models/gemini-2.5-flash' });
    const prompt = `Сен FreadZone веб-роман платформасының AI көмекшісісің. Тек кітаптар, романдар және оқу туралы сұрақтарға жауап бер.\n\nПайдаланушы: ${message}`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

module.exports = router;
