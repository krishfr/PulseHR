import { useState } from 'react';
import api from './api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await api.post('/login', { email, password });

    console.log('LOGIN RESPONSE', res.data);

    if (!res.data.token || !res.data.user) {
      setError('Invalid credentials');
      return;
    }

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    onLogin(res.data.user);
  } catch (err) {
    console.error('LOGIN ERROR', err.response?.data || err.message);
    setError(err.response?.data?.message || 'Invalid credentials');
  }
};


  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
