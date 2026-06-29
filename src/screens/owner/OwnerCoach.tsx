import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';

const cases = [
  { name: '연남베이글', text: '마감 40% 행사로 폐기율 절감', metric: '-62%', metricLabel: '폐기율' },
  { name: '망원샐러드', text: '점심 한가한 시간 25% 할인', metric: '1.9배', metricLabel: '방문' },
  { name: '성수카페로그', text: '비 오는 날 디저트 1+1', metric: '+34%', metricLabel: '매출' },
];

export function OwnerCoach() {
  const { dispatch } = useApp();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.icon}><Text style={{ fontSize: 17 }}>✦</Text></View>
          <Text style={styles.title}>AI 점주코치</Text>
        </View>
        <Text style={styles.subtitle}>시간·날씨·매출 데이터로 다음 행사를 추천해요</Text>
      </View>

      {/* Today's recommendation */}
      <View style={styles.rec}>
        <Text style={styles.recLabel}>오늘의 추천 · 지금</Text>
        <Text style={styles.recTitle}>
          비 오는 오후엔 <Text style={{ color: C.yellow }}>소금빵 30% 마감 할인</Text>
        </Text>
        <Text style={styles.recBody}>
          최근 4주간 비 오는 14~17시에 베이커리 할인 행사는 방문 1.8배, 폐기 52% 감소 효과가 있었어요.
        </Text>
        <TouchableOpacity
          style={styles.recBtn}
          onPress={() => dispatch({ type: 'OPEN_REGISTER', payload: { product: 'p1', pct: 30 } })}
        >
          <Text style={styles.recBtnText}>이 행사 바로 등록하기</Text>
        </TouchableOpacity>
      </View>

      {/* Success cases */}
      <Text style={styles.casesTitle}>같은 업종 성공사례</Text>
      <View style={styles.casesList}>
        {cases.map(c => (
          <View key={c.name} style={styles.caseCard}>
            <View style={styles.caseThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.caseName}>{c.name}</Text>
              <Text style={styles.caseText}>{c.text}</Text>
            </View>
            <View style={styles.caseMetric}>
              <Text style={styles.caseMetricVal}>{c.metric}</Text>
              <Text style={styles.caseMetricLabel}>{c.metricLabel}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Insights */}
      <View style={styles.insights}>
        <Text style={styles.insightsTitle}>이번 주 인사이트</Text>
        <View style={styles.insight}>
          <Text style={styles.bullet}>●</Text>
          <Text style={styles.insightText}>금요일 19시 이후 방문이 가장 많아요. 마감 1시간 전 할인을 늘려보세요.</Text>
        </View>
        <View style={styles.insight}>
          <Text style={styles.bullet}>●</Text>
          <Text style={styles.insightText}>크루아상은 할인 없이도 잘 팔려요. 할인 상품에서 제외하면 마진이 올라가요.</Text>
        </View>
      </View>
      <View style={{ height: 18 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 8, paddingHorizontal: 18, paddingBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  icon: { width: 30, height: 30, borderRadius: 9, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 12.5, color: C.textDim, marginTop: 6 },
  rec: { marginHorizontal: 18, marginBottom: 12, borderWidth: 1, borderColor: C.purpleBorder, borderRadius: 18, padding: 17, backgroundColor: '#1A1622' },
  recLabel: { fontSize: 11.5, fontWeight: '800', color: C.purple, letterSpacing: 0.5 },
  recTitle: { fontSize: 16, color: '#F0ECF8', lineHeight: 25, marginTop: 10, fontWeight: '700', letterSpacing: -0.3 },
  recBody: { fontSize: 13, color: '#A89BC0', lineHeight: 21, marginTop: 8 },
  recBtn: { marginTop: 14, backgroundColor: C.yellow, borderRadius: 12, padding: 12, alignItems: 'center' },
  recBtnText: { fontSize: 14, fontWeight: '800', color: C.bg },
  casesTitle: { fontSize: 14, fontWeight: '800', color: C.text, paddingHorizontal: 18, paddingBottom: 10, letterSpacing: -0.3 },
  casesList: { gap: 11, paddingHorizontal: 18 },
  caseCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center' },
  caseThumb: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.cardInput },
  caseName: { fontSize: 14.5, fontWeight: '700', color: C.text },
  caseText: { fontSize: 12.5, color: C.textSub, lineHeight: 19, marginTop: 3 },
  caseMetric: { alignItems: 'flex-end' },
  caseMetricVal: { fontSize: 17, fontWeight: '800', color: C.green, letterSpacing: -0.4 },
  caseMetricLabel: { fontSize: 10, color: C.textDim },
  insights: { marginHorizontal: 18, marginTop: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 },
  insightsTitle: { fontSize: 13.5, fontWeight: '800', color: C.text },
  insight: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 12 },
  bullet: { color: C.yellow, fontSize: 14 },
  insightText: { flex: 1, fontSize: 13, color: '#C4CAD2', lineHeight: 22 },
});
