"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function GroomingSlider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const banners = [
    isMobile ? "/grooming1-mobile.png" : "/grooming1.png",
    isMobile ? "/grooming2-mobile.png" : "/grooming2.png",
  ];

  return (
    <section id="grooming" style={{ margin: "2rem", borderRadius: "12px", overflow: "hidden" }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        speed={1000}
        style={{ width: "100%", height: "auto" }}
      >
        {banners.map((src, i) => (
          <SwiperSlide key={i}>
            <Image
              src={src}
              alt={`Grooming banner ${i + 1}`}
              width={1920}
              height={600}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        style={{
          textAlign: "center",
          marginTop: "-40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <a
          href="https://calendly.com/chikiotogrooming/grooming"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            backgroundColor: "#25d366",
            color: "white",
            padding: "0.8rem 2rem",
            borderRadius: "9999px",
            fontWeight: "700",
            textDecoration: "none",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Agendar cita
        </a>
      </div>
    </section>
  );
}
