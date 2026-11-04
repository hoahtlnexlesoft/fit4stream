import type { EventItem, ChatItem, Speaker, TicketType, PaymentMethod } from '../src';

// Replace with your API data. Image URLs are placeholders.
export const IMG = {
  xmas: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=900',
  conf: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900',
  host: 'https://i.pravatar.cc/300?img=47',
  a1: 'https://i.pravatar.cc/120?img=12', a2: 'https://i.pravatar.cc/120?img=32', a3: 'https://i.pravatar.cc/120?img=5', a4: 'https://i.pravatar.cc/120?img=15', me: 'https://i.pravatar.cc/120?img=44',
};

export const EVENTS: EventItem[] = [
  { id: 'xmas', title: 'Danang Christmas Market 2026', image: IMG.xmas, organizer: 'thao15 nguyen15', organizerAvatar: IMG.host, category: 'Concerts and Performances', status: 'live', start: '09:43', end: '12:00', dateLabel: 'Nov 03', price: '$3.99', watching: '2.4K', registered: true },
  { id: 'payout', title: 'For payout batch 5.Nov-1', image: IMG.conf, organizer: 'thao15 nguyen15', organizerAvatar: IMG.host, category: 'Concerts and Performances', status: 'ended', start: '09:50', end: '10:30', dateLabel: 'Nov 03', price: '$9.99' },
  { id: 'seo', title: 'Welcome to our topic about SEO', image: IMG.conf, organizer: 'Marc John', category: 'Virtual Conferencing', status: 'upcoming', start: '14:00', end: '15:30', dateLabel: 'Nov 05', price: 'Free' },
];

export const CHAT: ChatItem[] = [
  { id: '1', kind: 'msg', name: 'thao15 nguyen15', avatar: IMG.host, role: 'Host', text: 'Welcome everyone to the market tour!' },
  { id: '2', kind: 'msg', name: 'Nhan Doan', avatar: IMG.a1, role: 'Organizer', text: 'Q&A opens after the tour — raise your hand to join the stage!' },
  { id: '3', kind: 'system', text: 'Sandra Smith joined the stage' },
  { id: '4', kind: 'msg', name: 'Thao 13', avatar: IMG.a3, text: 'Hello from Saigon 👋' },
  { id: '5', kind: 'msg', name: 'Linh Tran', avatar: IMG.a4, text: 'The lights look amazing ✨' },
];

export const SPEAKERS: Speaker[] = [
  { id: 'h', name: 'thao15 nguyen15', role: 'Host', avatar: IMG.host, cameraOn: true, micOn: true, speaking: true },
  { id: 'o', name: 'Nhan Doan', role: 'Organizer', avatar: IMG.a1, cameraOn: true, micOn: true },
  { id: 'g', name: 'Sandra Smith', role: 'Guest', avatar: IMG.a2, cameraOn: true, micOn: false },
];

export const TICKETS: TicketType[] = [
  { id: 'std', name: 'Standard', description: 'Live access · 48h replay', price: 3.99 },
  { id: 'vip', name: 'All-access', description: 'Live + backstage chat · 30-day replay', price: 9.99, badge: 'Best value' },
];

export const METHODS: PaymentMethod[] = [
  { id: 'apple', brand: 'apple', title: 'Apple Pay', subtitle: 'Visa •••• 4242' },
  { id: 'google', brand: 'google', title: 'Google Pay', subtitle: 'Fast checkout' },
  { id: 'visa', brand: 'visa', title: 'Visa •••• 4242', subtitle: 'Expires 12/27 · Default' },
  { id: 'mc', brand: 'mastercard', title: 'Mastercard •••• 8812', subtitle: 'Expires 05/27' },
];
