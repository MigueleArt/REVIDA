'use client';

import { useState, useEffect } from 'react'; // Añadimos useEffect
import useAuth from '../../hooks/useAuth';
import { getChats } from '../../services/api';

export default function MensajesPage() {
  const { usuario } = useAuth();
  const [activeChat, setActiveChat] = useState(null); // Empezamos sin chat seleccionado
  const [mensaje, setMensaje] = useState('');
  const [chats, setChats] = useState([]); // Array vacío para llenar con la API
  const [loading, setLoading] = useState(true);

  // CARGAR CHATS REALES AL ENTRAR
  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosReales = await getChats();
        setChats(datosReales);
        if (datosReales.length > 0) setActiveChat(datosReales[0].id);
      } catch (error) {
        console.error("Error cargando chats:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Cargando mensajes...</div>;

  const activeChatData = chats.find(c => c.id === activeChat);

  // 

  const handleSend = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          mensajes: [
            ...chat.mensajes,
            { id: Date.now(), text: mensaje, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        };
      }
      return chat;
    }));
    setMensaje('');
  };

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 64px)', // Asumiendo que el Navbar mide ~64px
      backgroundColor: '#F3F4F6',
      fontFamily: 'system-ui, sans-serif'
    }}>
      
      {/* Sidebar de Chats */}
      <div style={{
        width: '350px',
        backgroundColor: 'white',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>Mensajes</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6',
                cursor: 'pointer',
                backgroundColor: activeChat === chat.id ? '#EFF6FF' : 'white',
                borderLeft: activeChat === chat.id ? '4px solid #2563EB' : '4px solid transparent',
                transition: 'background-color 0.2s',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: '#DBEAFE', color: '#2563EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '1.2rem', flexShrink: 0
              }}>
                {chat.avatar}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {chat.nombre}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                    {chat.mensajes[chat.mensajes.length - 1].time}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {chat.mensajes[chat.mensajes.length - 1].text}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: '500', marginTop: '4px', display: 'block' }}>
                  {chat.articulo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área Principal de Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
        
        {/* Cabecera del Chat */}
        {activeChatData && (
          <div style={{ 
            padding: '20px 30px', 
            backgroundColor: 'white', 
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#DBEAFE', color: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '1.1rem'
            }}>
              {activeChatData.avatar}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                {activeChatData.nombre}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280' }}>
                Interesado en: <strong>{activeChatData.articulo}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Mensajes */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeChatData ? activeChatData.mensajes.map((msg) => (
            <div key={msg.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomRightRadius: msg.sender === 'me' ? '4px' : '16px',
                borderBottomLeftRadius: msg.sender === 'them' ? '4px' : '16px',
                backgroundColor: msg.sender === 'me' ? '#2563EB' : 'white',
                color: msg.sender === 'me' ? 'white' : '#111827',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '6px' }}>
                {msg.time}
              </span>
            </div>
          )) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
              Selecciona una conversación para empezar a chatear.
            </div>
          )}
        </div>

        {/* Input de Mensaje */}
        {activeChatData && (
          <div style={{ padding: '20px 30px', backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '24px',
                  border: '1px solid #D1D5DB',
                  outline: 'none',
                  fontSize: '1rem',
                  backgroundColor: '#F9FAFB'
                }}
              />
              <button
                type="submit"
                disabled={!mensaje.trim()}
                aria-label="Enviar mensaje"  // <-- ESTO ES LO QUE PIDEN
                title="Enviar mensaje"
                style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  backgroundColor: mensaje.trim() ? '#2563EB' : '#93C5FD',
                  border: 'none', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: mensaje.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
