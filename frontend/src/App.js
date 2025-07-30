// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

// --- Páginas Placeholder ---
const ArtigosPage = () => <div className="status-message"><h1>Página de Artigos</h1><p>Conteúdo em breve...</p></div>;
const ForumPage = () => <div className="status-message"><h1>Página de Fóruns</h1><p>Conteúdo em breve...</p></div>;

// --- Componente de Header ---
function Header({ currentUser, onLogout, searchTerm, onSearchTermChange, onSearchSubmit }) {
  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo">Painel Útil</Link>
        <nav className="main-nav">
          <ul>
            <li><Link to="/artigos">Artigos</Link></li>
            <li><Link to="/forum">Fóruns</Link></li>
          </ul>
        </nav>
        <form className="search-form" onSubmit={onSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar por um assunto..."
            value={searchTerm}
            onChange={onSearchTermChange}
          />
          <button type="submit">Buscar</button>
        </form>
        <div className="user-actions">
          {currentUser ? (
            <>
              <span className="welcome-message">Olá, {currentUser.full_name}!</span>
              <button onClick={onLogout} className="btn btn-secondary">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Entrar</Link>
              <Link to="/criar-conta" className="btn btn-primary">Criar Conta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// --- Componente Principal da Aplicação ---
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Função para buscar as notícias padrão
  const fetchDefaultNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/tech-news`);
      const articles = await response.json();
      setResults(articles);
    } catch (error) {
      console.error("Erro ao buscar notícias padrão:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efeito para verificar o token E buscar notícias iniciais
  useEffect(() => {
    fetchDefaultNews();

    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3001/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(userData => { setCurrentUser(userData); })
      .catch(() => { localStorage.removeItem('token'); });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/tech-news?q=${searchTerm}`);
      const articles = await response.json();
      setResults(articles);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchTermChange={(e) => setSearchTerm(e.target.value)}
        onSearchSubmit={handleSearch}
      />
      <main>
        <Routes>
          <Route path="/" element={<HomePage results={results} isLoading={isLoading} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={setCurrentUser} />} />
          <Route path="/criar-conta" element={<RegisterPage />} />
          <Route path="/artigos" element={<ArtigosPage />} />
          <Route path="/forum" element={<ForumPage />} />
        </Routes>
      </main>
    </>
  );
}

// --- Componente "Wrapper" ---
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;