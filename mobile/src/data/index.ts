/**
 * Mock data layer. Every screen reads data ONLY through this module,
 * so wiring the real API means replacing these functions (keep the types).
 */
import raw from './events.json';
import { photo } from './images';

export type EventStatus = 'live' | 'upcoming' | 'ended';
export type AppEvent = {
  id: string;
  title: string;
  organizer: string;
  image: string;
  category: string;
  format: string[];
  type: string; // One-time | Series
  price: string; // "$3.99" | "Free"
  registers: number;
  views: number;
  likes: number;
  /** "November 09, 2026" */
  date: string;
  /** "09:43 – 137 mins" */
  time: string;
  /** "09:43 – 12:00" */
  range: string;
  tz: string;
  lang: string;
  status: EventStatus;
  about: string;
};

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Demo data is authored around Nov 3 2026 = "today"; shift so it always looks current. */
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
const SHIFT = Math.round((TODAY.getTime() - new Date(2026, 10, 3).getTime()) / 864e5);
const shift = (s: string) => {
  const m = s.match(/^(\w+) (\d+), (\d+)$/); if (!m) return s;
  const d = new Date(+m[3], MONTHS.indexOf(m[1]), +m[2] + SHIFT);
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
};

export const EVENTS: AppEvent[] = (raw.events as any[]).map((e) => ({
  ...e, image: photo(e.image), date: shift(e.date), format: e.format ?? [], about: e.about ?? '',
}));
export const getEvent = (id?: string) => EVENTS.find((e) => e.id === id) ?? EVENTS[0];

export const CATEGORIES = raw.categories.map((c) => ({ ...c, count: EVENTS.filter((e) => e.category === c.name && e.status !== 'ended').length }));
export const SHORT_CAT: Record<string, string> = {
  'Concerts and Performances': 'Concerts', 'Product Launches and Demonstrations': 'Product Launches',
  'Virtual Workshops and Training': 'Workshops', 'Social and Community': 'Community', 'Virtual Conferencing': 'Conferences',
};
export const shortCat = (c: string) => SHORT_CAT[c] ?? c;
export const CHANNELS: string[] = raw.channels;

export const eventDate = (e: AppEvent) => {
  const m = e.date.match(/^(\w+) (\d+), (\d+)$/)!;
  return new Date(+m[3], MONTHS.indexOf(m[1]), +m[2]);
};
export const startTime = (e: AppEvent) => e.range.split('–')[0].trim();
export const endTime = (e: AppEvent) => (e.range.split('–')[1] ?? '').trim();
export const durationLabel = (e: AppEvent) => (e.time.split('–')[1] ?? '').trim();
export const shortDate = (e: AppEvent) => { const d = eventDate(e); return `${MONTHS[d.getMonth()].slice(0, 3)} ${String(d.getDate()).padStart(2, '0')}`; };
export const today = () => new Date(TODAY);
export const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** Home hero: live first, then upcoming, max 10 (client rule). */
export const heroEvents = () => {
  const order = ['gig', 'xmas', 'seo'];
  const head = order.map((id) => EVENTS.find((e) => e.id === id)!).filter(Boolean);
  return [...head, ...EVENTS.filter((e) => !order.includes(e.id))].filter((e) => e.status !== 'ended').slice(0, 10);
};
export const upcomingEvents = () => EVENTS.filter((e) => e.status === 'upcoming').sort((a, b) => +eventDate(a) - +eventDate(b) || a.range.localeCompare(b.range));
export const liveEvents = () => EVENTS.filter((e) => e.status === 'live');

/* ---------- Orders / receipts ---------- */
export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed';
export type Order = { id: string; ev: string; when: string; lines: [string, number][]; total: number; pm: 'visa' | 'apple' | 'mastercard'; pmT: string; st: OrderStatus };
export const FEE = 0.49;
export const ORDERS: Record<string, Order> = Object.fromEntries(
  Object.entries(raw.orders as Record<string, any>).map(([k, o]) => [k, { ...o, id: k, pm: o.pm === 'mc' ? 'mastercard' : o.pm }]),
);
export const money = (n: number) => '$' + (Math.round(n * 100) / 100).toFixed(2);

/* ---------- Notifications ---------- */
export type Notice = { id: string; kind: 'live' | 'ticket' | 'reminder' | 'social'; title: string; body: string; when: string; unread?: boolean; action?: string; image?: string; person?: string; group: 'Today' | 'Earlier' };
export const NOTIFICATIONS: Notice[] = [
  { id: 'n1', kind: 'live', title: 'Danang Christmas Market 2026 is live', body: 'thao15 nguyen15 just went live — 2.4K watching', when: '2m', unread: true, action: 'Join', image: 'xmas', group: 'Today' },
  { id: 'n2', kind: 'ticket', title: 'Ticket confirmed', body: '2 × Standard · $6.87 paid with Visa •••• 4242', when: '15m', unread: true, action: 'Receipt', image: 'xmas', group: 'Today' },
  { id: 'n3', kind: 'reminder', title: 'Starts in 5 minutes', body: 'Welcome to our topic about SEO marketing — doors are open', when: '55m', action: 'Enter', image: 'conference', group: 'Today' },
  { id: 'n4', kind: 'social', title: 'Marc John started following you', body: 'Follow back to see when they go live', when: '2h', action: 'Follow back', person: 'Marc John', group: 'Today' },
  { id: 'n5', kind: 'reminder', title: 'How was “For payout batch 5.Nov-1”?', body: 'Tap a star to rate the event', when: 'Yesterday', image: 'conference', group: 'Earlier' },
  { id: 'n6', kind: 'ticket', title: 'Refund completed', body: '$10.48 is back on your Visa', when: 'Oct 31', image: 'conference', group: 'Earlier' },
];

/* ---------- Me ---------- */
export const ME = { first: 'Thao 13', last: 'NGUYEN13', email: 'thaonguyentest123+13@gmail.com', phone: '+1 555-0000', tickets: 1, following: 0, reviews: 0 };

/* ---------- Organizers ---------- */
export const ORGANIZERS: Record<string, { badge: string; events: string; followers: number; rating: string; reviews: number; expertise: string[]; bio: string }> = {
  'Marc John': { badge: 'Top speaker', events: '2.4k', followers: 1280, rating: '4.96', reviews: 379, expertise: ['Time management', 'Communication', 'Adaptability', 'Problem-solving', 'Teamwork', 'Leadership'], bio: 'Marc John is an entrepreneur and speaker who has founded several technology companies. He hosts live workshops on marketing, growth and productivity. Before Fit4Stream, he led product at two SaaS startups and has mentored 200+ early-stage founders. Expect practical frameworks, real case studies and plenty of time for live Q&A in every session.' },
  'thao15 nguyen15': { badge: 'Event organizer', events: '2', followers: 0, rating: '4.80', reviews: 12, expertise: ['Live music', 'Festivals', 'Travel', 'Food tours'], bio: 'thao15 nguyen15 hosts live concerts and festival tours across Vietnam — from Danang’s Christmas market to riverside music nights.' },
};
export const organizer = (name: string) => ORGANIZERS[name] ?? { badge: 'Organizer', events: '1', followers: 0, rating: '5.0', reviews: 0, expertise: [], bio: `${name} hosts live events on Fit4Stream.` };
