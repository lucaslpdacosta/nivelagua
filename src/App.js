import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './styles.css';

function App() {
  const [nivelAgua, setNivelAgua] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(false);
  const gaugeRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('valorNivel', (data) => {
      setNivelAgua(data);
      setConnectionStatus(true);
      setGaugeValue(gaugeRef.current, data / 100);
    });

    socket.on('disconnect', () => {
      setConnectionStatus(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const setGaugeValue = (gauge, value) => {
    if (value < 0 || value > 1) {
      return;
    }

    gauge.querySelector('.gauge__fill').style.transform = `rotate(${value / 2}turn)`;
    gauge.querySelector('.gauge__cover').textContent = `${Math.round(value * 100)}%`;
  };

  return (
    <div className="container">
      <h1 className="title">Medição de Nível de Água</h1>
      <div>
      </div>
      <div className="gauge" ref={gaugeRef}>
        <div className="gauge__body">
          <div className="gauge__fill"></div>
          <div className="gauge__cover"></div>
        </div>
      </div>
      <h2 style={{ fontFamily: 'Poppins, sans-serif', color: connectionStatus ? '#40AC82' : '#FB6944', textAlign: 'center', marginTop: '60px', fontWeight: 'bold' }}>
        {connectionStatus ? 'CONECTADO!' : 'DESCONECTADO'}
      </h2>
      {nivelAgua >= 90 && (
        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#E83A39', textAlign: 'center', fontWeight: 'bold', fontSize: '24px', marginBottom: '30px' }}>
          ALERTA CRÍTICO DE NÍVEL DE ÁGUA!
        </p>
      )}
      <p className="footer">Feito com ❤️ usando React</p>
    </div>
  );
}

export default App;