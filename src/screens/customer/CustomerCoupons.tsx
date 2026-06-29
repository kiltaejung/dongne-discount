import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';
import { STORES } from '../../data/stores';
import { won, distText, fmtSec } from '../../utils/format';

export function CustomerCoupons() {
  const { state, dispatch } = useApp();
  const couponStores = state.coupons
    .map(id => STORES.find(s => s.id === id))
    .filter(Boolean) as typeof STORES;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>쿠폰함</Text>
        <Text style={styles.subtitle}>받은 쿠폰 {state.coupons.length}장 · 매장에서 QR로 사용하세요</Text>
      </View>
      {couponStores.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Text style={{ fontSize: 24 }}>🎫</Text></View>
          <Text style={styles.emptyTitle}>아직 받은 쿠폰이 없어요</Text>
          <Text style={styles.emptyDesc}>홈에서 마음에 드는 할인을 찾아{'\n'}쿠폰을 받아보세요</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {couponStores.map(store => {
            const remainSec = store.urgent ? Math.max(0, store.secLeft - state.tick) : 0;
            const badge = store.type === '1+1' ? '1+1' : `${store.pct}%`;
            const timeText = store.urgent ? `남은 ${fmtSec(remainSec)}` : store.closeText;
            const timeColor = store.urgent ? C.orange : C.textSub;
            return (
              <View key={store.id} style={styles.couponCard}>
                <View style={styles.stub}>
                  <Text style={styles.stubBadge}>{badge}</Text>
                  <Text style={styles.stubLabel}>할인쿠폰</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeSub}>{store.cat} · {distText(store.dist)}</Text>
                  <Text style={[styles.timeText, { color: timeColor }]}>{timeText}</Text>
                  <TouchableOpacity
                    style={styles.useBtn}
                    onPress={() => dispatch({ type: 'OPEN_REDEEM', payload: { id: store.id, tick: state.tick } })}
                  >
                    <Text style={styles.useBtnText}>사용하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 8, paddingHorizontal: 18, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 12.5, color: C.textDim, marginTop: 3 },
  list: { gap: 14, paddingHorizontal: 18, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 90, paddingHorizontal: 30, gap: 12 },
  emptyIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.textSub },
  emptyDesc: { fontSize: 12.5, color: C.textDim2, textAlign: 'center', lineHeight: 19 },
  couponCard: { flexDirection: 'row', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, overflow: 'hidden' },
  stub: { width: 96, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', borderRightWidth: 2, borderRightColor: C.bg, borderStyle: 'dashed' },
  stubBadge: { fontSize: 26, fontWeight: '800', color: C.bg, letterSpacing: -1 },
  stubLabel: { fontSize: 10, fontWeight: '700', color: C.bg, marginTop: 2 },
  info: { flex: 1, padding: 14 },
  storeName: { fontSize: 16, fontWeight: '700', color: C.text, letterSpacing: -0.3 },
  storeSub: { fontSize: 11.5, color: C.textDim, marginTop: 3 },
  timeText: { fontFamily: 'monospace', fontSize: 11, marginTop: 8 },
  useBtn: { marginTop: 11, backgroundColor: C.bg, borderWidth: 1, borderColor: '#3A3520', borderRadius: 11, padding: 10, alignItems: 'center' },
  useBtnText: { fontSize: 13, fontWeight: '800', color: C.yellow },
});
