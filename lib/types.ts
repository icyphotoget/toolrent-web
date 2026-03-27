// ============================================================
// TYPES
// ============================================================
export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  pricePerDay: number;
  deposit: number; // povratni polog / kaucija
  image: string;
  description: string;
  specs: string[];
  available: boolean;
  nextAvailableDate?: string; // ISO date if not available
  brand: string;
}

export type ToolCategory = 'electric' | 'garden' | 'scaffolding' | 'construction';

export interface BookingItem {
  tool: Tool;
  startDate: Date;
  endDate: Date;
  days: number;
  subtotal: number;
  discount: number; // 0.2 if 3+ days
  total: number;
}

export interface CartStore {
  items: BookingItem[];
  addItem: (tool: Tool, startDate: Date, endDate: Date) => void;
  removeItem: (toolId: string) => void;
  clearCart: () => void;
  totalDays: number;
  subtotal: number;
  discount: number;
  total: number;
  totalDeposit: number;
}

export interface CheckoutData {
  name: string;
  phone: string;
  address: string;
  pickup: boolean; // true = osobno preuzimanje
  payment: 'gotovina' | 'kartica';
  note?: string;
}

// ============================================================
// TOOL DATA (mock — Supabase-ready)
// ============================================================
export const TOOLS: Tool[] = [
  {
    id: '1',
    name: 'DeWalt DCD791 aku bušilica',
    category: 'electric',
    brand: 'DeWalt',
    pricePerDay: 12,
    deposit: 80,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
    description: 'Snažna aku bušilica s 2 brzine, LED svjetlom i kompaktnim dizajnom. Idealna za kućne radove i lakše profesionalne primjene.',
    specs: ['18V Litij-ionska', '2 brzine', 'LED radno svjetlo', 'Težina: 1.6 kg'],
    available: true,
  },
  {
    id: '2',
    name: 'Makita HR2470 čekić',
    category: 'electric',
    brand: 'Makita',
    pricePerDay: 18,
    deposit: 120,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
    description: 'Elektropneumatska čekić bušilica za bušenje u beton i opeku. 5 kg s SDS-plus stezaljkom.',
    specs: ['800W motor', 'SDS-plus', '3 načina rada', 'Energija udarca: 2.9 J'],
    available: false,
    nextAvailableDate: '2026-04-05',
  },
  {
    id: '3',
    name: 'Bosch GSB 180-LI set',
    category: 'electric',
    brand: 'Bosch',
    pricePerDay: 10,
    deposit: 60,
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80',
    description: 'Aku bušilica s dva akumulatora i punjačem. Set uključuje kutnu brusku i svrdla.',
    specs: ['18V / 2.0Ah', '2 akumulatora', 'Brzi punjač', 'Vreća za alat'],
    available: true,
  },
  {
    id: '4',
    name: 'STIHL MS 193 C-E motorna pila',
    category: 'garden',
    brand: 'STIHL',
    pricePerDay: 25,
    deposit: 150,
    image: 'https://images.unsplash.com/photo-1591324573441-d98b73b86b44?w=600&q=80',
    description: 'Profesionalna lančana pila za sječu i obradu drva. Ergonomski dizajn s anti-vibracijskim sustavom.',
    specs: ['35cm vodilica', '2-MIX motor', 'Anti-vibracija', 'Težina: 3.6 kg'],
    available: true,
  },
  {
    id: '5',
    name: 'Viking ME 235 Električna sjekačica',
    category: 'garden',
    brand: 'Viking',
    pricePerDay: 20,
    deposit: 100,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    description: 'Električna sjekačica za grane do 35 mm. Tiha, lagana i jednostavna za rukovanje.',
    specs: ['230V / 2500W', 'Max promjer reza: 35 mm', 'Tiha: 92 dB', 'Težina: 4.5 kg'],
    available: true,
  },
  {
    id: '6',
    name: 'Honda UMK 435 motičnica',
    category: 'garden',
    brand: 'Honda',
    pricePerDay: 28,
    deposit: 140,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    description: 'Motorina motičnica za obradu tla. Idealna za vrtove, vinograde i poljoprivredne površine.',
    specs: ['35cm radna širina', '4okt Briggs motor', '3 brzine unaprijed', 'Težina: 30 kg'],
    available: false,
    nextAvailableDate: '2026-04-01',
  },
  {
    id: '7',
    name: 'Aluminijska skela 135x165cm',
    category: 'scaffolding',
    brand: 'Euro scaffolds',
    pricePerDay: 15,
    deposit: 200,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    description: 'Profesionalna aluminijska skela za radove na visini do 3m. Brza montaža, nosivost 200 kg/m².',
    specs: ['135x165 cm platforma', 'Do 3m visine', '200 kg/m² nosivost', 'EN1004 norma'],
    available: true,
  },
  {
    id: '8',
    name: 'Ljestve alum. 7.5m profesionalne',
    category: 'scaffolding',
    brand: 'Zarges',
    pricePerDay: 8,
    deposit: 80,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
    description: 'Višenamjenske aluminijske ljestve 7.5m s mehanizmom za penjanje. Za unutarnju i vanjsku upotrebu.',
    specs: ['7.5m dužina', '3x11 gazišta', '150 kg nosivost', 'EN131 norma'],
    available: true,
  },
  {
    id: '9',
    name: 'Mini bager JCB 8035 ZTS',
    category: 'construction',
    brand: 'JCB',
    pricePerDay: 120,
    deposit: 800,
    image: 'https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=600&q=80',
    description: 'Kompaktni mini bager za iskope i zemljane radove. 3.5t s kabinom i klima uređajem.',
    specs: ['3.5 tone', 'Kabina s AC', 'Dubina iskopa: 3.5m', 'Širina: 1.7m'],
    available: false,
    nextAvailableDate: '2026-04-10',
  },
  {
    id: '10',
    name: 'Komprimator zraka Atlas Copco',
    category: 'construction',
    brand: 'Atlas Copco',
    pricePerDay: 60,
    deposit: 300,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    description: 'Mobilni komprimator zraka za pneumatske alate i pranje. Tiha izvedba s niskom potrošnjom.',
    specs: ['7 bar / 500 l/min', 'Diesel pogon', 'Tihi rad: 68 dB', 'Težina: 350 kg'],
    available: true,
  },
  {
    id: '11',
    name: 'Bezrazine pila DeWalt DCS570',
    category: 'electric',
    brand: 'DeWalt',
    pricePerDay: 14,
    deposit: 90,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
    description: 'Aku kružna pila 18V za rezanje drva i građevinskih materijala. Precizno vođenje s vodičem.',
    specs: ['184mm oštrica', '18V', '4500 o/min', 'Dubina reza: 64mm'],
    available: true,
  },
  {
    id: '12',
    name: 'Tračna pila za metal Scheppach',
    category: 'construction',
    brand: 'Scheppach',
    pricePerDay: 22,
    deposit: 120,
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80',
    description: 'Tračna pila za rezanje metala, plastike i aluminija. Varijabilna brzina za različite materijale.',
    specs: ['Brzina: 30-80 m/min', 'Max rezanje okruglo: 115mm', 'Maso stezanja', '250W motor'],
    available: true,
  },
  {
    id: '13',
    name: 'Hilti TE 55 rotary hammer drill',
    category: 'electric',
    brand: 'Hilti',
    pricePerDay: 25,
    deposit: 200,
    image: '/hilti-te55.jpg',
    description: 'Profesionalni rotacijski čekić za bušenje u beton i opeku. Sadrži kofer, mazivo i dubinski štap.',
    specs: ['TE 55 model', 'SDS-plus stezaljka', 'Ukupno u koferu', 'Servis indikator'],
    available: true,
  },
  {
    id: '14',
    name: 'Hilti SF 121-A aku bušilica + punjač',
    category: 'electric',
    brand: 'Hilti',
    pricePerDay: 20,
    deposit: 180,
    image: '/hilti-sf121a.jpg',
    description: 'Aku bušilica s punjačem SFC 7/18 i dvije baterije 3.0 Ah NiMH. Set za profesionalce.',
    specs: ['18V / 3.0 Ah NiMH', 'Punjač SFC 7/18', '2 baterije', 'U koferu'],
    available: true,
  },
  {
    id: '15',
    name: 'Makita alat + kofer',
    category: 'electric',
    brand: 'Makita',
    pricePerDay: 15,
    deposit: 100,
    image: '/makita-case.jpg',
    description: 'Makita profesionalni alat u plavom koferu. Kompletan set za razne primjene.',
    specs: ['Makita kofer', 'Profesionalni set', 'Više komada', 'Odlično stanje'],
    available: true,
  },
  {
    id: '16',
    name: 'Miješalica za cement',
    category: 'construction',
    brand: 'NANEX',
    pricePerDay: 20,
    deposit: 100,
    image: '/cement-mixer.jpg',
    description: 'Prijenosna miješalica za cement. Potrebno predhodno oprati/odstraniti suhi cement prije korištenja.',
    specs: ['Električni pogon', 'Prijenosna', 'Za manje građevinske radove', 'Potrebno očistiti prije upotrebe'],
    available: true,
  },
];

export const CATEGORIES: { value: ToolCategory; label: string; icon: string }[] = [
  { value: 'electric', label: 'Električni alat', icon: 'Drill' },
  { value: 'garden', label: 'Vrtni strojevi', icon: 'Trees' },
  { value: 'scaffolding', label: 'Skele i ljestve', icon: 'Ladder' },
  { value: 'construction', label: 'Građevinska oprema', icon: 'HardHat' },
];

export const DISCOUNT_THRESHOLD_DAYS = 3;
export const DISCOUNT_RATE = 0.2; // 20% popust

export function calcRentalPrice(pricePerDay: number, days: number) {
  const subtotal = pricePerDay * days;
  const discount = days >= DISCOUNT_THRESHOLD_DAYS ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  return { subtotal, discount, total: subtotal - discount };
}
