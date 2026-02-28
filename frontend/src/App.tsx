import { useState, useEffect, useRef } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { IoLogoWechat, IoChatbubbleEllipses, IoHome, IoShieldCheckmark } from "react-icons/io5";
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatRoom from './components/ChatRoom';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [roomId, setRoomId] = useState('');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToRoomSelection = () => {
    document.getElementById('room-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const leaveRoom = () => {
    setJoined(false);
    setCurrentRoom(null);
    setRoomId('');
    wsRef.current?.close();
  };

  useEffect(() => {
    if (isAuthenticated && !joined) {
      const ws = new WebSocket('ws://localhost:8082');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "error") {
          setErrorMsg(data.payload.message);
        }
      };
      wsRef.current = ws;
      return () => ws.close();
    }
  }, [isAuthenticated, joined]);

  const joinRoom = () => {
    setErrorMsg('');
    if (!roomId.trim()) {
      setErrorMsg('Please enter a room ID');
      return;
    }
    setCurrentRoom(roomId);
    setJoined(true);
  };

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    setRoomId(id);
    setCurrentRoom(id);
    setJoined(true);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "create",
        payload: { roomId: id }
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (joined && currentRoom) {
    return <ChatRoom roomId={currentRoom} onLeaveRoom={leaveRoom} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col w-full p-4">
        <section className="hero relative w-full flex items-center justify-center text-center text-white">
          <div className="hero-overlay absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/70"></div>
          <div className="relative z-10 max-w-3xl p-8">
            <div className="flex items-center justify-center mb-6">
              <IoLogoWechat className="text-6xl md:text-8xl text-white drop-shadow-lg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Connect. Chat. Create memories.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6">
              Join rooms, meet friends, and share moments in real-time.
            </p>
            <div className="mt-8 flex flex-col items-center space-y-4">
              <button onClick={scrollToRoomSelection} className="button login px-6 py-3">
                Chat Now
              </button>
              {!isAuthenticated && (
                <a href="#features" className="text-sm text-gray-300 hover:underline">See features ↓</a>
              )}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-black text-white">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-5xl font-bold">Features</h2>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 bg-white/10 rounded-lg">
              <div className="flex justify-center mb-4">
                <IoChatbubbleEllipses className="text-4xl text-white" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Real-time chat</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Experience instant messaging with minimal delay. Socket-based system supports text, emojis, and media.
              </p>
            </div>
            <div className="p-8 bg-white/10 rounded-lg">
              <div className="flex justify-center mb-4">
                <IoHome className="text-4xl text-white" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Rooms & invitations</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Create private rooms or join with an ID. Share links, set custom names, and invite friends instantly.
              </p>
            </div>
            <div className="p-8 bg-white/10 rounded-lg">
              <div className="flex justify-center mb-4">
                <IoShieldCheckmark className="text-4xl text-white" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Privacy-first</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Protected by Auth0 authentication. No tracking, no data selling, no ads—just secure conversation.
              </p>
            </div>
          </div>
        </section>

        {!isAuthenticated && (
          <section id="contact" className="py-16 px-6 bg-black text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-4xl font-semibold mb-6">Get In Touch</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a href="mailto:aakanshapande0@gmail.com" className="button login">Email Me</a>
                <a href="https://aakanshapande.vercel.app/" target="_blank" rel="noopener" className="button signup">Portfolio</a>
              </div>
            </div>
          </section>
        )}

        {isAuthenticated && !joined && (
          <div id="room-selection" className="flex items-center justify-center py-24">
            <div className="w-full max-w-4xl flex flex-row gap-6">
              <div className="flex-1 p-8 rounded-lg text-center border border-gray-600">
                <h2 className="text-2xl mb-4">Create Room</h2>
                <button
                  onClick={createRoom}
                  className="mb-4 w-full bg-white text-black p-3 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
                >
                  Generate ID & Create
                </button>
                <p className="text-sm text-gray-300">A random room ID will be generated.</p>
              </div>
              <div className="flex-1 p-8 rounded-lg text-center border border-gray-600">
                <h2 className="text-2xl mb-4">Join Room</h2>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="w-full p-3 mb-4 text-white rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                {errorMsg && <div className="text-red-400 mb-4">{errorMsg}</div>}
                <button
                  onClick={joinRoom}
                  disabled={!roomId.trim()}
                  className="w-full bg-white text-black p-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-semibold transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App