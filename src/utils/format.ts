export function won(n: number): string {
  return n.toLocaleString('ko-KR');
}

export function fmtSec(t: number): string {
  if (t < 0) t = 0;
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const p = (x: number) => String(x).padStart(2, '0');
  return h > 0 ? `${h}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
}

export function distText(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
}

export function couponNo(id: string): string {
  let h = 0;
  for (const c of id + 'NEIGHBOR') h = (h * 31 + c.charCodeAt(0)) % 900000;
  const n = 100000 + h;
  return `ND-${String(n).slice(0, 3)}-${String(n).slice(3)}`;
}

export function nowMin(): number {
  return 9 * 60 + 41;
}

export function parseMin(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t || '');
  return m ? +m[1] * 60 + +m[2] : nowMin() + 60;
}

export function fmtClock(min: number): string {
  min = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(min / 60);
  const mm = min % 60;
  const ap = h < 12 ? '오전' : '오후';
  const hh = h % 12 || 12;
  return `${ap} ${hh}:${String(mm).padStart(2, '0')}`;
}
