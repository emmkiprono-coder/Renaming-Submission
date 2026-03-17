import { useState } from "react";

/* ───────── JSONBin config ───────── */
const JSONBIN_API_KEY = "$2a$10$M6W9ulyMKcxTdIcDcjhuVOm12ccNO2UeYG9e581pkl4mA3aX5Dvu.";
const SUBMISSIONS_BIN = "69ae1210ae596e708f6e5f1e";

async function saveSubmission(entry: Record<string, unknown>) {
  /* 1. Read current array */
  const getRes = await fetch(`https://api.jsonbin.io/v3/b/${SUBMISSIONS_BIN}/latest`, {
    headers: { "X-Access-Key": JSONBIN_API_KEY },
  });
  if (!getRes.ok) throw new Error(`Read failed: ${getRes.status}`);
  const data = await getRes.json();
  const existing: unknown[] = Array.isArray(data.record) ? data.record : [];

  /* 2. Append new entry (filter out _init placeholder) */
  const cleaned = existing.filter(
    (r: any) => !(r && typeof r === "object" && "_init" in r)
  );
  cleaned.push({ ...entry, submittedAt: new Date().toISOString() });

  /* 3. Write back */
  const putRes = await fetch(`https://api.jsonbin.io/v3/b/${SUBMISSIONS_BIN}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": JSONBIN_API_KEY,
    },
    body: JSON.stringify(cleaned),
  });
  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(err.message || `Save failed: ${putRes.status}`);
  }
}

/* ───────── types ───────── */
interface FormData {
  fullName: string;
  department: string;
  proposedName: string;
  rationale: string;
  unification: string;
  realWorldTest: string;
  culturalSignificance: string;
  tagline: string;
}

const empty: FormData = {
  fullName: "",
  department: "",
  proposedName: "",
  rationale: "",
  unification: "",
  realWorldTest: "",
  culturalSignificance: "",
  tagline: "",
};

const REQUIRED: (keyof FormData)[] = [
  "fullName",
  "department",
  "proposedName",
  "rationale",
  "unification",
  "realWorldTest",
];

const PILLARS = [
  { label: "Limited English Proficient", bg: "#dbeafe", text: "#2563eb", border: "#93c5fd" },
  { label: "Deaf & Hard of Hearing", bg: "#ede9fe", text: "#7c3aed", border: "#c4b5fd" },
  { label: "Literacy Challenged", bg: "#ccfbf1", text: "#0d9488", border: "#5eead4" },
  { label: "Sensory Impaired", bg: "#fef3c7", text: "#d97706", border: "#fcd34d" },
];

/* ───────── tiny components ───────── */

function Dot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#6366f1",
        marginLeft: 4,
        verticalAlign: "super",
        fontSize: 0,
      }}
    />
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 40 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i <= current ? 12 : 8,
            height: i <= current ? 12 : 8,
            borderRadius: "50%",
            background:
              i < current
                ? "linear-gradient(135deg, #6366f1, #0ea5e9)"
                : i === current
                ? "#a5b4fc"
                : "#d1d5db",
            transition: "all 0.4s ease",
            boxShadow: i < current ? "0 2px 8px rgba(99,102,241,0.35)" : "none",
          }}
        />
      ))}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>
        {label}
        {required && <Dot />}
      </label>
      {hint && (
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, lineHeight: 1.5 }}>{hint}</p>
      )}
      {children}
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontWeight: 500 }}>
          This field is required.
        </p>
      )}
    </div>
  );
}

/* ───────── app ───────── */

const SUBMISSIONS_OPEN = false;

export default function App() {
  if (!SUBMISSIONS_OPEN) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)", padding: "2rem", fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif' }}>
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e0e7ff", padding: "3rem 2.5rem", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(99,102,241,0.08)" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1e293b", margin: "0 0 0.75rem" }}>Submissions are now closed</h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: "0 0 2rem" }}>
            Thank you to everyone who submitted a department name. We received your entries and the naming committee has completed its review.
          </p>
          
            href="https://ls-renaming-lets-vote-bubj.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#4f46e5", color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 500, padding: "0.7rem 1.75rem", borderRadius: 12 }}
          >
            Cast your vote
          </a>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "1.25rem 0 0" }}>Voting is now open — every voice counts.</p>
        </div>
      </div>
    );
  }

  const [form, setForm] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: false }));
    };

  const filled = REQUIRED.filter((k) => form[k].trim().length > 0).length;

  const submit = async () => {
    const errs: typeof errors = {};
    let bad = false;
    for (const k of REQUIRED) {
      if (!form[k].trim()) {
        errs[k] = true;
        bad = true;
      }
    }
    if (bad) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await saveSubmission(form);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const FONT =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

  const inputStyle = (error?: boolean): React.CSSProperties => ({
    width: "100%",
    borderRadius: 14,
    border: `1.5px solid ${error ? "#fca5a5" : "#c7d2fe"}`,
    background: error ? "#fef2f2" : "rgba(255,255,255,0.7)",
    padding: "12px 16px",
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  });

  const textareaStyle = (error?: boolean): React.CSSProperties => ({
    ...inputStyle(error),
    resize: "none" as const,
    lineHeight: 1.6,
  });

  const cardStyle = (gradient: string): React.CSSProperties => ({
    background: gradient,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.6)",
    padding: 28,
    marginBottom: 20,
    boxShadow: "0 1px 3px rgba(99,102,241,0.06), 0 4px 16px rgba(99,102,241,0.04)",
  });

  /* ── success state ── */
  if (submitted) {
    return (
      <div
        style={{
          fontFamily: FONT,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "linear-gradient(150deg, #e0e7ff 0%, #ccfbf1 50%, #fae8ff 100%)",
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: "100%",
            textAlign: "center",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.8)",
            padding: 48,
            boxShadow: "0 8px 32px rgba(99,102,241,0.1)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d1fae5, #ccfbf1)",
              border: "1px solid #6ee7b7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", marginBottom: 8, letterSpacing: -0.5 }}>
            Submission received.
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Thank you, <span style={{ color: "#1e293b", fontWeight: 600 }}>{form.fullName}</span>.
            You'll be notified when the Unity Committee announces the finalists.
          </p>
          <div
            style={{
              background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              textAlign: "left",
              border: "1px solid #c7d2fe",
            }}
          >
            <p style={{ fontSize: 10, color: "#6366f1", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>
              Your Proposed Name
            </p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{form.proposedName}</p>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>
            Bridging languages and cultures — connecting patients to information and services at the desired time, in the optimal place, through appropriate modalities.
          </p>
        </div>
      </div>
    );
  }

  /* ── main form ── */
  return (
    <div
      style={{
        fontFamily: FONT,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e0e7ff 0%, #ede9fe 15%, #f5f3ff 30%, #f0fdfa 50%, #ecfdf5 65%, #fdf4ff 80%, #fae8ff 100%)",
      }}
    >
      {/* ── nav bar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(224,231,255,0.75)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(199,210,254,0.5)",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 24px",
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: 1.5, textTransform: "uppercase" }}>
            Advocate Health
          </span>
          <span style={{ fontSize: 11, color: "#818cf8", fontWeight: 500 }}>Language Services</span>
        </div>
      </nav>

      {/* ── hero ── */}
      <header style={{ paddingTop: 64, paddingBottom: 40, textAlign: "center", paddingLeft: 24, paddingRight: 24 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
            color: "white",
            padding: "6px 16px",
            borderRadius: 100,
            marginBottom: 16,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Name Our Team
        </div>
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 52px)",
            fontWeight: 800,
            color: "#1e1b4b",
            letterSpacing: -1.5,
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          One Team, One Voice.
        </h1>
        <p style={{ color: "#6b7280", fontSize: 16, maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
          Help us choose a name that honors the patients, families, and communities we serve.
        </p>
      </header>

      {/* ── mission ── */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", marginBottom: 40 }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(224,231,255,0.6), rgba(204,251,241,0.4), rgba(237,233,254,0.5))",
            backdropFilter: "blur(16px)",
            borderRadius: 20,
            border: "1px solid rgba(165,180,252,0.3)",
            padding: 28,
            boxShadow: "0 4px 20px rgba(99,102,241,0.06)",
          }}
        >
          <p
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 3,
              fontWeight: 800,
              marginBottom: 12,
              background: "linear-gradient(135deg, #6366f1, #0d9488)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Mission
          </p>
          <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
            The Language Services Department exists to{" "}
            <span style={{ color: "#1e293b", fontWeight: 700 }}>bridge languages and cultures</span>{" "}
            by connecting{" "}
            <span style={{ color: "#2563eb", fontWeight: 600 }}>Limited English Proficient</span>,{" "}
            <span style={{ color: "#7c3aed", fontWeight: 600 }}>Deaf</span>,{" "}
            <span style={{ color: "#7c3aed", fontWeight: 600 }}>Hard of Hearing</span>,{" "}
            <span style={{ color: "#0d9488", fontWeight: 600 }}>Literacy Challenged</span>, and{" "}
            <span style={{ color: "#d97706", fontWeight: 600 }}>Sensory Impaired</span>{" "}
            patients, family members, and companions to information and services — at the{" "}
            <span style={{ color: "#1e293b", fontWeight: 600 }}>desired time</span>, in the{" "}
            <span style={{ color: "#1e293b", fontWeight: 600 }}>optimal place</span>, utilizing{" "}
            <span style={{ color: "#1e293b", fontWeight: 600 }}>appropriate modalities</span> — to
            provide an effective means of communication at no cost.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PILLARS.map((p) => (
              <span
                key={p.label}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 100,
                  padding: "5px 14px",
                  background: p.bg,
                  color: p.text,
                  border: `1px solid ${p.border}`,
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── quote ── */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", marginBottom: 40 }}>
        <div
          style={{
            paddingLeft: 20,
            borderLeft: "3px solid",
            borderImage: "linear-gradient(to bottom, #818cf8, #06b6d4) 1",
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: 14, fontStyle: "italic", lineHeight: 1.7 }}>
            "This merger isn't about one team becoming stronger — it's about creating
            something entirely new that represents all of us and our mission."
          </p>
        </div>
      </div>

      {/* ── form ── */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", paddingBottom: 80 }}>
        <StepDots current={filled} total={REQUIRED.length} />

        {/* section: identity */}
        <div style={cardStyle("linear-gradient(135deg, rgba(238,242,255,0.8), rgba(224,231,255,0.5))")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #c7d2fe, #a5b4fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#312e81" }}>Your Information</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field label="Full Name" required error={errors.fullName}>
              <input
                type="text"
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Jane Doe"
                style={inputStyle(errors.fullName)}
                onFocus={(e) => { e.target.style.borderColor = "#818cf8"; e.target.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.fullName ? "#fca5a5" : "#c7d2fe"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
            <Field label="Team / Department" required error={errors.department}>
              <input
                type="text"
                value={form.department}
                onChange={set("department")}
                placeholder="Interpretation, Translation…"
                style={inputStyle(errors.department)}
                onFocus={(e) => { e.target.style.borderColor = "#818cf8"; e.target.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.department ? "#fca5a5" : "#c7d2fe"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
          </div>
        </div>

        {/* section: proposal */}
        <div style={cardStyle("linear-gradient(135deg, rgba(204,251,241,0.5), rgba(207,250,254,0.4))")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #99f6e4, #67e8f9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#134e4a" }}>Your Proposed Name</h2>
          </div>
          <p style={{ fontSize: 12, color: "#5eead4", marginBottom: 20, marginLeft: 46, fontWeight: 500 }}>
            Choose a name that bridges languages and cultures for patients who need us most.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Proposed Team Name" required error={errors.proposedName}>
              <input
                type="text"
                value={form.proposedName}
                onChange={set("proposedName")}
                placeholder="Enter your proposed team name"
                style={{ ...inputStyle(errors.proposedName), fontSize: 18, fontWeight: 700, border: `1.5px solid ${errors.proposedName ? "#fca5a5" : "#5eead4"}` }}
                onFocus={(e) => { e.target.style.borderColor = "#14b8a6"; e.target.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.proposedName ? "#fca5a5" : "#5eead4"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
            <Field
              label="Meaning & Rationale"
              required
              hint="How does this name connect to our mission of bridging languages and cultures?"
              error={errors.rationale}
            >
              <textarea
                value={form.rationale}
                onChange={set("rationale")}
                placeholder="Explain the meaning behind your proposed name…"
                rows={4}
                style={{ ...textareaStyle(errors.rationale), border: `1.5px solid ${errors.rationale ? "#fca5a5" : "#5eead4"}` }}
                onFocus={(e) => { e.target.style.borderColor = "#14b8a6"; e.target.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.rationale ? "#fca5a5" : "#5eead4"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
            <Field
              label="How It Unifies"
              required
              hint="How does this name avoid dominance by any legacy group and represent all of us?"
              error={errors.unification}
            >
              <textarea
                value={form.unification}
                onChange={set("unification")}
                placeholder="Describe how this name creates shared ownership…"
                rows={4}
                style={{ ...textareaStyle(errors.unification), border: `1.5px solid ${errors.unification ? "#fca5a5" : "#5eead4"}` }}
                onFocus={(e) => { e.target.style.borderColor = "#14b8a6"; e.target.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.unification ? "#fca5a5" : "#5eead4"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
            <Field
              label="Real-World Test"
              required
              hint="Write one sentence showing how the name would be used in practice."
              error={errors.realWorldTest}
            >
              <input
                type="text"
                value={form.realWorldTest}
                onChange={set("realWorldTest")}
                placeholder={'"The [Team Name] connected a Deaf patient to an ASL interpreter…"'}
                style={{ ...inputStyle(errors.realWorldTest), border: `1.5px solid ${errors.realWorldTest ? "#fca5a5" : "#5eead4"}` }}
                onFocus={(e) => { e.target.style.borderColor = "#14b8a6"; e.target.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.realWorldTest ? "#fca5a5" : "#5eead4"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
          </div>
        </div>

        {/* section: optional */}
        <div style={cardStyle("linear-gradient(135deg, rgba(250,232,255,0.5), rgba(237,233,254,0.5))")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #e9d5ff, #c4b5fd)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#581c87" }}>Optional Extras</h2>
          </div>
          <p style={{ fontSize: 12, color: "#c4b5fd", marginBottom: 20, marginLeft: 46, fontWeight: 500 }}>
            These aren't required, but they can strengthen your submission.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field
              label="Linguistic / Cultural Significance"
              hint="Does your name carry meaning in another language, sign language, or culture?"
            >
              <textarea
                value={form.culturalSignificance}
                onChange={set("culturalSignificance")}
                placeholder="Share any linguistic roots, translations, or cultural connections…"
                rows={3}
                style={{ ...textareaStyle(), border: "1.5px solid #d8b4fe" }}
                onFocus={(e) => { e.target.style.borderColor = "#a78bfa"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d8b4fe"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
            <Field label="Tagline">
              <input
                type="text"
                value={form.tagline}
                onChange={set("tagline")}
                placeholder='"Bridging Languages, Connecting Lives"'
                style={{ ...inputStyle(), border: "1.5px solid #d8b4fe" }}
                onFocus={(e) => { e.target.style.borderColor = "#a78bfa"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d8b4fe"; e.target.style.boxShadow = "none"; }}
              />
            </Field>
          </div>
        </div>

        {/* submit */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            onClick={submit}
            disabled={submitting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              padding: "0 36px",
              borderRadius: 100,
              background: submitting
                ? "linear-gradient(135deg, #a5b4fc, #818cf8)"
                : "linear-gradient(135deg, #6366f1, #4f46e5, #7c3aed)",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.5,
              border: "none",
              cursor: submitting ? "wait" : "pointer",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35), 0 2px 8px rgba(124,58,237,0.2)",
              transition: "transform 0.15s, box-shadow 0.15s",
              opacity: submitting ? 0.8 : 1,
            }}
            onMouseDown={(e) => { if (!submitting) (e.target as HTMLElement).style.transform = "scale(0.97)"; }}
            onMouseUp={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
          >
            {submitting ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8, animation: "spin 1s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Submitting…
              </>
            ) : (
              "Submit Your Entry"
            )}
          </button>
          {submitError && (
            <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12, fontWeight: 500 }}>
              {submitError}
            </p>
          )}
          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 16, lineHeight: 1.5 }}>
            Submissions close on{" "}
            <span style={{ color: "#475569", fontWeight: 600 }}>Friday, March 13</span>.
            <br />
            All entries will be reviewed by the Unity Committee.
          </p>
        </div>
      </main>

      {/* footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(165,180,252,0.3)",
          padding: "32px 24px",
          background: "linear-gradient(135deg, rgba(224,231,255,0.4), rgba(237,233,254,0.3))",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#a5b4fc", fontSize: 12, lineHeight: 1.6, marginBottom: 4, fontStyle: "italic" }}>
            At the desired time. In the optimal place. Through appropriate modalities. At no cost.
          </p>
          <p style={{ color: "#c7d2fe", fontSize: 11 }}>
            Advocate Health · Language Services · One Team, One Voice, One Mission
          </p>
        </div>
      </footer>
    </div>
  );
}
