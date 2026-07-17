import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Award, Check, ChevronLeft, Clock3, Flame, MapPin, Menu, RotateCw, Star, Users, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import './styles.css';

const burgers = [
  { n: '01', name: 'La Smokie', desc: 'Doble smash, cheddar madurado, pepinillo, cebolla y salsa Smokie.', price: '14,5', kcal: '1.180', allergens: 'Gluten · Leche · Huevo · Mostaza', protein: '54 g', heat: 'Suave', prep: '15 min', rating: '4.9', popular: true, video: '/assets/smokie-menu.mp4' },
  { n: '02', name: 'Burning Love', desc: 'Doble smash, gouda ahumado, jalapeño, bacon crujiente y hot honey.', price: '15', kcal: '1.260', allergens: 'Gluten · Leche · Huevo · Mostaza', protein: '58 g', heat: 'Picante', prep: '16 min', rating: '4.8', popular: true, video: '/assets/smokie-menu.mp4' },
  { n: '03', name: 'La Castiza', desc: 'Doble smash, manchego, cebolla caramelizada y mayo de ajo negro.', price: '15,5', kcal: '1.140', allergens: 'Gluten · Leche · Huevo', protein: '56 g', heat: 'Suave', prep: '14 min', rating: '4.7', video: '/assets/smokie-menu-castiza.mp4' },
  { n: '04', name: 'La Santa', desc: 'Doble smash, cheddar, bacon ahumado, cebolla crujiente y salsa Santa.', price: '16', kcal: '1.310', allergens: 'Gluten · Leche · Huevo · Mostaza', protein: '61 g', heat: 'Medio', prep: '17 min', rating: '5.0', popular: true, video: '/assets/smokie-menu.mp4' },
  { n: '05', name: 'Lollipops de Pollo', desc: 'Lollipops de pollo a la brasa, glaseado Smokie y especias de la casa.', price: '13,5', kcal: '740', allergens: 'Consultar al equipo', protein: '46 g', heat: 'Medio', prep: '18 min', rating: '4.9', popular: true, video: '/assets/smokie-chicken-lollipops.mp4' },
];

