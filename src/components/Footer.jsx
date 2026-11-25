export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">
          <span className="navbar__brand-mark" aria-hidden="true" />
          Smart Door Lock
        </span>
        <p className="footer__meta">
          Sistem kunci pintu otomatis berbasis ESP32 &amp; RFID — © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
