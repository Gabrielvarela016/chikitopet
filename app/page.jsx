"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import GroomingSlider from "../components/GroomingSlider";
import { FaShoppingCart, FaTimes } from "react-icons/fa";

export default function HomePage() {
  const [comidaProductos, setComidaProductos] = useState([]);
  const [medicamentosProductos, setMedicamentosProductos] = useState([]);
  const [jardineriaProductos, setJardineriaProductos] = useState([]);
  const [mascotaProductos, setMascotaProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  const [loading, setLoading] = useState({
    comida: true,
    medicamentos: true,
    jardineria: true,
    mascota: true,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState({
    comida: false,
    medicamentos: false,
    jardineria: false,
    mascota: false,
  });

  // Para los indicadores de paginación horizontal en móvil (productos)
  const refsSecciones = {
    comida: useRef(null),
    medicamentos: useRef(null),
    jardineria: useRef(null),
    mascota: useRef(null),
  };
  const [indiceVisible, setIndiceVisible] = useState({
    comida: 0,
    medicamentos: 0,
    jardineria: 0,
    mascota: 0,
  });

  // Para modal producto
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Para modal carrito
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false);
  const refCarrito = useRef(null);
  const [indiceVisibleCarrito, setIndiceVisibleCarrito] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchProductos(nombreColeccion, setProductos, key) {
      setLoading((prev) => ({ ...prev, [key]: true }));
      try {
        const querySnapshot = await getDocs(collection(db, nombreColeccion));
        const productos = [];
        querySnapshot.forEach((doc) =>
          productos.push({ id: doc.id, ...doc.data() })
        );
        setProductos(productos);
      } catch (error) {
        console.error(`Error cargando ${key}:`, error);
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    }

    fetchProductos("comida", setComidaProductos, "comida");
    fetchProductos("medicamentos", setMedicamentosProductos, "medicamentos");
    fetchProductos("jardineria", setJardineriaProductos, "jardineria");
    fetchProductos("mascota", setMascotaProductos, "mascota");
  }, []);

  const handleAddToCart = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // Para manejar scroll horizontal y actualizar el índice visible (productos)
  const onScrollHorizontal = (key) => {
    const contenedor = refsSecciones[key].current;
    if (!contenedor) return;
    const scrollLeft = contenedor.scrollLeft;
    const width = contenedor.clientWidth;
    const nuevoIndice = Math.round(scrollLeft / width);
    setIndiceVisible((prev) => ({ ...prev, [key]: nuevoIndice }));
  };

  // Para scroll horizontal carrito
  const onScrollCarrito = () => {
    const contenedor = refCarrito.current;
    if (!contenedor) return;
    const scrollLeft = contenedor.scrollLeft;
    const width = contenedor.clientWidth;
    const nuevoIndice = Math.round(scrollLeft / width);
    setIndiceVisibleCarrito(nuevoIndice);
  };

  // Abrir/cerrar modales
  const abrirModalProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalProductoAbierto(true);
  };
  const cerrarModalProducto = () => {
    setModalProductoAbierto(false);
    setProductoSeleccionado(null);
  };
  const abrirModalCarrito = () => setModalCarritoAbierto(true);
  const cerrarModalCarrito = () => setModalCarritoAbierto(false);


  const cardProducto = {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  };

  const botonEliminar = {
    background: "transparent",
    border: "none",
    color: "red",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "1.2rem",
    lineHeight: "1",
    position: "absolute",
    top: "8px",
    right: "8px",
  };

  const botonWhatsApp = {
    marginTop: "1rem",
    backgroundColor: "#25d366",
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    cursor: "pointer",
    color: "white",
    fontWeight: "700",
    fontSize: "1.1rem",
  };

  const modalFondo = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const modalContenido = {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: "1.5rem",
    borderRadius: "12px",
    color: "white",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 0 15px #4cae33",
  };

  const cerrarBtn = {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
  };

  const iconoCarrito = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "56px",
    height: "56px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
    zIndex: 9999,
    borderRadius: "50%",
  };

  const contadorEstilo = {
    position: "absolute",
    top: "6px",
    right: "6px",
    backgroundColor: "#4cae33",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "0.9rem",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const totalPrecio = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const renderProductos = (productos, loading, titulo, key) => {
    if (loading) {
      return (
        <section
          id={key}
          style={{
            minHeight: "40vh",
            padding: "2rem",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "white",
            borderRadius: "12px",
            margin: "2rem",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{titulo}</h2>
          <p>Cargando productos...</p>
        </section>
      );
    }

    if (productos.length === 0) {
      return (
        <section
          id={key}
          style={{
            minHeight: "40vh",
            padding: "2rem",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "white",
            borderRadius: "12px",
            margin: "2rem",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{titulo}</h2>
          <p>No hay productos disponibles.</p>
        </section>
      );
    }

    if (isMobile) {
      // Mostrar todos los productos en móvil con scroll horizontal y dots
      const mostrarProductos = productos;

      return (
        <section
          id={key}
          style={{
            padding: "1rem",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "white",
            borderRadius: "12px",
            margin: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >

          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{titulo}</h2>

          <div
            ref={refsSecciones[key]}
            onScroll={() => onScrollHorizontal(key)}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              gap: "1rem",
              touchAction: "pan-x",
              userSelect: "none",
              width: "100%",
            }}
            className="no-scrollbar"
          >
            {mostrarProductos.map((producto) => (
              <div
                key={producto.id}
                style={{
                  ...cardProducto,
                  minWidth: "100%",
                  scrollSnapAlign: "center",
                }}
                onClick={() => abrirModalProducto(producto)}
              >
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={280}
                  height={200}
                  style={{ objectFit: "contain", borderRadius: "8px" }}
                  priority
                />
                <h3 style={{ margin: "1rem 0 0.5rem 0" }}>{producto.nombre}</h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    textAlign: "center",
                    minHeight: "3rem",
                  }}
                >
                  {producto.descripcion}
                </p>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    margin: "0.5rem 0",
                  }}
                >
                  ${producto.precio.toFixed(2)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(producto);
                  }}
                  style={{
                    backgroundColor: "#4cae33",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Añadir al carrito
                </button>
              </div>
            ))}
          </div>

          {/* Dots indicadores */}
          {mostrarProductos.length > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "0.75rem",
                gap: "8px",
              }}
            >
              {mostrarProductos.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      indiceVisible[key] === i
                        ? "#4cae33"
                        : "rgba(255,255,255,0.4)",
                    transition: "background-color 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const contenedor = refsSecciones[key].current;
                    if (!contenedor) return;
                    contenedor.scrollTo({
                      left: i * contenedor.clientWidth,
                      behavior: "smooth",
                    });
                  }}
                  aria-label={`Ir al producto ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      );
    }

    // Desktop version (muestra sólo primeros 4 o todos si showAll es true)
    const mostrarProductos = showAll[key]
      ? productos
      : productos.slice(0, 4);

    return (
      <section
        id={key}
        style={{
          minHeight: "40vh",
          padding: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          color: "white",
          borderRadius: "12px",
          margin: "2rem",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{titulo}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {mostrarProductos.map((producto) => (
            <div
              key={producto.id}
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "1rem",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={() => abrirModalProducto(producto)}
            >
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                width={180}
                height={120}
                style={{ objectFit: "contain", borderRadius: "8px" }}
                priority
              />
              <h3 style={{ margin: "1rem 0 0.5rem 0" }}>{producto.nombre}</h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  textAlign: "center",
                  minHeight: "3rem",
                }}
              >
                {producto.descripcion}
              </p>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  margin: "0.5rem 0",
                }}
              >
                ${producto.precio.toFixed(2)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(producto);
                }}
                style={{
                  backgroundColor: "#4cae33",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>

        {productos.length > 4 && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={() => setShowAll((prev) => ({ ...prev, [key]: !prev[key] }))}
              style={{
                backgroundColor: "transparent",
                border: "2px solid white",
                color: "white",
                borderRadius: "8px",
                padding: "0.4rem 1rem",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4cae33";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "#4cae33";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "white";
              }}
              aria-label={showAll[key] ? "Ver menos productos" : "Ver más productos"}
            >
              {showAll[key] ? "- Ver menos" : "+ Ver más"}
            </button>
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      {/* Banner principal adaptativo */}
      <Image
        src={isMobile ? "/banner1-mobile.png" : "/banner1.png"}
        alt="Banner Chikito Pet"
        width={1920}
        height={600}
        style={{ width: "100%", height: "auto", display: "block" }}
        priority
      />

      {/* Secciones de productos */}
      {renderProductos(comidaProductos, loading.comida, "Comida", "comida")}
      {renderProductos(
        medicamentosProductos,
        loading.medicamentos,
        "Medicamentos",
        "medicamentos"
      )}

      {/* GroomingSlider justo debajo de Medicamentos */}
      <GroomingSlider />

      {renderProductos(
        jardineriaProductos,
        loading.jardineria,
        "Jardinería",
        "jardineria"
      )}
      {renderProductos(
        mascotaProductos,
        loading.mascota,
        "Para tu mascota",
        "mascota"
      )}

      {/* Icono carrito flotante */}
      <div style={iconoCarrito} onClick={abrirModalCarrito} aria-label="Abrir carrito">
        <FaShoppingCart size={28} />
        {carrito.length > 0 && (
          <div style={contadorEstilo}>{carrito.reduce((acc, item) => acc + item.cantidad, 0)}</div>
        )}
      </div>

      {/* Modal Producto */}
      {modalProductoAbierto && productoSeleccionado && (
        <div style={modalFondo} onClick={cerrarModalProducto} role="dialog" aria-modal="true">
          <div
            style={modalContenido}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <button
              onClick={cerrarModalProducto}
              style={cerrarBtn}
              aria-label="Cerrar ventana de producto"
            >
              <FaTimes />
            </button>
            <Image
              src={productoSeleccionado.imagen}
              alt={productoSeleccionado.nombre}
              width={500}
              height={350}
              style={{ objectFit: "contain", borderRadius: "12px" }}
              priority
            />
            <h2 style={{ marginTop: "1rem" }}>{productoSeleccionado.nombre}</h2>
            <p style={{ marginTop: "0.5rem" }}>{productoSeleccionado.descripcion}</p>
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.3rem",
                marginTop: "0.75rem",
                color: "#4cae33",
              }}
            >
              ${productoSeleccionado.precio.toFixed(2)}
            </p>
            <button
              onClick={() => {
                handleAddToCart(productoSeleccionado);
                cerrarModalProducto();
              }}
              style={{
                backgroundColor: "#4cae33",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontWeight: "600",
                marginTop: "1rem",
              }}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      )}

      {/* Modal Carrito */}
      {modalCarritoAbierto && (
        <div style={modalFondo} onClick={cerrarModalCarrito} role="dialog" aria-modal="true">
          <div
            style={{
              ...modalContenido,
              maxWidth: isMobile ? "90vw" : "500px",
              maxHeight: isMobile ? "70vh" : "80vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={cerrarModalCarrito}
              style={cerrarBtn}
              aria-label="Cerrar ventana del carrito"
            >
              <FaTimes />
            </button>

            {carrito.length === 0 ? (
              <p>No hay productos en el carrito.</p>
            ) : (
              <>
                {/* Productos en carrito - scroll horizontal en móvil */}
                <div
                  ref={refCarrito}
                  onScroll={onScrollCarrito}
                  style={{
                    display: "flex",
                    overflowX: isMobile ? "auto" : "visible",
                    scrollSnapType: isMobile ? "x mandatory" : "none",
                    gap: "1rem",
                    userSelect: "none",
                    width: "100%",
                  }}
                  className="no-scrollbar"
                >
                  {carrito.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        position: "relative",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        padding: "1rem",
                        minWidth: isMobile ? "100%" : "auto",
                        scrollSnapAlign: isMobile ? "center" : "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        style={botonEliminar}
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                      >
                        &times;
                      </button>
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        width={200}
                        height={140}
                        style={{ objectFit: "contain", borderRadius: "8px" }}
                        priority
                      />
                      <h3 style={{ marginTop: "0.5rem" }}>{item.nombre}</h3>
                      <p>
                        Cantidad: <strong>{item.cantidad}</strong>
                      </p>
                      <p>
                        Precio unitario: ${item.precio.toFixed(2)}
                      </p>
                      <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>
                        Total: ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Indicadores puntitos carrito móvil */}
                {isMobile && carrito.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "0.75rem",
                      gap: "8px",
                    }}
                  >
                    {carrito.map((_, i) => (
                      <span
                        key={i}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor:
                            indiceVisibleCarrito === i
                              ? "#4cae33"
                              : "rgba(255,255,255,0.4)",
                          transition: "background-color 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const contenedor = refCarrito.current;
                          if (!contenedor) return;
                          contenedor.scrollTo({
                            left: i * contenedor.clientWidth,
                            behavior: "smooth",
                          });
                        }}
                        aria-label={`Ir al producto ${i + 1} del carrito`}
                      />
                    ))}
                  </div>
                )}

                {/* Total general */}
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    marginTop: "1rem",
                    color: "#4cae33",
                  }}
                >
                  Total: ${totalPrecio.toFixed(2)}
                </p>

                <button
                  onClick={() => {
                    let mensaje = "¡Hola! Quisiera hacer el siguiente pedido:\n";
                    carrito.forEach((item) => {
                      mensaje += `- ${item.nombre} x${item.cantidad}\n`;
                    });
                    const whatsappUrl = `https://wa.me/50493937936?text=${encodeURIComponent(
                      mensaje
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  style={botonWhatsApp}
                  aria-label="Enviar pedido por WhatsApp"
                >
                  Enviar pedido por WhatsApp
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* Esconde scrollbar horizontal en móviles */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
