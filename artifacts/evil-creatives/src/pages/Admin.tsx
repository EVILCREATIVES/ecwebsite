import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadPresigned } from "@vercel/blob/client";
import {
  CONTENT_QUERY_KEY,
  defaultContent,
  fetchContent,
  resolveSrc,
  type MediaItem,
  type SiteContent,
} from "@/lib/siteContent";

// Hidden admin page (/admin). Not linked anywhere and marked noindex.
// The password is checked by the server (ADMIN_PASSWORD on Vercel); the page
// only keeps it in sessionStorage for the current browser tab.

const base = import.meta.env.BASE_URL;
const PW_KEY = "ec-admin-pw";

function readPw(): string {
  try {
    return sessionStorage.getItem(PW_KEY) ?? "";
  } catch {
    return "";
  }
}
function writePw(pw: string | null) {
  try {
    if (pw) sessionStorage.setItem(PW_KEY, pw);
    else sessionStorage.removeItem(PW_KEY);
  } catch {
    /* storage unavailable — the user just has to log in again */
  }
}

async function checkPassword(pw: string): Promise<"ok" | "wrong" | "unavailable" | "not-configured"> {
  try {
    const res = await fetch(`${base}api/content`, { method: "POST", headers: { "x-admin-password": pw } });
    if (res.status === 401) return "wrong";
    if (res.status === 503) return "not-configured";
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return "unavailable";
    return "ok";
  } catch {
    return "unavailable";
  }
}

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Admin — Evil Creatives";
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);
}

function Login({ onSuccess }: { onSuccess: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
      <form
        className="w-full max-w-sm border border-white/10 p-8 bg-white/[0.02]"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const result = await checkPassword(pw);
          setBusy(false);
          if (result === "ok") onSuccess(pw);
          else if (result === "wrong") setError("Wrong password.");
          else if (result === "not-configured")
            setError("No admin password is set on the server. Add ADMIN_PASSWORD in Vercel (Production) and redeploy.");
          else setError("The admin service isn't reachable. It only works on the deployed site (Vercel).");
        }}
      >
        <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-6">Evil Creatives / Admin</p>
        <label className="block font-display text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2" htmlFor="pw">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full bg-transparent border border-white/20 px-3 py-2 text-white focus:outline-none focus:border-primary"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy || !pw}
          className="mt-6 w-full bg-primary text-black font-display text-xs tracking-[0.25em] uppercase py-3 disabled:opacity-50"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
}

// The Blob client only reports "Failed to retrieve the presigned URL"; ask the
// server directly so the admin sees the real reason.
async function explainUploadFailure(pathname: string, pw: string): Promise<string | null> {
  try {
    const res = await fetch(`${base}api/upload`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "blob.generate-presigned-url",
        payload: { pathname, clientPayload: JSON.stringify({ password: pw }), multipart: false },
      }),
    });
    if (res.ok) return null;
    const body = await res.json().catch(() => ({}));
    return body.error ?? `Upload service returned ${res.status}`;
  } catch {
    return null;
  }
}

async function uploadFile(file: File, folder: string, pw: string): Promise<MediaItem["src"]> {
  const pathname = `${folder}/${safeName(file.name)}`;
  try {
    const blob = await uploadPresigned(pathname, file, {
      access: "public",
      handleUploadUrl: `${base}api/upload`,
      clientPayload: JSON.stringify({ password: pw }),
      multipart: file.size > 20 * 1024 * 1024,
    });
    return blob.url;
  } catch (err) {
    const reason = await explainUploadFailure(pathname, pw);
    throw reason ? new Error(reason) : err;
  }
}

function Preview({ item }: { item: MediaItem }) {
  const cls = "w-full h-full object-cover";
  return item.video ? (
    <video src={resolveSrc(item.src)} muted loop autoPlay playsInline className={cls} />
  ) : (
    <img src={resolveSrc(item.src)} alt={item.label} className={cls} />
  );
}

function FileButton({
  label,
  onFile,
  disabled,
  primary,
}: {
  label: string;
  onFile: (f: File) => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) onFile(f);
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => ref.current?.click()}
        className={
          primary
            ? "border border-primary/70 text-primary px-4 py-2 font-display text-[10px] tracking-[0.2em] uppercase hover:bg-primary hover:text-black disabled:opacity-40"
            : "border border-white/20 px-2.5 py-1.5 text-xs hover:border-primary hover:text-primary disabled:opacity-40"
        }
      >
        {label}
      </button>
    </>
  );
}

