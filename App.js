import React, { useState, useEffect } from 'react';
import './App.css';

const API = "http://localhost:5000/api/incidents";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [form, setForm] = useState({ title: '', description: '', severity: '' });
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setIncidents(data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.description || !form.severity) return alert("Fill all fields");

    const res = await fetch(API, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const newIncident = await res.json();
    setIncidents([newIncident, ...incidents]);
    setForm({ title: '', description: '', severity: '' });
  };

  const filtered = incidents
    .filter(i => filter === "All" || i.severity === filter)
    .sort((a, b) => sortOrder === "newest"
      ? new Date(b.reported_at) - new Date(a.reported_at)
      : new Date(a.reported_at) - new Date(b.reported_at)
    );

  return (
    <div className={`app ${theme}`}>
      <nav>
        <h2>🛡️ AI Safety Dashboard</h2>
        <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </nav>

      <div className="controls">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <ul>
        {filtered.map((inc, i) => (
          <li key={i}>
            <strong>{inc.title}</strong> - {inc.severity}
            <br />
            {new Date(inc.reported_at).toLocaleString()}
            <p>{inc.description}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
        <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
          <option value="">Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">Report</button>
      </form>
    </div>
  );
}

export default App;
