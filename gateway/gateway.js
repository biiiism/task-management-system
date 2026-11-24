const express = require('express');
const app = express();
app.use(express.json());

const USER_SERVICE = 'http://localhost:3001';
const TASK_SERVICE = 'http://localhost:3002';

async function forward(req, res, target) {
  try {
    const options = { method: req.method, headers: { 'Content-Type': 'application/json' } };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = JSON.stringify(req.body);
    }
    const response = await fetch(target + req.originalUrl, options);
    const data = await response.text();
    res.status(response.status).type('application/json').send(data);
  } catch (err) {
    res.status(502).json({ error: 'Bad Gateway: service unavailable' });
  }
}

app.use('/users', (req, res) => forward(req, res, USER_SERVICE));
app.use('/tasks', (req, res) => forward(req, res, TASK_SERVICE));

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  res.status(400).json({ error: 'Invalid request body' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));