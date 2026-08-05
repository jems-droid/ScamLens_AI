import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle, ArrowRight, Check, CheckCircle2, ClipboardCheck, Clock3, ExternalLink, FileImage,
  History, Info, Link2, Menu, MessageSquareText, Moon, Search, Shield, ShieldCheck, Sparkles,
  Sun, Trash2, Upload, X, Zap,
} from 'lucide-react';
import NotFound from '@/pages/not-found';
import { analyzeInput, type ScanResult, type ScanType, type Verdict } from '@/lib/scam-analysis';
import { useScanHistory } from '@/lib/use-scan-history';

const queryClient = new QueryClient();

function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" data-testid="link-logo" className="group flex items-center gap-3">
    <span className="relative grid size-10 place-items-center rounded-xl bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-primary))] shadow-sm transition-transform group-hover:-rotate-3">
      <ShieldCheck size={22} strokeWidth={2.4} />
      <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[hsl(var(--accent))]" />
    </span>
    {!compact && <span className="text-[1.08rem] font-extrabold tracking-[-.04em]">Scam<span className="text-[hsl(var(--primary))]">Lens</span></span>}
  </Link>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('scamlens-theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('scamlens-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <button type="button" onClick={() => setDark((value) => !value)} data-testid="button-theme-toggle" aria-label="Toggle dark mode"
    className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:-translate-y-0.5 hover:text-foreground">
    {dark ? <Sun size={18} /> : <Moon size={18} />}
  </button>;
}

function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  const [location] = useLocation();
  const items = [
    { href: '/', label: 'Overview', icon: Shield },
    { href: '/scanner', label: 'AI scanner', icon: Search },
    { href: '/history', label: 'Scan history', icon: History },
    { href: '/about', label: 'Stay safer', icon: Info },
  ];
  return <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col bg-[hsl(var(--sidebar))] px-5 py-6 text-[hsl(var(--sidebar-foreground))] transition-transform md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex items-center justify-between"><Logo compact /><button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 md:hidden" data-testid="button-close-menu"><X size={20} /></button></div>
    <div className="mt-12">
      <p className="mb-3 px-3 font-mono-app text-[10px] uppercase tracking-[.18em] text-slate-400">Your safety desk</p>
      <nav className="space-y-1.5" aria-label="Main navigation">
        {items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}
          className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${location === href ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-[0_8px_24px_hsl(187_86%_51%/.17)]' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
          <Icon size={18} strokeWidth={location === href ? 2.5 : 2} /><span>{label}</span>{location === href && <ArrowRight size={15} className="ml-auto" />}
        </Link>)}
      </nav>
    </div>
    <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.06] p-4">
      <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Sparkles size={17} /></div>
      <p className="text-sm font-bold text-white">When in doubt, pause.</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">ScamLens helps you slow down and make a confident next choice.</p>
      <Link href="/about" onClick={() => setMobileOpen(false)} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[hsl(var(--sidebar-primary))]">Read safety tips <ArrowRight size={13} /></Link>
    </div>
  </aside>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="min-h-[100dvh] bg-background">
    <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    {mobileOpen && <button className="fixed inset-0 z-30 bg-[hsl(215_42%_9%/.5)] md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-overlay" />}
    <div className="md:pl-[252px]">
      <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-xl md:px-10">
        <button className="rounded-xl border border-border bg-card p-2.5 md:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-menu"><Menu size={20} /></button>
        <div className="hidden md:block"><p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-muted-foreground">Personal safety companion</p></div>
        <div className="ml-auto flex items-center gap-3"><span className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex"><span className="size-2 rounded-full bg-emerald-500" />Local mode active</span><ThemeToggle /></div>
      </header>
      <main>{children}</main>
    </div>
  </div>;
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="max-w-xl"><p className="font-mono-app text-[11px] font-medium uppercase tracking-[.18em] text-[hsl(var(--primary))]">{eyebrow}</p><h1 className="mt-3 text-balance text-3xl font-extrabold tracking-[-.055em] text-foreground md:text-5xl">{title}</h1>{copy && <p className="mt-4 text-[15px] leading-7 text-muted-foreground">{copy}</p>}</div>;
}

