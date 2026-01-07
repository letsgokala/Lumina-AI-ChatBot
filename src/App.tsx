import React from 'react';

export default function App() {
  return (
    <main className="workspace-shell">
      <aside className="workspace-sidebar">
        <p className="eyebrow">Lumina</p>
        <h2>Sessions</h2>
        <div className="placeholder-stack">
          <div className="placeholder-line short" />
          <div className="placeholder-line" />
          <div className="placeholder-line" />
        </div>
      </aside>
      <section className="workspace-main">
        <p className="eyebrow">Assistant</p>
        <h1>Prototype a modern AI workspace.</h1>
        <p className="subtitle">
          The foundation now includes a two-column layout for conversation history and a focused chat surface.
        </p>
      </section>
    </main>
  );
}
