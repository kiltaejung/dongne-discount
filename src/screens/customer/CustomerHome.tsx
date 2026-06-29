import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';
import { won, fmtSec, distText } from '../../utils/format';
import { STORES, CATS, MAP_PINS } from '../../data/stores';
import { MapPlaceholder } from '../../components/MapPlaceholder';

function useBlinkAnim() {
  const anim = useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.35, duration: 500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return anim;
}

function StoreCard({ store }: { store: ReturnType<typeof buildStoreView> }) {
  const { dispatch, flash } = useApp();
  const blink = useBlinkAnim();
  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => dispatch({ type: 'OPEN_DETAIL', payload: store.id })}
      activeOpacity={0.85}
    >
      <View style={cardStyles.image}>
        <View style={StyleSheet.absoluteFill}>
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={[cardStyles.stripe, { top: i * 15 }]} />
          ))}
        </View>
        <View style={cardStyles.imageRow}>
          <View style={[cardStyles.badge, store.urgent ? { backgroundColor: C.orange } : {}]}>
            <Text style={[cardStyles.badgeText, store.urgent ? { color: '#fff' } : {}]}>{store.badge}</Text>
          </View>
          {store.urgent && (
            <View style={cardStyles.urgentBadge}>
              <Text style={cardStyles.urgentText}>마감임박</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={cardStyles.heart}
          onPress={(e) => { dispatch({ type: 'TOGGLE_FAV', payload: store.id }); }}
        >
          <Text style={{ color: store.isFav ? C.yellow : C.text, fontSize: 18 }}>
            {store.isFav ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
        <Text style={cardStyles.photoLabel}>매장 사진</Text>
      </View>
      <View style={cardStyles.body}>
        <View style={cardStyles.nameRow}>
          <Text style={cardStyles.name}>{store.name}</Text>
          <Text style={cardStyles.dist}>{store.distText}</Text>
        </View>
        <Text style={cardStyles.catText}>{store.cat} · {store.event}</Text>
        <View style={cardStyles.priceRow}>
          <Text style={cardStyles.price}>{store.afterText}</Text>
          {store.showStrike && <Text style={cardStyles.strike}>{store.beforeText}</Text>}
        </View>
        <View style={cardStyles.qtyRow}>
          <View style={cardStyles.progressBg}>
            <View style={[cardStyles.progressFill, { width: `${store.barPct}%` }]} />
          </View>
          <Text style={cardStyles.qtyText}>{store.qtyText}</Text>
        </View>
        <View style={cardStyles.footer}>
          <Text style={[cardStyles.timeText, { color: store.timeColor }]}>{store.timeText}</Text>
          <TouchableOpacity
            style={cardStyles.couponBtn}
            onPress={(e) => {
              const had = store.hasCoupon;
              dispatch({ type: 'GET_COUPON', payload: store.id });
              flash(had ? '이미 받은 쿠폰이에요' : '쿠폰함에 담았어요');
            }}
          >
            <Text style={cardStyles.couponBtnText}>쿠폰 받기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function UrgentCard({ store }: { store: ReturnType<typeof buildStoreView> }) {
  const { dispatch } = useApp();
  const blink = useBlinkAnim();
  return (
    <TouchableOpacity
      style={urgentStyles.card}
      onPress={() => dispatch({ type: 'OPEN_DETAIL', payload: store.id })}
      activeOpacity={0.85}
    >
      <View style={urgentStyles.header}>
        <View style={urgentStyles.badge}>
          <Text style={urgentStyles.badgeText}>{store.badge}</Text>
        </View>
        <View style={urgentStyles.countdown}>
          <Animated.View style={[urgentStyles.blinkDot, { opacity: blink }]} />
          <Text style={urgentStyles.countdownText}>{store.urgentTime}</Text>
        </View>
      </View>
      <Text style={urgentStyles.name}>{store.name}</Text>
      <Text style={urgentStyles.catDist}>{store.cat} · {store.distText}</Text>
      <View style={urgentStyles.priceRow}>
        <Text style={urgentStyles.price}>{store.afterText}</Text>
        {store.showStrike && <Text style={urgentStyles.strike}>{store.beforeText}</Text>}
      </View>
      <Text style={urgentStyles.qty}>{store.qtyText}</Text>
    </TouchableOpacity>
  );
}

function buildStoreView(store: typeof STORES[0], state: { coupons: string[]; favorites: string[]; tick: number }) {
  const remainSec = store.urgent ? Math.max(0, store.secLeft - state.tick) : 0;
  const isFav = state.favorites.includes(store.id);
  return {
    ...store,
    isFav, hasCoupon: state.coupons.includes(store.id),
    distText: distText(store.dist),
    qtyText: `${store.qty}개 남음`,
    barPct: Math.round(store.qty / store.total * 100),
    afterText: store.type === '1+1' ? `${won(store.before)}원 · 1+1` : `${won(store.after)}원`,
    beforeText: `${won(store.before)}원`,
    showStrike: store.type !== '1+1',
    badge: store.type === '1+1' ? '1+1' : `${store.pct}%`,
    timeText: store.urgent ? `남은 ${fmtSec(remainSec)}` : store.closeText,
    timeColor: store.urgent ? C.orange : C.textSub,
    urgentTime: store.urgent ? fmtSec(remainSec) : store.closeText,
  };
}

export function CustomerHome() {
  const { state, dispatch } = useApp();
  const blink = useBlinkAnim();

  const inCat = (s: typeof STORES[0]) => state.category === '전체' || s.cat === state.category;
  const feed = STORES.filter(inCat).map(s => buildStoreView(s, state));
  const urgent = STORES.filter(s => s.urgent).map(s => buildStoreView(s, state));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Location header */}
      <View style={styles.header}>
        <Text style={styles.locLabel}>현재 위치</Text>
        <View style={styles.locRow}>
          <Text style={styles.locCity}>성수동</Text>
          <Text style={styles.locNow}>· 지금</Text>
        </View>
      </View>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>메뉴, 가게 이름으로 검색</Text>
      </View>
      {/* Urgent section */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLeft}>
          <Animated.View style={[styles.blinkDot, { opacity: blink, backgroundColor: C.orange }]} />
          <Text style={styles.sectionTitle}>마감 임박</Text>
        </View>
        <Text style={styles.sectionRight}>지금 안 가면 끝</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.urgentScroll} contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}>
        {urgent.map(s => <UrgentCard key={s.id} store={s} />)}
      </ScrollView>
      {/* Map preview */}
      <View style={styles.mapHeader}>
        <Text style={styles.sectionTitle}>지도에서 보기</Text>
        <TouchableOpacity onPress={() => dispatch({ type: 'SET_CTAB', payload: 'map' })}>
          <Text style={styles.mapLink}>전체 지도 →</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ marginHorizontal: 18, marginBottom: 20 }}
        onPress={() => dispatch({ type: 'SET_CTAB', payload: 'map' })}
        activeOpacity={0.9}
      >
        <MapPlaceholder height={172} pins={MAP_PINS} dealCount={STORES.length} />
      </TouchableOpacity>
      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
        {CATS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, state.category === cat && styles.chipActive]}
            onPress={() => dispatch({ type: 'SET_CATEGORY', payload: cat })}
          >
            <Text style={[styles.chipText, state.category === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Feed header */}
      <View style={styles.feedHeader}>
        <Text style={styles.sectionTitle}>내 주변 실시간 할인</Text>
        <Text style={styles.feedCount}>{STORES.length}곳</Text>
      </View>
      {/* Feed */}
      <View style={styles.feedList}>
        {feed.map(s => <StoreCard key={s.id} store={s} />)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },
  locLabel: { fontSize: 11, color: C.textDim, fontWeight: '600' },
  locRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, marginTop: 2 },
  locCity: { fontSize: 19, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  locNow: { fontSize: 12, color: C.yellow, fontWeight: '700' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 11, marginHorizontal: 18, marginBottom: 10 },
  searchIcon: { fontSize: 16, color: C.textDim2 },
  searchPlaceholder: { fontSize: 13.5, color: C.textDim2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 6 },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  sectionRight: { fontFamily: 'monospace', fontSize: 11.5, color: C.orangeText },
  blinkDot: { width: 7, height: 7, borderRadius: 3.5 },
  urgentScroll: { paddingVertical: 6 },
  mapHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 6 },
  mapLink: { fontSize: 12.5, fontWeight: '700', color: C.yellow },
  chipsScroll: { marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: C.border, backgroundColor: C.card, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  chipActive: { backgroundColor: C.yellow, borderColor: C.yellow },
  chipText: { fontSize: 12.5, fontWeight: '700', color: C.textSub },
  chipTextActive: { color: C.bg },
  feedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 12 },
  feedCount: { fontFamily: 'monospace', fontSize: 11.5, color: C.textSub },
  feedList: { gap: 14, paddingHorizontal: 18, paddingBottom: 24 },
});

