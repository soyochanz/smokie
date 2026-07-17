import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Award, Check, ChevronLeft, Clock3, Flame, MapPin, Menu, RotateCw, Star, Users, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import './styles.css';

const burgers = [
  { n: '01', name: 'La Smokie', desc: 'Doble smash, cheddar madurado, pepinillo, cebolla y salsa Smokie.', price: '14,5', kcal: '1.180', allergens: 'Gluten · Leche · Huevo · Mostaza', protein: '54 g', heat: 'Suave', prep: '15 min', rating: '4.9', popular: true, video: '/assets/smokie-menu.mp4' },
  { n: '02', name: 'Burning Love', desc: 'Doble smash, gouda ahumado, jalapeño, bacon crujiente y hot honey.', price: '15', kcal: '1.260', allergens: 'Gluten · Leche · Huevo · Mostaza', protein: '58 g', heat: 'Picante', prep: '16 min', rating: '4.8', popular: true, video: '/assets/smokie-menu.mp4' },
  { n: '03', name: 'La Castiza', desc: 'Doble smash, manchego, cebolla caramelizada y mayo de ajo negro.', price: '15,5', kcal: '1.140', allergens: 'Gluten · Leche · Huevo', protein: '56 g', heat: 'Suave', prep: '14 min', rating: '4.7', video: '/assets/smokie-menu.mp4' },
  { n: '04', name: 'La Santa', desc: 'Doble smash, cheddar, bacon ahumado, cebolla crujiente y salsa Santa.', price: '16', kcal: '1.310', allergens: 'Gluten · Leche · Huevo · Mostaza', protein: '61 g', heat: 'Medio', prep: '17 min', rating: '5.0', popular: true, video: '/assets/smokie-menu.mp4' },
];

const times = ['13:30', '14:00', '14:30', '15:00', '20:30', '21:00', '21:30', '22:00', '22:30'];

function Logo() {
  return <a className="logo" href="#top" aria-label="Smokie Madriz, inicio"><span>SMOKIE</span><i>MADRIZ</i></a>;
}

function BurgerCard({ burger }) {
  const [flipped, setFlipped] = useState(false);
  return <article className={`burger-card ${flipped ? 'is-flipped' : ''}`}>
    <button className="burger-card-button" onClick={() => setFlipped(!flipped)} aria-pressed={flipped} aria-label={`${flipped ? 'Volver al vídeo de' : 'Ver información de'} ${burger.name}`}>
      <div className="burger-card-inner">
        <div className="burger-face burger-front">
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
        </div>
        <div className="burger-face burger-back">
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
        </div>
      </div>
    </button>
  </article>;
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
  const videoRef = useRef(null);
  const videoDuration = useRef(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 72, damping: 24, mass: .32, restDelta: .0001 });
  const introOpacity = useTransform(smoothProgress, [0, .16, .38], [1, 1, 0]);
  const introY = useTransform(smoothProgress, [0, .38], [0, -70]);
  const endOpacity = useTransform(smoothProgress, [.68, .86, 1], [0, 0, 1]);
  const progressScale = useTransform(smoothProgress, [0, 1], [0, 1]);
  const smokeDrift = useTransform(smoothProgress, [0, 1], ['-4%', '8%']);

  useMotionValueEvent(smoothProgress, 'change', latest => {
    if (!videoRef.current || !videoDuration.current) return;
    videoRef.current.currentTime = Math.min(videoDuration.current - .04, Math.max(.01, latest * videoDuration.current));
  });
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
          <video
            ref={videoRef}
            className="hero-scrub-video"
            src="/assets/smokie-decompose.mp4"
            preload="auto"
            autoPlay
            muted
            playsInline
            onLoadedMetadata={e => { videoDuration.current = e.currentTarget.duration; e.currentTarget.currentTime = .01; }}
            onCanPlay={e => {
              const video = e.currentTarget;
              video.pause();
              videoDuration.current = video.duration;
              video.currentTime = Math.min(video.duration - .04, smoothProgress.get() * video.duration);
            }}
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

      <section className="menu-section" id="carta">
        <div className="section-head reveal"><span>03 — LA CARTA</span><h2>LOS<br/><em>FAVORITOS.</em></h2><p>Cuatro burgers. Cero relleno.<br/>Toca cada una para descubrirla.</p></div>
        <div className="menu-grid reveal">
          {burgers.map(b => <BurgerCard burger={b} key={b.name} />)}
        </div>
        <div className="menu-foot"><span>También hay patatas, sides y cosas para mojar.</span><a href="#">VER CARTA COMPLETA <ArrowUpRight size={15}/></a></div>
      </section>

      <section className="booking-cta reveal">
        <div className="cta-top"><span>04 — TU MESA</span><span>MAR — DOM · 13:30 — 00:00</span></div>
        <h2>VEN CON<br/><em>HAMBRE.</em></h2>
        <div className="cta-bottom"><p>Nosotros ponemos<br/>el resto.</p><button className="primary light" onClick={() => setBooking(true)}>RESERVAR MESA <ArrowUpRight/></button></div>
      </section>

      <section className="location" id="visitanos">
        <div className="location-copy"><span>05 — ENCUÉNTRANOS</span><h2>JUNTO AL<br/>MEDITERRÁNEO,<br/><em>MOJÁCAR.</em></h2><p>Paseo del Mediterráneo, 237<br/>04638 Mojácar, Almería</p><a href="https://www.google.com/maps/search/?api=1&query=Paseo+del+Mediterraneo+237+Mojacar" target="_blank" rel="noreferrer">CÓMO LLEGAR <ArrowUpRight size={15}/></a><a href="tel:+34611334597">RESERVAS · 611 334 597 <ArrowUpRight size={15}/></a></div>
        <div className="map-art"><div className="map-grid"/><div className="map-pin"><span>SM</span><i>ESTÁS AQUÍ</i></div><div className="street s1">PASEO DEL MEDITERRÁNEO</div><div className="street s2">MAR MEDITERRÁNEO</div></div>
      </section>
    </main>

    <footer><Logo/><div><a href="tel:+34611334597">Reservas · 611 334 597 <ArrowUpRight size={14}/></a><a href="#">Instagram <ArrowUpRight size={14}/></a></div><p>© 2026 SMOKIE MADRIZ<br/>HECHO CON FUEGO EN MOJÁCAR.</p></footer>
    <Booking open={booking} onClose={() => setBooking(false)} />
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
