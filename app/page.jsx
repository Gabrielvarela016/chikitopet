"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import GroomingSlider from "../components/GroomingSlider";
import { FaShoppingCart, FaTimes } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

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

  // Modal producto
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Modal carrito
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false);

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

  // Función renderProductos actualizada con los puntos decorativos móviles
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
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Triángulo izquierdo */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "-30px",
              width: 0,
              height: 0,
              borderTop: "20px solid transparent",
              borderBottom: "20px solid transparent",
              borderRight: "30px solid white",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
          {/* Triángulo derecho */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              right: "-30px",
              width: 0,
              height: 0,
              borderTop: "20px solid transparent",
              borderBottom: "20px solid transparent",
              borderLeft: "30px solid white",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />

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
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Triángulo izquierdo */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "-30px",
              width: 0,
              height: 0,
              borderTop: "20px solid transparent",
              borderBottom: "20px solid transparent",
              borderRight: "30px solid #4cae33",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
          {/* Triángulo derecho */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              right: "-30px",
              width: 0,
              height: 0,
              borderTop: "20px solid transparent",
              borderBottom: "20px solid transparent",
              borderLeft: "30px solid #4cae33",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />

          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{titulo}</h2>
          <p>No hay productos disponibles.</p>
        </section>
      );
    }

    // Aquí está la modificación: si es móvil, mostrar todos los productos; si no, mostrar según showAll o solo 4
    const mostrarProductos = isMobile
      ? productos
      : showAll[key]
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
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Triángulo izquierdo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "-30px",
            width: 0,
            height: 0,
            borderTop: "20px solid transparent",
            borderBottom: "20px solid transparent",
            borderRight: "30px solid #4cae33",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        />
        {/* Triángulo derecho */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            right: "-30px",
            width: 0,
            height: 0,
            borderTop: "20px solid transparent",
            borderBottom: "20px solid transparent",
            borderLeft: "30px solid #4cae33",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        />

        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{titulo}</h2>

        {isMobile ? (
          <Swiper
            key={`swiper-${key}-${showAll[key]}`}
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 60000, disableOnInteraction: false }}
            loop={true}
            style={{ paddingBottom: "2rem" }}
          >
            {mostrarProductos.map((producto) => (
              <SwiperSlide key={producto.id}>
                <div
                  style={cardProducto}
                  onClick={() =>
                    setProductoSeleccionado(producto) || setModalProductoAbierto(true)
                  }
                >
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    width={300}
                    height={180}
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
                    LPS{producto.precio.toFixed(2)}
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
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div
            className="gridProductos"
            style={{
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(4, 1fr)",
              maxHeight: showAll[key] ? "none" : "600px",
              overflowY: showAll[key] ? "visible" : "auto",
              transition: "max-height 0.3s ease",
            }}
          >
            {mostrarProductos.map((producto) => (
              <div
                key={producto.id}
                style={cardProducto}
                onClick={() =>
                  setProductoSeleccionado(producto) || setModalProductoAbierto(true)
                }
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
                  LPS{producto.precio.toFixed(2)}
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
        )}

        {/* Botón Ver más sólo para escritorio */}
        {productos.length > 4 && !isMobile && (
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

        {/* Puntos decorativos sólo en móvil */}
        {isMobile && (
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "1rem",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#4cae33",
                  opacity: 0.7,
                }}
              />
            ))}
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

              {/* Icono flotante carrito */}
      <div
        onClick={() => setModalCarritoAbierto(true)}
        style={iconoCarrito}
        aria-label={`Abrir carrito de compras con ${carrito.reduce((total, item) => total + item.cantidad, 0)} productos`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setModalCarritoAbierto(true);
        }}
      >
        <FaShoppingCart size={28} />
        {carrito.reduce((total, item) => total + item.cantidad, 0) > 0 && (
          <span style={contadorEstilo} aria-live="polite">
            {carrito.reduce((total, item) => total + item.cantidad, 0)}
          </span>
        )}
      </div>

      {/* Modal carrito */}
      {modalCarritoAbierto && (
        <div
          style={modalFondo}
          onClick={() => setModalCarritoAbierto(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalCarritoTitulo"
        >
          <div
            style={modalContenido}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <button
              style={cerrarBtn}
              onClick={() => setModalCarritoAbierto(false)}
              aria-label="Cerrar carrito"
            >
              <FaTimes />
            </button>
            <h2 id="modalCarritoTitulo">Carrito de compras</h2>
            {carrito.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {carrito.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        marginBottom: "1rem",
                        position: "relative",
                        paddingRight: "2rem",
                      }}
                    >
                      <strong>{item.nombre}</strong> x {item.cantidad} - $
                      {(item.precio * item.cantidad).toFixed(2)}
                      <button
                        style={botonEliminar}
                        onClick={() => handleRemoveFromCart(item.id)}
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    marginTop: "1rem",
                  }}
                >
                  Total: ${totalPrecio.toFixed(2)}
                </p>
                <a
                  href={`https://wa.me/50493937936?text=${encodeURIComponent(
                    `Hola, quiero hacer un pedido:\n${carrito
                      .map(
                        (item) =>
                          `- ${item.nombre} x${item.cantidad} = $${(
                            item.precio * item.cantidad
                          ).toFixed(2)}`
                      )
                      .join("\n")}\nTotal: LPS{totalPrecio.toFixed(2)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button style={botonWhatsApp} aria-label="Enviar pedido por WhatsApp">
                    Ordenar por WhatsApp
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal producto individual */}
      {modalProductoAbierto && productoSeleccionado && (
        <div
          style={modalFondo}
          onClick={() => setModalProductoAbierto(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalProductoTitulo"
        >
          <div
            style={modalContenido}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <button
              style={cerrarBtn}
              onClick={() => setModalProductoAbierto(false)}
              aria-label="Cerrar producto"
            >
              <FaTimes />
            </button>
            <Image
              src={productoSeleccionado.imagen}
              alt={productoSeleccionado.nombre}
              width={400}
              height={300}
              style={{ objectFit: "contain", borderRadius: "12px" }}
              priority
            />
            <h2 id="modalProductoTitulo">{productoSeleccionado.nombre}</h2>
            <p>{productoSeleccionado.descripcion}</p>
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.3rem",
                marginTop: "0.5rem",
              }}
            >
              LPS{productoSeleccionado.precio.toFixed(2)}
            </p>
            <button
              onClick={() => {
                handleAddToCart(productoSeleccionado);
                setModalProductoAbierto(false);
              }}
              style={{
                backgroundColor: "#4cae33",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                fontWeight: "700",
                marginTop: "1rem",
              }}
              aria-label="Añadir producto al carrito"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      )}
    </>
  );
}
