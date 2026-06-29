export type StoreType = {
  id: string;
  name: string;
  cat: string;
  event: string;
  closeText: string;
  deadline: string;
  dist: number;
  pct: number;
  type: 'pct' | '1+1';
  before: number;
  after: number;
  qty: number;
  total: number;
  urgent: boolean;
  secLeft: number;
  rating: number;
  addr: string;
  hours: string;
};

export const STORES: StoreType[] = [
  { id: 's1', name: '성수베이크하우스', cat: '베이커리', event: '마감 떨이', closeText: '오늘 21:00까지', deadline: '21:00', dist: 350, pct: 50, type: 'pct', before: 12000, after: 6000, qty: 8, total: 40, urgent: true, secLeft: 3120, rating: 4.7, addr: '성동구 성수이로 12', hours: '매일 08:00 - 21:00' },
  { id: 's2', name: '규카츠 도쿄 성수점', cat: '일식', event: '런치 한가 할인', closeText: '오늘 15:00까지', deadline: '15:00', dist: 420, pct: 30, type: 'pct', before: 13000, after: 9100, qty: 12, total: 30, urgent: false, secLeft: 0, rating: 4.5, addr: '성동구 아차산로 5', hours: '매일 11:00 - 21:30' },
  { id: 's3', name: '카페 노트', cat: '카페·디저트', event: '1+1 이벤트', closeText: '오늘 22:00까지', deadline: '22:00', dist: 620, pct: 0, type: '1+1', before: 5500, after: 5500, qty: 5, total: 20, urgent: false, secLeft: 0, rating: 4.8, addr: '성동구 연무장길 33', hours: '매일 10:00 - 22:00' },
  { id: 's4', name: '정성정육점', cat: '정육·청과', event: '마감 세일', closeText: '오늘 20:00까지', deadline: '20:00', dist: 780, pct: 40, type: 'pct', before: 25000, after: 15000, qty: 6, total: 15, urgent: true, secLeft: 1860, rating: 4.6, addr: '성동구 성수일로 88', hours: '매일 09:00 - 20:00' },
  { id: 's5', name: '샐러디 왕십리점', cat: '샐러드', event: '오후 할인', closeText: '오늘 18:00까지', deadline: '18:00', dist: 1100, pct: 25, type: 'pct', before: 9800, after: 7350, qty: 20, total: 40, urgent: false, secLeft: 0, rating: 4.4, addr: '성동구 왕십리로 410', hours: '매일 10:30 - 21:00' },
  { id: 's6', name: '더진국 국밥', cat: '한식', event: '저녁 전 할인', closeText: '오늘 17:00까지', deadline: '17:00', dist: 890, pct: 20, type: 'pct', before: 9000, after: 7200, qty: 14, total: 30, urgent: false, secLeft: 0, rating: 4.6, addr: '성동구 고산자로 21', hours: '매일 08:00 - 21:00' },
  { id: 's7', name: '올리브청과', cat: '정육·청과', event: '마감 세일', closeText: '오늘 21:30까지', deadline: '21:30', dist: 510, pct: 35, type: 'pct', before: 8000, after: 5200, qty: 9, total: 25, urgent: true, secLeft: 2640, rating: 4.3, addr: '성동구 성수이로 7', hours: '매일 09:00 - 21:30' },
  { id: 's8', name: '블레이즈 버거', cat: '버거', event: '사이드 증정', closeText: '오늘 21:00까지', deadline: '21:00', dist: 1300, pct: 30, type: 'pct', before: 11000, after: 7700, qty: 7, total: 20, urgent: false, secLeft: 0, rating: 4.7, addr: '성동구 광나루로 4', hours: '매일 11:00 - 22:00' },
];

export const CATS = ['전체', '베이커리', '카페·디저트', '한식', '일식', '정육·청과', '샐러드', '버거'];

export const MAP_PINS = [
  { id: 's1', left: 30, top: 34 }, { id: 's7', left: 48, top: 22 }, { id: 's2', left: 72, top: 31 },
  { id: 's3', left: 22, top: 60 }, { id: 's4', left: 63, top: 54 }, { id: 's6', left: 54, top: 70 },
];

export type Product = { id: string; name: string; price: number };

export const PRODUCTS: Product[] = [
  { id: 'p1', name: '소금빵', price: 3500 }, { id: 'p2', name: '크루아상', price: 4000 },
  { id: 'p3', name: '바게트', price: 4500 }, { id: 'p4', name: '우유식빵', price: 5000 },
  { id: 'p5', name: '에그타르트', price: 3000 }, { id: 'p6', name: '마늘바게트', price: 6000 },
];
