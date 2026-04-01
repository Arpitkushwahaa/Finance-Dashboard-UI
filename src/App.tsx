import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Moon, Sun, Shield, LayoutDashboard } from 'lucide-react';
import { DashboardOverview } from './components/DashboardOverview';
import { TransactionsList } from './components/TransactionsList';
import { Insights } from './components/Insights';

function App() {
  const darkMode = useStore(state => state.darkMode);
  const toggleDarkMode = useStore(state => state.toggleDarkMode);
  const role = useStore(state => state.role);
  const setRole = useStore(state => state.setRole);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold hidden sm:block">Finance Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'viewer')}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DashboardOverview />
        <Insights />
        <TransactionsList />
      </main>
    </div>
  );
}

export default App;
