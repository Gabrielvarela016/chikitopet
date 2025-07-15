"use client";

import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Si ya está logueado redirige directo
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor ingresa email y contraseña.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.3rem",
          color: "#2a5230",
          fontWeight: "600",
        }}
      >
        Validando acceso...
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "400px",
        margin: "5rem auto",
        padding: "2.8rem 2.6rem",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(42, 82, 48, 0.25)",
        backgroundColor: "#f7f9f7",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#2a5230",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontWeight: "900",
          fontSize: "2.8rem",
          marginBottom: "2.2rem",
          letterSpacing: "0.06em",
          userSelect: "none",
        }}
      >
        Admin Login
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="email"
          style={{ display: "block", marginBottom: "0.8rem", fontWeight: "700" }}
        >
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          placeholder="correo"
          required
          style={{
            width: "100%",
            padding: "0.6rem 0.9rem",
            fontSize: "1.1rem",
            borderRadius: "10px",
            border: "2px solid #8aad88",
            marginBottom: "1.8rem",
            outline: "none",
            color: "#2a5230",
            transition: "border-color 0.25s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#417730")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          autoComplete="username"
        />

        <label
          htmlFor="password"
          style={{ display: "block", marginBottom: "0.8rem", fontWeight: "700" }}
        >
          Contraseña:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          style={{
            width: "100%",
            padding: "0.6rem 0.9rem",
            fontSize: "1.1rem",
            borderRadius: "10px",
            border: "2px solid #8aad88",
            marginBottom: "1.8rem",
            outline: "none",
            color: "#2a5230",
            transition: "border-color 0.25s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#417730")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          autoComplete="current-password"
        />

        {error && (
          <p
            role="alert"
            style={{
              color: "#cc3333",
              fontWeight: "700",
              marginBottom: "1.5rem",
              fontSize: "1.05rem",
              userSelect: "none",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9rem 0",
            fontSize: "1.2rem",
            fontWeight: "800",
            color: "white",
            backgroundColor: loading ? "#a3a3a3" : "#2a5230",
            border: "none",
            borderRadius: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading
              ? "none"
              : "0 6px 20px rgba(42, 82, 48, 0.8)",
            transition: "background-color 0.25s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#417730";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#2a5230";
          }}
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
