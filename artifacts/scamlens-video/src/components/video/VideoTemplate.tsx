import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';

const SCENE_DURATIONS = {
  opening: 4200,
  interruption: 3600,
  signals: 4600,
  clarity: 4300,
  ritual: 4300,
  close: 4000,
};

const BASE = import.meta.env.BASE_URL;

function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-[.8vw] font-mono text-[.72vw] font-medium uppercase tracking-[.24em] ${light ? 'text-[#a9c9bf]' : 'text-[#1c5d69]'}`}>
      <span className={`h-[.38vw] w-[.38vw] rounded-full ${light ? 'bg-[#e6ac55]' : 'bg-[#e6ac55]'}`} />
      {children}
    </div>
  );
}

function SceneFrame({ children, dark = false, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <motion.section
      className={`absolute inset-0 overflow-hidden ${dark ? 'bg-[#17373f] text-[#f0eee6]' : 'bg-[#f0eee6] text-[#17373f]'} ${className}`}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(100% 0 0% 0)' }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

function SignalGrid({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[.13] ${dark ? 'text-[#a9c9bf]' : 'text-[#1c5d69]'}`}
      style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '5vw 5vw' }}
    />
  );
}

function ProductHeader({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`absolute left-[5.6vw] right-[5.6vw] top-[4.5vh] z-20 flex items-center justify-between ${dark ? 'text-[#f0eee6]' : 'text-[#17373f]'}`}>
      <div className="flex items-center gap-[.8vw]">
        <div className={`relative grid h-[2.35vw] w-[2.35vw] place-items-center rounded-[.65vw] ${dark ? 'bg-[#a9c9bf] text-[#17373f]' : 'bg-[#17373f] text-[#a9c9bf]'}`}>
          <span className="text-[1.15vw] font-bold">S</span>
          <span className="absolute -right-[.18vw] -top-[.18vw] h-[.42vw] w-[.42vw] rounded-full bg-[#e6ac55]" />
        </div>
        <span className="font-display text-[1.38vw] font-bold tracking-[-.05em]">ScamLens</span>
      </div>
      <span className="font-mono text-[.63vw] uppercase tracking-[.22em] opacity-55">Personal safety companion</span>
    </div>
  );
}

function Opening() {
  return (
    <SceneFrame className="bg-[#f0eee6]">
      <SignalGrid />
      <div className="grain pointer-events-none absolute inset-0" />
      <ProductHeader />
      <motion.div className="absolute -right-[9vw] -top-[17vw] h-[48vw] w-[48vw] rounded-full border-[1.5vw] border-[#a9c9bf]/40" animate={{ rotate: 360 }} transition={{ duration: 34, ease: 'linear', repeat: Infinity }} />
      <motion.div className="absolute right-[16vw] top-[20vh] h-[11vw] w-[11vw] rounded-full bg-[#a9c9bf]/45 blur-[1.2vw]" animate={{ y: ['0vh', '-2vh', '0vh'] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute left-[11.5vw] top-[29vh] max-w-[47vw]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
          <Kicker>Safety, without the scare tactics</Kicker>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 34, rotateX: -35 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.05, delay: .38, ease: [0.16, 1, 0.3, 1] }} className="mt-[2vh] font-display text-[7.4vw] font-semibold leading-[.86] tracking-[-.075em]">
          Before you<br /><span className="text-[#1c5d69]">click,</span> check.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .9 }} className="mt-[3.2vh] max-w-[32vw] text-[1.15vw] leading-[1.55] text-[#507079]">
          A calm second pair of eyes for suspicious messages, links, and screenshots.
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0, scale: .7, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.1, delay: .65, type: 'spring', stiffness: 120, damping: 18 }} className="absolute bottom-[13vh] right-[11vw] w-[19vw] rotate-[7deg]">
        <div className="rounded-[1.4vw] border border-[#17373f]/15 bg-[#fbfaf4]/85 p-[1.2vw] shadow-[0_2vw_5vw_rgba(23,55,63,.14)] backdrop-blur-sm">
          <div className="mb-[1vw] flex items-center justify-between"><span className="font-mono text-[.57vw] uppercase tracking-[.16em] text-[#81969a]">ScamLens / ready</span><span className="h-[.4vw] w-[.4vw] rounded-full bg-[#659b78]" /></div>
          <div className="rounded-[.9vw] bg-[#dfe9e0] p-[1.1vw]"><span className="font-mono text-[.56vw] uppercase tracking-[.14em] text-[#507079]">Example scan</span><p className="mt-[.7vw] text-[.75vw] font-semibold leading-[1.45]">“Your account needs verification. Click now.”</p></div>
          <div className="mt-[.9vw] flex items-center justify-between"><span className="font-mono text-[.53vw] uppercase tracking-[.12em] text-[#507079]">Use caution</span><b className="font-display text-[1.6vw] text-[#bd5d54]">74</b></div>
        </div>
      </motion.div>
      <motion.div className="absolute bottom-[6vh] left-[5.6vw] right-[5.6vw] flex items-center gap-[1vw] text-[#507079]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: .6 }}>
        <span className="font-mono text-[.6vw] uppercase tracking-[.18em]">01</span><div className="hairline flex-1" /><span className="font-mono text-[.6vw] uppercase tracking-[.18em]">A clearer decision starts with a pause</span>
      </motion.div>
    </SceneFrame>
  );
}