const cardStyles = StyleSheet.create({
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, overflow: 'hidden' },
  image: { height: 152, backgroundColor: C.cardInput, position: 'relative' },
  stripe: { position: 'absolute', left: 0, right: 0, height: 11, backgroundColor: '#222A33', transform: [{ rotate: '135deg' }] },
  imageRow: { position: 'absolute', left: 12, top: 12, flexDirection: 'row', gap: 6 },
  badge: { backgroundColor: C.yellow, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9 },
  badgeText: { fontSize: 15, fontWeight: '800', color: C.bg, letterSpacing: -0.3 },
  urgentBadge: { backgroundColor: C.orange, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 },
  urgentText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  heart: { position: 'absolute', right: 12, top: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(4,6,10,0.5)', alignItems: 'center', justifyContent: 'center' },
  photoLabel: { position: 'absolute', left: 14, bottom: 9, fontFamily: 'monospace', fontSize: 10.5, color: '#7A828D' },
  body: { padding: 15 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  name: { fontSize: 16.5, fontWeight: '700', color: C.text, letterSpacing: -0.3 },
  dist: { fontFamily: 'monospace', fontSize: 12, color: C.textSub, flexShrink: 0 },
  catText: { fontSize: 12, color: C.textDim, marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 11 },
  price: { fontSize: 20, fontWeight: '800', color: C.yellow, letterSpacing: -0.4 },
  strike: { fontSize: 13, color: C.textDim2, textDecorationLine: 'line-through' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 13 },
  progressBg: { flex: 1, height: 6, backgroundColor: '#262D38', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 3 },
  qtyText: { fontFamily: 'monospace', fontSize: 11, color: C.textSub },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  timeText: { fontFamily: 'monospace', fontSize: 12, fontWeight: '700' },
  couponBtn: { backgroundColor: C.yellow, paddingHorizontal: 17, paddingVertical: 10, borderRadius: 12 },
  couponBtnText: { fontSize: 13, fontWeight: '800', color: C.bg },
});

const urgentStyles = StyleSheet.create({
  card: { width: 206, backgroundColor: C.orangeBg, borderWidth: 1, borderColor: C.orangeBorder, borderRadius: 20, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { backgroundColor: C.orange, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 10 },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: -0.3 },
  countdown: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  blinkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.orange },
  countdownText: { fontFamily: 'monospace', fontSize: 13, fontWeight: '700', color: C.orangeText },
  name: { fontSize: 17, fontWeight: '800', color: C.text, letterSpacing: -0.3, marginTop: 14 },
  catDist: { fontSize: 12, color: '#8A6A5E', marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginTop: 12 },
  price: { fontSize: 19, fontWeight: '800', color: C.yellow },
  strike: { fontSize: 12, color: '#6B5048', textDecorationLine: 'line-through' },
  qty: { fontFamily: 'monospace', fontSize: 11, color: C.textSub, marginTop: 13 },
});
