import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';
import { STORES } from '../../data/stores';
import { won, distText } from '../../utils/format';

export function CustomerFavorites() {
  const { state, dispatch } = useApp();
  const favStores = state.favorites
    .map(id => STORES.find(s => s.id === id))
    .filter(Boolean) as typeof STORES;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>즐겨찾기</Text>
        <Text style={styles.subtitle}>관심 매장 {state.favorites.length}곳</Text>
      </View>
      {favStores.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Text style={{ fontSize: 24 }}>🤍</Text></View>
          <Text style={styles.emptyTitle}>즐겨찾기가 비어있어요</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {favStores.map(store => {
            const badge = store.type === '1+1' ? '1+1' : `${store.pct}%`;
            const afterText = store.type === '1+1' ? `${won(store.before)}원 · 1+1` : `${won(store.after)}원`;
            const isFav = state.favorites.includes(store.id);
            return (
              <TouchableOpacity
                key={store.id}
                style={styles.card}
                onPress={() => dispatch({ type: 'OPEN_DETAIL', payload: store.id })}
                activeOpacity={0.85}
              >
                <View style={styles.thumbnail}>
                  <View style={styles.thumbBadge}>
                    <Text style={styles.thumbBadgeText}>{badge}</Text>
                  </View>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{store.name}</Text>
                  <Text style={styles.sub}>{store.cat} · {distText(store.dist)}</Text>
                  <Text style={styles.price}>{afterText}</Text>
                </View>
                <TouchableOpacity
                  style={styles.heartBtn}
                  onPress={() => dispatch({ type: 'TOGGLE_FAV', payload: store.id })}
                >
                  <Text style={{ color: isFav ? C.yellow : C.text, fontSize: 20 }}>
                    {isFav ? '♥' : '♡'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
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
  list: { gap: 12, paddingHorizontal: 18, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 90, gap: 12 },
  emptyIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.textSub },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 12 },
  thumbnail: { width: 62, height: 62, borderRadius: 14, backgroundColor: C.cardInput, overflow: 'hidden', position: 'relative' },
  thumbBadge: { position: 'absolute', left: 5, top: 5, backgroundColor: C.yellow, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 7 },
  thumbBadgeText: { fontSize: 11, fontWeight: '800', color: C.bg },
  info: { flex: 1 },
  name: { fontSize: 15.5, fontWeight: '700', color: C.text, letterSpacing: -0.3 },
  sub: { fontSize: 11.5, color: C.textDim, marginTop: 2 },
  price: { fontSize: 14.5, fontWeight: '800', color: C.yellow, marginTop: 6 },
  heartBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
});