function Interruption() {
  return (
    <SceneFrame dark>
      <SignalGrid dark />
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />
      <ProductHeader dark />
      <motion.div className="absolute left-[6vw] top-[22vh] w-[39vw]" initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }}>
        <Kicker light>When the message makes you rush</Kicker>
        <h2 className="mt-[2.6vh] font-display text-[5.8vw] font-semibold leading-[.9] tracking-[-.065em]">The red flag<br /><span className="text-[#e6ac55]">is the rush.</span></h2>
        <p className="mt-[3vh] max-w-[25vw] text-[1vw] leading-[1.65] text-[#a9c9bf]">Scams borrow urgency. ScamLens gives your judgment its own room to breathe.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: .8, rotate: 10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .8, delay: .25 }} className="absolute right-[11vw] top-[22vh] w-[29vw]">
        <div className="relative overflow-hidden rounded-[1.3vw] border border-[#a9c9bf]/25 bg-[#f0eee6] p-[1.4vw] text-[#17373f] shadow-[0_2vw_5vw_rgba(0,0,0,.22)]">
          <div className="absolute -inset-x-0 top-0 h-[4vw] bg-[#bd5d54]/10 scanline" />
          <div className="flex items-center justify-between border-b border-[#17373f]/10 pb-[.9vw]"><span className="font-mono text-[.58vw] uppercase tracking-[.16em] text-[#81969a]">incoming message</span><span className="font-mono text-[.55vw] text-[#bd5d54]">10:04</span></div>
          <p className="mt-[1.4vw] text-[1.25vw] font-semibold leading-[1.35]">Bank Alert: your account will be suspended today.</p>
          <div className="mt-[1.2vw] rounded-[.8vw] bg-[#bd5d54]/10 p-[.9vw] text-[.8vw] font-semibold leading-[1.45] text-[#bd5d54]">Verify now at secure-account-check.example within 10 minutes.</div>
          <div className="mt-[1.1vw] flex items-center gap-[.6vw] text-[.65vw] text-[#507079]"><span className="h-[.5vw] w-[.5vw] rounded-full bg-[#bd5d54]" />Pressure detected</div>
        </div>
        <motion.div className="absolute -bottom-[2vw] -left-[2vw] rounded-[.7vw] border border-[#e6ac55]/55 bg-[#e6ac55] px-[1vw] py-[.7vw] font-mono text-[.58vw] font-medium uppercase tracking-[.12em] text-[#17373f]" animate={{ y: [0, -7, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>pause / verify / breathe</motion.div>
      </motion.div>
    </SceneFrame>
  );
}

function Signals() {
  const signals = ['Urgency is doing the talking', 'The link wants you to trust it', 'A familiar name can be copied'];
  return (
    <SceneFrame className="bg-[#dfe9e0]">
      <SignalGrid />
      <ProductHeader />
      <div className="absolute left-[7vw] top-[19vh]">
        <Kicker>Pattern recognition</Kicker>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .2 }} className="mt-[2vh] max-w-[38vw] font-display text-[5.5vw] font-semibold leading-[.9] tracking-[-.07em]">Notice what<br /><span className="text-[#1c5d69]">doesn’t fit.</span></motion.h2>
      </div>
      <div className="absolute right-[8vw] top-[20vh] w-[37vw] space-y-[1vw]">
        {signals.map((signal, index) => (
          <motion.div key={signal} initial={{ opacity: 0, x: 50, scale: .96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: .65, delay: .35 + index * .2, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-[1.1vw] rounded-[1vw] border border-[#17373f]/12 bg-[#f0eee6]/75 p-[1.1vw] shadow-[0_.8vw_2vw_rgba(23,55,63,.07)]">
            <span className="grid h-[2.2vw] w-[2.2vw] shrink-0 place-items-center rounded-full bg-[#1c5d69] font-mono text-[.72vw] text-[#f0eee6]">0{index + 1}</span>
            <span className="text-[.95vw] font-semibold">{signal}</span>
            <span className="ml-auto h-[.5vw] w-[.5vw] rounded-full bg-[#e6ac55] blink" />
          </motion.div>
        ))}
      </div>
      <motion.div className="absolute bottom-[12vh] left-[7vw] flex items-center gap-[1vw] text-[#507079]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <span className="font-mono text-[.62vw] uppercase tracking-[.16em]">No jargon</span><div className="h-[1.4vw] w-[1px] bg-[#17373f]/25" /><span className="text-[.8vw]">Plain-language signals. Practical next steps.</span>
      </motion.div>
      <motion.img src={`${BASE}assets/scamlens-orbit.png`} alt="" className="pointer-events-none absolute -bottom-[8vw] right-[36vw] w-[20vw] opacity-70" animate={{ rotate: [0, 4, 0], y: [0, -9, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
    </SceneFrame>
  );
}

function Clarity() {
  return (
    <SceneFrame dark>
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />
      <motion.div className="absolute -left-[8vw] top-[5vh] h-[55vw] w-[55vw] rounded-full border-[.8vw] border-[#a9c9bf]/15" animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
      <ProductHeader dark />
      <div className="absolute left-[8vw] top-[25vh]">
        <Kicker light>One calm read</Kicker>
        <motion.h2 initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .25, ease: [0.16, 1, 0.3, 1] }} className="mt-[2vh] font-display text-[6.6vw] font-semibold leading-[.86] tracking-[-.08em]">Make the<br /><span className="text-[#a9c9bf]">next move</span><br />yours.</motion.h2>
      </div>
      <motion.div initial={{ opacity: 0, x: 45, rotate: 4 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: .9, delay: .6 }} className="absolute right-[10vw] top-[23vh] w-[27vw] rounded-[1.4vw] border border-[#a9c9bf]/25 bg-[#f0eee6] p-[1.4vw] text-[#17373f] shadow-[0_2vw_5vw_rgba(0,0,0,.25)]">
        <div className="flex items-center justify-between"><span className="font-mono text-[.57vw] uppercase tracking-[.18em] text-[#507079]">scan complete</span><span className="rounded-full bg-[#a9c9bf] px-[.65vw] py-[.35vw] font-mono text-[.55vw] uppercase">clear read</span></div>
        <div className="mt-[1.1vw] flex items-center gap-[1vw]"><div className="grid h-[5.7vw] w-[5.7vw] place-items-center rounded-full border-[.55vw] border-[#e6ac55]/70"><span className="font-display text-[2vw] font-bold">74</span></div><div><p className="font-display text-[1.45vw] font-semibold">Use caution</p><p className="mt-[.25vw] text-[.67vw] text-[#507079]">Pressure tactics detected.</p></div></div>
        <div className="mt-[1.2vw] space-y-[.55vw]">{['Urgency is doing the talking', 'Check the link independently'].map((item) => <div key={item} className="flex items-center gap-[.55vw] text-[.67vw] text-[#507079]"><span className="grid h-[.85vw] w-[.85vw] place-items-center rounded-full bg-[#a9c9bf] text-[.55vw]">✓</span>{item}</div>)}</div>
      </motion.div>
    </SceneFrame>
  );
}

function Ritual() {
  const steps = [['01', 'Stop', 'Don’t click, reply, or send while you feel rushed.'], ['02', 'Check', 'Use a trusted route you find yourself.'], ['03', 'Share', 'Ask someone you trust to look with you.']];
  return (
    <SceneFrame className="bg-[#f0eee6]">
      <SignalGrid />
      <ProductHeader />
      <div className="absolute left-[7vw] top-[17vh]">
        <Kicker>The pause plan</Kicker>
        <motion.h2 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .2 }} className="mt-[2vh] font-display text-[5.7vw] font-semibold leading-[.88] tracking-[-.07em]">Three breaths.<br /><span className="text-[#1c5d69]">Three checks.</span></motion.h2>
      </div>
      <div className="absolute bottom-[14vh] left-[7vw] right-[7vw] grid grid-cols-3 gap-[1.2vw]">
        {steps.map(([num, title, copy], i) => (
          <motion.div key={num} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .45 + i * .2 }} className="rounded-[1vw] border border-[#17373f]/13 bg-[#dfe9e0]/70 p-[1.15vw]">
            <span className="font-mono text-[.65vw] tracking-[.15em] text-[#1c5d69]">{num}</span>
            <h3 className="mt-[2vw] font-display text-[2vw] font-semibold tracking-[-.05em]">{title}</h3>
            <p className="mt-[.65vw] max-w-[16vw] text-[.7vw] leading-[1.5] text-[#507079]">{copy}</p>
          </motion.div>
        ))}
      </div>
    </SceneFrame>
  );
}

