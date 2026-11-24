const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DB_FILE = path.join(__dirname, 'tasks.json');

function readTasks() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch (err) { return []; }
}
function writeTasks(tasks) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
}

app.get('/tasks', (req, res) => res.json(readTasks()));

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const tasks = readTasks();
  const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const task = { id: newId, title, completed: false };
  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.completed !== undefined) task.completed = req.body.completed;
  writeTasks(tasks);
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  const removed = tasks.splice(index, 1)[0];
  writeTasks(tasks);
  res.json({ message: 'Task deleted', task: removed });
});

app.listen(3002, () => console.log('Task Service running on port 3002'));