function ScoreBadge({ score, verdict }: { score: number; verdict: Verdict }) {
  const tone = score >= 65 ? 'red' : score >= 34 ? 'amber' : 'green';
  const colors = { red: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300', amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' };
  return <span data-testid="status-verdict" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${colors[tone]}`}><span className={`size-1.5 rounded-full ${tone === 'red' ? 'bg-red-500' : tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />{verdict} · {score}/100</span>;
}

function ResultCard({ result, onDismiss }: { result: ScanResult; onDismiss?: () => void }) {
  return <section className="animate-rise overflow-hidden rounded-3xl border border-border bg-card shadow-calm" data-testid="card-analysis-result">
    <div className="border-b border-border bg-[hsl(var(--secondary)/.42)] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="font-mono-app text-[10px] uppercase tracking-[.17em] text-muted-foreground">Scan complete</p><h2 className="mt-2 text-xl font-extrabold tracking-[-.035em]">Here’s the clear read</h2></div>{onDismiss && <button onClick={onDismiss} className="rounded-full p-2 text-muted-foreground hover:bg-background hover:text-foreground" data-testid="button-dismiss-result" aria-label="Dismiss result"><X size={18} /></button>}</div>
      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className={`grid size-[104px] shrink-0 place-items-center rounded-full border-[9px] ${result.score >= 65 ? 'border-red-200 dark:border-red-900/60' : result.score >= 34 ? 'border-amber-200 dark:border-amber-900/60' : 'border-emerald-200 dark:border-emerald-900/60'}`}><div className="text-center"><strong className="block text-3xl font-extrabold tracking-[-.08em]">{result.score}</strong><span className="font-mono-app text-[9px] uppercase text-muted-foreground">risk score</span></div></div>
        <div><ScoreBadge score={result.score} verdict={result.verdict} /><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{result.explanation}</p></div>
      </div>
    </div>
    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
      <div><h3 className="flex items-center gap-2 text-sm font-extrabold"><AlertCircle size={17} className="text-amber-500" /> What stood out</h3><ul className="mt-4 space-y-3">{result.warningSigns.map((sign, index) => <li key={sign} data-testid={`text-warning-${index}`} className="flex gap-3 text-sm leading-6 text-muted-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[hsl(var(--primary))]" />{sign}</li>)}</ul></div>
      <div><h3 className="flex items-center gap-2 text-sm font-extrabold"><ClipboardCheck size={17} className="text-[hsl(var(--primary))]" /> What to do next</h3><ul className="mt-4 space-y-3">{result.suggestedActions.map((action) => <li key={action} className="flex gap-3 text-sm leading-6 text-muted-foreground"><Check size={16} className="mt-1 shrink-0 text-emerald-500" />{action}</li>)}</ul></div>
    </div>
  </section>;
}

const DEMO_MESSAGE = 'Bank Alert: Your account will be suspended today. Verify now at secure-account-check.example within 10 minutes or your card will be blocked. Reply STOP to cancel.';

function Scanner({ history, addScan }: { history: ScanResult[]; addScan: (scan: ScanResult) => void }) {
  const [type, setType] = useState<ScanType>('message');
  const [input, setInput] = useState('');
  const [imageName, setImageName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async (scanType = type, scanInput = input, scanImageName = imageName) => {
    if (scanType !== 'image' && !scanInput.trim()) return;
    if (scanType === 'image' && !scanImageName) return;
    setLoading(true); setResult(null);
    const scan = await analyzeInput(scanType, scanType === 'image' ? scanImageName : scanInput);
    addScan(scan); setResult(scan); setLoading(false);
  };
  const tryDemoMessage = () => {
    setType('message');
    setInput(DEMO_MESSAGE);
    setImageName('');
    setImagePreview('');
    void submit('message', DEMO_MESSAGE);
  };
  const chooseType = (next: ScanType) => { setType(next); setInput(''); setImageName(''); setImagePreview(''); setResult(null); };
  const onFile = (file?: File) => {
    if (!file) return; setImageName(file.name);
    const reader = new FileReader(); reader.onload = () => setImagePreview(String(reader.result)); reader.readAsDataURL(file);
  };
  return <div className="mx-auto max-w-[1160px] px-5 py-10 md:px-10 md:py-14">
    <div className="grid-paper relative -mx-5 -mt-10 overflow-hidden border-b border-border px-5 pb-12 pt-10 md:-mx-10 md:-mt-14 md:px-10 md:pb-16 md:pt-14">
      <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-[hsl(var(--primary)/.08)] blur-3xl" />
      <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end"><SectionHeading eyebrow="AI scanner / local mock" title="A second pair of eyes, before you act." copy="Paste a suspicious message or link, or upload a screenshot. ScamLens looks for familiar pressure tactics and gives you a calm next step." /><Link href="/history" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[hsl(var(--primary))] hover:gap-3 transition-all" data-testid="link-view-history">View scan history <ArrowRight size={16} /></Link></div>
    </div>
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-calm md:p-7">
        <div className="flex flex-wrap gap-2 border-b border-border pb-5">
          {([{ id: 'message', label: 'Message', icon: MessageSquareText }, { id: 'url', label: 'Website link', icon: Link2 }, { id: 'image', label: 'Screenshot', icon: FileImage }] as const).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => chooseType(id)} data-testid={`button-input-${id}`} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${type === id ? 'bg-[hsl(var(--primary))] text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:-translate-y-0.5'}`}><Icon size={16} />{label}</button>)}
        </div>
        <div className="pt-6">
          {type === 'image' ? <button type="button" onClick={() => fileRef.current?.click()} data-testid="button-upload-image" className="group flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[hsl(var(--primary)/.3)] bg-[hsl(var(--secondary)/.34)] px-6 text-center transition hover:border-[hsl(var(--primary)/.65)] hover:bg-[hsl(var(--secondary)/.6)]">
            {imagePreview ? <img src={imagePreview} alt="Selected screenshot preview" className="max-h-[210px] rounded-xl object-contain shadow-sm" /> : <><span className="mb-4 grid size-14 place-items-center rounded-2xl bg-card text-[hsl(var(--primary))] shadow-sm transition group-hover:-translate-y-1"><Upload size={23} /></span><strong className="text-sm">Choose a screenshot</strong><span className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WEBP · max 10 MB</span></>}
            {imageName && <span className="mt-3 text-xs font-semibold text-[hsl(var(--primary))]">{imageName}</span>}
           </button> : <><div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="scan-input" className="block text-sm font-bold">{type === 'message' ? 'What did they send you?' : 'What link feels off?'}</label>{type === 'message' && <button type="button" onClick={tryDemoMessage} data-testid="button-demo-message" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[hsl(var(--primary)/.25)] bg-[hsl(var(--primary)/.06)] px-2.5 py-1.5 text-[11px] font-extrabold text-[hsl(var(--primary))] transition hover:-translate-y-0.5 hover:border-[hsl(var(--primary)/.5)] hover:bg-[hsl(var(--primary)/.12)]"><Zap size={13} />Try Demo Message</button>}</div><textarea id="scan-input" value={input} onChange={(event) => setInput(event.target.value)} data-testid="input-scan-content" placeholder={type === 'message' ? 'Paste the message here…' : 'https://example.com/claim'} className="min-h-[260px] w-full resize-none rounded-2xl border border-input bg-background p-4 text-sm leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary)/.1)]" /><p className="mt-2 text-xs text-muted-foreground">Your scan stays on this device in local mode.</p></>}
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => onFile(event.target.files?.[0])} data-testid="input-image-file" />
           <button type="button" onClick={() => void submit()} disabled={loading || (type === 'image' ? !imageName : !input.trim())} data-testid="button-run-scan" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-extrabold text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/.2)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_hsl(var(--primary)/.28)] disabled:cursor-not-allowed disabled:opacity-50">{loading ? <><span className="size-4 animate-pulse rounded-full bg-current/60" />Reading the details…</> : <><Search size={17} /> Check this {type === 'url' ? 'link' : type === 'image' ? 'screenshot' : 'message'}</>}</button>
        </div>
        {result && <div className="mt-8"><ResultCard result={result} onDismiss={() => setResult(null)} /></div>}
      </div>
      <div className="space-y-5">
        <div className="rounded-3xl bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))] shadow-calm-lg">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"><Shield size={20} /></span><div><p className="text-sm font-extrabold text-white">A pause is a power move.</p><p className="text-xs text-slate-400">Trust your second thought.</p></div></div>
          <div className="mt-6 border-t border-white/10 pt-5"><p className="text-sm leading-6 text-slate-300">ScamLens does not contact anyone, follow links, or make decisions for you. It simply helps you see common warning signs more clearly.</p></div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6"><p className="font-mono-app text-[10px] uppercase tracking-[.16em] text-muted-foreground">Recent checks</p>{history.length ? <div className="mt-4 space-y-3">{history.slice(0, 3).map((scan) => <div key={scan.id} className="flex items-center gap-3"><span className={`grid size-8 place-items-center rounded-lg ${scan.score >= 65 ? 'bg-red-50 text-red-600 dark:bg-red-950/40' : 'bg-secondary text-[hsl(var(--primary))]'}`}>{scan.type === 'message' ? <MessageSquareText size={15} /> : scan.type === 'url' ? <Link2 size={15} /> : <FileImage size={15} />}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{scan.inputPreview}</p><p className="text-[11px] text-muted-foreground">{scan.verdict}</p></div><span className="font-mono-app text-xs font-medium">{scan.score}</span></div>)}</div> : <p className="mt-4 text-sm leading-6 text-muted-foreground">Your scans will appear here as you check things.</p>}</div>
      </div>
    </div>
  </div>;
}

function Home({ history }: { history: ScanResult[] }) {
  return <div>
    <section className="relative overflow-hidden bg-[hsl(var(--sidebar))] px-5 py-16 text-white md:px-10 md:py-24">
      <div className="pointer-events-none absolute right-[-12%] top-[-40%] size-[620px] rounded-full border-[90px] border-[hsl(var(--sidebar-primary)/.12)]" /><div className="pointer-events-none absolute bottom-[-70px] left-[42%] size-64 rounded-full bg-[hsl(var(--sidebar-primary)/.12)] blur-3xl" />
      <div className="relative mx-auto grid max-w-[1160px] gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div className="animate-rise"><div className="mb-7 flex items-center gap-2 text-xs font-bold text-[hsl(var(--sidebar-primary))]"><span className="grid size-6 place-items-center rounded-md bg-[hsl(var(--sidebar-primary)/.15)]"><ShieldCheck size={15} /></span>Safety, without the scare tactics</div><h1 className="max-w-2xl text-balance text-5xl font-extrabold leading-[.98] tracking-[-.075em] md:text-7xl">Before you<br /><span className="text-[hsl(var(--sidebar-primary))]">click,</span> check.</h1><p className="mt-7 max-w-lg text-base leading-7 text-slate-300 md:text-lg">A calm, clear way to understand suspicious messages, links, and screenshots — before they cost you time, money, or peace of mind.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/scanner" data-testid="link-start-scan" className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--sidebar-primary))] px-5 py-3.5 text-sm font-extrabold text-[hsl(var(--sidebar-primary-foreground))] shadow-[0_10px_28px_hsl(187_86%_51%/.2)] transition hover:-translate-y-1">Check something now <ArrowRight size={17} /></Link><Link href="/about" data-testid="link-learn-safety" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Learn the patterns</Link></div></div>
        <div className="animate-rise delay-2 relative"><div className="absolute -inset-4 rounded-[2.2rem] border border-[hsl(var(--sidebar-primary)/.15)]" /><div className="relative rounded-[1.7rem] border border-white/10 bg-white/[.08] p-5 shadow-2xl backdrop-blur-sm"><div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-2 text-xs font-bold"><span className="size-2 rounded-full bg-emerald-400" />ScamLens / ready</div><span className="font-mono-app text-[10px] text-slate-400">LOCAL MODE</span></div><div className="mt-7 rounded-2xl bg-[#f3f8fb] p-5 text-[hsl(var(--foreground))]"><p className="font-mono-app text-[10px] uppercase tracking-[.15em] text-muted-foreground">Example scan</p><p className="mt-4 text-sm font-semibold leading-6">“Your account needs verification. Click now to avoid suspension.”</p><div className="mt-5 flex items-center gap-3 rounded-xl bg-amber-50 p-3 text-amber-800"><AlertCircle size={17} /><span className="text-xs font-extrabold">Use caution · 74/100</span></div><div className="mt-5 space-y-2.5">{['Urgency is doing the talking', 'The link needs independent checking'].map((item) => <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground"><span className="grid size-4 place-items-center rounded-full bg-amber-100 text-amber-700"><Check size={10} /></span>{item}</div>)}</div></div><div className="mt-5 flex items-center justify-between text-xs text-slate-400"><span>Clearer decisions start here.</span><span className="font-mono-app">01 / 03</span></div></div></div>
      </div>
    </section>
    <section className="mx-auto max-w-[1160px] px-5 py-16 md:px-10 md:py-24"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="font-mono-app text-[11px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">A simple rhythm</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.055em] md:text-4xl">Less reacting.<br />More knowing.</h2></div><div className="grid gap-4 sm:grid-cols-3">{[{ n: '01', title: 'Bring the worry', copy: 'Paste a message, link, or screenshot that made you pause.' }, { n: '02', title: 'See it clearly', copy: 'Get plain-language signals — not a wall of technical jargon.' }, { n: '03', title: 'Choose your next step', copy: 'Follow a practical action plan that puts you back in control.' }].map((item, i) => <div key={item.n} className={`animate-rise delay-${i + 1} rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-calm`}><span className="font-mono-app text-xs text-[hsl(var(--primary))]">{item.n}</span><h3 className="mt-12 text-sm font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p></div>)}</div></div></section>
    <section className="border-y border-border bg-[hsl(var(--secondary)/.35)] px-5 py-16 md:px-10 md:py-20"><div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="font-mono-app text-[11px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">Designed for real life</p><h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-[-.055em] md:text-4xl">No shame. No panic.<br />Just a better moment to decide.</h2></div><div className="grid grid-cols-2 gap-x-10 gap-y-6 text-sm"><div><strong className="block text-2xl font-extrabold">{history.length || '—'}</strong><span className="text-muted-foreground">local scans saved</span></div><div><strong className="block text-2xl font-extrabold">3</strong><span className="text-muted-foreground">ways to check</span></div><div><strong className="block text-2xl font-extrabold">0</strong><span className="text-muted-foreground">accounts required</span></div><div><strong className="block text-2xl font-extrabold">1</strong><span className="text-muted-foreground">calmer next step</span></div></div></div></section>
  </div>;
}

function HistoryPage({ history, removeScan, clearHistory, ready }: { history: ScanResult[]; removeScan: (id: string) => void; clearHistory: () => void; ready: boolean }) {
  const [selected, setSelected] = useState<ScanResult | null>(null);
  if (!ready) return <div className="mx-auto max-w-[1160px] px-5 py-14"><div className="h-10 w-64 animate-pulse rounded-lg bg-muted" /><div className="mt-10 h-48 animate-pulse rounded-3xl bg-muted" /></div>;
  return <div className="mx-auto max-w-[1160px] px-5 py-10 md:px-10 md:py-14"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow="Your device / private by default" title="A trail of clearer decisions." copy="Your scan history lives in this browser only. Nothing is uploaded or shared." />{history.length > 0 && <button onClick={clearHistory} data-testid="button-clear-history" className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30 sm:self-auto"><Trash2 size={15} /> Clear history</button>}</div>
    {history.length === 0 ? <div className="mt-12 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-calm"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-[hsl(var(--primary))]"><History size={25} /></span><h2 className="mt-5 text-lg font-extrabold">Nothing checked yet</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">When you scan a message, link, or screenshot, the result will be kept here for easy reference.</p><Link href="/scanner" data-testid="link-empty-start-scan" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-bold text-primary-foreground">Start your first scan <ArrowRight size={16} /></Link></div> : <div className="mt-10 space-y-3">{history.map((scan, i) => <div key={scan.id} data-testid={`row-scan-${i}`} className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-calm sm:flex-row sm:items-center"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${scan.score >= 65 ? 'bg-red-50 text-red-600 dark:bg-red-950/40' : scan.score >= 34 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'}`}>{scan.type === 'message' ? <MessageSquareText size={19} /> : scan.type === 'url' ? <Link2 size={19} /> : <FileImage size={19} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono-app text-[10px] uppercase tracking-wider text-muted-foreground">{scan.type}</span><span className="text-[11px] text-muted-foreground">·</span><span className="text-[11px] text-muted-foreground">{new Date(scan.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></div><p className="mt-1 truncate text-sm font-bold">{scan.inputPreview}</p></div><ScoreBadge score={scan.score} verdict={scan.verdict} /><div className="flex gap-1 sm:ml-2"><button onClick={() => setSelected(scan)} data-testid={`button-view-scan-${i}`} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="View scan"><ExternalLink size={16} /></button><button onClick={() => removeScan(scan.id)} data-testid={`button-delete-scan-${i}`} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40" aria-label="Delete scan"><Trash2 size={16} /></button></div></div>)}</div>}
    {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-[hsl(215_42%_9%/.55)] p-4" onClick={() => setSelected(null)}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto" onClick={(event) => event.stopPropagation()}><ResultCard result={selected} onDismiss={() => setSelected(null)} /></div></div>}
  </div>;
}

