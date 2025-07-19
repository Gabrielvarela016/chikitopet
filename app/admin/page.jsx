"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const subcategoriasPorCategoria = {
  comida: ["Alimentos", "Snacks"],
  medicamentos: ["Desparasitante", "Vacunas"],
  jardineria: ["Semillas para Jardinería", "Sustrato", "Macetas"],
  mascota: ["Ropa", "Juguetes", "Platos de comida"],
};

export default function AdminPanel() {
  const router = useRouter();

  // --- Autenticación ---
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuario, setUsuario] = useState(null);

  // --- Productos ---
  const [productos, setProductos] = useState({
    comida: [],
    medicamentos: [],
    jardineria: [],
    mascota: [],
  });

  // --- Formulario ---
  const [categoria, setCategoria] = useState("comida");
  const [subcategoria, setSubcategoria] = useState(subcategoriasPorCategoria["comida"][0]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenURL, setImagenURL] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  // Valida usuario y redirige si no está
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        setLoadingAuth(false);
      } else {
        setUsuario(null);
        setLoadingAuth(false);
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Carga productos al iniciar y cuando cambie categoria (aunque cargamos todos)
  useEffect(() => {
    cargarProductos();
  }, []);

  // Cambia subcategoría si cambia categoría
  useEffect(() => {
    setSubcategoria(subcategoriasPorCategoria[categoria][0]);
  }, [categoria]);

  async function cargarProductos() {
    const categorias = ["comida", "medicamentos", "jardineria", "mascota"];
    let nuevosProductos = {};
    for (const cat of categorias) {
      const querySnapshot = await getDocs(collection(db, cat));
      nuevosProductos[cat] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    setProductos(nuevosProductos);
  }

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagenURL("");
    setCategoria("comida");
    setSubcategoria(subcategoriasPorCategoria["comida"][0]);
    setEditandoId(null);
    setError("");
  };

  const agregarProducto = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !precio || !categoria || !imagenURL || !subcategoria) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!imagenURL.startsWith("https://res.cloudinary.com/")) {
      setError("La URL debe ser de Cloudinary.");
      return;
    }

    try {
      if (editandoId) {
        const docRef = doc(db, categoria, editandoId);
        await updateDoc(docRef, {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          categoria,
          subcategoria,
          imagen: imagenURL,
        });
        alert("Producto actualizado correctamente.");
      } else {
        await addDoc(collection(db, categoria), {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          categoria,
          subcategoria,
          imagen: imagenURL,
        });
        alert("Producto agregado correctamente.");
      }

      limpiarFormulario();
      cargarProductos();
    } catch (error) {
      console.error("Error al agregar/actualizar producto:", error);
      alert("Error al guardar el producto.");
    }
  };

  const borrarProducto = async (cat, id) => {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;
    try {
      await deleteDoc(doc(db, cat, id));
      cargarProductos();
    } catch (error) {
      console.error("Error al borrar producto:", error);
      alert("Error al borrar producto.");
    }
  };

  const editarProducto = (producto) => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio.toString());
    setCategoria(producto.categoria);
    setSubcategoria(producto.subcategoria || subcategoriasPorCategoria[producto.categoria][0]);
    setImagenURL(producto.imagen || "");
    setEditandoId(producto.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function cerrarSesion() {
    signOut(auth).then(() => {
      router.push("/admin/login");
    });
  }

  if (loadingAuth) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Validando acceso...</p>;
  }

  if (!usuario) {
    return null;
  }

  return (
    <main
      style={{
        maxWidth: 920,
        margin: "3rem auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#ffffff",
        padding: "2.5rem 3rem",
        borderRadius: "14px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
        color: "#1f3d1f",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
          borderBottom: "2px solid #2a5230",
          paddingBottom: "0.7rem",
        }}
      >
        <h1
          style={{
            fontWeight: "800",
            fontSize: "2.8rem",
            letterSpacing: "1px",
            color: "#2a5230",
            margin: 0,
          }}
        >
          Panel de Administración de Productos
        </h1>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() =>
              window.open(
                "https://console.cloudinary.com/app/c-bfb4497f5732aa61b82b68e55459f8/assets/media_library/search?q=&view_mode=list",
                "_blank"
              )
            }
            style={{
              backgroundColor: "#2a5230",
              color: "white",
              fontWeight: "700",
              border: "none",
              padding: "0.65rem 1.5rem",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(42, 82, 48, 0.7)",
              transition: "background-color 0.25s ease",
              fontSize: "1rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#417730")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2a5230")}
            title="Ir a Cloudinary Media Library"
          >
            Imágenes
          </button>

          <button
            onClick={cerrarSesion}
            style={{
              backgroundColor: "#cc3333",
              color: "white",
              fontWeight: "700",
              border: "none",
              padding: "0.65rem 1.5rem",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(204, 51, 51, 0.7)",
              transition: "background-color 0.25s ease",
              fontSize: "1rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e05c5c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#cc3333")}
            title="Cerrar sesión"
          >
            🔒 Cerrar sesión
          </button>
        </div>
      </header>

      <form
        onSubmit={agregarProducto}
        style={{
          backgroundColor: "#f3f7f3",
          borderRadius: "12px",
          padding: "2.5rem 3rem",
          boxShadow: "0 6px 18px rgba(42, 82, 48, 0.15)",
          marginBottom: "4rem",
          color: "#2a5230",
        }}
      >
        <h2
          style={{
            fontWeight: "700",
            fontSize: "2rem",
            marginBottom: "1.7rem",
            borderBottom: "2px solid #2a5230",
            paddingBottom: "0.3rem",
            letterSpacing: "0.02em",
          }}
        >
          {editandoId ? "Editar Producto" : "Agregar Producto"}
        </h2>

        {error && (
          <p
            style={{
              color: "#cc3333",
              fontWeight: "700",
              marginBottom: "1rem",
              fontSize: "1.1rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Campo URL imagen */}
        <label style={{ display: "block", marginBottom: "1.3rem", fontWeight: "600", fontSize: "1.05rem" }}>
          URL de imagen:
          <input
            type="text"
            value={imagenURL}
            onChange={(e) => setImagenURL(e.target.value)}
            placeholder="Pega aquí la URL desde Cloudinary"
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1.8px solid #8aad88",
              color: "#2a5230",
              marginTop: "0.4rem",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4c8c22")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          />
        </label>

        {imagenURL && (
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <img
              src={imagenURL}
              alt="Preview"
              style={{ maxWidth: "160px", borderRadius: "14px", boxShadow: "0 4px 14px rgba(42, 82, 48, 0.3)" }}
            />
          </div>
        )}

        {/* Selector Categoría */}
        <label style={{ display: "block", marginBottom: "1.3rem", fontWeight: "600", fontSize: "1.05rem" }}>
          Categoría:
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
              marginTop: "0.3rem",
              padding: "0.45rem 0.8rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1.8px solid #8aad88",
              color: "#2a5230",
              outline: "none",
              width: "100%",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4c8c22")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          >
            <option value="comida">Comida</option>
            <option value="medicamentos">Medicamentos</option>
            <option value="jardineria">Jardinería</option>
            <option value="mascota">Para tu mascota</option>
          </select>
        </label>

        {/* Selector Subcategoría dinámico */}
        <label style={{ display: "block", marginBottom: "1.3rem", fontWeight: "600", fontSize: "1.05rem" }}>
          Subcategoría:
          <select
            value={subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            style={{
              marginTop: "0.3rem",
              padding: "0.45rem 0.8rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1.8px solid #8aad88",
              color: "#2a5230",
              outline: "none",
              width: "100%",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4c8c22")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          >
            {subcategoriasPorCategoria[categoria].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </label>

        {/* Campos nombre, descripción y precio */}
        <label style={{ display: "block", marginBottom: "1.3rem", fontWeight: "600", fontSize: "1.05rem" }}>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1.8px solid #8aad88",
              marginTop: "0.4rem",
              color: "#2a5230",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4c8c22")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          />
        </label>

        <label style={{ display: "block", marginBottom: "1.3rem", fontWeight: "600", fontSize: "1.05rem" }}>
          Descripción:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={3}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1.8px solid #8aad88",
              marginTop: "0.4rem",
              resize: "vertical",
              color: "#2a5230",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4c8c22")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          />
        </label>

        <label style={{ display: "block", marginBottom: "1.8rem", fontWeight: "600", fontSize: "1.05rem" }}>
          Precio:
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1.8px solid #8aad88",
              marginTop: "0.4rem",
              color: "#2a5230",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4c8c22")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#8aad88")}
          />
        </label>

        {/* Botones */}
        <div style={{ display: "flex", gap: "1.4rem", justifyContent: "flex-start" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#2a5230",
              color: "white",
              fontWeight: "700",
              border: "none",
              padding: "0.85rem 2.2rem",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 5px 14px rgba(42, 82, 48, 0.75)",
              transition: "background-color 0.3s ease",
              fontSize: "1.1rem",
            }}
          >
            {editandoId ? "Actualizar" : "Agregar"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              style={{
                backgroundColor: "#a3a3a3",
                color: "white",
                fontWeight: "700",
                border: "none",
                padding: "0.85rem 2.2rem",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 5px 14px rgba(163, 163, 163, 0.75)",
                transition: "background-color 0.3s ease",
                fontSize: "1.1rem",
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Listado productos por categoría */}
      {["comida", "medicamentos", "jardineria", "mascota"].map((cat) => (
        <section key={cat} style={{ marginBottom: "3.8rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "1rem",
              borderBottom: "3px solid #2a5230",
              paddingBottom: "0.3rem",
              textTransform: "capitalize",
              color: "#2a5230",
            }}
          >
            {cat === "mascota" ? "Para tu mascota" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </h2>

          <ul
            style={{
              listStyle: "none",
              paddingLeft: 0,
              marginTop: "1rem",
              color: "#1f3d1f",
            }}
          >
            {productos[cat] && productos[cat].length === 0 && (
              <p style={{ fontStyle: "italic", color: "#567956" }}>
                No hay productos en esta categoría.
              </p>
            )}

            {productos[cat]?.map((producto) => (
              <li
                key={producto.id}
                style={{
                  backgroundColor: "#f3f7f3",
                  borderRadius: "10px",
                  padding: "1.4rem 1.9rem",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 3px 12px rgba(42, 82, 48, 0.12)",
                }}
              >
                <div style={{ maxWidth: "65%" }}>
                  <strong style={{ fontSize: "1.25rem" }}>{producto.nombre}</strong>
                  <p style={{ margin: "0.4rem 0", fontSize: "0.95rem" }}>
                    {producto.descripcion}
                  </p>
                  <small style={{ color: "#345834" }}>
                    Subcategoría: {producto.subcategoria}
                  </small>
                  <p
                    style={{
                      margin: "0.6rem 0 0 0",
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      color: "#2a5230",
                    }}
                  >
                    LPS. {producto.precio.toFixed(2)}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => editarProducto(producto)}
                    style={{
                      border: "none",
                      backgroundColor: "#417730",
                      color: "white",
                      padding: "0.55rem 1.2rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "700",
                      boxShadow: "0 3px 10px rgba(65, 119, 48, 0.8)",
                      fontSize: "1rem",
                      transition: "background-color 0.25s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#315822")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#417730")}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => borrarProducto(cat, producto.id)}
                    style={{
                      border: "none",
                      backgroundColor: "#cc3333",
                      color: "white",
                      padding: "0.55rem 1.3rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "700",
                      boxShadow: "0 3px 10px rgba(204, 51, 51, 0.8)",
                      fontSize: "1rem",
                      transition: "background-color 0.25s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a32c2c")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#cc3333")}
                  >
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
