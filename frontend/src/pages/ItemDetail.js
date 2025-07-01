import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LOCALHOST_URL } from '../state/DataContext';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${LOCALHOST_URL}/api/items/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setItem)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (!item) return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: '#e0e0e0'
    }}>
      <div style={{
        display: 'inline-block',
        width: '20px',
        height: '20px',
        border: '2px solid #bb86fc',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        marginRight: '10px'
      }}></div>
      Loading...
    </div>
  );

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#121212',
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#1a1a1a',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid #333',
      }}>
        <h2 style={{
          color: '#bb86fc',
          marginBottom: '24px',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          {item.name}
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <p style={{
            color: '#e0e0e0',
            fontSize: '16px',
            margin: 0,
            padding: '12px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            borderLeft: '4px solid #bb86fc'
          }}>
            <strong style={{ color: '#bb86fc' }}>Category:</strong> {item.category}
          </p>
          <p style={{
            color: '#e0e0e0',
            fontSize: '16px',
            margin: 0,
            padding: '12px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            borderLeft: '4px solid #bb86fc'
          }}>
            <strong style={{ color: '#bb86fc' }}>Price:</strong> ${item.price}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '32px',
            padding: '12px 24px',
            backgroundColor: '#bb86fc',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          ← Back to Items
        </button>
      </div>
    </div>
  );
}

export default ItemDetail;