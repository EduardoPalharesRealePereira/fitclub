"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Competition {
  id: string;
  name: string;
  description: string;
  photo_url: string | null;
  created_by: string;
  start_date: string;
  end_date: string;
  invite_code: string;
}
interface WorkoutLog {
  id: string;
  user_id: string;
  date: string;
  photo_url: string | null;
  exercise_type: string;
  notes: string;
}
interface Member {
  user_id: string;
  display_name: string;
  log_count: number;
}

const EXERCISE_TYPES = [
  "Musculação 💪", "Corrida 🏃", "Ciclismo 🚴", "Natação 🏊",
  "CrossFit ⚡", "Yoga 🧘", "Pilates 🤸", "Futebol ⚽",
  "Basquete 🏀", "HIIT 🔥", "Caminhada 🚶", "Artes Marciais 🥊",
  "Tênis 🎾", "Voleibol 🏐", "Outro 🏋️",
];

const DAYS_PT  = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const fieldStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: 12,
  background: "#0d1520", border: "1px solid #1a2332", color: "#f0f4f8",
  fontSize: "0.9375rem", outline: "none", boxSizing: "border-box",
};

function fmt(dateStr: string): string {
  if (!dateStr) return "Selecionar data";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function ErrorBox({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div style={{
      color: "#ff6b6b", background: "rgba(255,80,80,0.08)",
      border: "1px solid rgba(255,80,80,0.25)", borderRadius: 10,
      padding: "0.625rem 1rem", fontSize: "0.875rem", marginBottom: "1rem",
    }}>⚠️ {msg}</div>
  );
}

/* ── Date Picker Modal ──────────────────────────────────── */
function DatePickerModal({
  title, selected, minDate, onSelect, onClose,
}: {
  title: string;
  selected: string;
  minDate?: string;
  onSelect: (d: string) => void;
  onClose: () => void;
}) {
  const init = selected ? new Date(selected + "T00:00:00") : new Date();
  const [month, setMonth] = useState(init.getMonth());
  const [year,  setYear]  = useState(init.getFullYear());

  const minD = minDate ? new Date(minDate + "T00:00:00") : null;
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function prevM() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextM() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  function pick(day: number) {
    const s = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    if (minD && new Date(s + "T00:00:00") < minD) return;
    onSelect(s);
    onClose();
  }

  function disabled(day: number) {
    if (!minD) return false;
    return new Date(`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}T00:00:00`) < minD;
  }
  function isSel(day: number) {
    return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}` === selected;
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:480, background:"#0a0f1a", borderRadius:"24px 24px 0 0", padding:"1.5rem 1.25rem 2.5rem", animation:"slideUp 0.25s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
          <h3 style={{ fontWeight:900, fontSize:"1rem" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#8b9bb4", fontSize:"1.625rem", cursor:"pointer", lineHeight:1 }}>×</button>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
          <button onClick={prevM} style={{ background:"none", border:"none", color:"#8b9bb4", fontSize:"1.5rem", cursor:"pointer", padding:"0 0.5rem" }}>‹</button>
          <span style={{ fontWeight:700, fontSize:"1rem" }}>{MONTHS_PT[month]} {year}</span>
          <button onClick={nextM} style={{ background:"none", border:"none", color:"#8b9bb4", fontSize:"1.5rem", cursor:"pointer", padding:"0 0.5rem" }}>›</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.25rem", marginBottom:"0.5rem" }}>
          {DAYS_PT.map(d => <div key={d} style={{ textAlign:"center", fontSize:"0.625rem", fontWeight:700, color:"#4a5568" }}>{d}</div>)}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.375rem" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dis = disabled(day);
            const sel = isSel(day);
            return (
              <button key={i} onClick={() => !dis && pick(day)} style={{
                aspectRatio:"1", borderRadius:10, border:"1.5px solid",
                borderColor: sel ? "#00e5a0" : "#1a2332",
                background: sel ? "rgba(0,229,160,0.18)" : "transparent",
                color: dis ? "#2a3445" : sel ? "#00e5a0" : "#f0f4f8",
                fontWeight: sel ? 800 : 400,
                cursor: dis ? "not-allowed" : "pointer",
                fontSize:"0.875rem",
              }}>{day}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function CompetitionSection({ userId, displayName }: { userId: string; displayName: string }) {
  const supabase = createClient();
  const [view, setView] = useState<"loading"|"none"|"create"|"join"|"active">("loading");
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [logs,    setLogs]    = useState<WorkoutLog[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  // Ranking first, Calendar second
  const [activeTab, setActiveTab] = useState<"ranking"|"calendar">("ranking");

  const [showLogModal, setShowLogModal] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear,  setCalYear]  = useState(new Date().getFullYear());
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Create form
  const [cName,  setCName]  = useState("");
  const [cDesc,  setCDesc]  = useState("");
  const [cStart, setCStart] = useState("");
  const [cEnd,   setCEnd]   = useState("");
  const [groupPhotoFile,    setGroupPhotoFile]    = useState<File | null>(null);
  const [groupPhotoPreview, setGroupPhotoPreview] = useState<string | null>(null);
  const [creating,     setCreating]     = useState(false);
  const [createError,  setCreateError]  = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker,   setShowEndPicker]   = useState(false);

  // Join form
  const [joinCode,  setJoinCode]  = useState("");
  const [joining,   setJoining]   = useState(false);
  const [joinError, setJoinError] = useState("");

  // Log form
  const [logPhotoFile,    setLogPhotoFile]    = useState<File | null>(null);
  const [logPhotoPreview, setLogPhotoPreview] = useState<string | null>(null);
  const [exerciseType, setExerciseType] = useState("");
  const [logNotes,     setLogNotes]     = useState("");
  const [logging,   setLogging]   = useState(false);
  const [logError,  setLogError]  = useState("");

  useEffect(() => { loadCompetition(); }, []);

  /* ── Data loaders ───────────────────────────────────────── */
  async function loadCompetition() {
    const { data: row } = await supabase
      .from("competition_members").select("competition_id")
      .eq("user_id", userId).order("joined_at", { ascending: false }).limit(1).maybeSingle();
    if (!row) { setView("none"); return; }

    const { data: comp } = await supabase.from("competitions").select("*").eq("id", row.competition_id).single();
    if (!comp) { setView("none"); return; }

    setCompetition(comp);
    await Promise.all([loadLogs(comp.id), loadMembers(comp.id)]);
    setView("active");
  }

  async function loadLogs(compId: string) {
    const { data } = await supabase.from("workout_logs").select("*").eq("competition_id", compId);
    setLogs(data || []);
  }

  async function loadMembers(compId: string) {
    const { data: rows } = await supabase.from("competition_members").select("user_id,display_name").eq("competition_id", compId);
    if (!rows) return;
    const { data: lc } = await supabase.from("workout_logs").select("user_id").eq("competition_id", compId);
    const cnt: Record<string,number> = {};
    (lc || []).forEach(l => { cnt[l.user_id] = (cnt[l.user_id] || 0) + 1; });
    setMembers(rows.map(m => ({ ...m, log_count: cnt[m.user_id] || 0 })).sort((a,b) => b.log_count - a.log_count));
  }

  async function uploadPhoto(file: File, folder: string): Promise<string | null> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${userId}-${Date.now()}.${ext}`;
    const { data } = await supabase.storage.from("competition-photos").upload(path, file, { upsert: true });
    if (!data) return null;
    return supabase.storage.from("competition-photos").getPublicUrl(path).data.publicUrl;
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>, setF: (f: File|null)=>void, setP: (s:string|null)=>void) {
    const file = e.target.files?.[0]; if (!file) return;
    setF(file);
    const r = new FileReader(); r.onload = () => setP(r.result as string); r.readAsDataURL(file);
  }

  /* ── Date validation ────────────────────────────────────── */
  function validateDates(): string {
    if (!cStart || !cEnd) return "";
    const start = new Date(cStart + "T00:00:00");
    const end   = new Date(cEnd   + "T00:00:00");
    if (end <= start)                   return "A data de término deve ser posterior ao início.";
    const diff = (end.getTime() - start.getTime()) / 86400000;
    if (diff < 7)                       return "A competição deve ter no mínimo 7 dias.";
    return "";
  }

  // Min end date = start + 7 days
  const minEndDate = cStart ? addDays(cStart, 7) : undefined;

  /* ── Create ─────────────────────────────────────────────── */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const dateErr = validateDates();
    if (!cName.trim() || !cStart || !cEnd) { setCreateError("Preencha nome e datas."); return; }
    if (dateErr) { setCreateError(dateErr); return; }
    setCreating(true); setCreateError("");

    let photoUrl: string | null = null;
    if (groupPhotoFile) photoUrl = await uploadPhoto(groupPhotoFile, "groups");

    const { data: comp, error } = await supabase
      .from("competitions")
      .insert({ name: cName, description: cDesc, photo_url: photoUrl, created_by: userId, start_date: cStart, end_date: cEnd })
      .select().single();

    if (error || !comp) { setCreateError("Erro ao criar. Tente novamente."); setCreating(false); return; }

    await supabase.from("competition_members").insert({ competition_id: comp.id, user_id: userId, display_name: displayName });
    setCompetition(comp);
    setMembers([{ user_id: userId, display_name: displayName, log_count: 0 }]);
    setLogs([]);
    setView("active");
    setCreating(false);
  }

  /* ── Join ───────────────────────────────────────────────── */
  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) { setJoinError("Informe o código."); return; }
    setJoining(true); setJoinError("");

    const { data: comp } = await supabase.from("competitions").select("*").eq("invite_code", joinCode.trim().toUpperCase()).maybeSingle();
    if (!comp) { setJoinError("Código inválido."); setJoining(false); return; }

    const { error } = await supabase.from("competition_members").insert({ competition_id: comp.id, user_id: userId, display_name: displayName });
    if (error?.code === "23505") { setJoinError("Você já está nessa competição."); setJoining(false); return; }

    setCompetition(comp);
    await Promise.all([loadLogs(comp.id), loadMembers(comp.id)]);
    setView("active");
    setJoining(false);
  }

  /* ── Log workout ────────────────────────────────────────── */
  async function handleLogWorkout(e: React.FormEvent) {
    e.preventDefault();
    if (!exerciseType) { setLogError("Selecione o tipo de exercício."); return; }
    if (!competition)  return;
    setLogging(true); setLogError("");

    let photoUrl: string | null = null;
    if (logPhotoFile) photoUrl = await uploadPhoto(logPhotoFile, "workouts");

    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("workout_logs").upsert(
      { competition_id: competition.id, user_id: userId, date: today, photo_url: photoUrl, exercise_type: exerciseType, notes: logNotes },
      { onConflict: "competition_id,user_id,date" }
    );
    if (error) { setLogError("Erro ao registrar. Tente novamente."); setLogging(false); return; }

    await Promise.all([loadLogs(competition.id), loadMembers(competition.id)]);
    setShowLogModal(false);
    setLogPhotoFile(null); setLogPhotoPreview(null);
    setExerciseType(""); setLogNotes("");
    setLogging(false);
  }

  /* ── Invite link ────────────────────────────────────────── */
  function copyInviteLink() {
    if (!competition) return;
    const link = `${window.location.origin}/join?code=${competition.invite_code}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  }

  /* ── Helpers ────────────────────────────────────────────── */
  function getDaysLeft(): number {
    if (!competition) return 0;
    return Math.max(0, Math.ceil((new Date(competition.end_date + "T23:59:59").getTime() - Date.now()) / 86400000));
  }
  function getProgress(): number {
    if (!competition) return 0;
    const s = new Date(competition.start_date).getTime();
    const e = new Date(competition.end_date).getTime();
    return Math.min(100, Math.max(0, ((Date.now() - s) / (e - s)) * 100));
  }
  function buildCalendar() {
    const first = new Date(calYear, calMonth, 1).getDay();
    const days  = new Date(calYear, calMonth + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }

  const myLogs    = logs.filter(l => l.user_id === userId);
  const myLogMap  = new Map(myLogs.map(l => [l.date, l]));
  const todayStr  = new Date().toISOString().split("T")[0];
  const todayLogged = myLogMap.has(todayStr);
  const me        = members.find(m => m.user_id === userId);
  const myRank    = members.findIndex(m => m.user_id === userId) + 1;

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */

  if (view === "loading") return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"5rem 1rem" }}>
      <div style={{ width:36, height:36, border:"3px solid #1a2332", borderTopColor:"#00e5a0", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  /* ── NO COMPETITION ─────────────────────────────────────── */
  if (view === "none") return (
    <div style={{ padding:"1.25rem" }}>
      <div style={{ marginBottom:"2rem" }}>
        <h2 style={{ fontSize:"1.375rem", fontWeight:900, marginBottom:"0.375rem" }}>🏆 Competições</h2>
        <p style={{ fontSize:"0.875rem", color:"#8b9bb4", lineHeight:1.6 }}>Compita com amigos. Cada dia de treino registrado conta um ponto no ranking.</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
        <button onClick={() => setView("create")} style={{ padding:"1.375rem 1.25rem", borderRadius:18, textAlign:"left", cursor:"pointer", background:"linear-gradient(135deg,rgba(0,229,160,0.1),rgba(0,180,216,0.07))", border:"1px solid rgba(0,229,160,0.22)" }}>
          <div style={{ fontSize:"1.75rem", marginBottom:"0.5rem" }}>✨</div>
          <div style={{ fontWeight:800, fontSize:"1rem", color:"#00e5a0", marginBottom:"0.25rem" }}>Criar competição</div>
          <div style={{ fontSize:"0.8125rem", color:"#8b9bb4" }}>Configure um desafio e convide amigos via link</div>
        </button>
        <button onClick={() => setView("join")} style={{ padding:"1.375rem 1.25rem", borderRadius:18, textAlign:"left", cursor:"pointer", background:"#0d1520", border:"1px solid #1a2332" }}>
          <div style={{ fontSize:"1.75rem", marginBottom:"0.5rem" }}>🔗</div>
          <div style={{ fontWeight:800, fontSize:"1rem", color:"#f0f4f8", marginBottom:"0.25rem" }}>Entrar com código</div>
          <div style={{ fontSize:"0.8125rem", color:"#8b9bb4" }}>Cole o código de quem criou a competição</div>
        </button>
      </div>
    </div>
  );

  /* ── CREATE ─────────────────────────────────────────────── */
  if (view === "create") return (
    <div style={{ padding:"1.25rem" }}>
      {showStartPicker && (
        <DatePickerModal
          title="Data de início"
          selected={cStart}
          minDate={todayStr}
          onSelect={d => { setCStart(d); if (cEnd && cEnd < addDays(d,7)) setCEnd(""); }}
          onClose={() => setShowStartPicker(false)}
        />
      )}
      {showEndPicker && (
        <DatePickerModal
          title="Data de término"
          selected={cEnd}
          minDate={minEndDate}
          onSelect={setCEnd}
          onClose={() => setShowEndPicker(false)}
        />
      )}

      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.75rem" }}>
        <button onClick={() => setView("none")} style={{ background:"none", border:"none", color:"#8b9bb4", cursor:"pointer", fontSize:"1.375rem", padding:0, lineHeight:1 }}>←</button>
        <h2 style={{ fontWeight:900, fontSize:"1.25rem" }}>Criar competição</h2>
      </div>

      <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        {/* Group photo */}
        <div>
          <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Foto do grupo</label>
          <label style={{ display:"block", cursor:"pointer" }}>
            <input type="file" accept="image/*" onChange={e => onFileChange(e, setGroupPhotoFile, setGroupPhotoPreview)} style={{ display:"none" }} />
            {groupPhotoPreview
              ? <img src={groupPhotoPreview} alt="group" style={{ width:"100%", height:140, objectFit:"cover", borderRadius:14, border:"1px solid #1a2332" }} />
              : <div style={{ width:"100%", height:100, borderRadius:14, border:"2px dashed #1a2332", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#4a5568", gap:"0.375rem" }}>
                  <span style={{ fontSize:"1.5rem" }}>📷</span>
                  <span style={{ fontSize:"0.8125rem" }}>Adicionar foto (opcional)</span>
                </div>
            }
          </label>
        </div>

        <div>
          <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Nome *</label>
          <input style={fieldStyle} placeholder="Ex: Janeiro em chamas 🔥" value={cName} onChange={e => setCName(e.target.value)} />
        </div>

        <div>
          <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Descrição</label>
          <textarea style={{ ...fieldStyle, resize:"none" } as React.CSSProperties} placeholder="Regras, objetivo..." rows={2} value={cDesc} onChange={e => setCDesc(e.target.value)} />
        </div>

        {/* Date pickers */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
          <div>
            <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Início *</label>
            <button type="button" onClick={() => setShowStartPicker(true)} style={{
              ...fieldStyle, textAlign:"left", cursor:"pointer",
              color: cStart ? "#f0f4f8" : "#4a5568",
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <span>{fmt(cStart)}</span>
              <span style={{ fontSize:"0.875rem", color:"#4a5568" }}>📅</span>
            </button>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Término *</label>
            <button type="button" onClick={() => cStart ? setShowEndPicker(true) : setCreateError("Selecione o início primeiro.")} style={{
              ...fieldStyle, textAlign:"left", cursor:"pointer",
              color: cEnd ? "#f0f4f8" : "#4a5568",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              opacity: cStart ? 1 : 0.5,
            }}>
              <span>{fmt(cEnd)}</span>
              <span style={{ fontSize:"0.875rem", color:"#4a5568" }}>📅</span>
            </button>
          </div>
        </div>

        {cStart && cEnd && (
          <p style={{ fontSize:"0.8125rem", color:"#8b9bb4", marginTop:"-0.25rem" }}>
            ⏱ {Math.ceil((new Date(cEnd+"T00:00:00").getTime()-new Date(cStart+"T00:00:00").getTime())/86400000)} dias de competição
          </p>
        )}

        <ErrorBox msg={createError} />

        <button type="submit" disabled={creating} className="btn-primary" style={{ width:"100%", opacity:creating?0.7:1 }}>
          {creating ? "Criando..." : "Criar e gerar link →"}
        </button>
      </form>
    </div>
  );

  /* ── JOIN ───────────────────────────────────────────────── */
  if (view === "join") return (
    <div style={{ padding:"1.25rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.75rem" }}>
        <button onClick={() => setView("none")} style={{ background:"none", border:"none", color:"#8b9bb4", cursor:"pointer", fontSize:"1.375rem", padding:0, lineHeight:1 }}>←</button>
        <h2 style={{ fontWeight:900, fontSize:"1.25rem" }}>Entrar com código</h2>
      </div>
      <p style={{ fontSize:"0.875rem", color:"#8b9bb4", marginBottom:"1.75rem", lineHeight:1.6 }}>Peça o código de 8 dígitos para quem criou a competição.</p>
      <form onSubmit={handleJoin} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <input
          style={{ ...fieldStyle, fontSize:"1.5rem", fontWeight:900, letterSpacing:"0.25em", textAlign:"center", textTransform:"uppercase" }}
          placeholder="CÓDIGO"
          maxLength={8}
          value={joinCode}
          onChange={e => setJoinCode(e.target.value.toUpperCase())}
        />
        <ErrorBox msg={joinError} />
        <button type="submit" disabled={joining} className="btn-primary" style={{ width:"100%", opacity:joining?0.7:1 }}>
          {joining ? "Entrando..." : "Entrar na competição →"}
        </button>
      </form>
    </div>
  );

  /* ── ACTIVE COMPETITION ─────────────────────────────────── */
  if (!competition) return null;
  const daysLeft = getDaysLeft();
  const progress = getProgress();
  const calendar = buildCalendar();

  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        background: competition.photo_url
          ? `linear-gradient(to bottom,rgba(8,11,16,0.4) 0%,rgba(8,11,16,0.95) 100%),url(${competition.photo_url}) center/cover`
          : "linear-gradient(135deg,rgba(0,229,160,0.1),rgba(0,180,216,0.07))",
        padding:"1.5rem 1.25rem 1.125rem",
        borderBottom:"1px solid #0f1922",
      }}>
        <p style={{ fontSize:"0.625rem", fontWeight:700, color:"#00e5a0", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"0.25rem" }}>Competição ativa</p>
        <h2 style={{ fontSize:"1.375rem", fontWeight:900, letterSpacing:"-0.02em", marginBottom:competition.description?"0.25rem":"0.875rem" }}>{competition.name}</h2>
        {competition.description && <p style={{ fontSize:"0.8125rem", color:"#8b9bb4", marginBottom:"0.875rem" }}>{competition.description}</p>}

        {/* Stats */}
        <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1rem" }}>
          {[
            { v: daysLeft, l:"dias restantes", c: daysLeft>5?"#00e5a0":"#f39c12" },
            { v: members.length, l:"participantes", c:"#00b4d8" },
            { v: myRank>0?`#${myRank}`:"—", l:"seu ranking", c:"#f39c12" },
            { v: me?.log_count??0, l:"seus treinos", c:"#8e44ad" },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, textAlign:"center", background:"rgba(0,0,0,0.35)", borderRadius:12, padding:"0.625rem 0.25rem" }}>
              <div style={{ fontSize:"1.375rem", fontWeight:900, color:s.c, lineHeight:1.1 }}>{s.v}</div>
              <div style={{ fontSize:"0.5rem", color:"#8b9bb4", textTransform:"uppercase", letterSpacing:"0.04em", marginTop:"0.2rem" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom:"1rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.625rem", color:"#4a5568", marginBottom:"0.375rem" }}>
            <span>{competition.start_date}</span>
            <span style={{ color:"#8b9bb4" }}>{Math.round(progress)}% concluído</span>
            <span>{competition.end_date}</span>
          </div>
          <div style={{ height:5, background:"#1a2332", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#00e5a0,#00b4d8)", borderRadius:99, transition:"width 0.6s ease" }} />
          </div>
        </div>

        {/* Invite link button — no code shown */}
        <button onClick={copyInviteLink} style={{
          width:"100%", padding:"0.75rem 1rem", borderRadius:14, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
          transition:"all 0.2s",
          background: linkCopied ? "rgba(0,229,160,0.15)" : "rgba(0,0,0,0.4)",
          border: `1px solid ${linkCopied ? "#00e5a0" : "#1a2332"}`,
          color: linkCopied ? "#00e5a0" : "#8b9bb4",
          fontWeight:700, fontSize:"0.9375rem",
        }}>
          {linkCopied ? "✓ Link copiado! Cole no WhatsApp" : "📲 Copiar link de convite"}
        </button>
      </div>

      {/* ── Tabs: Ranking | Calendário ── */}
      <div style={{ display:"flex", borderBottom:"1px solid #0f1922" }}>
        {[
          { id:"ranking"  as const, label:"🏆 Ranking" },
          { id:"calendar" as const, label:"📅 Calendário" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex:1, padding:"0.875rem", background:"none", border:"none", cursor:"pointer",
            fontWeight:activeTab===t.id?700:500, fontSize:"0.875rem", transition:"all 0.2s",
            color:activeTab===t.id?"#00e5a0":"#8b9bb4",
            borderBottom:activeTab===t.id?"2px solid #00e5a0":"2px solid transparent",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── RANKING ── */}
      {activeTab === "ranking" && (
        <div style={{ padding:"1.25rem" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem", marginBottom:"1.25rem" }}>
            {members.length === 0 && <div style={{ textAlign:"center", padding:"2rem", color:"#8b9bb4" }}>Nenhum participante ainda.</div>}
            {members.map((m, i) => {
              const isMe = m.user_id === userId;
              const medal = i===0?"linear-gradient(135deg,#FFD700,#FFA500)":i===1?"linear-gradient(135deg,#C0C0C0,#A8A8A8)":i===2?"linear-gradient(135deg,#CD7F32,#A0522D)":"#1a2332";
              const maxC = members[0]?.log_count || 1;
              return (
                <div key={m.user_id} style={{
                  display:"flex", alignItems:"center", gap:"0.875rem",
                  padding:"0.875rem 1rem", borderRadius:16,
                  background:isMe?"rgba(0,229,160,0.07)":"#0d1520",
                  border:`1px solid ${isMe?"rgba(0,229,160,0.22)":"#1a2332"}`,
                }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0, background:medal, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:"0.875rem", color:i<3?"#000":"#8b9bb4" }}>{i+1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:"0.9375rem", display:"flex", alignItems:"center", gap:"0.375rem", marginBottom:"0.3rem" }}>
                      <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.display_name}</span>
                      {isMe && <span style={{ fontSize:"0.5625rem", color:"#00e5a0", background:"rgba(0,229,160,0.15)", padding:"0.1rem 0.4rem", borderRadius:4, flexShrink:0 }}>você</span>}
                    </div>
                    <div style={{ height:4, background:"#1a2332", borderRadius:99, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:99, transition:"width 0.6s ease", width:`${(m.log_count/maxC)*100}%`, background:i===0?"linear-gradient(90deg,#FFD700,#FFA500)":"linear-gradient(90deg,#00e5a0,#00b4d8)" }} />
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontWeight:900, fontSize:"1.25rem", color:i===0?"#FFD700":"#f0f4f8" }}>{m.log_count}</div>
                    <div style={{ fontSize:"0.5625rem", color:"#8b9bb4" }}>treinos</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Log workout button always visible in ranking */}
          {todayLogged ? (
            <div style={{ textAlign:"center", padding:"0.875rem", background:"rgba(0,229,160,0.07)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:14 }}>
              <span style={{ color:"#00e5a0", fontWeight:700, fontSize:"0.9375rem" }}>✓ Treino de hoje registrado!</span>
            </div>
          ) : (
            <button onClick={() => setShowLogModal(true)} className="btn-primary" style={{ width:"100%" }}>
              📸 Registrar treino de hoje
            </button>
          )}
        </div>
      )}

      {/* ── CALENDAR ── */}
      {activeTab === "calendar" && (
        <div style={{ padding:"1.25rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
            <button onClick={() => { const d=new Date(calYear,calMonth-1); setCalMonth(d.getMonth()); setCalYear(d.getFullYear()); }} style={{ background:"none", border:"none", color:"#8b9bb4", fontSize:"1.375rem", cursor:"pointer", padding:"0 0.5rem", lineHeight:1 }}>‹</button>
            <span style={{ fontWeight:700, fontSize:"1rem" }}>{MONTHS_PT[calMonth]} {calYear}</span>
            <button onClick={() => { const d=new Date(calYear,calMonth+1); setCalMonth(d.getMonth()); setCalYear(d.getFullYear()); }} style={{ background:"none", border:"none", color:"#8b9bb4", fontSize:"1.375rem", cursor:"pointer", padding:"0 0.5rem", lineHeight:1 }}>›</button>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.25rem", marginBottom:"0.375rem" }}>
            {DAYS_PT.map(d => <div key={d} style={{ textAlign:"center", fontSize:"0.625rem", fontWeight:700, color:"#4a5568" }}>{d}</div>)}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.3rem" }}>
            {calendar.map((day, i) => {
              if (!day) return <div key={i} />;
              const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const log = myLogMap.get(ds);
              const isToday = ds === todayStr;
              const isPast  = ds < todayStr;
              return (
                <button key={i} onClick={() => log ? setSelectedLog(selectedLog?.date===ds?null:log) : undefined} style={{
                  aspectRatio:"1", borderRadius:10, border:"1.5px solid",
                  borderColor: isToday?"#00e5a0":log?"rgba(0,229,160,0.35)":"#1a2332",
                  background: log?"rgba(0,229,160,0.12)":isToday?"rgba(0,229,160,0.06)":"transparent",
                  cursor:log?"pointer":"default",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0.2rem", gap:"0.1rem",
                }}>
                  <span style={{ fontSize:"0.75rem", fontWeight:isToday?900:500, color:log?"#00e5a0":isToday?"#00e5a0":isPast?"#4a5568":"#8b9bb4" }}>{day}</span>
                  {log && <span style={{ fontSize:"0.5rem", lineHeight:1 }}>💪</span>}
                </button>
              );
            })}
          </div>

          {selectedLog && (
            <div style={{ marginTop:"1.25rem", background:"#0d1520", border:"1px solid rgba(0,229,160,0.2)", borderRadius:18, overflow:"hidden" }}>
              {selectedLog.photo_url && <img src={selectedLog.photo_url} alt="workout" style={{ width:"100%", height:180, objectFit:"cover" }} />}
              <div style={{ padding:"1rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.25rem" }}>
                  <span style={{ fontWeight:800, fontSize:"1rem" }}>{selectedLog.exercise_type}</span>
                  <span style={{ fontSize:"0.6875rem", color:"#8b9bb4" }}>· {selectedLog.date}</span>
                </div>
                {selectedLog.notes && <p style={{ fontSize:"0.8125rem", color:"#8b9bb4", marginTop:"0.25rem" }}>{selectedLog.notes}</p>}
              </div>
            </div>
          )}

          <div style={{ marginTop:"1rem", background:"#0d1520", border:"1px solid #1a2332", borderRadius:16, padding:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:"0.75rem", color:"#8b9bb4", marginBottom:"0.25rem" }}>Seus treinos registrados</div>
              <div style={{ fontWeight:900, fontSize:"1.625rem", color:"#00e5a0" }}>{myLogs.length} <span style={{ fontSize:"0.875rem", color:"#8b9bb4", fontWeight:500 }}>dias</span></div>
            </div>
            <div style={{ fontSize:"2.5rem" }}>{myLogs.length===0?"😴":myLogs.length<5?"🔥":myLogs.length<10?"⚡":"🏆"}</div>
          </div>
        </div>
      )}

      {/* ── Log Workout Modal ── */}
      {showLogModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ width:"100%", maxWidth:480, background:"#0a0f1a", borderRadius:"24px 24px 0 0", padding:"1.5rem 1.25rem 2.5rem", maxHeight:"92vh", overflowY:"auto", animation:"slideUp 0.28s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h3 style={{ fontWeight:900, fontSize:"1.125rem" }}>📸 Registrar treino</h3>
              <button onClick={() => { setShowLogModal(false); setLogPhotoFile(null); setLogPhotoPreview(null); setExerciseType(""); setLogNotes(""); setLogError(""); }} style={{ background:"none", border:"none", color:"#8b9bb4", fontSize:"1.625rem", cursor:"pointer", lineHeight:1 }}>×</button>
            </div>

            <form onSubmit={handleLogWorkout} style={{ display:"flex", flexDirection:"column", gap:"1.125rem" }}>
              <div>
                <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Foto do treino</label>
                <label style={{ display:"block", cursor:"pointer" }}>
                  <input type="file" accept="image/*" capture="environment" onChange={e => onFileChange(e, setLogPhotoFile, setLogPhotoPreview)} style={{ display:"none" }} />
                  {logPhotoPreview
                    ? <div style={{ position:"relative" }}>
                        <img src={logPhotoPreview} alt="" style={{ width:"100%", height:190, objectFit:"cover", borderRadius:14, border:"1px solid #1a2332" }} />
                        <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.65)", borderRadius:8, padding:"0.3rem 0.6rem", fontSize:"0.75rem", color:"#fff" }}>trocar</div>
                      </div>
                    : <div style={{ width:"100%", height:120, borderRadius:14, border:"2px dashed #1a2332", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#4a5568", gap:"0.375rem" }}>
                        <span style={{ fontSize:"2rem" }}>📷</span>
                        <span style={{ fontSize:"0.8125rem" }}>Tirar foto ou escolher da galeria</span>
                      </div>
                  }
                </label>
              </div>

              <div>
                <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.625rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Tipo de exercício *</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                  {EXERCISE_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => setExerciseType(t)} style={{
                      padding:"0.4rem 0.75rem", borderRadius:99, cursor:"pointer", transition:"all 0.15s",
                      fontSize:"0.8125rem", fontWeight:exerciseType===t?700:400,
                      border:"1px solid", borderColor:exerciseType===t?"#00e5a0":"#1a2332",
                      background:exerciseType===t?"rgba(0,229,160,0.12)":"transparent",
                      color:exerciseType===t?"#00e5a0":"#8b9bb4",
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#8b9bb4", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Anotações <span style={{ color:"#4a5568", fontWeight:400, textTransform:"none" }}>(opcional)</span></label>
                <textarea style={{ ...fieldStyle, resize:"none" } as React.CSSProperties} placeholder="PR novo, como foi..." rows={2} value={logNotes} onChange={e => setLogNotes(e.target.value)} />
              </div>

              <ErrorBox msg={logError} />

              <button type="submit" disabled={logging} className="btn-primary" style={{ width:"100%", opacity:logging?0.7:1 }}>
                {logging ? "Registrando..." : "✓ Confirmar treino"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