function Close() {
  return (
    <SceneFrame dark>
      <div className="grain pointer-events-none absolute inset-0 opacity-35" />
      <ProductHeader dark />
      <motion.div className="absolute left-[9vw] top-[22vh]" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .25 }}>
        <Kicker light>ScamLens / local mode</Kicker>
        <h2 className="mt-[2.2vh] font-display text-[7.5vw] font-semibold leading-[.84] tracking-[-.08em]">Pause.<br /><span className="text-[#a9c9bf]">Then choose.</span></h2>
        <p className="mt-[3.4vh] max-w-[29vw] text-[1vw] leading-[1.6] text-[#a9c9bf]">Clarity is a small habit that protects a lot.</p>
      </motion.div>
      <motion.div className="absolute right-[10vw] top-[28vh] flex h-[18vw] w-[18vw] items-center justify-center rounded-full border border-[#a9c9bf]/25" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
        <div className="absolute inset-[1.2vw] rounded-full border border-[#a9c9bf]/15" />
        <div className="grid h-[8vw] w-[8vw] place-items-center rounded-[2vw] bg-[#a9c9bf] text-[#17373f] shadow-[0_1vw_3vw_rgba(169,201,191,.18)]"><span className="font-display text-[4vw] font-bold">S</span></div>
        <span className="absolute -top-[.45vw] h-[.9vw] w-[.9vw] rounded-full bg-[#e6ac55]" />
      </motion.div>
      <motion.div className="absolute bottom-[6vh] left-[9vw] right-[9vw] flex items-center justify-between border-t border-[#a9c9bf]/25 pt-[1.2vw] font-mono text-[.6vw] uppercase tracking-[.18em] text-[#a9c9bf]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <span>Before you click, check.</span><span>scamlens / 2025</span>
      </motion.div>
    </SceneFrame>
  );
}

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });
  const scenes = [<Opening key="opening" />, <Interruption key="interruption" />, <Signals key="signals" />, <Clarity key="clarity" />, <Ritual key="ritual" />, <Close key="close" />];
  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: '#17373f' }}>
      <div className="pointer-events-none absolute inset-0 z-50 border-[.45vw] border-[#e6ac55]/0" />
      <AnimatePresence mode="sync" initial={false}>{scenes[currentScene]}</AnimatePresence>
    </main>
  );
}