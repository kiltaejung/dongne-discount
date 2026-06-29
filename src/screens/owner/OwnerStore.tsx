import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';

const storeMenu = ['매장 정보 수정', '영업 시간 설정', '알림 설정', '정산 계좌', '고객센터', '로그아웃'];

export function OwnerStore() {
  const { flash } = useApp();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>내 매장</Text>
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.profileThumb} />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>성수베이크하우스</Text>
          <Text style={styles.profileSub}>베이커리 · ★ 4.7</Text>
          <View style={styles.openBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.openText}>영업중</Text>
          </View>
        </View>
      </View>

      {/* Plan card */}
      <View style={styles.planCard}>
        <View>
          <Text style={styles.planLabel}>현재 구독 플랜</Text>
          <Text style={styles.planTitle}>프로 · 월 29,000원</Text>
        </View>
        <TouchableOpacity style={styles.planBtn} onPress={() => flash('구독 관리 (준비 중)')}>
          <Text style={styles.planBtnText}>관리</Text>
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {storeMenu.map((label, i) => (
          <TouchableOpacity
            key={label}
            style={[styles.menuRow, i < storeMenu.length - 1 && styles.menuRowBorder]}
            onPress={() => flash(`${label} (준비 중)`)}
          >
            <Text style={styles.menuLabel}>{label}</Text>
            <Text style={{ color: C.textDim, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 8, paddingHorizontal: 18, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 18, marginBottom: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 16 },
  profileThumb: { width: 60, height: 60, borderRadius: 16, backgroundColor: C.cardInput },
  profileName: { fontSize: 17, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  profileSub: { fontSize: 12.5, color: C.textSub, marginTop: 3 },
  openBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10, alignSelf: 'flex-start', marginTop: 8 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  openText: { fontSize: 11, fontWeight: '700', color: C.greenText },
  planCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 18, marginBottom: 14, padding: 16, borderRadius: 18, backgroundColor: C.yellow },
  planLabel: { fontSize: 11.5, fontWeight: '700', color: '#5A4708' },
  planTitle: { fontSize: 17, fontWeight: '800', color: C.bg, marginTop: 3, letterSpacing: -0.3 },
  planBtn: { backgroundColor: C.bg, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 11 },
  planBtnText: { fontSize: 12.5, fontWeight: '800', color: C.yellow },
  menuCard: { marginHorizontal: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, paddingVertical: 15 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: C.cardInput },
  menuLabel: { flex: 1, fontSize: 14, color: '#E8EAED' },
});
