const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DB_FILE = path.join(__dirname, 'users.json');

function readUsers() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch (err) { return []; }
}
function writeUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

app.get('/users', (req, res) => res.json(readUsers()));

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
  const users = readUsers();
  const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const user = { id: newId, name, email };
  users.push(user);
  writeUsers(users);
  res.status(201).json(user);
});
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  writeUsers(users);
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const users = readUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  const removed = users.splice(index, 1)[0];
  writeUsers(users);
  res.json({ message: 'User deleted', user: removed });
});
app.listen(3001, () => console.log('User Service running on port 3001'));