import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';
import { STORES } from '../../data/stores';
import { won, fmtSec, distText } from '../../utils/format';

export function StoreDetail() {
  const { state, dispatch, flash } = useApp();
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

  const remainSec = store.urgent ? Math.max(0, store.secLeft - state.tick) : 0;
  const badge = store.type === '1+1' ? '1+1' : `${store.pct}%`;
  const afterText = store.type === '1+1' ? `${won(store.before)}원 · 1+1` : `${won(store.after)}원`;
  const hasCoupon = state.coupons.includes(store.id);
  const isFav = state.favorites.includes(store.id);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.hero}>
          <View style={StyleSheet.absoluteFill}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View key={i} style={[styles.heroStripe, { top: i * 20 }]} />
            ))}
          </View>
          <View style={[styles.heroGrad, StyleSheet.absoluteFill]} />
          <TouchableOpacity style={styles.backBtn} onPress={() => dispatch({ type: 'BACK' })}>
            <Text style={{ color: C.text, fontSize: 20 }}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartBtn} onPress={() => dispatch({ type: 'TOGGLE_FAV', payload: store.id })}>
            <Text style={{ color: isFav ? C.yellow : C.text, fontSize: 20 }}>
              {isFav ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.heroLabel}>매장 사진</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.badges}>
            {store.urgent && (
              <View style={styles.urgentBadge}><Text style={styles.urgentText}>마감임박</Text></View>
            )}
            <Text style={styles.catText}>{store.cat}</Text>
          </View>
          <Text style={styles.storeName}>{store.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.rating}>★ {store.rating.toFixed(1)}</Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.distText}>{distText(store.dist)}</Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.eventText}>{store.event}</Text>
          </View>

          {/* Discount box */}
          <View style={styles.discountBox}>
            <View style={styles.discountTop}>
              <View style={styles.discountLeft}>
                <Text style={styles.discountPct}>{badge}</Text>
                <Text style={styles.discountLabel}>할인</Text>
              </View>
              {store.urgent && (
                <View style={styles.countdownRow}>
                  <Animated.View style={[styles.blinkDot, { opacity: blink }]} />
                  <Text style={styles.countdownText}>{fmtSec(remainSec)}</Text>
                </View>
              )}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.discountPrice}>{afterText}</Text>
              {store.type !== '1+1' && (
                <Text style={styles.beforePrice}>{won(store.before)}원</Text>
              )}
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${Math.round(store.qty / store.total * 100)}%` }]} />
              </View>
              <Text style={styles.qtyText}>{store.qty}개 남음</Text>
            </View>
          </View>

          {/* Store info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>{store.hours}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{store.addr}</Text>
            </View>
          </View>

          {/* Mini map */}
          <View style={styles.miniMap}>
            <View style={styles.miniMapContent}>
              <View style={styles.miniPin}>
                <View style={[styles.miniPinBadge, { backgroundColor: C.yellow }]}>
                  <Text style={styles.miniPinText}>{badge}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.routeBtn} onPress={() => flash('길안내를 시작할게요')}>
              <Text style={{ color: C.yellow, fontSize: 14 }}>✈</Text>
              <Text style={styles.routeText}>길찾기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => dispatch({ type: 'TOGGLE_FAV', payload: store.id })}
        >
          <Text style={{ color: isFav ? C.yellow : C.textSub, fontSize: 22 }}>
            {isFav ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
        {!hasCoupon ? (
          <TouchableOpacity
            style={styles.couponBtn}
            onPress={() => {
              dispatch({ type: 'GET_COUPON', payload: store.id });
              flash('쿠폰함에 담았어요');
            }}
          >
            <Text style={styles.couponBtnText}>쿠폰 받기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.couponBtn}
            onPress={() => dispatch({ type: 'OPEN_REDEEM', payload: { id: store.id, tick: state.tick } })}
          >
            <Text style={styles.couponBtnText}>쿠폰 사용하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  hero: { height: 280, backgroundColor: C.cardInput, position: 'relative' },
  heroStripe: { position: 'absolute', left: 0, right: 0, height: 13, backgroundColor: '#222A33', transform: [{ rotate: '135deg' }] },
  heroGrad: { opacity: 0 },
  backBtn: { position: 'absolute', left: 18, top: 56, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(4,6,10,0.55)', alignItems: 'center', justifyContent: 'center' },
  heartBtn: { position: 'absolute', right: 18, top: 56, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(4,6,10,0.55)', alignItems: 'center', justifyContent: 'center' },
  heroLabel: { position: 'absolute', left: 18, bottom: 10, fontFamily: 'monospace', fontSize: 10.5, color: '#7A828D' },
  content: { padding: 20, marginTop: -30, position: 'relative' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  urgentBadge: { backgroundColor: C.orange, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 9 },
  urgentText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  catText: { fontSize: 12, color: C.textSub },
  storeName: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.6, marginTop: 9 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7 },
  rating: { fontSize: 12.5, color: C.yellow, fontWeight: '700' },
  divider: { fontSize: 12, color: '#3A434F' },
  distText: { fontFamily: 'monospace', fontSize: 12.5, color: C.textSub },
  eventText: { fontSize: 12.5, color: C.textSub },
  discountBox: { marginTop: 18, backgroundColor: C.orangeBg, borderWidth: 1, borderColor: C.orangeBorder, borderRadius: 18, padding: 18 },
  discountTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  discountLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 9 },
  discountPct: { fontSize: 30, fontWeight: '800', color: C.yellow, letterSpacing: -1 },
  discountLabel: { fontSize: 14, color: '#8A929D', fontWeight: '600' },
  countdownRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  blinkDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.orange },
  countdownText: { fontFamily: 'monospace', fontSize: 15, fontWeight: '700', color: C.orangeText },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 9, marginTop: 13 },
  discountPrice: { fontSize: 22, fontWeight: '800', color: C.text },
  beforePrice: { fontSize: 14, color: '#6B5048', textDecorationLine: 'line-through' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 15 },
  progressBg: { flex: 1, height: 7, backgroundColor: '#2A1C16', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 4 },
  qtyText: { fontFamily: 'monospace', fontSize: 11.5, color: C.yellow, fontWeight: '700' },
  infoCard: { marginTop: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15 },
  infoIcon: { fontSize: 18 },
  infoText: { fontSize: 13.5, color: '#C4CAD2' },
  infoDivider: { height: 1, backgroundColor: C.cardInput },
  miniMap: { marginTop: 14, height: 150, backgroundColor: '#0F141B', borderWidth: 1, borderColor: C.border, borderRadius: 16, position: 'relative' },
  miniMapContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  miniPin: { alignItems: 'center' },
  miniPinBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  miniPinText: { fontSize: 12, fontWeight: '800', color: C.bg },
  routeBtn: { position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.bg, borderWidth: 1, borderColor: '#3A434F', paddingHorizontal: 15, paddingVertical: 9, borderRadius: 11 },
  routeText: { fontSize: 12.5, fontWeight: '700', color: C.text },
  bottomBar: { flexDirection: 'row', gap: 11, alignItems: 'center', padding: 13, paddingBottom: 28, backgroundColor: C.bgDark, borderTopWidth: 1, borderTopColor: '#1A1F27' },
  favBtn: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  couponBtn: { flex: 1, height: 52, backgroundColor: C.yellow, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  couponBtnText: { fontSize: 15.5, fontWeight: '800', color: C.bg },
});