function About() {
  const patterns = [
    { title: 'Urgency', copy: '“Act now” is meant to interrupt your judgment. A real organization can wait for you to verify.', icon: Clock3 },
    { title: 'Unexpected requests', copy: 'Be wary when a familiar name suddenly asks for a password, payment, gift card, or private code.', icon: AlertCircle },
    { title: 'A link that does the convincing', copy: 'A polished logo is easy to copy. Check a website or phone number you already know instead.', icon: Link2 },
  ];
  return <div className="mx-auto max-w-[1160px] px-5 py-10 md:px-10 md:py-14"><SectionHeading eyebrow="Stay a step ahead" title="Scams work by rushing a good person." copy="Knowing the patterns makes it easier to notice when a message is trying to borrow your attention, trust, or fear." /><div className="mt-12 grid gap-5 md:grid-cols-3">{patterns.map(({ title, copy, icon: Icon }, i) => <article key={title} className={`animate-rise delay-${i + 1} rounded-3xl border border-border bg-card p-6 shadow-calm transition hover:-translate-y-1`}><span className="grid size-11 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Icon size={21} /></span><h2 className="mt-14 text-lg font-extrabold tracking-[-.03em]">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div><div className="mt-14 grid gap-8 rounded-3xl bg-[hsl(var(--sidebar))] p-7 text-white md:grid-cols-[.8fr_1.2fr] md:p-10"><div><p className="font-mono-app text-[11px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-primary))]">The pause plan</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.055em]">Three breaths.<br />Three checks.</h2></div><ol className="space-y-5">{['Stop. Do not click, reply, or send anything while you feel rushed.', 'Check. Contact the person or organization through a trusted route you find yourself.', 'Share. Ask someone you trust to look at it with you. Reporting helps protect the next person.'].map((step, i) => <li key={step} className="flex gap-4"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[hsl(var(--sidebar-primary))] text-xs font-extrabold text-[hsl(var(--sidebar-primary-foreground))]">{i + 1}</span><p className="pt-1 text-sm leading-6 text-slate-300">{step}</p></li>)}</ol></div><div className="mt-14 grid gap-8 border-t border-border pt-12 md:grid-cols-2"><div><p className="font-mono-app text-[11px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">A useful default</p><h2 className="mt-3 text-2xl font-extrabold tracking-[-.04em]">If a message creates panic, move slower.</h2></div><p className="text-sm leading-7 text-muted-foreground">ScamLens is a thinking aid, not a guarantee. A low score cannot prove something is safe, and a high score is not a diagnosis. When money, identity, or safety is involved, use a trusted contact or the organization’s official support channel.</p></div></div>;
}

function AppContent() {
  const { history, ready, addScan, removeScan, clearHistory } = useScanHistory();
  return <Shell><Switch><Route path="/"><Home history={history} /></Route><Route path="/scanner"><Scanner history={history} addScan={addScan} /></Route><Route path="/history"><HistoryPage history={history} removeScan={removeScan} clearHistory={clearHistory} ready={ready} /></Route><Route path="/about"><About /></Route><Route component={NotFound} /></Switch></Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppContent /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;