const times = ['13:30', '14:00', '14:30', '15:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
const HERO_FRAME_COUNT = 80;
const festivalZones = [
  { id: 'noroeste', name: 'Noroeste', number: '01', events: [{ city: 'Ourense', event: 'Smokie Tour · Ourense' }, { city: 'Zamora', event: 'Smokie Tour · Zamora' }] },
  { id: 'centro', name: 'Centro', number: '02', events: [{ city: 'Cuenca', event: 'The Burger Cup · Parque San Julián' }, { city: 'Ciudad Real', event: 'Smokie Tour · Ciudad Real' }, { city: 'Tomelloso', event: 'Smokie Tour · Tomelloso' }] },
  { id: 'sur', name: 'Sur', number: '03', events: [{ city: 'Utrera', event: 'Smokie Tour · Utrera' }, { city: 'Andalucía', event: 'Smokeout Food Festival · BBQ & Grill' }] },
];

function Logo() {
  return <a className="logo" href="#top" aria-label="Smokie Madriz, inicio"><img src="/assets/smokie-logo.png" alt="Smokie Madriz" /></a>;
}

function BurgerCard({ burger }) {
  const [flipped, setFlipped] = useState(false);
  const faceMotion = { initial: { opacity: 0, scaleX: .08 }, animate: { opacity: 1, scaleX: 1 }, exit: { opacity: 0, scaleX: .08 }, transition: { duration: .34, ease: [0.22, 1, 0.36, 1] } };
  return <article className="burger-card">
    <button className="burger-card-button" onClick={() => setFlipped(!flipped)} aria-pressed={flipped} aria-label={`${flipped ? 'Volver al vídeo de' : 'Ver información de'} ${burger.name}`}>
      <div className="burger-card-inner">
        <AnimatePresence initial={false} mode="wait">
        {!flipped ? <motion.div key="front" className="burger-face burger-front burger-face-motion" {...faceMotion}>
          <video src={burger.video} autoPlay muted loop playsInline preload="metadata" />
          <div className="burger-shade" />
          <div className="burger-top">
            <div>{burger.popular && <span className="popular-badge" title="Especialidad"><Award size={17}/></span>}{burger.heat !== 'Suave' && <span className="heat-badge"><Flame size={15}/> {burger.heat}</span>}</div>
            <span className="prep-badge"><Clock3 size={13}/> {burger.prep}</span>
          </div>
          <div className="burger-panel">
            <div className="rating-row"><span><Star size={13} fill="currentColor"/> {burger.rating}</span><i>{burger.n} · SMOKIE</i></div>
            <div className="burger-title-row"><h3>{burger.name}</h3><strong>{burger.price}<sup>€</sup></strong></div>
            <p>{burger.desc}</p>
            <div className="flip-hint"><RotateCw size={14}/> PULSA PARA VER LA FICHA</div>
          </div>
        </motion.div> : <motion.div key="back" className="burger-face burger-back burger-face-motion" {...faceMotion}>
          <div className="burger-back-glow" />
          <div className="burger-back-head"><span>{burger.n} · FICHA DEL PLATO</span><strong>{burger.price}€</strong></div>
          <h3>{burger.name}</h3>
          <p>{burger.desc}</p>
          <div className="burger-facts">
            <div><span>ENERGÍA</span><strong>{burger.kcal} <small>KCAL</small></strong></div>
            <div><span>PROTEÍNA</span><strong>{burger.protein}</strong></div>
            <div><span>INTENSIDAD</span><strong>{burger.heat}</strong></div>
          </div>
          <div className="allergens"><span>ALÉRGENOS</span><p>{burger.allergens}</p></div>
          <small>Información nutricional aproximada. Consulta al equipo si tienes alguna intolerancia.</small>
        </motion.div>}
        </AnimatePresence>
      </div>
    </button>
  </article>;
}

function SmokeCanvas() {
  const smokeRef = useRef(null);

  useEffect(() => {
    const canvas = smokeRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame;
    let width = 0;
    let height = 0;
    let particles = [];
    let visible = false;

    const reset = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(bounds.width * dpr));
      height = Math.max(1, Math.round(bounds.height * dpr));
      canvas.width = width;
      canvas.height = height;
      particles = Array.from({ length: 34 }, (_, index) => ({
        x: width * (.12 + Math.random() * .78),
        y: height * (.88 + Math.random() * .28),
        radius: width * (.035 + Math.random() * .09),
        speed: height * (.00032 + Math.random() * .00055),
        drift: (Math.random() - .5) * width * .00018,
        alpha: .025 + Math.random() * .07,
        phase: index * .72 + Math.random() * 5,
      }));
    };

    const draw = time => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'screen';
      particles.forEach((particle, index) => {
        const wave = Math.sin(time * .00035 + particle.phase) * particle.radius * .32;
        const gradient = context.createRadialGradient(particle.x + wave, particle.y, 0, particle.x + wave, particle.y, particle.radius);
        gradient.addColorStop(0, `rgba(224,219,208,${particle.alpha})`);
        gradient.addColorStop(.36, `rgba(157,151,141,${particle.alpha * .65})`);
        gradient.addColorStop(1, 'rgba(70,67,63,0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.ellipse(particle.x + wave, particle.y, particle.radius * (1.1 + index % 3 * .12), particle.radius * .72, Math.sin(particle.phase) * .5, 0, Math.PI * 2);
        context.fill();
        if (!reduceMotion) {
          particle.y -= particle.speed;
          particle.x += particle.drift;
          particle.radius *= 1.00045;
          if (particle.y + particle.radius < -height * .05) {
            particle.y = height + particle.radius * .4;
            particle.x = width * (.08 + Math.random() * .84);
            particle.radius = width * (.035 + Math.random() * .075);
          }
        }
      });
      context.globalCompositeOperation = 'source-over';
      if (!reduceMotion && visible) animationFrame = requestAnimationFrame(draw);
    };

    reset();
    draw(0);
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reduceMotion) animationFrame = requestAnimationFrame(draw);
      if (!visible) cancelAnimationFrame(animationFrame);
    }, { rootMargin: '180px 0px' });
    observer.observe(canvas);
    window.addEventListener('resize', reset);
    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener('resize', reset);
    };
  }, []);

  return <canvas ref={smokeRef} className="manifesto-smoke" aria-hidden="true" />;
}

