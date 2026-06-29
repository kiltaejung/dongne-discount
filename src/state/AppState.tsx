import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { STORES, PRODUCTS, Product } from '../data/stores';
import { nowMin, parseMin } from '../utils/format';

export type EventItem = {
  id: string;
  pid: string;
  promoType: 'discount' | 'gift' | 'service';
  pct: number;
  regular: number;
  sale: number;
  gift: string;
  qty: number;
  total: number;
  secLeft: number;
};

export type AppStateType = {
  role: 'customer' | 'owner';
  roleMenuOpen: boolean;
  tick: number;
  toast: string | null;
  // customer
  variant: 'A' | 'B' | 'C';
  cTab: 'home' | 'map' | 'coupons' | 'favorites';
  cScreen: 'main' | 'detail' | 'redeem';
  selectedId: string | null;
  category: string;
  coupons: string[];
  favorites: string[];
  redeemStart: number;
  // owner
  oTab: 'home' | 'stats' | 'coach' | 'store';
  oScreen: 'main' | 'register' | 'qr';
  events: EventItem[];
  regStep: number;
  regProduct: string | null;
  regPromoType: 'discount' | 'gift' | 'service';
  regMode: 'rate' | 'price';
  regPct: number;
  regSale: number;
  regRegular: number;
  regGift: string;
  regQty: number;
  regEndMode: 'duration' | 'time';
  regDuration: number;
  regEndTime: string;
  registered: boolean;
  regPush: number;
  qrEventId: string | null;
  qrState: 'scan' | 'success';
  statsPeriod: string;
};

type Action =
  | { type: 'TICK' }
  | { type: 'SET_TOAST'; payload: string | null }
  | { type: 'TOGGLE_ROLE_MENU' }
  | { type: 'CLOSE_ROLE_MENU' }
  | { type: 'SELECT_ROLE'; payload: 'customer' | 'owner' }
  | { type: 'SET_CTAB'; payload: AppStateType['cTab'] }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'OPEN_DETAIL'; payload: string }
  | { type: 'BACK' }
  | { type: 'OPEN_REDEEM'; payload: { id: string; tick: number } }
  | { type: 'GET_COUPON'; payload: string }
  | { type: 'TOGGLE_FAV'; payload: string }
  | { type: 'SET_OTAB'; payload: AppStateType['oTab'] }
  | { type: 'OPEN_REGISTER'; payload: { product: string | null; pct: number } | null }
  | { type: 'CLOSE_REG' }
  | { type: 'REG_NEXT' }
  | { type: 'REG_BACK' }
  | { type: 'SELECT_PRODUCT'; payload: string }
  | { type: 'SET_PROMO_TYPE'; payload: 'discount' | 'gift' | 'service' }
  | { type: 'SET_MODE'; payload: 'rate' | 'price' }
  | { type: 'SET_PCT'; payload: number }
  | { type: 'SET_REGULAR'; payload: number }
  | { type: 'SET_SALE'; payload: number }
  | { type: 'SET_GIFT'; payload: string }
  | { type: 'SET_END_MODE'; payload: 'duration' | 'time' }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_END_TIME'; payload: string }
  | { type: 'QTY_DELTA'; payload: number }
  | { type: 'SUBMIT_REG'; payload: { push: number; event: EventItem } }
  | { type: 'DONE_HOME' }
  | { type: 'OPEN_QR'; payload: string }
  | { type: 'CLOSE_QR' }
  | { type: 'SCAN_DONE' }
  | { type: 'SCAN_AGAIN' }
  | { type: 'END_EVENT'; payload: string }
  | { type: 'SET_PERIOD'; payload: string };

const initialEvents: EventItem[] = [
  { id: 'e1', pid: 'p1', promoType: 'discount', pct: 50, regular: 3500, sale: 1750, gift: '', qty: 8, total: 40, secLeft: 3120 },
  { id: 'e2', pid: 'p5', promoType: 'gift', pct: 0, regular: 3000, sale: 3000, gift: '아메리카노 1잔', qty: 11, total: 25, secLeft: 1500 },
];

const initialState: AppStateType = {
  role: 'customer', roleMenuOpen: false, tick: 0, toast: null,
  variant: 'A', cTab: 'home', cScreen: 'main', selectedId: null, category: '전체',
  coupons: ['s5'], favorites: ['s2', 's3'], redeemStart: 0,
  oTab: 'home', oScreen: 'main',
  events: initialEvents,
  regStep: 1, regProduct: null, regPromoType: 'discount', regMode: 'rate',
  regPct: 30, regSale: 0, regRegular: 0, regGift: '', regQty: 20,
  regEndMode: 'duration', regDuration: 60, regEndTime: '11:00',
  registered: false, regPush: 0,
  qrEventId: null, qrState: 'scan', statsPeriod: '주',
};