function ListEditor({
  title,
  hint,
  items,
  folder,
  pw,
  onChange,
}: {
  title: string;
  hint: string;
  items: MediaItem[];
  folder: string;
  pw: string;
  onChange: (items: MediaItem[]) => void;
}) {
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [error, setError] = useState("");

  const doUpload = async (file: File, index: number | "new") => {
    setBusy(index);
    setError("");
    try {
      const src = await uploadFile(file, folder, pw);
      const video = file.type.startsWith("video/");
      if (index === "new") {
        const label = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        onChange([...items, { src, video, label }]);
      } else {
        onChange(items.map((it, i) => (i === index ? { ...it, src, video } : it)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <section className="mb-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5 border-b border-white/10 pb-3">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="text-white/45 text-sm mt-1">{hint}</p>
        </div>
        <FileButton label={busy === "new" ? "Uploading…" : "+ Add image / video"} primary disabled={busy !== null} onFile={(f) => doUpload(f, "new")} />
      </div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {items.length === 0 && <p className="text-white/40 text-sm">No items — this row is hidden on the site.</p>}
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`} className="border border-white/10 bg-white/[0.02]">
            <div className="relative aspect-[16/10] bg-black overflow-hidden">
              <Preview item={item} />
              <span className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 text-[10px] font-display tracking-widest">
                {String(i + 1).padStart(2, "0")}
                {item.video ? " · VIDEO" : ""}
              </span>
              {busy === i && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs">Uploading…</div>
              )}
            </div>
            <div className="p-3 space-y-3">
              <input
                value={item.label}
                onChange={(e) => onChange(items.map((it, k) => (k === i ? { ...it, label: e.target.value } : it)))}
                placeholder="Caption"
                aria-label={`Caption for item ${i + 1}`}
                className="w-full bg-transparent border border-white/15 px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
              />
              <div className="flex flex-wrap gap-2">
                <FileButton label="Replace" disabled={busy !== null} onFile={(f) => doUpload(f, i)} />
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="border border-white/20 px-2.5 py-1.5 text-xs disabled:opacity-30 hover:border-primary" aria-label="Move earlier">
                  ←
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="border border-white/20 px-2.5 py-1.5 text-xs disabled:opacity-30 hover:border-primary" aria-label="Move later">
                  →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove "${item.label || "this item"}"?`)) onChange(items.filter((_, k) => k !== i));
                  }}
                  className="ml-auto border border-red-400/40 text-red-300 px-2.5 py-1.5 text-xs hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Admin() {
  useNoIndex();
  const queryClient = useQueryClient();
  const [pw, setPw] = useState(readPw);
  const [authed, setAuthed] = useState(false);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "error"; msg?: string }>({ kind: "idle" });

  // Re-validate a password remembered from earlier in this tab.
  useEffect(() => {
    if (!pw) return;
    checkPassword(pw).then((r) => {
      if (r === "ok") setAuthed(true);
      else {
        writePw(null);
        setPw("");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchContent().then((c) => {
      setDraft(c);
      setSaved(JSON.stringify(c));
    });
  }, [authed]);

  const dirty = draft !== null && JSON.stringify(draft) !== saved;

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!authed) {
    return (
      <Login
        onSuccess={(p) => {
          writePw(p);
          setPw(p);
          setAuthed(true);
        }}
      />
    );
  }

  const save = async () => {
    if (!draft) return;
    setStatus({ kind: "saving" });
    try {
      const res = await fetch(`${base}api/content`, {
        method: "PUT",
        headers: { "content-type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ works: draft.works, campaigns: draft.campaigns }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? `Save failed (${res.status})`);
      setSaved(JSON.stringify(draft));
      queryClient.setQueryData(CONTENT_QUERY_KEY, draft);
      setStatus({ kind: "ok", msg: "Saved — live on the site within a few seconds." });
    } catch (err) {
      setStatus({ kind: "error", msg: err instanceof Error ? err.message : "Save failed" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[rgba(11,10,22,0.85)] border-b border-white/10 px-6 md:px-10 py-4 flex flex-wrap items-center gap-4 justify-between">
        <div>
          <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase">Evil Creatives / Admin</p>
          <p className="text-xs text-white/45 mt-1">
            {dirty ? "Unsaved changes" : "All changes saved"}
            {status.msg && <span className={status.kind === "error" ? " text-red-400" : " text-emerald-400"}> · {status.msg}</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href={base} target="_blank" rel="noreferrer" className="text-xs text-white/60 hover:text-primary">
            View site ↗
          </a>
          <button
            type="button"
            onClick={() => {
              if (confirm("Replace everything in the editor with the original built-in content? (Nothing changes on the site until you save.)"))
                setDraft(structuredClone(defaultContent));
            }}
            className="border border-white/20 px-3 py-2 text-xs hover:border-primary"
          >
            Restore defaults
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => setDraft(JSON.parse(saved))}
            className="border border-white/20 px-3 py-2 text-xs hover:border-primary disabled:opacity-30"
          >
            Discard changes
          </button>
          <button
            type="button"
            disabled={!dirty || status.kind === "saving"}
            onClick={save}
            className="bg-primary text-black font-display text-[11px] tracking-[0.25em] uppercase px-5 py-2.5 disabled:opacity-40"
          >
            {status.kind === "saving" ? "Saving…" : "Save & publish"}
          </button>
          <button
            type="button"
            onClick={() => {
              writePw(null);
              setPw("");
              setAuthed(false);
              setDraft(null);
            }}
            className="text-xs text-white/50 hover:text-white"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="px-6 md:px-10 py-10 max-w-[1600px] mx-auto">
        {!draft ? (
          <p className="text-white/50">Loading content…</p>
        ) : (
          <>
            <ListEditor
              title="Works — top row"
              hint="Scrolls left. Landscape images or videos work best (16:10)."
              items={draft.works.rowOne}
              folder="works"
              pw={pw}
              onChange={(rowOne) => setDraft({ ...draft, works: { ...draft.works, rowOne } })}
            />
            <ListEditor
              title="Works — bottom row"
              hint="Scrolls right. Landscape images or videos work best (16:10)."
              items={draft.works.rowTwo}
              folder="works"
              pw={pw}
              onChange={(rowTwo) => setDraft({ ...draft, works: { ...draft.works, rowTwo } })}
            />
            <ListEditor
              title="Campaigns"
              hint="Laid out in a repeating pattern: tall (3:4) · wide (16:9) · tall (3:4) · two stacked wides (16:9)."
              items={draft.campaigns}
              folder="campaigns"
              pw={pw}
              onChange={(campaigns) => setDraft({ ...draft, campaigns })}
            />
          </>
        )}
      </main>
    </div>
  );
}