function Festivals() {
  const [activeZone, setActiveZone] = useState('centro');
  const active = festivalZones.find(zone => zone.id === activeZone);
  const selectZone = id => setActiveZone(id);

  return <section className="festivals" id="festivales">
    <div className="festival-heading reveal">
      <span>03 — EN LA CARRETERA</span>
      <h2>FESTIVALES<br/><em>CON MUCHO HUMO.</em></h2>
      <p>Hemos llevado nuestras burgers por España. Elige una zona para descubrir dónde encendimos el fuego.</p>
    </div>
    <div className="festival-layout reveal">
      <div className="spain-map-wrap">
        <svg className="spain-map" viewBox="0 0 760 520" role="img" aria-label="Mapa interactivo de festivales de Smokie Madriz en España">
          <defs>
            <clipPath id="spain-shape">
              <path d="M112 98L148 78L190 82L224 95L267 84L311 88L355 80L399 89L443 77L487 90L520 108L554 103L587 123L624 132L676 165L658 194L674 222L651 247L655 280L637 311L626 349L598 381L560 399L534 428L482 442L428 431L379 455L330 460L286 446L242 451L205 435L170 430L141 410L159 378L149 349L166 322L153 294L169 264L157 233L165 203L143 176L151 147L127 126Z" />
            </clipPath>
            <filter id="map-glow"><feGaussianBlur stdDeviation="12" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <g clipPath="url(#spain-shape)" className="map-zones">
            <path className={`map-zone ${activeZone === 'noroeste' ? 'active' : ''}`} onClick={() => selectZone('noroeste')} onKeyDown={event => (event.key === 'Enter' || event.key === ' ') && selectZone('noroeste')} role="button" tabIndex="0" aria-label="Festivales en Noroeste" d="M65 48H303V329H65Z" />
            <path className={`map-zone ${activeZone === 'centro' ? 'active' : ''}`} onClick={() => selectZone('centro')} onKeyDown={event => (event.key === 'Enter' || event.key === ' ') && selectZone('centro')} role="button" tabIndex="0" aria-label="Festivales en Centro" d="M299 48H700V350H299Z" />
            <path className={`map-zone ${activeZone === 'sur' ? 'active' : ''}`} onClick={() => selectZone('sur')} onKeyDown={event => (event.key === 'Enter' || event.key === ' ') && selectZone('sur')} role="button" tabIndex="0" aria-label="Festivales en Sur" d="M72 326H700V490H72Z" />
          </g>
          <path className="spain-outline" d="M112 98L148 78L190 82L224 95L267 84L311 88L355 80L399 89L443 77L487 90L520 108L554 103L587 123L624 132L676 165L658 194L674 222L651 247L655 280L637 311L626 349L598 381L560 399L534 428L482 442L428 431L379 455L330 460L286 446L242 451L205 435L170 430L141 410L159 378L149 349L166 322L153 294L169 264L157 233L165 203L143 176L151 147L127 126Z" />
          <g className="balearic-islands"><path d="M690 286l24-11 18 12-20 13z"/><path d="M716 320l12-7 9 10-14 6z"/><path d="M686 338l8-4 5 8-9 4z"/></g>
          <g className="map-labels">
            <text x="215" y="166">NOROESTE</text><text x="465" y="190">CENTRO</text><text x="380" y="402">SUR</text>
          </g>
          <g className="map-points" filter="url(#map-glow)">
            <circle cx="151" cy="138" r="6"/><circle cx="248" cy="225" r="6"/><circle cx="536" cy="220" r="6"/><circle cx="437" cy="284" r="6"/><circle cx="480" cy="319" r="6"/><circle cx="323" cy="404" r="6"/>
          </g>
        </svg>
        <div className="map-compass">N<br/><span>↑</span></div>
      </div>
      <div className="festival-panel" aria-live="polite">
        <div className="festival-panel-top">
          <div><span>RUTA SMOKIE · ZONA {active.number}</span><strong>{active.name}</strong></div>
          <b>{String(active.events.length).padStart(2, '0')}<small>PARADAS</small></b>
        </div>
        <p className="festival-panel-copy">Fuego, carretera y burgers. Estas son las ciudades donde dejamos nuestra marca.</p>
        <div className="festival-events">
          <AnimatePresence mode="wait">
            <motion.div key={active.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .32 }}>
              {active.events.map((item, index) => <article key={item.event}>
                <span className="event-index">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{item.city}</h3><p>{item.event}</p></div>
                <i><MapPin size={17}/></i>
              </article>)}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="zone-switcher">
          {festivalZones.map(zone => <button key={zone.id} className={activeZone === zone.id ? 'active' : ''} onClick={() => selectZone(zone.id)}>{zone.number} {zone.name}</button>)}
        </div>
      </div>
    </div>
  </section>;
}

