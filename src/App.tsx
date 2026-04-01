import React from 'react';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-card text-card-foreground">
        <h1 className="text-xl font-bold">Finance Dashboard</h1>
      </header>
      <main className="flex-1 p-8 bg-background">
        <p>Loading dashboard...</p>
      </main>
    </div>
  );
}

export default App;
