"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { FaShoppingCart, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

import "./productos.css";

export default function ProductosPage() {
  const categorias = {
    comida: { label: "COMIDA", sub: ["Alimentos", "Snacks"] },
    medicamentos: { label: "MEDICAMENTOS", sub: ["Desparasitante", "Vacunas"] },
    jardineria: { label: "JARDINERÍA", sub: ["Semillas para Jardinería", "Sustrato", "Macetas"] },
    mascota: { label: "PARA TU MASCOTA", sub: ["Ropa", "Juguetes", "Platos de comida", "Aseo"] },
  };

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configuracion, setConfiguracion] = useState({
    mostrarCarrito: true,
    mostrarWhatsapp: true,
    mostrarFiltros: true
  });

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);

  const [filtrosAbiertos, setFiltrosAbiertos] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false);

  const [productoDetalle, setProductoDetalle] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Ref y estado para scroll horizontal
  const sliderRef = useRef(null);
  const [paginaActual, setPaginaActual] = useState(0);

  const [busqueda, setBusqueda] = useState("");

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const slideWidth = sliderRef.current.firstChild?.offsetWidth || 1;
    const gap = 16; // espacio entre slides en px, ajustar si cambias el gap en CSS
    const pagina = Math.round(scrollLeft / (slideWidth + gap));
    setPaginaActual(pagina);
  };

  useEffect(() => {
    // Reset página al cambiar filtros o productos filtrados
    setPaginaActual(0);
    if (sliderRef.current) sliderRef.current.scrollLeft = 0;
  }, [categoriaSeleccionada, subcategoriaSeleccionada, productos, busqueda]);

  useEffect(() => {
    // Suscripción a la configuración en tiempo real
    const unsubscribeConfig = onSnapshot(doc(db, "configuracion", "principal"), (doc) => {
      if (doc.exists()) {
        const configData = doc.data();
        setConfiguracion({
          mostrarCarrito: configData.mostrarCarrito !== false,
          mostrarWhatsapp: configData.mostrarWhatsapp !== false,
          mostrarFiltros: configData.mostrarFiltros !== false
        });
      }
    });

    async function fetchProductos() {
      setLoading(true);
      try {
        const colecciones = ["comida", "medicamentos", "jardineria", "mascota"];
        let todos = [];
        for (const col of colecciones) {
          const querySnapshot = await getDocs(collection(db, col));
          const arr = [];
          querySnapshot.forEach((doc) => {
            arr.push({ id: doc.id, categoria: col, ...doc.data() });
          });
          todos = todos.concat(arr);
        }
        // Ordenar productos alfabéticamente
        todos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProductos(todos);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();

    return () => {
      unsubscribeConfig(); // Limpiar suscripción al desmontar
    };
  }, []);

  const productosFiltrados = productos.filter((p) => {
    if (categoriaSeleccionada && p.categoria !== categoriaSeleccionada) return false;
    if (subcategoriaSeleccionada && p.subcategoria !== subcategoriaSeleccionada) return false;
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const handleAddToCart = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      return existe
        ? prev.map((p) => (p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p))
        : [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => setCarrito((prev) => prev.filter((p) => p.id !== id));

  const toggleFiltro = (key) => setFiltrosAbiertos((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const enviarWhatsApp = () => {
    const mensaje = carrito
      .map((p) => `- ${p.nombre} x${p.cantidad} (Lps ${(p.precio * p.cantidad).toFixed(2)})`)
      .join("\n");
    const url = `https://wa.me/50493937936?text=${encodeURIComponent(
      "¡Hola! Quisiera hacer el siguiente pedido:\n" + mensaje
    )}`;
    window.open(url, "_blank");
  };

  const abrirDetalleProducto = (producto) => {
    setProductoDetalle(producto);
  };

  const cerrarDetalleProducto = () => {
    setProductoDetalle(null);
  };

  // Función para truncar la descripción a 3 líneas
  const truncarDescripcion = (desc) => {
    if (!desc) return "";
    const lineas = desc.split('\n');
    return lineas.slice(0, 3).join('\n') + (lineas.length > 3 ? '...' : '');
  };

  return (
    <div className="contenedorGeneral">
      {/* BANNER SUPERIOR */}
      <div className="bannerSuperior">
        <img
          src={isMobile ? "/banner1-mobile.png" : "/banner1.png"}
          alt="Banner superior Chikito Pet"
        />
      </div>

      <h1 className="titulo">Catálogo de Productos</h1>

      {/* BUSCADOR */}
      <div style={{ margin: "1rem 0", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            width: isMobile ? "90%" : "300px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          aria-label="Buscar productos"
        />
      </div>

      <div className="contenedor">
        {/* FILTRO LATERAL */}
        {configuracion.mostrarFiltros && (
          <aside className={isMobile ? "filtroMobile" : "filtroDesktop"}>
            <h2>Filtrar por</h2>
            {Object.entries(categorias).map(([key, cat]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <div
                  onClick={() => {
                    if (isMobile) {
                      toggleFiltro(key);
                      setCategoriaSeleccionada(key === categoriaSeleccionada ? null : key);
                      setSubcategoriaSeleccionada(null);
                    } else {
                      setCategoriaSeleccionada(key === categoriaSeleccionada ? null : key);
                      setSubcategoriaSeleccionada(null);
                    }
                  }}
                  className="filtroTitulo"
                >
                  {cat.label}
                  {isMobile && (filtrosAbiertos[key] ? <FaChevronUp /> : <FaChevronDown />)}
                </div>
                {(isMobile ? filtrosAbiertos[key] : categoriaSeleccionada === key) && (
                  <ul className="listaSubfiltros">
                    {cat.sub.map((sub) => (
                      <li
                        key={sub}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubcategoriaSeleccionada(sub === subcategoriaSeleccionada ? null : sub);
                          if (isMobile) setFiltrosAbiertos((prev) => ({ ...prev, [key]: true }));
                        }}
                        className={subcategoriaSeleccionada === sub ? "subFiltroItem activo" : "subFiltroItem"}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {(categoriaSeleccionada || subcategoriaSeleccionada) && (
              <button
                onClick={() => {
                  setCategoriaSeleccionada(null);
                  setSubcategoriaSeleccionada(null);
                }}
                className="btnLimpiarFiltros"
              >
                Limpiar filtros
              </button>
            )}
          </aside>
        )}

        {/* PRODUCTOS */}
        <main className="mainCatalogo" style={!configuracion.mostrarFiltros ? { marginLeft: '0' } : {}}>
          {loading ? (
            <div className="loaderContainer">
              <div className="loader"></div>
              <p>Cargando productos...</p>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <p>No hay productos para estos filtros.</p>
          ) : (
            <>
              <div
                className="gridProductos"
                ref={sliderRef}
                onScroll={isMobile ? handleScroll : undefined}
                role={isMobile ? "list" : undefined}
              >
                {productosFiltrados.map((prod) => (
                  <div
                    key={prod.id}
                    className="cardProducto"
                    onClick={() => abrirDetalleProducto(prod)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") abrirDetalleProducto(prod);
                    }}
                  >
                    <Image
                      src={prod.imagen}
                      alt={prod.nombre}
                      width={200}
                      height={140}
                      className="imgProducto"
                      priority={false}
                      style={{ cursor: "pointer" }}
                    />
                    <h3>{prod.nombre}</h3>
                    <p className="desc" style={{ 
                      whiteSpace: 'pre-line',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {truncarDescripcion(prod.descripcion)}
                    </p>
                    <p className="precio">Lps {prod.precio.toFixed(2)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(prod);
                      }}
                      className="botonAgregar"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                ))}
              </div>

              {/* Puntitos paginación en móvil */}
              {isMobile && productosFiltrados.length > 1 && (
                <div className="paginacionPuntitos">
                  {productosFiltrados.map((_, i) => (
                    <span
                      key={i}
                      className={i === paginaActual ? "puntito activo" : "puntito"}
                      onClick={() => {
                        if (!sliderRef.current) return;
                        const slideWidth = sliderRef.current.firstChild?.offsetWidth || 0;
                        const gap = 16;
                        sliderRef.current.scrollTo({
                          left: i * (slideWidth + gap),
                          behavior: "smooth",
                        });
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL DETALLE PRODUCTO */}
      {productoDetalle && (
        <div className="modalFondo" onClick={cerrarDetalleProducto}>
          <div className="modalDetalle" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={cerrarDetalleProducto}
              className="cerrarBtn"
              aria-label="Cerrar detalle producto"
            >
              <FaTimes />
            </button>
            <div className="detalleContenido">
              <img
                src={productoDetalle.imagen}
                alt={productoDetalle.nombre}
                className="detalleImagen"
              />
              <div className="detalleTexto">
                <h2>{productoDetalle.nombre}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{productoDetalle.descripcion}</p>
                <p className="precioDetalle">Lps {productoDetalle.precio.toFixed(2)}</p>
                <button
                  onClick={() => {
                    handleAddToCart(productoDetalle);
                    cerrarDetalleProducto();
                  }}
                  className="botonAgregar"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN CARRITO FLOTANTE */}
      {configuracion.mostrarCarrito && carrito.length > 0 && (
        <button
          onClick={() => setModalCarritoAbierto(true)}
          className="botonCarritoFlotante"
          aria-label="Abrir carrito"
        >
          <FaShoppingCart size={24} />
          <span className="contadorCarrito">{totalProductos}</span>
        </button>
      )}

      {/* MODAL CARRITO */}
      {modalCarritoAbierto && (
        <div className="modalFondo" onClick={() => setModalCarritoAbierto(false)}>
          <div className="modalContenido" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalCarritoAbierto(false)}
              className="cerrarBtn"
              aria-label="Cerrar carrito"
            >
              <FaTimes />
            </button>
            <h3 style={{ marginBottom: "1rem" }}>🛒 Mi Carrito</h3>

            {carrito.length === 0 ? (
              <p>No hay productos en el carrito.</p>
            ) : (
              <>
                {carrito.map((item) => (
                  <div key={item.id} className="itemCarrito">
                    <span>
                      {item.nombre} x{item.cantidad}
                    </span>
                    <span>Lps {(item.precio * item.cantidad).toFixed(2)}</span>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="botonEliminar"
                      aria-label={`Eliminar ${item.nombre} del carrito`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <hr style={{ margin: "1rem 0" }} />
                <p className="totalCarrito">Total: Lps {totalPrecio.toFixed(2)}</p>
                {configuracion.mostrarWhatsapp && (
                  <button onClick={enviarWhatsApp} className="botonWhatsApp">
                    Enviar pedido por WhatsApp
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
