import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';
import { STORES } from '../../data/stores';
import { won, fmtSec, couponNo } from '../../utils/format';

function QRGrid({ seed }: { seed: string }) {
  const n = 21;
  let x = 0;
  for (const c of seed + 'NEIGHBOR') x = (x * 131 + c.charCodeAt(0)) % 99991;
  x = x || 7;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const finder = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const finderOn = (r: number, c: number) => {
    let R = r, C = c;
    if (r >= n - 7) R = r - (n - 7);
    if (c >= n - 7) C = c - (n - 7);
    const ring = R === 0 || R === 6 || C === 0 || C === 6;
    const core = R >= 2 && R <= 4 && C >= 2 && C <= 4;
    return ring || core;
  };
  const cells: boolean[] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const on = finder(r, c) ? finderOn(r, c) : rnd() > 0.52;
    cells.push(on);
  }
  return (
    <View style={qrStyles.grid}>
      {cells.map((on, i) => (
        <View key={i} style={[qrStyles.cell, { backgroundColor: on ? '#0E1116' : '#fff' }]} />
      ))}
    </View>
  );
}

const qrStyles = StyleSheet.create({
  grid: { width: 184, height: 184, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 184 / 21, height: 184 / 21 },
});

export function CouponRedeem() {
  const { state, dispatch } = useApp();
  const store = STORES.find(s => s.id === state.selectedId);
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.35, duration: 500, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (!store) return null;

  const rsec = Math.max(0, 300 - (state.tick - state.redeemStart));
  const badge = store.type === '1+1' ? '1+1' : `${store.pct}%`;
  const afterText = store.type === '1+1' ? `${won(store.before)}원 · 1+1` : `${won(store.after)}원`;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => dispatch({ type: 'BACK' })}>
        <Text style={{ color: C.text, fontSize: 20 }}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.instructions}>매장 직원에게 보여주세요</Text>
      <Text style={styles.storeName}>{store.name}</Text>
      <Text style={styles.dealInfo}>{badge} 할인 · {afterText}</Text>

      <View style={styles.qrWrapper}>
        <QRGrid seed={state.selectedId!} />
      </View>

      <View style={styles.couponNoSection}>
        <Text style={styles.couponNoLabel}>쿠폰 번호</Text>
        <Text style={styles.couponNo}>{couponNo(store.id)}</Text>
      </View>

      <View style={styles.timer}>
        <Animated.View style={[styles.blinkDot, { opacity: blink }]} />
        <Text style={styles.timerLabel}>유효시간</Text>
        <Text style={styles.timerValue}>{fmtSec(rsec)}</Text>
      </View>

      <Text style={styles.notice}>직원이 QR 또는 번호를 확인하면{'\n'}자동으로 수량이 차감됩니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15110A', alignItems: 'center', paddingTop: 64 },
  closeBtn: { position: 'absolute', left: 18, top: 56, width: 40, height: 40, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  instructions: { fontSize: 12, fontWeight: '700', color: C.yellow, letterSpacing: 1 },
  storeName: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.4, marginTop: 8 },
  dealInfo: { marginTop: 5, fontSize: 14, color: C.textSub },
  qrWrapper: { marginTop: 26, backgroundColor: '#fff', padding: 18, borderRadius: 22 },
  couponNoSection: { marginTop: 20, alignItems: 'center', gap: 4 },
  couponNoLabel: { fontSize: 11, color: C.textDim, fontWeight: '600' },
  couponNo: { fontFamily: 'monospace', fontSize: 20, fontWeight: '700', color: C.text, letterSpacing: 2 },
  timer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.orangeBg, borderWidth: 1, borderColor: C.orangeBorder, borderRadius: 13, paddingHorizontal: 18, paddingVertical: 11 },
  blinkDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.orange },
  timerLabel: { fontSize: 13, color: C.orangeText, fontWeight: '600' },
  timerValue: { fontFamily: 'monospace', fontSize: 18, fontWeight: '700', color: C.yellow },
  notice: { position: 'absolute', bottom: 38, fontSize: 11.5, color: C.textDim2, textAlign: 'center', lineHeight: 20, paddingHorizontal: 40 },
});
