import { useState, useEffect } from 'react';
import Login from './Login';
import ApplyLeave from './Components/ApplyLeave';
import MyLeaves from './Components/MyLeaves';
import AdminDashboard from './Components/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  );

  const [currentView, setCurrentView] = useState('apply');

  // 🔒 Auto-correct view on reload or role change
  useEffect(() => {
    if (!user) return;

    const role = user.role?.toLowerCase().trim();

    if (role === 'manager' || role === 'hr') {
      setCurrentView('admin');
    } else {
      setCurrentView('apply');
    }
  }, [user]);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // 🔒 Login gate
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const { emp_id, name, role } = user;
  const normalizedRole = role?.toLowerCase().trim();

  return (
    <div className="App">
      <header className="app-header">
        <h1>PulseHR - Employee Leave Management System</h1>

        <div className="user-info">
          <span className="user-name">Welcome, {name}</span>
          <span className={`role-badge role-${normalizedRole}`}>
            {normalizedRole}
          </span>
        </div>

        <nav className="nav-menu">
          {(normalizedRole === 'developer' ||
            normalizedRole === 'employee') && (
            <>
              <button
                className={currentView === 'apply' ? 'active' : ''}
                onClick={() => setCurrentView('apply')}
              >
                Apply Leave
              </button>

              <button
                className={currentView === 'my-leaves' ? 'active' : ''}
                onClick={() => setCurrentView('my-leaves')}
              >
                My Leaves
              </button>
            </>
          )}

          {(normalizedRole === 'manager' ||
            normalizedRole === 'hr') && (
            <button
              className={currentView === 'admin' ? 'active' : ''}
              onClick={() => setCurrentView('admin')}
            >
              Admin Dashboard
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="main-content">
        {(currentView === 'apply' &&
          (normalizedRole === 'developer' ||
            normalizedRole === 'employee')) && (
          <ApplyLeave empId={emp_id} />
        )}

        {(currentView === 'my-leaves' &&
          (normalizedRole === 'developer' ||
            normalizedRole === 'employee')) && (
          <MyLeaves empId={emp_id} />
        )}

        {(currentView === 'admin' &&
          (normalizedRole === 'manager' ||
            normalizedRole === 'hr')) && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;
