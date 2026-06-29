import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from './Colors';
import { useApp } from '../state/AppState';

export function RoleMenuButton() {
  const { state, dispatch } = useApp();
  return (
    <TouchableOpacity onPress={() => dispatch({ type: 'TOGGLE_ROLE_MENU' })} style={styles.pill}>
      <Text style={styles.swapIcon}>⇅</Text>
      <Text style={styles.label}>{state.role === 'customer' ? '고객모드' : '점주모드'}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export function RoleDropdown() {
  const { state, dispatch } = useApp();
  if (!state.roleMenuOpen) return null;
  const isCustomer = state.role === 'customer';
  return (
    <>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={() => dispatch({ type: 'CLOSE_ROLE_MENU' })}
        activeOpacity={1}
      />
      <View style={styles.dropdown}>
        <Text style={styles.dropLabel}>모드 전환</Text>
        <TouchableOpacity
          style={[styles.row, isCustomer && { backgroundColor: '#202A36' }]}
          onPress={() => dispatch({ type: 'SELECT_ROLE', payload: 'customer' })}
        >
          <View style={[styles.iconBox, { backgroundColor: '#22303F' }]}>
            <Text style={{ color: C.blue, fontSize: 16 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>고객 모드</Text>
            <Text style={styles.rowSub}>할인 찾기 · 쿠폰</Text>
          </View>
          {isCustomer && <Text style={{ color: C.yellow, fontSize: 16 }}>✓</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.row, !isCustomer && { backgroundColor: '#2A2516' }]}
          onPress={() => dispatch({ type: 'SELECT_ROLE', payload: 'owner' })}
        >
          <View style={[styles.iconBox, { backgroundColor: '#3A3320' }]}>
            <Text style={{ color: C.yellow, fontSize: 16 }}>🏪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>점주 모드</Text>
            <Text style={styles.rowSub}>행사 등록 · 매장 관리</Text>
          </View>
          {!isCustomer && <Text style={{ color: C.yellow, fontSize: 16 }}>✓</Text>}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.card, borderWidth: 1, borderColor: '#2A323D',
    borderRadius: 22, paddingVertical: 7, paddingHorizontal: 12,
  },
  swapIcon: { color: C.yellow, fontSize: 14 },
  label: { fontSize: 13.5, fontWeight: '800', color: C.text },
  chevron: { color: '#7A828D', fontSize: 14 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 70 },
  dropdown: {
    position: 'absolute', left: 18, top: 100, zIndex: 71, width: 222,
    backgroundColor: '#1A1F27', borderWidth: 1, borderColor: C.border2,
    borderRadius: 18, padding: 7,
    shadowColor: '#000', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.75, shadowRadius: 30,
    elevation: 20,
  },
  dropLabel: {
    fontSize: 10.5, fontWeight: '800', color: C.textDim,
    letterSpacing: 0.8, textTransform: 'uppercase', paddingHorizontal: 10, paddingVertical: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11, borderRadius: 12 },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14.5, fontWeight: '700', color: C.text },
  rowSub: { fontSize: 11, color: '#8A929D', marginTop: 1 },
});
