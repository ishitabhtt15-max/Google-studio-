import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView, useMotionValue } from 'motion/react';
import { ArrowRight, ChevronDown, ExternalLink, Menu, X, Globe, Cpu, Sparkles, Command, ChevronRight } from 'lucide-react';
import { PROJECTS, SKILLS, SOCIALS } from './constants';

// --- Animation Components ---

const Preloader = ({ onComplete, key }: { onComplete: () => void, key?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
    >
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl md:text-[12rem] font-black tracking-tighter text-white/5"
        >
          {count}%
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${count}%` }}
            className="h-px bg-blue-600"
          />
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-blue-500/50"
      >
        <span className="animate-pulse">Initializing System</span>
        <span className="w-1 h-1 rounded-full bg-blue-500" />
        <span>Decrypting Assets</span>
      </motion.div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Update CSS variables for flashlight effect
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.clickable')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const cursorSpringX = useSpring(mouseX, { stiffness: 500, damping: 40 });
  const cursorSpringY = useSpring(mouseY, { stiffness: 500, damping: 40 });

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-500 rounded-full pointer-events-none z-[100]"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-blue-500/30 rounded-full pointer-events-none z-[100]"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      />

      {/* Flashlight Overlay (Global) */}
      <div className="fixed inset-0 pointer-events-none z-[90] flashlight-overlay" />
    </>
  );
};

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

const TextReveal = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Marquee = ({ items, speed = 20 }: { items: string[], speed?: number }) => {
  return (
    <div className="relative flex overflow-hidden bg-white/5 py-10 border-y border-white/10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center mx-10 text-4xl md:text-6xl font-bold tracking-tighter text-white/20 uppercase">
            {item} <Sparkles className="ml-10 text-blue-500" size={32} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Layout Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Command size={18} className="text-white" />
          </div>
          LUMINA
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/50">
          {['Work', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full" />
            </a>
          ))}
          <div className="flex items-center gap-4">
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black hover:text-white transition-colors border-r border-white/10 pr-4"
            >
              RESUME
            </a>
            <Magnetic>
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black hover:scale-105 active:scale-95 transition-all">
                LET'S TALK
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-[72px] bg-black z-40 p-6"
          >
            <div className="flex flex-col gap-8 text-4xl font-bold tracking-tighter">
              {['Work', 'About', 'Contact'].map((item, i) => (
                <motion.a 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-blue-500"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const GlitchText = ({ children, className = "" }: { children: string, className?: string }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        animate={{
          x: [0, -2, 2, -2, 0],
          y: [0, 1, -1, 1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
          repeatType: "mirror",
          ease: "linear",
        }}
        className="absolute top-0 left-0 w-full h-full text-red-500/30 -z-10"
      >
        {children}
      </motion.span>
      <motion.span
        animate={{
          x: [0, 2, -2, 2, 0],
          y: [0, -1, 1, -1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
          repeatType: "mirror",
          ease: "linear",
        }}
        className="absolute top-0 left-0 w-full h-full text-blue-500/30 -z-10"
      >
        {children}
      </motion.span>
      {children}
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-6 scanline">
      {/* The Mystery Text (Hidden Layer) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
        <h2 className="text-[20vw] font-black tracking-tighter leading-none text-white/10 uppercase">
          Mystery
        </h2>
      </div>

      {/* Flashlight Revealed Layer */}
      <motion.div 
        style={{ y: y1, opacity, scale }}
        className="text-center z-10 flashlight-reveal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest mb-8 text-blue-500"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          System Online
        </motion.div>
        
        <div className="mb-8 relative">
          <motion.div
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <TextReveal className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-2">
              <GlitchText>UNVEILING</GlitchText>
            </TextReveal>
            <TextReveal className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
              THE
            </TextReveal>
            <TextReveal className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.8]">
              <GlitchText>UNKNOWN</GlitchText>
            </TextReveal>
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-white/40 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed mb-10"
        >
          We explore the intersection of human emotion and digital precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Magnetic>
            <button className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group">
              Explore Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Magnetic>
          <Magnetic>
            <button className="w-full md:w-auto bg-white/5 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
              The Dossier
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Floating Particles/Dust */}
      <div className="absolute inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, Math.random() * 100 + "%"],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Scroll to Decrypt</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"
        />
      </motion.div>
    </section>
  );
};

const ProjectCarousel = ({ projects, onProjectClick, activeTab }: { projects: any[], onProjectClick: (p: any) => void, activeTab: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  const paginate = (newDirection: number) => {
    const nextIndex = currentIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < projects.length) {
      setDirection(newDirection);
      setCurrentIndex(nextIndex);
    }
  };

  const project = projects[currentIndex];

  if (!project) return null;

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full perspective-1000 overflow-hidden rounded-[3rem] group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={project.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            rotateY: { duration: 0.4 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) paginate(-1);
            else if (info.offset.x < -100) paginate(1);
          }}
          onClick={() => onProjectClick(project)}
          className="absolute inset-0 cursor-none"
        >
          <div className="relative w-full h-full overflow-hidden rounded-[3rem] border border-white/10 bg-[#111]">
            <motion.img 
              layoutId={`img-${project.id}`}
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2s] ease-out"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 md:p-24 flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className={`px-5 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-full ${activeTab === 'UI' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {project.type}
                  </span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    {project.year} — {project.category}
                  </span>
                </div>
                <h3 className="text-7xl md:text-[12rem] font-black tracking-tighter mb-8 leading-[0.85]">
                  {project.title}
                </h3>
                <p className="text-white/60 text-xl md:text-2xl font-medium max-w-2xl mb-12 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-8">
                  <div className="flex -space-x-3">
                    {project.tags.slice(0, 4).map((tag: string) => (
                      <div key={tag} className="px-5 py-2.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {tag}
                      </div>
                    ))}
                  </div>
                  <div className="h-px w-24 bg-white/20" />
                  <div className="flex items-center gap-3 group/btn">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover/btn:text-white transition-colors">Explore Case Study</span>
                    <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all`}>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Interactive Cursor Hint */}
            <div className="absolute inset-0 flex items-center justify-between px-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
              <motion.div 
                animate={{ x: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10"
              >
                <ChevronRight className="rotate-180 text-white/40" size={32} />
              </motion.div>
              <motion.div 
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10"
              >
                <ChevronRight className="text-white/40" size={32} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-12 z-20 flex items-center gap-8 bg-black/40 backdrop-blur-xl p-4 rounded-full border border-white/10">
        <div className="flex items-center gap-4 px-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
          <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span>
          <div className="w-12 h-px bg-white/20" />
          <span>{String(projects.length).padStart(2, '0')}</span>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            disabled={currentIndex === 0}
            className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            disabled={currentIndex === projects.length - 1}
            className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all ${currentIndex === projects.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: any;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity }}
      className="group relative aspect-[4/5] md:aspect-[16/9] overflow-hidden rounded-[2rem] bg-[#111] cursor-pointer border border-white/5"
    >
      <motion.img 
        src={project.image} 
        alt={project.title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60"
      />
      
      <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-600 text-white rounded-full">
              {project.type}
            </span>
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
                {tag}
              </span>
            ))}
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
            <ExternalLink size={20} className="text-white" />
          </div>
        </div>

        <div>
          <TextReveal className="mb-2">
            <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">{project.category}</span>
          </TextReveal>
          <TextReveal>
            <h3 className="text-4xl md:text-7xl font-black tracking-tighter mb-4">{project.title}</h3>
          </TextReveal>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-base md:text-lg max-w-xl font-medium leading-relaxed"
          >
            {project.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

const Work = () => {
  return (
    <section id="work" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest mb-4">
            <div className="w-8 h-px bg-blue-500" />
            Portfolio
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
            FEATURED <br /> PROJECTS
          </h2>
          <p className="text-white/40 text-lg md:text-xl font-medium">
            We don't just build websites. We build digital experiences that leave a lasting impression.
          </p>
        </div>
        <button className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
          View All Work <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"><ArrowRight size={18} /></div>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12 md:gap-24">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

const BentoAbout = () => {
  return (
    <section id="about" className="py-32 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Bento Item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-[#111] rounded-[2.5rem] p-10 md:p-16 border border-white/5 flex flex-col justify-between min-h-[400px]"
          >
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-10">
              <Sparkles className="text-blue-500" size={32} />
            </div>
            <div>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">WE DESIGN FOR <br /> THE FUTURE.</h3>
              <p className="text-white/50 text-lg md:text-xl font-medium max-w-2xl">
                Our mission is to help brands navigate the digital landscape with confidence through cutting-edge design and technology.
              </p>
            </div>
          </motion.div>

          {/* Small Bento Item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 bg-blue-600 rounded-[2.5rem] p-10 flex flex-col justify-between text-white"
          >
            <div className="text-6xl font-black tracking-tighter">10+</div>
            <div>
              <h4 className="text-xl font-bold mb-2">YEARS OF MAGIC</h4>
              <p className="text-white/80 text-sm font-medium">Delivering world-class experiences since 2016.</p>
            </div>
          </motion.div>

          {/* Grid Items */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 bg-[#111] rounded-[2.5rem] p-10 border border-white/5"
          >
            <Globe className="text-white/20 mb-6" size={40} />
            <h4 className="text-xl font-bold mb-4 uppercase tracking-tighter">Global Reach</h4>
            <p className="text-white/40 text-sm font-medium">Working with clients from San Francisco to Tokyo.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 bg-[#111] rounded-[2.5rem] p-10 border border-white/5"
          >
            <Cpu className="text-white/20 mb-6" size={40} />
            <h4 className="text-xl font-bold mb-4 uppercase tracking-tighter">Tech Driven</h4>
            <p className="text-white/40 text-sm font-medium">Leveraging the latest tools to build robust solutions.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 bg-white rounded-[2.5rem] p-10 flex flex-col justify-between text-black"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <h4 className="text-xl font-bold tracking-tighter">JOIN 50+ HAPPY CLIENTS</h4>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10">
              HAVE A <br /> PROJECT?
            </h2>
            <p className="text-white/40 text-xl font-medium mb-10 max-w-md">
              We're always looking for new challenges and interesting people to work with.
            </p>
            <button className="group flex items-center gap-4 text-2xl font-bold tracking-tighter hover:text-blue-500 transition-colors">
              hello@lumina.studio <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">Social</h4>
              <div className="flex flex-col gap-4">
                {SOCIALS.map(s => (
                  <a key={s.name} href={s.url} className="text-lg font-bold hover:text-blue-500 transition-colors">{s.name}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">Office</h4>
              <p className="text-lg font-bold">San Francisco, CA<br />123 Digital Ave</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
          <p>© 2026 LUMINA STUDIO — ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-blue-500">Resume</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface ProjectDetailProps {
  project: any;
  onBack: () => void;
  onNext: () => void;
  key?: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onNext }) => {
  const { scrollYProgress } = useScroll();
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black min-h-screen text-white"
    >
      {/* Project Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: titleY }}
          className="z-10 text-center px-6"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs mb-6 block"
          >
            {project.category}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="text-7xl md:text-[12rem] font-black tracking-tighter leading-none"
          >
            {project.title}
          </motion.h1>
        </motion.div>

        <motion.div 
          style={{ scale: imageScale }}
          className="absolute inset-0 -z-10"
        >
          <img 
            src={project.image} 
            alt={project.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-40"
          />
        </motion.div>

        <button 
          onClick={onBack}
          className="absolute top-10 left-10 z-20 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-blue-500 transition-colors"
        >
          <X size={20} /> Close
        </button>
      </section>

      {/* Project Info Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-20">
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8 uppercase">OVERVIEW</h2>
            <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed">
              {project.longDescription}
            </p>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Client</h4>
              <p className="text-sm font-bold">{project.client}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Year</h4>
              <p className="text-sm font-bold">{project.year}</p>
            </div>
            <div className="col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Services</h4>
              <div className="flex flex-wrap gap-2">
                {project.services.map((s: string) => (
                  <span key={s} className="text-xs font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Case Study Deep Dive */}
        {project.caseStudy && (
          <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">The Problem</h3>
              <p className="text-2xl md:text-3xl font-medium tracking-tight leading-snug">
                {project.caseStudy.problem}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">The Solution</h3>
              <p className="text-2xl md:text-3xl font-medium tracking-tight leading-snug text-white/60">
                {project.caseStudy.solution}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/5 rounded-[3rem] p-12 md:p-20 border border-white/10"
            >
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-10">Research & Insights</h3>
                <ul className="space-y-6">
                  {project.caseStudy.research.map((item: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="text-blue-500 font-black">0{i + 1}</span>
                      <p className="text-lg text-white/80">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-10">Key Results</h3>
                <ul className="space-y-6">
                  {project.caseStudy.results.map((item: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5" />
                      <p className="text-lg text-white/80">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Project Gallery / Storytelling */}
      <section className="px-6 max-w-7xl mx-auto pb-32">
        {project.caseStudy?.sections ? (
          <div className="flex flex-col gap-48">
            {Object.entries(project.caseStudy.sections).map(([key, section]: [string, any], index: number) => (
              <div key={key} className="flex flex-col gap-20">
                {/* Section Header */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                  <div className="md:col-span-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-6">
                        0{index + 1}. {key.toUpperCase()}
                      </h3>
                      <h4 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                        {section.title.split(' ').map((word: string, i: number) => (
                          <span key={i} className={i === 0 ? 'text-white' : 'text-white/20'}>{word} </span>
                        ))}
                      </h4>
                      <p className="text-white/50 text-xl font-medium max-w-2xl leading-relaxed">
                        {section.description}
                      </p>
                    </motion.div>
                  </div>
                  <div className="md:col-span-4">
                    <ul className="space-y-4">
                      {section.points.map((point: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {section.images.map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="rounded-[3rem] overflow-hidden border border-white/10 aspect-[4/3] bg-[#111]"
                    >
                      <img src={img} alt={`${section.title} ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Final CTA */}
            <div className="text-center py-20">
              <p className="text-white/20 text-sm font-bold uppercase tracking-[0.5em] mb-12">End of Deep Dive</p>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-16 py-8 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all group shadow-[0_0_50px_-12px_rgba(37,99,235,0.5)]"
              >
                View Full High-Res Project on Behance
                <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-12 md:gap-24">
            {project.gallery.map((img: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="rounded-[2.5rem] overflow-hidden bg-[#111] border border-white/5"
              >
                <img 
                  src={img} 
                  alt={`Gallery ${i}`} 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Next Project Footer */}
      <section 
        onClick={onNext}
        className="py-64 px-6 bg-[#050505] cursor-pointer group overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs mb-8 block group-hover:translate-y-[-10px] transition-transform">Next Project</span>
          <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none group-hover:scale-105 transition-transform duration-700">
            {PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length].title}
          </h2>
        </div>
        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.33, 1, 0.68, 1]" />
      </section>
    </motion.div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'UI' | 'UX'>('UI');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const handleNextProject = () => {
    const currentIndex = PROJECTS.indexOf(selectedProject);
    const nextIndex = (currentIndex + 1) % PROJECTS.length;
    setSelectedProject(PROJECTS[nextIndex]);
  };

  const filteredProjects = PROJECTS.filter(p => p.type === activeTab);

  const themeColors = {
    UI: {
      accent: 'text-blue-500',
      bgAccent: 'bg-blue-600',
      border: 'border-blue-500/20',
      glow: 'shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)]'
    },
    UX: {
      accent: 'text-purple-500',
      bgAccent: 'bg-purple-600',
      border: 'border-purple-500/20',
      glow: 'shadow-[0_0_50px_-12px_rgba(147,51,234,0.3)]'
    }
  };

  const currentTheme = themeColors[activeTab];

  return (
    <div className={`bg-black text-white min-h-screen selection:bg-blue-600 selection:text-white font-sans antialiased noise transition-colors duration-1000 ${activeTab === 'UX' ? 'selection:bg-purple-600' : ''}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="loader" onComplete={() => setIsLoading(false)} />
        ) : !selectedProject ? (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden"
          >
            {/* Dynamic Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
              {activeTab === 'UI' ? (
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              ) : (
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff08 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              )}
            </div>

            <CustomCursor />
            <motion.div 
              className={`fixed top-0 left-0 right-0 h-1 z-[60] origin-left ${currentTheme.bgAccent}`} 
              style={{ scaleX }} 
            />
            
            <Navbar />
            
            <main>
              <Hero />
              <Marquee items={["User Experience", "Interface Design", "Product Strategy", "Motion Graphics", "Brand Identity"]} />
              
              <section id="work" className="py-32 px-6 max-w-7xl mx-auto relative">
                <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                  <div className="max-w-2xl">
                    <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest mb-4 ${currentTheme.accent}`}>
                      <div className={`w-8 h-px ${currentTheme.bgAccent}`} />
                      Portfolio
                    </div>
                    <motion.h2 
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl md:text-8xl font-black tracking-tighter mb-6"
                    >
                      {activeTab === 'UI' ? 'VISUAL' : 'STRATEGIC'} <br /> 
                      <span className={currentTheme.accent}>{activeTab} DESIGN</span>
                    </motion.h2>
                    <motion.p 
                      key={`${activeTab}-desc`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/40 text-lg md:text-xl font-medium max-w-md"
                    >
                      {activeTab === 'UI' 
                        ? "Focusing on aesthetics, high-fidelity interfaces, and pixel-perfect motion."
                        : "Focusing on user research, information architecture, and complex problem-solving."
                      }
                    </motion.p>
                  </div>
                  
                  {/* Enhanced UI/UX Toggle */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">Select Discipline</span>
                    <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-xl relative">
                      {['UI', 'UX'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab as 'UI' | 'UX')}
                          className={`px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all relative z-10 ${
                            activeTab === tab ? 'text-black' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          {activeTab === tab && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 bg-white rounded-full -z-10"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <ProjectCarousel 
                    projects={filteredProjects} 
                    onProjectClick={handleProjectClick} 
                    activeTab={activeTab}
                  />
                </div>
              </section>

              <BentoAbout />
              <section className="py-32">
                <Marquee items={["Innovate", "Create", "Elevate", "Design", "Build"]} speed={30} />
              </section>
            </main>
            <Footer />
          </motion.div>
        ) : (
          <ProjectDetail 
            key="detail"
            project={selectedProject} 
            onBack={() => setSelectedProject(null)}
            onNext={handleNextProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