function Booking({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('21:00');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const confirmBooking = () => {
    const reservation = { ...form, guests, date, time, id: `SM-${Date.now().toString().slice(-6)}` };
    const saved = JSON.parse(localStorage.getItem('smokie-madriz-reservations') || '[]');
    localStorage.setItem('smokie-madriz-reservations', JSON.stringify([...saved, reservation]));
    setStep(3);
  };

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setStep(1);
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  const formatted = date ? new Intl.DateTimeFormat('es-ES', { weekday:'long', day:'numeric', month:'long' }).format(new Date(`${date}T12:00:00`)) : 'Elige una fecha';

  return <div className="modal" role="dialog" aria-modal="true" aria-label="Reservar mesa">
    <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X /></button>
    <div className="booking-art">
      <Logo />
      <div className="booking-quote">Las buenas noches<br/><em>empiezan con fuego.</em></div>
      <div className="booking-meta"><MapPin size={16}/> Paseo del Mediterráneo, 237 · Mojácar</div>
    </div>
    <div className="booking-panel">
      <div className="step-label">RESERVAS · PASO {Math.min(step, 2)} DE 2</div>
      {step === 1 && <>
        <h2>Tu mesa,<br/><em>a tu manera.</em></h2>
        <div className="field-label"><Users size={17}/> ¿Cuántos sois?</div>
        <div className="guest-row">
          {[1,2,3,4,5,6].map(x => <button className={guests === x ? 'active' : ''} onClick={() => setGuests(x)} key={x}>{x}{x === 6 ? '+' : ''}</button>)}
        </div>
        <label className="field-label" htmlFor="date"><Clock3 size={17}/> ¿Cuándo venís?</label>
        <input id="date" className="date-input" type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} />
        <div className="selected-date">{formatted}</div>
        <div className="time-grid">
          {times.map(x => <button className={time === x ? 'active' : ''} onClick={() => setTime(x)} key={x}>{x}</button>)}
        </div>
        <button className="primary wide" disabled={!date} onClick={() => setStep(2)}>CONTINUAR <ArrowUpRight size={17}/></button>
      </>}
      {step === 2 && <>
        <button className="back" onClick={() => setStep(1)}><ChevronLeft size={16}/> Volver</button>
        <h2>Ya casi<br/><em>es vuestra.</em></h2>
        <div className="summary"><span>{guests} personas</span><span>{formatted}</span><strong>{time} h</strong></div>
        <div className="form-stack">
          <input placeholder="Nombre y apellidos" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/>
          <input type="tel" placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/>
        </div>
        <button className="primary wide" disabled={!form.name || !form.email || !form.phone} onClick={confirmBooking}>CONFIRMAR RESERVA <ArrowUpRight size={17}/></button>
        <p className="legal">Al reservar aceptas nuestra política de privacidad y cancelación.</p>
      </>}
      {step === 3 && <div className="success">
        <div className="success-icon"><Check /></div>
        <h2>Nos vemos<br/><em>en el fuego.</em></h2>
        <p>Reserva confirmada para {guests} personas<br/>{formatted} · {time} h</p>
        <span>Te hemos enviado la confirmación por email.</span>
        <button className="primary wide" onClick={onClose}>VOLVER A LA WEB</button>
      </div>}
    </div>
  </div>;
}