function reducer(state: AppStateType, action: Action): AppStateType {
  switch (action.type) {
    case 'TICK': return { ...state, tick: state.tick + 1 };
    case 'SET_TOAST': return { ...state, toast: action.payload };
    case 'TOGGLE_ROLE_MENU': return { ...state, roleMenuOpen: !state.roleMenuOpen };
    case 'CLOSE_ROLE_MENU': return { ...state, roleMenuOpen: false };
    case 'SELECT_ROLE': return action.payload === 'customer'
      ? { ...state, role: 'customer', roleMenuOpen: false, cScreen: 'main', cTab: 'home' }
      : { ...state, role: 'owner', roleMenuOpen: false, oScreen: 'main', oTab: 'home' };
    case 'SET_CTAB': return { ...state, cTab: action.payload, cScreen: 'main' };
    case 'SET_CATEGORY': return { ...state, category: action.payload };
    case 'OPEN_DETAIL': return { ...state, selectedId: action.payload, cScreen: 'detail' };
    case 'BACK': return { ...state, cScreen: 'main' };
    case 'OPEN_REDEEM': return { ...state, selectedId: action.payload.id, cScreen: 'redeem', redeemStart: action.payload.tick };
    case 'GET_COUPON': return state.coupons.includes(action.payload)
      ? state : { ...state, coupons: [...state.coupons, action.payload] };
    case 'TOGGLE_FAV': return {
      ...state,
      favorites: state.favorites.includes(action.payload)
        ? state.favorites.filter(x => x !== action.payload)
        : [...state.favorites, action.payload],
    };
    case 'SET_OTAB': return { ...state, oTab: action.payload, oScreen: 'main' };
    case 'OPEN_REGISTER': {
      const pid = action.payload?.product ?? null;
      const pr = pid ? PRODUCTS.find(p => p.id === pid) : null;
      const reg = pr?.price ?? 0;
      return {
        ...state, oScreen: 'register', regStep: 1, registered: false,
        regProduct: pid, regPromoType: 'discount', regMode: 'rate',
        regPct: action.payload?.pct ?? 30, regRegular: reg,
        regSale: reg ? Math.round(reg * 0.7) : 0,
        regGift: '', regQty: 20, regEndMode: 'duration', regDuration: 60, regEndTime: '11:00',
      };
    }
    case 'CLOSE_REG': return { ...state, oScreen: 'main' };
    case 'REG_NEXT':
      if (state.regStep === 1 && !state.regProduct) return state;
      return { ...state, regStep: Math.min(3, state.regStep + 1) };
    case 'REG_BACK': return { ...state, regStep: Math.max(1, state.regStep - 1) };
    case 'SELECT_PRODUCT': {
      const p = PRODUCTS.find(x => x.id === action.payload);
      return { ...state, regProduct: action.payload, regRegular: p!.price, regSale: Math.round(p!.price * 0.7) };
    }
    case 'SET_PROMO_TYPE': return { ...state, regPromoType: action.payload };
    case 'SET_MODE': return { ...state, regMode: action.payload };
    case 'SET_PCT': return { ...state, regPct: action.payload };
    case 'SET_REGULAR': return { ...state, regRegular: Math.max(0, action.payload) };
    case 'SET_SALE': return { ...state, regSale: Math.max(0, action.payload) };
    case 'SET_GIFT': return { ...state, regGift: action.payload };
    case 'SET_END_MODE': return { ...state, regEndMode: action.payload };
    case 'SET_DURATION': return { ...state, regDuration: action.payload };
    case 'SET_END_TIME': return { ...state, regEndTime: action.payload || '11:00' };
    case 'QTY_DELTA': return { ...state, regQty: Math.max(1, state.regQty + action.payload) };
    case 'SUBMIT_REG':
      return { ...state, registered: true, regPush: action.payload.push, events: [action.payload.event, ...state.events] };
    case 'DONE_HOME': return { ...state, oScreen: 'main', oTab: 'home', registered: false };
    case 'OPEN_QR': return { ...state, oScreen: 'qr', qrEventId: action.payload, qrState: 'scan' };
    case 'CLOSE_QR': return { ...state, oScreen: 'main' };
    case 'SCAN_DONE':
      return { ...state, qrState: 'success', events: state.events.map(e => e.id === state.qrEventId ? { ...e, qty: Math.max(0, e.qty - 1) } : e) };
    case 'SCAN_AGAIN': return { ...state, qrState: 'scan' };
    case 'END_EVENT': return { ...state, events: state.events.filter(e => e.id !== action.payload) };
    case 'SET_PERIOD': return { ...state, statsPeriod: action.payload };
    default: return state;
  }
}

type ContextType = {
  state: AppStateType;
  dispatch: React.Dispatch<Action>;
  flash: (msg: string) => void;
  prod: (id: string) => Product | undefined;
};

const AppContext = createContext<ContextType>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(interval);
  }, []);

  const flash = useCallback((msg: string) => {
    dispatch({ type: 'SET_TOAST', payload: msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 1800);
  }, []);

  const prod = useCallback((id: string) => PRODUCTS.find(p => p.id === id), []);

  return (
    <AppContext.Provider value={{ state, dispatch, flash, prod }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
