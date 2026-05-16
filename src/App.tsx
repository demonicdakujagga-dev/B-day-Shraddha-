import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Stars, 
  Music, 
  Music2, 
  Gift, 
  Cake, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Share2,
  RotateCcw
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCreative, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

// --- Types ---
interface ScrapbookPageProps {
  title: string;
  content: string;
  image?: string;
  stickers?: React.ReactNode[];
  bgColor?: string;
}

// --- Components ---

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 100,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0.3
          }}
          animate={{ 
            y: -100,
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 50}px)`,
            opacity: [0.3, 0.6, 0.3],
            rotate: 360
          }}
          transition={{ 
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          className="absolute text-brand-pink/40"
        >
          {i % 3 === 0 ? <Heart fill="currentColor" size={24} /> : 
           i % 3 === 1 ? <Stars size={20} /> : <Sparkles size={16} />}
        </motion.div>
      ))}
    </div>
  );
};

const Sticker = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    whileHover={{ scale: 1.1, rotate: 5 }}
    className={`sticker ${className}`}
  >
    {children}
  </motion.div>
);

const GiftBox = ({ onOpen }: { onOpen: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    onOpen();
  };

  return (
    <div className="relative cursor-pointer group" onClick={handleOpen}>
      <motion.div
        animate={isOpen ? { scale: [1, 1.2, 0], opacity: [1, 1, 0], rotate: [0, 10, -10, 0] } : { y: [0, -5, 0] }}
        transition={isOpen ? { duration: 0.5 } : { duration: 2, repeat: Infinity }}
        className="text-brand-gold relative z-10"
      >
        <Gift size={80} fill={isOpen ? "none" : "currentColor"} className="drop-shadow-lg" />
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/90 p-4 rounded-xl shadow-2xl border-2 border-brand-pink text-center w-64 z-20">
              <p className="font-handwriting text-2xl text-pink-600">Surprise!</p>
              <p className="text-sm text-gray-600 mt-2">You are the light of my life. May every dream of yours come true today!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Background music initialization (Instrumental)
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.log("Audio play failed, user interaction required first."));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleOpenCard = () => {
    console.log("Opening card...");
    setIsOpen(true);
    // GSAP 3D card open animation
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: -180,
        duration: 1.8,
        ease: "power3.inOut"
      });
    }
    
    // Celebration
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fce4ec', '#fff3e0', '#f3e5f5', '#d4af37']
      });
    }, 1000);
  };

  const resetCard = () => {
    setIsOpen(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: 0,
        duration: 1.2,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <ParticleBackground />

      {/* Music Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 glass-card p-3 text-brand-gold cursor-pointer"
      >
        {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>

      {/* Main Card Container */}
      <div className="relative [perspective:2000px] w-full max-w-4xl h-[600px] md:h-[700px]">
        <div 
          ref={cardRef}
          className="relative w-full h-full [transform-style:preserve-3d] origin-left"
        >
          {/* --- Front Face (Cover) --- */}
          <div className="absolute inset-0 [backface-visibility:hidden] z-20 overflow-hidden rounded-3xl paper-texture border-4 border-white flex flex-col items-center justify-center text-center p-8 shadow-2xl">
            <div className="tape top-10 left-1/2 -translate-x-1/2" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Cake className="w-24 h-24 text-brand-pink mb-6 drop-shadow-md mx-auto" />
              <h1 className="font-cursive text-5xl md:text-7xl text-brand-gold mb-4 leading-tight">
                For Someone Special
              </h1>
              <p className="font-sans text-lg text-gray-500 italic max-w-md">
                "Life is a scrapbook of beautiful moments. Today, we add a golden page for you."
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCard}
              className="mt-12 bg-brand-gold text-white px-10 py-4 rounded-full font-sans font-semibold text-xl shadow-lg hover:shadow-brand-gold/30 transition-all flex items-center gap-2 group cursor-pointer"
            >
              Open Card
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Decorations */}
            <Sticker className="top-10 left-10 text-brand-pink opacity-40"><Heart size={48} /></Sticker>
            <Sticker className="bottom-10 right-10 text-brand-lavender opacity-60 rotate-12"><Stars size={64} /></Sticker>
          </div>

          {/* --- Back Face (Inside Cover) --- */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] z-10 paper-texture rounded-3xl border-4 border-white shadow-2xl overflow-hidden">
             {/* This page is what shows when the card is open, technically the swiper will live inside here or next to it */}
             <div className="w-full h-full bg-brand-peach/20 flex flex-col p-12">
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isOpen ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1 }}
                  >
                    <h2 className="font-cursive text-4xl text-brand-gold mb-6 italic">A Message from the Heart</h2>
                    <div className="max-w-lg mx-auto">
                        <p className="font-handwriting text-3xl text-gray-700 leading-relaxed">
                          May your day be filled with laughter, your year with wisdom, and your life with endless love. You are truly unique and deserve all the magic the universe has to offer.
                        </p>
                    </div>
                  </motion.div>
                </div>
             </div>
          </div>
        </div>

        {/* --- Content Behind (The Inner Pages) --- */}
        <div className={`absolute inset-0 z-0 bg-white rounded-3xl overflow-hidden shadow-2xl transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <Swiper
            modules={[Navigation, Pagination, EffectCreative, Autoplay]}
            navigation={{
               prevEl: '.prev-btn',
               nextEl: '.next-btn',
            }}
            pagination={{ clickable: true }}
            effect={'creative'}
            creativeEffect={{
              prev: { shadow: true, translate: [0, 0, -400] },
              next: { translate: ['100%', 0, 0] },
            }}
            className="w-full h-full"
          >
            {/* Page 1: Sweet Memories */}
            <SwiperSlide>
              <div className="scrapbook-page bg-brand-pink/5">
                <div className="tape top-8 left-8" />
                <h3 className="font-cursive text-4xl text-brand-gold mb-8 mt-4">Sweetest Memories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                   <div className="polaroid-frame -rotate-3">
                      <div className="bg-slate-100 w-full aspect-square flex items-center justify-center overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400" alt="Memory" className="w-full h-full object-cover" />
                      </div>
                      <p className="font-handwriting text-xl mt-4 text-gray-600">The best times...</p>
                   </div>
                   <div className="font-handwriting text-2xl text-gray-700 space-y-4 px-6 md:px-0">
                      <p>Do you remember that sunny afternoon by the park? The way we couldn't stop laughing at the simplest things?</p>
                      <p>Those are the moments I treasure most. Every memory with you is a gift I've tucked away in my heart.</p>
                   </div>
                </div>
                <Sticker className="bottom-10 right-10 text-brand-gold"><Sparkles size={40} /></Sticker>
              </div>
            </SwiperSlide>

            {/* Page 2: The Secret Surprise */}
            <SwiperSlide>
              <div className="scrapbook-page bg-brand-lavender/5">
                <h3 className="font-cursive text-4xl text-brand-gold mb-12">A Little Surprise...</h3>
                <GiftBox onOpen={() => {
                  confetti({
                    particleCount: 100,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ['#FFD700', '#FFA500', '#FF69B4']
                  });
                }} />
                <p className="mt-8 font-handwriting text-xl text-gray-500 italic">(Click to open the gift!)</p>
                
                <div className="mt-12 flex gap-4">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      className="text-brand-pink"
                    >
                      <Heart fill="currentColor" size={32} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </SwiperSlide>

            {/* Page 3: Final Wishes */}
            <SwiperSlide>
              <div className="scrapbook-page bg-brand-peach/5">
                <h3 className="font-cursive text-4xl text-brand-gold mb-6 leading-tight">Happiest Birthday</h3>
                <div className="max-w-xl text-center space-y-6">
                   <p className="font-handwriting text-3xl text-gray-800 leading-relaxed">
                     As you blow out the candles, know that you are celebrated, appreciated, and loved more than words can say.
                   </p>
                   <div className="pt-8 border-t border-brand-gold/20">
                      <p className="font-sans text-sm tracking-widest uppercase text-gray-400">Made with love for you</p>
                      <div className="flex justify-center gap-6 mt-6">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied to share!");
                          }}
                          className="p-3 glass-card text-brand-gold"
                        >
                          <Share2 size={24} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          onClick={resetCard}
                          className="p-3 glass-card text-pink-400"
                        >
                          <RotateCcw size={24} />
                        </motion.button>
                      </div>
                   </div>
                </div>
                
                <motion.div 
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="mt-8 text-brand-gold font-cursive text-2xl"
                >
                  Stay Radiant ✨
                </motion.div>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Custom Navigation buttons for Swiper */}
          <button className="prev-btn absolute left-4 top-1/2 -translate-y-1/2 z-10 glass-card p-2 text-brand-gold hover:bg-white transition-all">
            <ChevronLeft size={30} />
          </button>
          <button className="next-btn absolute right-4 top-1/2 -translate-y-1/2 z-10 glass-card p-2 text-brand-gold hover:bg-white transition-all">
            <ChevronRight size={30} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-300 text-xs font-sans tracking-widest uppercase opacity-20 hover:opacity-100 transition-opacity">
        Designed with Love • 2026
      </div>
    </div>
  );
}