function App() {
  const [booking, setBooking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const heroFrames = useRef([]);
  const currentFrame = useRef(0);
  const framesReady = useRef(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: .25, restDelta: .0001 });
  const videoProgress = useTransform(smoothProgress, [0, .78, 1], [0, 1, 1]);
  const introOpacity = useTransform(smoothProgress, [0, .16, .38], [1, 1, 0]);
  const introY = useTransform(smoothProgress, [0, .38], [0, -70]);
  const endOpacity = useTransform(smoothProgress, [.68, .86, 1], [0, 0, 1]);
  const progressScale = useTransform(smoothProgress, [0, 1], [0, 1]);
  const smokeDrift = useTransform(smoothProgress, [0, 1], ['-4%', '8%']);

  const drawHeroFrame = index => {
    const canvas = canvasRef.current;
    const image = heroFrames.current[index];
    if (!canvas || !image?.complete || !image.naturalWidth) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const context = canvas.getContext('2d', { alpha: false });
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const renderWidth = image.naturalWidth * scale;
    const renderHeight = image.naturalHeight * scale;
    context.drawImage(image, (width - renderWidth) / 2, (height - renderHeight) / 2, renderWidth, renderHeight);
    canvas.dataset.frame = String(index + 1);
  };

  useMotionValueEvent(videoProgress, 'change', latest => {
    if (!framesReady.current) return;
    const nextFrame = Math.min(HERO_FRAME_COUNT - 1, Math.max(0, Math.round(latest * (HERO_FRAME_COUNT - 1))));
    if (nextFrame === currentFrame.current) return;
    currentFrame.current = nextFrame;
    requestAnimationFrame(() => drawHeroFrame(nextFrame));
  });

  useEffect(() => {
    let cancelled = false;
    const images = Array.from({ length: HERO_FRAME_COUNT }, (_, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = index < 8 ? 'high' : 'auto';
      image.src = `/assets/hero-frames/frame-${String(index + 1).padStart(3, '0')}.jpg`;
      image.onload = () => {
        if (index === currentFrame.current) drawHeroFrame(index);
      };
      return image;
    });
    heroFrames.current = images;
    Promise.allSettled(images.map(image => image.decode ? image.decode() : Promise.resolve())).then(() => {
      if (cancelled) return;
      framesReady.current = true;
      const index = Math.min(HERO_FRAME_COUNT - 1, Math.round(videoProgress.get() * (HERO_FRAME_COUNT - 1)));
      currentFrame.current = index;
      drawHeroFrame(index);
      if (canvasRef.current) canvasRef.current.dataset.ready = 'true';
    });
    const handleResize = () => drawHeroFrame(currentFrame.current);
    window.addEventListener('resize', handleResize);
    return () => {
      cancelled = true;
      framesReady.current = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('seen')), {threshold:.15});
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  return <>
    <header>
      <Logo />
      <nav className={menuOpen ? 'open' : ''}>
        <a href="#carta" onClick={() => setMenuOpen(false)}>LA CARTA</a>
        <a href="#festivales" onClick={() => setMenuOpen(false)}>FESTIVALES</a>
        <a href="#historia" onClick={() => setMenuOpen(false)}>NOSOTROS</a>
        <a href="#visitanos" onClick={() => setMenuOpen(false)}>VISÍTANOS</a>
      </nav>
      <button className="reserve-top" onClick={() => setBooking(true)}>RESERVAR <ArrowUpRight size={15}/></button>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero-scroll" ref={heroRef} aria-label="Hamburguesa Smokie descompuesta por capas">
        <div className="hero-sticky">
          <div className="hero-noise" />
          <canvas
            ref={canvasRef}
            className="hero-scrub-video"
            role="img"
            aria-label="Hamburguesa Smokie que se descompone al hacer scroll"
          />
          <motion.div className="smoke smoke-one" style={{ x: smokeDrift }} />
          <motion.div className="smoke smoke-two" style={{ x: smokeDrift }} />
          <div className="hero-vignette" />
          <motion.div className="hero-scroll-copy" style={{ opacity: introOpacity, y: introY }}>
            <div className="eyebrow"><span/> AHUMADOS · BURGERS · HIGH STREETFOOD</div>
            <h1>MUCHOS<br/>VENDEN <em>HUMO.</em></h1>
            <div className="hero-tagline"><p>NOSOTROS<br/>LO COCINAMOS.</p><span>SCROLL PARA DESCUBRIR <ArrowDown size={15}/></span></div>
          </motion.div>
          <motion.div className="hero-reveal-copy" style={{ opacity: endOpacity }}>
            <span>CADA CAPA IMPORTA</span>
            <h2>DESMONTAMOS<br/><em>LO ORDINARIO.</em></h2>
            <button className="primary" onClick={() => setBooking(true)}>RESERVAR MESA <ArrowUpRight size={16}/></button>
          </motion.div>
          <div className="hero-side-label">MOJÁCAR · ALMERÍA · 2026</div>
          <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />
        </div>
      </section>

      <section className="ticker"><div>BURGERS <i>✦</i> HIGH STREETFOOD <i>✦</i> REAL FIRE <i>✦</i> ITALOAMERICAN FUSION <i>✦</i> BURGERS <i>✦</i></div></section>

      <section className="manifesto reveal" id="historia">
        <SmokeCanvas />
        <div className="section-index">01 — MANIFIESTO</div>
        <div className="manifesto-copy">
          <h2>NO HACEMOS<br/>HAMBURGUESAS<br/><em>PARA TODOS.</em></h2>
          <div><p>Ahumamos sin prisa y cocinamos sin fronteras. Burgers premiadas, sabores italoamericanos y high streetfood pensado para comer con las manos.</p><span>Esto es Smokie Madriz. Fuego en cada mordisco.</span></div>
        </div>
      </section>

      <section className="smoke-story reveal">
        <span>02 — AHUMADO REAL</span>
        <p>El humo no es un efecto.<br/><em>Es un ingrediente.</em></p>
        <div>TIEMPO · MADERA · FUEGO</div>
      </section>

      <Festivals />

      <section className="menu-section" id="carta">
        <div className="section-head reveal"><span>04 — LA CARTA</span><h2>LOS<br/><em>FAVORITOS.</em></h2><p>Cinco platos. Cero relleno.<br/>Toca cada uno para descubrirlo.</p></div>
        <div className="menu-grid reveal">
          {burgers.map(b => <BurgerCard burger={b} key={b.name} />)}
        </div>
        <div className="menu-foot"><span>También hay patatas, sides y cosas para mojar.</span><a href="#">VER CARTA COMPLETA <ArrowUpRight size={15}/></a></div>
      </section>

      <section className="booking-cta reveal" id="reservas">
        <div className="cta-top"><span>05 — TU MESA</span><span>MAR — DOM · 13:30 — 00:00</span></div>
        <h2>VEN CON<br/><em>HAMBRE.</em></h2>
        <img className="cta-burger" src="/assets/smokie-darkside.png" alt="Hamburguesa Smokie en su caja The dark side of the food" />
        <div className="cta-bottom"><p>Nosotros ponemos<br/>el resto.</p><button className="primary light" onClick={() => setBooking(true)}>RESERVAR MESA <ArrowUpRight/></button></div>
      </section>

      <section className="location" id="visitanos">
        <div className="location-copy"><span>06 — ENCUÉNTRANOS</span><h2>JUNTO AL<br/>MEDITERRÁNEO,<br/><em>MOJÁCAR.</em></h2><p>Paseo del Mediterráneo, 237<br/>04638 Mojácar, Almería</p><a href="https://www.google.com/maps/search/?api=1&query=Paseo+del+Mediterraneo+237+Mojacar" target="_blank" rel="noreferrer">CÓMO LLEGAR <ArrowUpRight size={15}/></a><a href="tel:+34611334597">RESERVAS · 611 334 597 <ArrowUpRight size={15}/></a></div>
        <div className="map-art real-map">
          <iframe
            title="Mapa de Smokie Madriz en Mojácar"
            src="https://www.google.com/maps?q=Paseo+del+Mediterr%C3%A1neo+237,+04638+Moj%C3%A1car,+Almer%C3%ADa&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a className="map-open" href="https://www.google.com/maps/search/?api=1&query=Paseo+del+Mediterraneo+237+Mojacar" target="_blank" rel="noreferrer">ABRIR EN MAPS <ArrowUpRight size={14}/></a>
        </div>
      </section>
    </main>

    <footer><Logo/><div><a href="tel:+34611334597">Reservas · 611 334 597 <ArrowUpRight size={14}/></a><a href="#">Instagram <ArrowUpRight size={14}/></a></div><p>© 2026 SMOKIE MADRIZ<br/><span className="footer-credit">MADE WITH <b aria-label="amor">💜</b> BY <a href="https://altherasolutions.com" target="_blank" rel="noreferrer">ALTHERA</a></span></p></footer>
    <Booking open={booking} onClose={() => setBooking(false)} />
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
