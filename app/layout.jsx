"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const getActiveSection = () => {
    if (pathname === "/") return "inicio";
    if (pathname.startsWith("/productos")) return "productos";
    if (pathname.startsWith("/grooming")) return "grooming";
    return "";
  };

  const activeSection = getActiveSection();

  return (
    <html lang="es">
      <body>
        <header className="header">
          <nav className="nav">
            <div className="logo">
              <Link
                href="/"
                onClick={handleLinkClick}
                style={{ cursor: "pointer", display: "inline-block" }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo Chikito Pet"
                  width={200}
                  height={60}
                  style={{ objectFit: "contain" }}
                  priority
                />
              </Link>
            </div>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              ☰
            </button>

            <ul className={`menu ${menuOpen ? "open" : ""}`}>
              <li>
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className={activeSection === "inicio" ? "active" : ""}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  onClick={handleLinkClick}
                  className={activeSection === "productos" ? "active" : ""}
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/grooming"
                  onClick={handleLinkClick}
                  className={activeSection === "grooming" ? "active" : ""}
                >
                  Grooming
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="footer">
          
          <p>© 2025 Chikito Pets.</p>

          <div className="redes-footer" aria-label="Redes sociales y contacto">
            <a
              href="https://wa.me/50493937936"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="icon"
            >
              <FaWhatsapp size={24} />
            </a>
            <a
              href="https://www.facebook.com/ChikitopetsHn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="icon"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.instagram.com/chikitopets?igshid=1bnb04kxmqvna"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="icon"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@chikitohn_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="icon"
            >
              <FaTiktok size={24} />
            </a>
          </div>

          <p>
            Desarrollador:{" "}
            <a
              href="mailto:varela.gabriel550@gmail.com"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              varela.gabriel550@gmail.com
            </a>
          </p>

        </footer>

        <style jsx global>{`
          body,
          html {
            margin: 0;
            padding: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background-color: #4cae33;
            color: white;
          }

          .header {
            position: sticky;
            top: 0;
            background: #0f8f30;
            color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }

          .nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 2rem;
            height: 64px;
          }

          .logo {
            display: flex;
            align-items: center;
            height: 100%;
            cursor: pointer;
          }

          .menu-toggle {
            background: none;
            border: none;
            font-size: 2rem;
            color: white;
            cursor: pointer;
            display: none;
          }

          ul.menu {
            list-style: none;
            display: flex;
            gap: 2rem;
            margin: 0;
            padding: 0;
          }

          ul.menu li a {
            color: white;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            padding-bottom: 4px;
            transition: border-bottom 0.3s ease, color 0.3s ease;
            border-bottom: 2px solid transparent;
            cursor: pointer;
          }

          ul.menu li a:hover {
            color: #ffff00;
          }

          ul.menu li a.active {
            border-bottom: 2px solid #ffff00;
            color: #ffff00;
          }

          @media (max-width: 768px) {
            .menu-toggle {
              display: block;
            }

            ul.menu {
              position: absolute;
              top: 64px;
              right: 1.5rem;
              background: #0f8f30;
              flex-direction: column;
              border-radius: 6px;
              padding: 1rem 1.5rem;
              display: none;
              width: 160px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            ul.menu.open {
              display: flex;
            }

            ul.menu li {
              margin-bottom: 1rem;
            }

            ul.menu li:last-child {
              margin-bottom: 0;
            }

            ul.menu li a {
              font-size: 1.1rem;
            }
          }

          .footer {
            margin-top: 4rem;
            padding: 1.5rem;
            background-color: #0f8f30;
            color: white;
            text-align: center;
            font-size: 0.9rem;
          }

          .redes-footer {
            margin-top: 0.5rem;
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            align-items: center;
          }

          .redes-footer a.icon {
            color: white;
            transition: color 0.3s ease;
          }

          .redes-footer a.icon:hover {
            color: #ffff00;
          }
        `}</style>
      </body>
    </html>
  );
}
