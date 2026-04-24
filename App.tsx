/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Globe, Zap, Music, Menu, X, Play, ChevronLeft, ChevronRight, Linkedin, Mail, Smartphone } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ProjectCard from './components/ArtistCard';
import { Project } from './types';

// Projects Data
const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Comeralia',
    type: 'Software & Solutions',
    link: 'https://www.comeralia.com',
    image: '/images/comeralia-despacho2.jpg',
    description: 'Plataforma líder en soluciones tecnológicas para la gestión comercial y optimización de procesos empresariales.'
  },
  {
    id: '2',
    name: 'LinkedIn Professional',
    type: 'Estrategia y Network',
    link: 'https://es.linkedin.com/in/nagore-f-a53930165',
    image: '/images/linkedin-image.jpeg',
    description: 'Perfil profesional de Nagore Fernández, destacando su trayectoria en consultoría estratégica y desarrollo de negocio.'
  },
  {
    id: '3',
    name: 'Porfolio Web',
    type: 'Diseño e Innovación',
    link: 'https://ngrfdz.netlify.app',
    image: '/images/Portfolio-image.jpeg',
    description: 'Catálogo exhaustivo de proyectos e iniciativas que demuestran la versatilidad y el enfoque disruptivo de Nagore.'
  }
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-30% 0px -30% 0px'
    });

    const sections = ['proyectos', 'sobre-nagore', 'contacto'].map(id => document.getElementById(id));
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Handle keyboard navigation for project modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowLeft') navigateProject('prev');
      if (e.key === 'ArrowRight') navigateProject('next');
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateProject = (direction: 'next' | 'prev') => {
    if (!selectedProject) return;
    const currentIndex = PROJECTS.findIndex(p => p.id === selectedProject.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % PROJECTS.length;
    } else {
      nextIndex = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    }
    setSelectedProject(PROJECTS[nextIndex]);
  };

  return (
    <div className="relative min-h-screen text-[#0f172a] selection:bg-[#2563eb] selection:text-white cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-[#0f172a] cursor-default z-50 flex items-center gap-1.5 md:gap-2">
          FERGO
          <img src="/images/FERGO_LOGO.png" alt="FERGO Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-sm" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {[
            { id: 'proyectos', label: 'Proyectos' },
            { id: 'sobre-nagore', label: 'Sobre Nagore' },
            { id: 'contacto', label: 'Contacto' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`transition-all duration-300 cursor-pointer bg-transparent border-none ${
                activeSection === item.id 
                  ? 'text-[#2563eb] [text-shadow:0_0_15px_rgba(37,99,235,0.4),0_0_30px_rgba(37,99,235,0.2)]' 
                  : 'text-slate-500 hover:text-[#2563eb] hover:[text-shadow:0_0_10px_rgba(37,99,235,0.3)]'
              }`}
              data-hover="true"
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollToSection('contacto')}
          className="hidden md:inline-block border border-slate-300 px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all duration-300 text-[#0f172a] cursor-pointer bg-white/50 backdrop-blur-sm"
          data-hover="true"
        >
          Contactar
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#0f172a] z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {[
              { id: 'proyectos', label: 'Proyectos' },
              { id: 'sobre-nagore', label: 'Sobre Nagore' },
              { id: 'contacto', label: 'Contacto' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-4xl font-heading font-bold uppercase transition-all duration-300 bg-transparent border-none ${
                  activeSection === item.id 
                    ? 'text-white [text-shadow:0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(255,255,255,0.8)]' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contacto')}
              className="mt-8 border border-white px-10 py-4 text-sm font-bold tracking-widest uppercase bg-white text-black"
            >
              Contactar
            </button>

            <div className="absolute bottom-10 flex gap-6">
              <a href="https://es.linkedin.com/in/nagore-f-a53930165" className="text-white/50 hover:text-white transition-colors">LinkedIn</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.25,
                  delayChildren: 0.1,
                }
              }
            }}
            className="flex flex-col items-center w-full"
          >
            {/* Date / Location */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(15px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 70, damping: 20 } }
              }}
              className="flex items-center gap-3 md:gap-6 text-xs md:text-base font-mono text-[#2563eb] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-slate-100/60 px-4 py-2 rounded-full"
            >
              <span>Nagore Fernández</span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#2563eb] rounded-full animate-pulse" />
              <span>Strategy & Capital</span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.05, y: -50, filter: "blur(30px)" },
                show: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 40, damping: 12, mass: 1.2 } }
              }}
              className="relative w-full flex justify-center items-center"
            >
              <GradientText
                text="FERGO"
                as="h1"
                className="text-[15vw] md:text-[14vw] leading-[0.9] font-black tracking-tighter text-center"
              />
              {/* Optimized Orb - Reduced Blur for Performance */}
              <motion.div
                className="absolute -z-20 w-[50vw] h-[50vw] pointer-events-none will-change-transform"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
                style={{
                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
                  transform: 'translateZ(0)'
                }}
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { scaleX: 0, opacity: 0 },
                show: { scaleX: 1, opacity: 1, transition: { duration: 1.5, ease: "circOut" } }
              }}
              className="w-full max-w-md h-[2px] bg-gradient-to-r from-transparent via-[#2563eb]/70 to-transparent mt-4 md:mt-8 mb-6 md:mb-8 origin-center"
            />

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(15px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 70, damping: 20 } }
              }}
              className="text-base md:text-2xl font-light max-w-xl mx-auto text-slate-700 leading-relaxed drop-shadow-lg px-4"
            >
              Impulsando el futuro a través de la inversión estratégica
            </motion.p>
          </motion.div>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y border-slate-200 shadow-[0_0_40px_rgba(0,0,0,0.05)]">
          <motion.div
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {/* Duplicate content for seamless loop */}
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    FERGO CAPITAL <span className="text-black text-2xl md:text-4xl">●</span>
                    INNOVACIÓN PROFESIONAL <span className="text-black text-2xl md:text-4xl">●</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* PROJECTS SECTION */}
      <section id="proyectos" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
            <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] drop-shadow-sm break-words w-full md:w-auto text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]">
              Proyectos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200 bg-white/40 backdrop-blur-sm">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="sobre-nagore" className="relative z-10 py-20 md:py-32 bg-slate-50/60 backdrop-blur-sm border-t border-slate-200 overflow-hidden">
        {/* Decorative blurred circle */}
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] pointer-events-none will-change-transform" style={{ background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.05) 0%, transparent 60%)', transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight text-[#0f172a]">
                Sobre <br /> <GradientText text="NAGORE" className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-12 font-light leading-relaxed drop-shadow-sm">
                Nagore Fernández fusiona la visión estratégica con una ejecución impecable en el mundo del capital y la tecnología. Con una trayectoria enfocada en el crecimiento sostenible y la innovación digital en FERGO CAPITAL.
              </p>

              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: Zap, title: 'Liderazgo Estratégico', desc: 'Transformación de ideas complejas en resultados de negocio tangibles.' },
                  { icon: Globe, title: 'Visión Global', desc: 'Expandiendo horizontes a través de una red internacional de partners.' },
                  { icon: Music, title: 'Innovación Tecnológica', desc: 'Integrando soluciones de software avanzadas en entornos corporativos.' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-6"
                  >
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <feature.icon className="w-6 h-6 text-[#2563eb]" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading text-[#0f172a]">{feature.title}</h4>
                      <p className="text-sm text-slate-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative h-[400px] md:h-[600px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-3xl rotate-3 opacity-20 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-slate-200 group shadow-2xl">
                <img
                  src="/images/nagoresession.jpeg"
                  alt="Nagore Fernández Portrait"
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-50">
                    NF
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                    Founder of Fergo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contacto" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-slate-50/80 border-t border-slate-200 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-10 text-[#0f172a]">
              CONTACTO
            </h2>
            <p className="text-[#2563eb] font-mono uppercase tracking-widest -mt-3 md:-mt-8 relative z-10 text-sm md:text-base">
              Conectemos para el próximo gran paso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'LinkedIn', value: 'Nagore Fernández', icon: Linkedin, link: 'https://es.linkedin.com/in/nagore-f-a53930165', color: 'teal', accent: 'bg-white border-slate-200' },
              { name: 'Email', value: 'n.fernandez@fergocapital.com', icon: Mail, link: 'mailto:n.fernandez@fergocapital.com', color: 'mint', accent: 'bg-white border-slate-200' },
              { name: 'Teléfono', value: '944 43 82 93', icon: Smartphone, link: 'tel:+34944438293', color: 'periwinkle', accent: 'bg-white border-slate-200' },
            ].map((contact, i) => (
              <motion.a
                key={i}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -20 }}
                className={`relative p-8 md:p-10 border shadow-sm flex flex-col items-center text-center transition-colors duration-300 ${contact.accent} will-change-transform`}
                data-hover="true"
              >
                <div className="p-6 rounded-full bg-blue-50 mb-6">
                  <contact.icon className="w-8 h-8 text-[#2563eb]" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-[#0f172a] uppercase">{contact.name}</h3>
                <p className="text-lg font-bold break-all text-[#2563eb]">
                  {contact.value}
                </p>
                <div className="mt-8 text-xs font-mono tracking-widest text-slate-400 uppercase">
                  Hacer clic para contactar
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-[#0f172a] uppercase flex items-center gap-2">
              FERGO
              <img src="/images/FERGO_LOGO.png" alt="FERGO Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-sm" />
            </div>
            <div className="flex gap-2 text-xs font-mono text-slate-500">
              <span>
                created by <a href="https://es.linkedin.com/in/andermnz" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-colors underline decoration-slate-300 underline-offset-4" data-hover="true">@andermnz</a>
              </span>
            </div>
          </div>

          <div className="flex gap-6 md:gap-8 flex-wrap">
            <a href="https://es.linkedin.com/in/nagore-f-a53930165" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#2563eb] font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              LinkedIn
            </a>
            <a href="https://www.comeralia.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#2563eb] font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Comeralia
            </a>
            <a href="https://ngrfdz.netlify.app" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#2563eb] font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Porfolio
            </a>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-white border border-slate-200 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-blue-900/5 group/modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateProject('prev'); }}
                className="absolute left-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-white/80 text-slate-700 hover:bg-white hover:text-blue-600 transition-colors border border-slate-200 backdrop-blur-sm"
                data-hover="true"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateProject('next'); }}
                className="absolute right-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-white/80 text-slate-700 hover:bg-white hover:text-blue-600 transition-colors border border-slate-200 backdrop-blur-sm md:right-8"
                data-hover="true"
                aria-label="Next Project"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedProject.id}
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#2563eb] mb-4">
                    <Globe className="w-4 h-4" />
                    <span className="font-mono text-sm tracking-widest uppercase">{selectedProject.type}</span>
                  </div>

                  <h3 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-none mb-2 text-[#0f172a]">
                    {selectedProject.name}
                  </h3>

                  <div className="h-px w-20 bg-slate-200 my-6" />

                  <p className="text-slate-600 leading-relaxed text-lg font-light mb-8">
                    {selectedProject.description}
                  </p>

                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-[#2563eb] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#2563eb] hover:text-white transition-all duration-300 text-[#2563eb] cursor-pointer"
                    data-hover="true"
                  >
                    Visitar Proyecto
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;