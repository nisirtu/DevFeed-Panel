// frontend/src/pages/HomePage.js
import React from 'react';

function HomePage({ results, isLoading }) {
  if (isLoading) {
    return <div className="status-message"><p>Buscando notícias...</p></div>;
  }
  
  if (!results || results.length === 0) {
    return <div className="status-message"><p>Faça uma busca para ver os resultados aqui.</p></div>;
  }

  return (
    <div className="results-container">
      {results.map((item, index) => (
        <article key={index} className="result-item">
          {item.image && <img src={item.image} alt={item.title} />}
          <h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
          <p>{item.description}</p>
          <small>Fonte: {item.source.name}</small>
        </article>
      ))}
    </div>
  );
}

export default HomePage;