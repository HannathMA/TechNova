import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('eventsync.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT CHECK(role IN ('organizer', 'volunteer', 'participant'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    date TEXT,
    location TEXT,
    status TEXT DEFAULT 'active',
    organizer_id TEXT,
    FOREIGN KEY(organizer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    event_id TEXT,
    title TEXT,
    description TEXT,
    assigned_to TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed')),
    FOREIGN KEY(event_id) REFERENCES events(id),
    FOREIGN KEY(assigned_to) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    event_id TEXT,
    content TEXT,
    type TEXT DEFAULT 'info' CHECK(type IN ('info', 'emergency')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(event_id) REFERENCES events(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)');
  insertUser.run('1', 'admin@college.edu', 'Admin Organizer', 'organizer');
  insertUser.run('2', 'volunteer@college.edu', 'John Volunteer', 'volunteer');
  insertUser.run('3', 'student@college.edu', 'Jane Student', 'participant');
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  // WebSocket handling
  const clients = new Set<WebSocket>();
  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });

  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // API Routes
  app.post('/api/login', (req, res) => {
    const { email } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  });

  app.get('/api/events', (req, res) => {
    const events = db.prepare('SELECT * FROM events').all();
    res.json(events);
  });

  app.post('/api/events', (req, res) => {
    const { id, title, description, date, location, organizer_id } = req.body;
    db.prepare('INSERT INTO events (id, title, description, date, location, organizer_id) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, title, description, date, location, organizer_id);
    const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    broadcast({ type: 'EVENT_CREATED', payload: newEvent });
    res.json(newEvent);
  });

  app.get('/api/tasks', (req, res) => {
    const { userId, role } = req.query;
    let tasks;
    if (role === 'volunteer') {
      tasks = db.prepare('SELECT t.*, e.title as event_title FROM tasks t JOIN events e ON t.event_id = e.id WHERE t.assigned_to = ?').all(userId);
    } else {
      tasks = db.prepare('SELECT t.*, e.title as event_title FROM tasks t JOIN events e ON t.event_id = e.id').all();
    }
    res.json(tasks);
  });

  app.post('/api/tasks', (req, res) => {
    const { id, event_id, title, description, assigned_to } = req.body;
    db.prepare('INSERT INTO tasks (id, event_id, title, description, assigned_to) VALUES (?, ?, ?, ?, ?)')
      .run(id, event_id, title, description, assigned_to);
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    broadcast({ type: 'TASK_ASSIGNED', payload: newTask });
    res.json(newTask);
  });

  app.patch('/api/tasks/:id', (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, req.params.id);
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    broadcast({ type: 'TASK_UPDATED', payload: updatedTask });
    res.json(updatedTask);
  });

  app.get('/api/announcements', (req, res) => {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
    res.json(announcements);
  });

  app.post('/api/announcements', (req, res) => {
    const { id, event_id, content, type } = req.body;
    db.prepare('INSERT INTO announcements (id, event_id, content, type) VALUES (?, ?, ?, ?)')
      .run(id, event_id, content, type);
    const newAnnouncement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    broadcast({ type: 'ANNOUNCEMENT', payload: newAnnouncement });
    res.json(newAnnouncement);
  });

  app.get('/api/volunteers', (req, res) => {
    const volunteers = db.prepare("SELECT id, name, email FROM users WHERE role = 'volunteer'").all();
    res.json(volunteers);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
