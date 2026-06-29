import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';

const salesWeek = [
  { day: '월', px: 51 }, { day: '화', px: 57 }, { day: '수', px: 47 },
  { day: '목', px: 67 }, { day: '금', px: 81 }, { day: '토', px: 96 }, { day: '일', px: 73 },
];
const visitsHour = [
  { label: '11시', px: 27 }, { label: '13시', px: 50 }, { label: '15시', px: 21 },
  { label: '17시', px: 41 }, { label: '19시', px: 64 }, { label: '21시', px: 34 },
];
const topProducts = [
  { rank: 1, name: '소금빵', count: 142, w: 100 },
  { rank: 2, name: '크루아상', count: 98, w: 69 },
  { rank: 3, name: '에그타르트', count: 76, w: 54 },
  { rank: 4, name: '바게트', count: 54, w: 38 },
];

export function OwnerStats() {
  const { state, dispatch } = useApp();
  const periods = ['오늘', '주', '월'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>매출 통계</Text>
        <Text style={styles.subtitle}>데이터 기반 마케팅 대시보드</Text>
      </View>
      <View style={styles.periodRow}>
        {periods.map(p => {
          const label = p === '주' ? '이번 주' : p === '월' ? '이번 달' : p;
          const active = state.statsPeriod === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, active && styles.periodBtnActive]}
              onPress={() => dispatch({ type: 'SET_PERIOD', payload: p })}
            >
              <Text style={[styles.periodText, active && styles.periodTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.bigStat}>
          <Text style={styles.bigStatLabel}>기간 매출</Text>
          <Text style={styles.bigStatValue}>₩2.84M</Text>
          <Text style={styles.bigStatUp}>▲ 31% 지난주 대비</Text>
        </View>
        <View style={styles.bigStat}>
          <Text style={styles.bigStatLabel}>재고 폐기율</Text>
          <Text style={styles.bigStatValue}>8%</Text>
          <Text style={styles.bigStatUp}>▼ 41% 행사 전 대비</Text>
        </View>
      </View>

      {/* Weekly chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>요일별 매출</Text>
        <View style={styles.barChart}>
          {salesWeek.map((d, i) => (
            <View key={d.day} style={styles.barWrap}>
              <View style={[styles.bar, { height: d.px, backgroundColor: i === 5 ? C.yellow : '#3A4452' }]} />
              <Text style={styles.barLabel}>{d.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Hourly chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>시간대별 방문</Text>
        <View style={[styles.barChart, { height: 90 }]}>
          {visitsHour.map(v => (
            <View key={v.label} style={[styles.barWrap, { height: 90 }]}>
              <View style={[styles.bar, { height: v.px, backgroundColor: v.px >= 60 ? C.yellow : '#3A4452' }]} />
              <Text style={[styles.barLabel, { fontFamily: 'monospace', fontSize: 9 }]}>{v.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Top products */}
      <View style={[styles.chartCard, { marginBottom: 18 }]}>
        <Text style={styles.chartTitle}>인기 상품</Text>
        {topProducts.map(t => (
          <View key={t.name} style={styles.productRow}>
            <Text style={styles.rank}>{t.rank}</Text>
            <Text style={styles.productName}>{t.name}</Text>
            <View style={styles.productBarBg}>
              <View style={[styles.productBarFill, { width: `${t.w}%` }]} />
            </View>
            <Text style={styles.productCount}>{t.count}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 8, paddingHorizontal: 18, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 12.5, color: C.textDim, marginTop: 3 },
  periodRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 18, paddingBottom: 14 },
  periodBtn: { flex: 1, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, padding: 9, borderRadius: 11, alignItems: 'center' },
  periodBtnActive: { backgroundColor: C.yellow, borderColor: C.yellow },
  periodText: { fontSize: 13, fontWeight: '700', color: C.textSub },
  periodTextActive: { color: C.bg },
  statsGrid: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingBottom: 8 },
  bigStat: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 15 },
  bigStatLabel: { fontSize: 11.5, color: C.textDim, fontWeight: '600' },
  bigStatValue: { fontSize: 21, fontWeight: '800', color: C.text, marginTop: 6, letterSpacing: -0.5 },
  bigStatUp: { fontSize: 11, fontWeight: '700', color: C.green, marginTop: 4 },
  chartCard: { marginHorizontal: 18, marginTop: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 16 },
  chartTitle: { fontSize: 13.5, fontWeight: '800', color: C.text },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, marginTop: 18, gap: 8 },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 7 },
  bar: { width: '100%', maxWidth: 22, borderRadius: 5 },
  barLabel: { fontSize: 11, color: C.textDim, fontWeight: '600' },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.cardInput },
  rank: { fontFamily: 'monospace', fontSize: 13, fontWeight: '700', color: C.yellow, width: 18 },
  productName: { fontSize: 14, fontWeight: '600', color: '#E8EAED', width: 84 },
  productBarBg: { flex: 1, height: 8, backgroundColor: '#262D38', borderRadius: 4, overflow: 'hidden' },
  productBarFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 4 },
  productCount: { fontFamily: 'monospace', fontSize: 11.5, color: C.textSub, width: 38, textAlign: 'right' },
});
