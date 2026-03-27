'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, X, Plus, Minus, Calendar, MapPin,
  Drill, Trees, HardHat, Hammer, ChevronRight,
  CheckCircle, AlertTriangle, Phone, MessageCircle,
  ArrowRight, Shield, Truck, Clock, Users,
} from 'lucide-react';
import { format, differenceInDays, addDays, formatISO } from 'date-fns';
import { hr } from 'date-fns/locale';
import { Tool, ToolCategory, BookingItem, TOOLS, CATEGORIES, calcRentalPrice } from '@/lib/types';
import { useCart } from '@/lib/cart';

// ============================================================
// UTILITY
// ============================================================
function formatDate(d: Date) {
  return format(d, 'dd. MMM.', { locale: hr });
}
function formatDateISO(d: Date) {
  return format(d, 'yyyy-MM-dd');
}
function getMinDate() {
  return formatISO(new Date()).split('T')[0];
}
function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

// ============================================================
// HEADER
// ============================================================
function Header({ onCartOpen }: { onCartOpen: () => void }) {
  const cart = useCart();
  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <Drill className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-white tracking-tight">ToolRent</span>
        </div>
        <button
          onClick={onCartOpen}
          className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Košarica</span>
          {cart.items.length > 0 && (
            <motion.span
              key={cart.items.length}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-orange-600 rounded-full text-xs font-black flex items-center justify-center"
            >
              {cart.items.length}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  return (
    <section className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-5">
          <Truck className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-orange-400">Dostava diljem Osijeka i okolice</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
          Alat kad ti treba.<br />
          <span className="text-orange-500">Bez kupovine.</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Najam profesionalnog alata i strojeva — od aku bušilice do bagera.
          Jednostavno, brzo, bez pologa kartice unaprijed.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">
          {[
            { icon: <Clock className="w-3.5 h-3.5" />, text: 'Najam od 1 dana' },
            { icon: <Shield className="w-3.5 h-3.5" />, text: 'Polog samo pri preuzimanju' },
            { icon: <CheckCircle className="w-3.5 h-3.5" />, text: '600+ zadovoljnih korisnika' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 bg-dark-700/50 px-3 py-1.5 rounded-full">
              <span className="text-orange-400">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CATEGORY TABS
// ============================================================
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <Drill className="w-4 h-4" />,
  electric: <Drill className="w-4 h-4" />,
  garden: <Trees className="w-4 h-4" />,
  scaffolding: <Hammer className="w-4 h-4" />,
  construction: <HardHat className="w-4 h-4" />,
  teammate: <Users className="w-4 h-4" />,
};

function CategoryTabs({ active, onChange }: { active: ToolCategory | 'all'; onChange: (c: ToolCategory | 'all') => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${active === 'all' ? 'bg-orange-500 text-white' : 'bg-dark-700 text-slate-400 hover:bg-dark-600'}`}
      >
        {CATEGORY_ICONS.all} Svi alati
      </button>
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${active === cat.value ? 'bg-orange-500 text-white' : 'bg-dark-700 text-slate-400 hover:bg-dark-600'}`}
        >
          {CATEGORY_ICONS[cat.value]} {cat.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// TOOL CARD
// ============================================================
function ToolCard({ tool, onSelect }: { tool: Tool; onSelect: (t: Tool) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-dark-700 rounded-2xl overflow-hidden border border-dark-600 hover:border-orange-500/40 transition-colors cursor-pointer group"
      onClick={() => onSelect(tool)}
    >
      <div className="relative">
        <img src={tool.image} alt={tool.name} className="w-full h-44 object-cover" />
        <div className="absolute top-3 left-3">
          {tool.available ? (
            <span className="flex items-center gap-1 bg-green-500/90 text-white px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full" /> Dostupno
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-500/90 text-white px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Zauzeto do {tool.nextAvailableDate ? format(new Date(tool.nextAvailableDate), 'dd.MM.') : 'uskoro'}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-dark-900/80 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
          {formatEUR(tool.pricePerDay)}/dan
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide mb-1">{tool.brand}</p>
        <h3 className="text-white font-bold text-sm leading-snug mb-2">{tool.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-orange-500 font-black text-lg">{formatEUR(tool.pricePerDay)}</div>
            <div className="text-slate-500 text-xs">/ dan + {formatEUR(tool.deposit)} polog</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-3 py-1.5 text-orange-400 text-xs font-bold">
            Rezerviraj →
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// RENTAL MODAL
// ============================================================
function RentalModal({ tool, onClose, onAdd }: { tool: Tool; onClose: () => void; onAdd: () => void }) {
  const [startDate, setStartDate] = useState(getMinDate());
  const [endDate, setEndDate] = useState(getMinDate());
  const { total, discount, subtotal } = calcRentalPrice(tool.pricePerDay, Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)) + 1));
  const actualDays = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)) + 1);
  const priceCalc = calcRentalPrice(tool.pricePerDay, actualDays);
  const whatsappText = encodeURIComponent(`Upit za najam ${tool.name} od ${formatDate(new Date(startDate))} do ${formatDate(new Date(endDate))}`);
  const whatsappLink = `https://wa.me/385981234567?text=${whatsappText}`;

  const handleStart = (d: string) => {
    setStartDate(d);
    if (d > endDate) setEndDate(d);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-dark-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-800 border-b border-dark-700 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-xs text-orange-400 font-semibold">{tool.brand}</p>
            <h2 className="text-white font-black text-base">{tool.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Image */}
        <div className="relative h-48 sm:h-56">
          <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-800 to-transparent h-20" />
          <div className="absolute bottom-3 left-4">
            <div className="text-orange-500 font-black text-2xl">{formatEUR(tool.pricePerDay)} <span className="text-sm font-normal text-slate-400">/ dan</span></div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>

          {/* Specs */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specifikacije</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {tool.specs.map((spec, i) => (
                <div key={i} className="bg-dark-700 rounded-lg px-3 py-2 text-xs text-slate-300">• {spec}</div>
              ))}
            </div>
          </div>

          {/* Deposit warning */}
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-amber-400">Povratni polog: </span>
              {formatEUR(tool.deposit)} — vraćamo nakon provjere stanja alata.
            </div>
          </div>

          {/* Date picker */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Odabir datuma
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Datum od</label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={startDate}
                  onChange={e => handleStart(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Datum do</label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Price calculation */}
          <div className="bg-dark-700 rounded-xl p-4 border border-dark-600">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">{formatEUR(tool.pricePerDay)} × {actualDays} {actualDays === 1 ? 'dan' : 'dana'}</span>
                <span className="text-white font-medium">{formatEUR(priceCalc.subtotal)}</span>
              </div>
              {priceCalc.discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-between text-green-400"
                >
                  <span>Popust 20% (3+ dana)</span>
                  <span className="font-bold">−{formatEUR(priceCalc.discount)}</span>
                </motion.div>
              )}
              <div className="border-t border-dark-600 pt-2 flex justify-between font-bold">
                <span className="text-white">Ukupno najam</span>
                <span className="text-orange-500 text-lg">{formatEUR(priceCalc.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Povratni polog (pri preuzimanju)</span>
                <span>{formatEUR(tool.deposit)}</span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3">
            <button
              onClick={onAdd}
              disabled={!tool.available}
              className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-dark-600 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors text-sm"
            >
              {tool.available ? (
                <><Plus className="w-5 h-5" /> Dodaj u košaricu <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Zauzeto — dostupno od {tool.nextAvailableDate ? format(new Date(tool.nextAvailableDate), 'dd.MM.') : 'uskoro'}</>
              )}
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Upit WhatsApp
            </a>
          </div>

          {!tool.available && (
            <p className="text-xs text-center text-slate-500">
              Ili rezerviraj za datum kad se vrati — nazovi <a href="tel:+385981234567" className="text-orange-400 font-bold">098 123 4567</a>
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// CART DRAWER
// ============================================================
function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();

  const formatD = (d: Date) => formatDate(d);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-dark-800 border-l border-dark-700 flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-dark-700 flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-lg">Košarica</h2>
                <p className="text-xs text-slate-500">{cart.items.length} {cart.items.length === 1 ? 'artikl' : 'artikala'}</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 bg-dark-700 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                  <h3 className="text-slate-500 font-bold">Košarica je prazna</h3>
                  <p className="text-slate-600 text-sm mt-1">Odaberi alat i rezerviraj</p>
                </div>
              ) : (
                cart.items.map(item => (
                  <div key={item.tool.id} className="bg-dark-700 rounded-xl p-4 border border-dark-600">
                    <div className="flex gap-3">
                      <img src={item.tool.image} alt={item.tool.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-orange-400 font-semibold">{item.tool.brand}</p>
                        <h4 className="text-white font-bold text-sm truncate">{item.tool.name}</h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {formatD(item.startDate)} — {formatD(item.endDate)}
                        </div>
                      </div>
                      <button
                        onClick={() => cart.removeItem(item.tool.id)}
                        className="w-7 h-7 bg-dark-600 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-red-500/20"
                      >
                        <Minus className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.days} {item.days === 1 ? 'dan' : 'dana'}</span>
                      <div className="flex items-center gap-2">
                        {item.discount > 0 && <span className="text-green-400 font-bold">−{formatEUR(item.discount)}</span>}
                        <span className="text-orange-500 font-black text-base">{formatEUR(item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary + Checkout */}
            {cart.items.length > 0 && (
              <div className="border-t border-dark-700 p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Najam ({cart.items.length} artikala, {cart.totalDays} dana)</span>
                    <span>{formatEUR(cart.subtotal)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-400 font-bold">
                      <span>Popust 20%</span>
                      <span>−{formatEUR(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-black text-lg pt-2 border-t border-dark-600">
                    <span>Ukupno</span>
                    <span className="text-orange-500">{formatEUR(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Povratni polog (pri preuzimanju)</span>
                    <span>{formatEUR(cart.totalDeposit)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  <ArrowRight className="w-4 h-4" /> Idući korak — Dostava i plaćanje
                </button>
                <button
                  onClick={() => cart.clearCart()}
                  className="w-full text-center text-xs text-slate-500 hover:text-red-400 py-1 transition-colors"
                >
                  Isprazni košaricu
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// STICKY MOBILE CART BAR
// ============================================================
function MobileCartBar({ onOpen }: { onOpen: () => void }) {
  const cart = useCart();
  if (cart.items.length === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-dark-800 border-t border-dark-700 px-4 py-3 sm:hidden">
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-between py-3 px-5 bg-orange-500 rounded-xl text-white font-bold text-sm"
      >
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          {cart.items.length} {cart.items.length === 1 ? 'artikl' : 'artikla'}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-orange-200 text-xs">{cart.totalDays} dana</span>
          <span>{formatEUR(cart.total)}</span>
        </div>
      </button>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Drill className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-black">ToolRent</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Najam profesionalnog alata i strojeva u Osijeku i okolici.
              Od 1 dana, dostava ili osobno preuzimanje.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Kategorije</h4>
            <div className="space-y-1.5">
              {CATEGORIES.map(c => (
                <div key={c.value} className="text-slate-500 text-xs">{c.label}</div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Kontakt</h4>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-orange-400" /> 098 123 4567</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-orange-400" /> Osijek, Hrvatska</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-orange-400" /> Pon–Sub: 7–19h</div>
            </div>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-6 text-center text-xs text-slate-600">
          © 2026 ToolRent. Sva prava pridržana. Cijene su u EUR s PDV-om.
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function ToolRentPage() {
  const [category, setCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();

  const filtered = category === 'all' ? TOOLS : TOOLS.filter(t => t.category === category);

  const handleAddToCart = () => {
    if (!selectedTool) return;
    const start = new Date(selectedTool.nextAvailableDate || getMinDate());
    const end = addDays(start, 1);
    cart.addItem(selectedTool, start, end);
    setSelectedTool(null);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Hero />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category tabs */}
        <div className="mb-6">
          <CategoryTabs active={category} onChange={setCategory} />
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6 text-xs text-slate-500">
          <span>{filtered.length} {filtered.length === 1 ? 'alat' : 'alata'}</span>
          <span className="w-1 h-1 bg-dark-600 rounded-full" />
          <span className="text-green-400">{TOOLS.filter(t => t.available).length} dostupno odmah</span>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(tool => (
              <ToolCard key={tool.id} tool={tool} onSelect={setSelectedTool} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <AlertTriangle className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-slate-500">Nema alata u ovoj kategoriji</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Rental modal */}
      <AnimatePresence>
        {selectedTool && (
          <RentalModal
            tool={selectedTool}
            onClose={() => setSelectedTool(null)}
            onAdd={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile sticky bar */}
      <MobileCartBar onOpen={() => setCartOpen(true)} />
    </div>
  );
}
