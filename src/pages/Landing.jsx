import { Link } from "react-router-dom";

const FEATURES = [
  {
    tag: "RFID",
    title: "Akses pakai kartu",
    desc: "Cukup tap kartu RFID ke reader, sistem otomatis mengecek apakah kartu itu diizinkan membuka pintu.",
  },
  {
    tag: "Riwayat",
    title: "Semua tercatat",
    desc: "Setiap tap kartu — diterima atau ditolak — tersimpan di database, lengkap dengan waktu dan nama pemilik kartu.",
  },
  {
    tag: "Jarak jauh",
    title: "Buka dari dashboard",
    desc: "Admin bisa membuka pintu langsung dari website ini, tanpa perlu berada di dekat alat.",
  },
];

export default function Landing() {
  return (
    <main>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">ESP32 + RFID + Doorlock</p>
            <h1>
              Smart Door Lock,
              <br />
              kunci pintar untuk pintu kamu.
            </h1>
            <p className="hero__lead">
              Sistem kunci pintu otomatis: tap kartu RFID untuk masuk, semua akses tercatat, dan bisa
              dibuka dari jarak jauh lewat dashboard ini.
            </p>
            <div className="hero__actions">
              <Link to="/login" className="btn btn--dark btn--lg">
                Masuk ke Dashboard
              </Link>
              <Link to="/register" className="btn btn--ghost btn--lg">
                Daftar Admin
              </Link>
            </div>
          </div>

          <aside className="status-card" aria-label="Ringkasan sistem">
            <div className="status-card__row status-card__row--header">
              <span>Ringkasan Sistem</span>
              <span className="status-card__dot" aria-hidden="true" />
            </div>
            <div className="status-card__row">
              <span>Metode akses</span>
              <span className="status-card__value">Kartu RFID</span>
            </div>
            <div className="status-card__row">
              <span>Kontrol jarak jauh</span>
              <span className="status-card__value">Aktif</span>
            </div>
            <div className="status-card__row">
              <span>Pencatatan akses</span>
              <span className="status-card__value">Otomatis</span>
            </div>
            <div className="status-card__row">
              <span>Notifikasi lokal</span>
              <span className="status-card__value">LCD &amp; Buzzer</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Cara kerja</p>
          <h2>Bagaimana sistem ini bekerja</h2>
          <div className="cards">
            {FEATURES.map((f) => (
              <article className="card" key={f.title}>
                <p className="card__tag">{f.tag}</p>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
