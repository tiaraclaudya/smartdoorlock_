import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default function Dashboard() {
  const { token, user } = useAuth();

  const [doorStatus, setDoorStatus] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockNote, setUnlockNote] = useState(null);

  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState({ uid: "", owner_name: "" });
  const [cardStatus, setCardStatus] = useState({ state: "idle", message: "" });

  const [logs, setLogs] = useState([]);
  const [logsState, setLogsState] = useState("loading");

  const loadAll = useCallback(async () => {
    try {
      const [statusData, cardsData, logsData] = await Promise.all([
        api.doorStatus(token),
        api.listCards(token),
        api.listLogs(token),
      ]);
      setDoorStatus(statusData.status);
      setCards(cardsData.cards);
      setLogs(logsData.logs);
      setLogsState("idle");
    } catch (err) {
      setLogsState("error");
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleUnlock() {
    setUnlocking(true);
    setUnlockNote(null);
    try {
      const res = await api.unlockDoor(token);
      setUnlockNote({ type: "success", text: res.message });
      setTimeout(loadAll, 1500);
    } catch (err) {
      setUnlockNote({ type: "error", text: err.message });
    } finally {
      setUnlocking(false);
    }
  }

  async function handleAddCard(e) {
    e.preventDefault();
    setCardStatus({ state: "loading", message: "" });
    try {
      await api.addCard(token, cardForm);
      setCardForm({ uid: "", owner_name: "" });
      setCardStatus({ state: "idle", message: "" });
      loadAll();
    } catch (err) {
      setCardStatus({ state: "error", message: err.message });
    }
  }

  async function handleToggleCard(card) {
    try {
      await api.toggleCard(token, card.id, !card.is_active);
      loadAll();
    } catch (err) {
      setCardStatus({ state: "error", message: err.message });
    }
  }

  async function handleDeleteCard(card) {
    if (!confirm(`Hapus kartu milik ${card.owner_name}?`)) return;
    try {
      await api.deleteCard(token, card.id);
      loadAll();
    } catch (err) {
      setCardStatus({ state: "error", message: err.message });
    }
  }

  const isLocked = doorStatus?.is_locked !== false;

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__header">
          <div>
            <p className="eyebrow">Dasbor</p>
            <h1>Kontrol Pintu</h1>
            <p className="dashboard__sub">
              Masuk sebagai <strong>{user?.email}</strong>
            </p>
          </div>
        </div>

        {/* STATUS PINTU + BUKA JARAK JAUH */}
        <section className="panel">
          <div className="panel__door">
            <div>
              <p className="eyebrow">Status pintu</p>
              <h2 className={isLocked ? "door-state door-state--locked" : "door-state door-state--unlocked"}>
                {isLocked ? "Terkunci" : "Baru saja dibuka"}
              </h2>
              <p className="dashboard__sub">Terakhir lapor alat: {formatDate(doorStatus?.last_seen)}</p>
            </div>
            <button className="btn btn--dark btn--lg" onClick={handleUnlock} disabled={unlocking}>
              {unlocking ? "Mengirim perintah..." : "Buka Pintu Sekarang"}
            </button>
          </div>
          {unlockNote && (
            <p className={`form-note ${unlockNote.type === "success" ? "form-note--success" : "form-note--error"}`}>
              {unlockNote.text}
            </p>
          )}
        </section>

        {/* KELOLA KARTU RFID */}
        <section className="panel">
          <p className="eyebrow">Kartu RFID</p>
          <h2>Kartu yang diizinkan</h2>

          <form className="inline-form" onSubmit={handleAddCard}>
            <label>
              UID Kartu
              <input
                type="text"
                required
                value={cardForm.uid}
                onChange={(e) => setCardForm((f) => ({ ...f, uid: e.target.value }))}
                placeholder="Contoh: A1B2C3D4"
              />
            </label>
            <label>
              Nama Pemilik
              <input
                type="text"
                required
                value={cardForm.owner_name}
                onChange={(e) => setCardForm((f) => ({ ...f, owner_name: e.target.value }))}
                placeholder="Contoh: Budi"
              />
            </label>
            <button type="submit" className="btn btn--dark" disabled={cardStatus.state === "loading"}>
              {cardStatus.state === "loading" ? "Menambah..." : "Tambah Kartu"}
            </button>
          </form>
          {cardStatus.state === "error" && <p className="form-note form-note--error">{cardStatus.message}</p>}

          {cards.length === 0 ? (
            <div className="empty-state">
              <p>Belum ada kartu terdaftar.</p>
              <p className="empty-state__sub">Tambahkan UID kartu RFID pertamamu lewat form di atas.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Pemilik</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.id}>
                      <td className="mono">{c.uid}</td>
                      <td>{c.owner_name}</td>
                      <td>
                        <span className={`pill ${c.is_active ? "pill--active" : "pill--inactive"}`}>
                          {c.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="table-actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => handleToggleCard(c)}>
                          {c.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button className="btn btn--ghost btn--sm" onClick={() => handleDeleteCard(c)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RIWAYAT AKSES */}
        <section className="panel">
          <p className="eyebrow">Riwayat</p>
          <h2>Riwayat akses</h2>

          {logsState === "loading" && <p className="page-loading">Memuat riwayat...</p>}
          {logsState === "error" && <p className="form-note form-note--error">Gagal memuat riwayat akses.</p>}

          {logsState === "idle" && logs.length === 0 && (
            <div className="empty-state">
              <p>Belum ada riwayat akses.</p>
              <p className="empty-state__sub">Percobaan tap kartu RFID akan muncul di sini.</p>
            </div>
          )}

          {logsState === "idle" && logs.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Nama</th>
                    <th>Status</th>
                    <th>Sumber</th>
                    <th>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="mono">{log.uid}</td>
                      <td>{log.owner_name || "Tidak dikenal"}</td>
                      <td>
                        <span className={`pill ${log.granted ? "pill--active" : "pill--inactive"}`}>
                          {log.granted ? "Diterima" : "Ditolak"}
                        </span>
                      </td>
                      <td>{log.source === "remote" ? "Jarak jauh" : "Kartu RFID"}</td>
                      <td className="mono">{formatDate(log.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
