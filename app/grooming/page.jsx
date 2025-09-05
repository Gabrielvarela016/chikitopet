"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import {
  FaBath,
  FaCut,
  FaPaw,
  FaSpa,
  FaStethoscope,
  FaCheckCircle,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";

export default function GroomingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    setHasMounted(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const banners = hasMounted
    ? [
        isMobile ? "/grooming1-mobile.png" : "/grooming1.png",
        isMobile ? "/grooming2-mobile.png" : "/grooming2.png",
      ]
    : [];

  return (
    <main
      style={{
        backgroundColor: "#0f8f30",
        minHeight: "100vh",
        padding: "2rem 1rem",
        color: "white",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Slider */}
      <section style={{ maxWidth: "1200px", margin: "auto" }}>
        {hasMounted && (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "2rem",
              position: "relative",
            }}
          >
            {banners.map((src, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={src}
                  alt={`Banner Grooming ${index + 1}`}
                  width={1600}
                  height={600}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  priority
                />
              </SwiperSlide>
            ))}
            <a
              href="https://calendly.com/chikiotogrooming/nueva-reunion"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                backgroundColor: "#25d366",
                color: "white",
                padding: "0.8rem 2rem",
                borderRadius: "9999px",
                fontWeight: "700",
                textDecoration: "none",
                zIndex: 10,
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
            >
              Agendar cita
            </a>
          </Swiper>
        )}
      </section>

      {/* Sección 1 - Descripción principal */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          maxWidth: "1000px",
          margin: "auto",
          padding: "2rem",
          backgroundColor: "#ffffff14",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
        }}
      >
        <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
          Grooming Profesional para Consentir a tu Mascota
        </h1>
        <p>
          En <strong>Chikito Pet</strong>, entendemos que el cuidado estético de
          tu mascota es clave para su bienestar. Nuestro servicio de grooming
          profesional garantiza que tu peludo esté limpio, cómodo y feliz.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <ServiceItem
            icon={<FaBath />}
            text="Baños especializados según el tipo de pelaje"
          />
          <ServiceItem
            icon={<FaCut />}
            text="Corte y cepillado profesional adaptado a cada raza"
          />
          <ServiceItem
            icon={<FaPaw />}
            text="Limpieza de oídos, corte de uñas y control de pulgas"
          />
          <ServiceItem
            icon={<FaSpa />}
            text="Tratamientos relajantes y productos de alta calidad"
          />
        </div>

        <p style={{ marginTop: "2rem" }}>
          Nuestro equipo ofrece un trato amoroso y paciente, asegurando una
          experiencia positiva para cada mascota.
        </p>
      </motion.section>

      {/* Sección 2 - Información */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        style={{
          maxWidth: "1000px",
          margin: "3rem auto",
          padding: "2rem",
          backgroundColor: "#ffffff14",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
          ¿Por qué es importante el grooming?
        </h2>
        <p>
          El aseo regular mejora la salud física y emocional de tu mascota.
          Mantiene su piel limpia, previene enfermedades y mejora el vínculo
          contigo.
        </p>

        <h3 style={{ marginTop: "2rem" }}>Beneficios:</h3>
        <ul style={{ paddingLeft: "0", listStyle: "none" }}>
          <BenefitItem
            icon={<FaStethoscope />}
            title="Salud"
            desc="Previene infecciones, reduce la muda y detecta problemas a tiempo."
          />
          <BenefitItem
            icon={<FaPaw />}
            title="Bienestar"
            desc="Evita enredos y molestias, y mejora el confort diario."
          />
          <BenefitItem
            icon={<FaCheckCircle />}
            title="Vínculo"
            desc="Fortalece la confianza y conexión con tu mascota."
          />
        </ul>

        <h3 style={{ marginTop: "2rem" }}>¿Qué incluye?</h3>
        <p>
          Baño, cepillado, corte de pelo, corte de uñas, limpieza de oídos y
          revisión de piel y pelaje.
        </p>

        <h3 style={{ marginTop: "2rem" }}>¿Por qué un profesional?</h3>
        <p>
          Garantiza seguridad, prevención de problemas y resultados estéticos
          adaptados a cada raza.
        </p>
      </motion.section>

      {/* Botón final */}
      <div style={{ textAlign: "center", margin: "3rem 0" }}>
        <a
          href="https://calendly.com/chikiotogrooming/nueva-reunion"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#25d366",
            color: "white",
            padding: "1rem 3rem",
            borderRadius: "9999px",
            fontWeight: "700",
            fontSize: "1.2rem",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            userSelect: "none",
          }}
        >
          Agendar cita
        </a>
      </div>
    </main>
  );
}

// Componente para servicios con ícono
function ServiceItem({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ffffff22",
        borderRadius: "12px",
        padding: "1rem",
        fontWeight: "500",
      }}
    >
      <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

// Componente para beneficios
function BenefitItem({ icon, title, desc }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "1rem",
      }}
    >
      <span style={{ fontSize: "1.5rem", marginRight: "0.8rem" }}>{icon}</span>
      <div>
        <strong>{title}:</strong> {desc}
      </div>
    </li>
  );
}
