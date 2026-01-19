import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidGmail = (email) => email.endsWith("@gmail.com");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidGmail(email)) {
      setError("El correo debe ser @gmail.com");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onLogin();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado");
      } else if (err.code === "auth/wrong-password") {
        setError("Contraseña incorrecta");
      } else if (err.code === "auth/user-not-found") {
        setError("Este usuario no existe");
      } else {
        setError("Error al autenticar");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-white/30">
        
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg">
            ✔
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          TO-DO APP
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isRegister ? "Crea tu cuenta" : "Inicia sesión"}
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded-lg mb-4 animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo @gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading
              ? "Cargando..."
              : isRegister
              ? "Crear cuenta"
              : "Entrar"}
          </button>
        </form>

        <p
          className="text-sm text-indigo-600 mt-6 cursor-pointer hover:underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
