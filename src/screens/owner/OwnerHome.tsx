import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';
import { PRODUCTS } from '../../data/stores';
import { won, fmtSec } from '../../utils/format';

function useBlinkAnim() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.35, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return anim;
}

export function OwnerHome() {
  const { state, dispatch, flash, prod } = useApp();
  const blink = useBlinkAnim();

  const events = state.events.map(e => {
    const pr = prod(e.pid);
    const isGift = e.promoType !== 'discount';
    const reg = e.regular ?? pr?.price ?? 0;
    const sale = e.sale ?? Math.round(reg * (1 - e.pct / 100));
    return {
      ...e,
      name: pr?.name ?? '',
      isDiscount: !isGift, isGift,
      badge: isGift ? '증정' : `${e.pct}%`,
      afterText: `${won(sale)}원`,
      beforeText: `${won(reg)}원`,
      giftText: e.gift || '사은품',
      barPct: Math.round(e.qty / Math.max(1, e.total) * 100),
      countdown: fmtSec(Math.max(0, e.secLeft - state.tick)),
    };
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Store header */}
      <View style={styles.storeHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.storeName}>성수베이크하우스</Text>
          <View style={styles.statusRow}>
            <TouchableOpacity
              style={styles.openBadge}
              onPress={() => flash('영업 상태를 변경했어요')}
            >
              <View style={styles.greenDot} />
              <Text style={styles.openText}>영업중</Text>
            </TouchableOpacity>
            <Text style={styles.weather}>☂ 18° · 비</Text>
          </View>
        </View>
      </View>

      {/* Register CTA */}
      <TouchableOpacity
        style={styles.registerCta}
        onPress={() => dispatch({ type: 'OPEN_REGISTER', payload: null })}
        activeOpacity={0.88}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>30초 행사 등록</Text>
          <Text style={styles.ctaSub}>사진만 찍으면 AI가 등록을 도와드려요</Text>
        </View>
        <View style={styles.ctaIcon}>
          <Text style={{ color: C.yellow, fontSize: 24, fontWeight: '700' }}>+</Text>
        </View>
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>오늘 매출</Text>
          <Text style={styles.statValue}>₩428K</Text>
          <Text style={styles.statUp}>▲ 23%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>방문</Text>
          <Text style={styles.statValue}>37명</Text>
          <Text style={styles.statUp}>▲ 12%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>쿠폰 사용</Text>
          <Text style={styles.statValue}>21건</Text>
          <Text style={[styles.statUp, { color: C.yellow }]}>진행중</Text>
        </View>
      </View>

      {/* Events */}
      <View style={styles.eventHeader}>
        <View style={styles.eventHeaderLeft}>
          <Animated.View style={[styles.blinkDot, { opacity: blink }]} />
          <Text style={styles.sectionTitle}>진행 중인 행사</Text>
        </View>
        <Text style={styles.eventCount}>{events.length}건</Text>
      </View>

      <View style={styles.eventList}>
        {events.map(e => (
          <View key={e.id} style={styles.eventCard}>
            <View style={styles.eventTop}>
              <View style={styles.eventThumb} />
              <View style={{ flex: 1 }}>
                <View style={styles.eventNameRow}>
                  <Text style={styles.eventName}>{e.name}</Text>
                  <View style={[styles.eventBadge, e.isGift && { backgroundColor: C.green }]}>
                    <Text style={[styles.eventBadgeText, e.isGift && { color: C.bg }]}>{e.badge}</Text>
                  </View>
                </View>
                {e.isDiscount && (
                  <View style={styles.priceRow}>
                    <Text style={styles.afterText}>{e.afterText}</Text>
                    <Text style={styles.beforeText}>{e.beforeText}</Text>
                  </View>
                )}
                {e.isGift && <Text style={styles.giftText}>{e.giftText} 증정</Text>}
              </View>
              <View style={styles.countdown}>
                <Text style={styles.countdownVal}>{e.countdown}</Text>
                <Text style={styles.countdownLabel}>종료까지</Text>
              </View>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${e.barPct}%` }]} />
              </View>
              <Text style={styles.qtyText}>{e.qty}/{e.total} 남음</Text>
            </View>
            <View style={styles.eventBtns}>
              <TouchableOpacity
                style={styles.qrBtn}
                onPress={() => dispatch({ type: 'OPEN_QR', payload: e.id })}
              >
                <Text style={styles.qrBtnIcon}>⬛</Text>
                <Text style={styles.qrBtnText}>QR 인증</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.endBtn}
                onPress={() => { dispatch({ type: 'END_EVENT', payload: e.id }); flash('행사를 마감했어요'); }}
              >
                <Text style={styles.endBtnText}>마감</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* AI Coach card */}
      <TouchableOpacity
        style={styles.coachCard}
        onPress={() => dispatch({ type: 'OPEN_REGISTER', payload: { product: 'p1', pct: 30 } })}
        activeOpacity={0.88}
      >
        <View style={styles.coachHeader}>
          <View style={styles.coachIcon}><Text style={{ fontSize: 14 }}>✦</Text></View>
          <Text style={styles.coachTitle}>AI 점주코치</Text>
        </View>
        <Text style={styles.coachBody}>
          지금 비가 와요. <Text style={{ color: C.yellow }}>14~17시 베이커리</Text>는 30% 할인 시 평균 방문이 <Text style={{ color: C.yellow }}>1.8배</Text> 늘었어요.
        </Text>
        <Text style={styles.coachSub}>소금빵 마감 할인을 추천해요.</Text>
        <View style={styles.coachBtn}>
          <Text style={styles.coachBtnText}>추천 행사 바로 등록</Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: 14 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  storeHeader: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 6 },
  storeName: { fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  openBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  greenDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green },
  openText: { fontSize: 11.5, fontWeight: '700', color: C.greenText },
  weather: { fontFamily: 'monospace', fontSize: 11.5, color: C.textSub },
  registerCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 18, marginBottom: 4, padding: 18, borderRadius: 20, backgroundColor: C.yellow },
  ctaTitle: { fontSize: 18, fontWeight: '800', color: C.bg, letterSpacing: -0.4 },
  ctaSub: { fontSize: 12.5, fontWeight: '600', color: '#5A4708', marginTop: 3 },
  ctaIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingVertical: 14 },
  statCard: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 13 },
  statLabel: { fontSize: 11, color: C.textDim, fontWeight: '600' },
  statValue: { fontSize: 17, fontWeight: '800', color: C.text, marginTop: 5, letterSpacing: -0.4 },
  statUp: { fontSize: 10.5, fontWeight: '700', color: C.green, marginTop: 3 },
  eventHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 0 },
  eventHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  blinkDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.yellow },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  eventCount: { fontFamily: 'monospace', fontSize: 11.5, color: C.textSub },
  eventList: { gap: 12, paddingHorizontal: 18, paddingTop: 12 },
  eventCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 15 },
  eventTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  eventThumb: { width: 52, height: 52, borderRadius: 13, backgroundColor: C.cardInput },
  eventNameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  eventName: { fontSize: 15.5, fontWeight: '700', color: C.text },
  eventBadge: { backgroundColor: C.yellow, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7 },
  eventBadgeText: { fontSize: 11, fontWeight: '800', color: C.bg },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
  afterText: { fontSize: 14, fontWeight: '800', color: C.yellow },
  beforeText: { fontSize: 11, color: C.textDim2, textDecorationLine: 'line-through' },
  giftText: { fontSize: 13, fontWeight: '700', color: C.greenText, marginTop: 4 },
  countdown: { alignItems: 'flex-end' },
  countdownVal: { fontFamily: 'monospace', fontSize: 13, fontWeight: '700', color: C.orangeText },
  countdownLabel: { fontSize: 10.5, color: C.textDim, marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 13 },
  progressBg: { flex: 1, height: 7, backgroundColor: '#262D38', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 4 },
  qtyText: { fontFamily: 'monospace', fontSize: 11, color: C.textSub },
  eventBtns: { flexDirection: 'row', gap: 8, marginTop: 13 },
  qrBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.yellow, borderRadius: 12, paddingVertical: 11 },
  qrBtnIcon: { fontSize: 14 },
  qrBtnText: { fontSize: 13, fontWeight: '800', color: C.bg },
  endBtn: { backgroundColor: C.cardInput, borderWidth: 1, borderColor: C.border2, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12 },
  endBtnText: { fontSize: 13, fontWeight: '700', color: C.textSub },
  coachCard: { margin: 18, marginTop: 14, backgroundColor: '#161B22', borderWidth: 1, borderColor: '#3A2A4A', borderRadius: 18, padding: 16 },
  coachHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coachIcon: { width: 26, height: 26, borderRadius: 8, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center' },
  coachTitle: { fontSize: 13.5, fontWeight: '800', color: C.purpleText, letterSpacing: -0.2 },
  coachBody: { fontSize: 14.5, color: '#E8E6F0', lineHeight: 22, marginTop: 11, fontWeight: '600' },
  coachSub: { fontSize: 12.5, color: '#9A8FB0', marginTop: 8 },
  coachBtn: { marginTop: 13, backgroundColor: '#2A1F3A', borderWidth: 1, borderColor: C.purpleBorder, borderRadius: 12, padding: 11, alignItems: 'center' },
  coachBtnText: { fontSize: 13.5, fontWeight: '800', color: C.purpleText },
});
