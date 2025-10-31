
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GPTPortal = () => {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (email.endsWith("@empresa.com") || email.endsWith("@cliente.com")) {
      setLoggedIn(true);
    } else {
      alert("Debe usar un correo corporativo autorizado.");
    }
  };

  const sendMessage = async () => {
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage], email }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-gradient-to-br from-pink-100 via-white to-pink-50">
        <img src="/logo-comware.png" alt="Comware Logo" className="mb-6 w-40" />
        <h1 className="text-3xl font-bold mb-2 text-center text-pink-700">
          Asistente Legal Corporativo
        </h1>
        <p className="mb-6 text-center text-gray-600 max-w-md">
          Ingresa tu correo corporativo para acceder al asistente legal personalizado de Comware. Esta herramienta está diseñada para optimizar procesos legales y mejorar tu productividad.
        </p>
        <input
          type="email"
          placeholder="Correo corporativo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-80 p-2 border rounded"
        />
        <button onClick={handleLogin} className="w-80 bg-pink-700 hover:bg-pink-800 text-white p-2 rounded">
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img src="/logo-comware.png" alt="Comware" className="w-24" />
            <h1 className="text-2xl font-semibold text-pink-700">Asistente Legal</h1>
          </div>
          <span className="text-sm text-gray-500">Usuario: {email}</span>
        </header>

        <Card className="h-[60vh] overflow-y-auto mb-4 shadow-md">
          <CardContent className="space-y-2 p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
                <p className={\`inline-block rounded-xl px-4 py-2 max-w-[80%] \${msg.role === "user" ? "bg-pink-100 text-pink-900" : "bg-white border text-gray-700"}\`}>
                  <strong>{msg.role === "user" ? "Tú" : "Asistente"}:</strong> {msg.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <input
            placeholder="Escribe tu consulta legal..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button onClick={sendMessage} className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded">
            Enviar
          </button>
        </div>

        <footer className="mt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Comware. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default GPTPortal;
