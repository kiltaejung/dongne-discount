import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { C } from '../components/Colors';
import { useApp } from '../state/AppState';
import { CustomerHome } from './customer/CustomerHome';
import { CustomerMap } from './customer/CustomerMap';
import { CustomerCoupons } from './customer/CustomerCoupons';
import { CustomerFavorites } from './customer/CustomerFavorites';
import { StoreDetail } from './customer/StoreDetail';
import { CouponRedeem } from './customer/CouponRedeem';
import { RoleMenuButton, RoleDropdown } from '../components/RoleMenu';

function TabBar() {
  const { state, dispatch } = useApp();
  const t = state.cTab;
  const c = (tab: string) => t === tab ? C.yellow : C.textDim2;
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_CTAB', payload: 'home' })}>
        <Text style={[styles.tabIcon, { color: c('home') }]}>⌂</Text>
        <Text style={[styles.tabLabel, { color: c('home') }]}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_CTAB', payload: 'map' })}>
        <Text style={[styles.tabIcon, { color: c('map') }]}>📍</Text>
        <Text style={[styles.tabLabel, { color: c('map') }]}>지도</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_CTAB', payload: 'coupons' })}>
        <View style={{ position: 'relative' }}>
          <Text style={[styles.tabIcon, { color: c('coupons') }]}>🎫</Text>
          {state.coupons.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{state.coupons.length}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, { color: c('coupons') }]}>쿠폰함</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_CTAB', payload: 'favorites' })}>
        <Text style={[styles.tabIcon, { color: c('favorites') }]}>♡</Text>
        <Text style={[styles.tabLabel, { color: c('favorites') }]}>즐겨찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

export function CustomerScreen() {
  const { state } = useApp();
  const isMain = state.cScreen === 'main';
  const isDetail = state.cScreen === 'detail';
  const isRedeem = state.cScreen === 'redeem';

  return (
    <SafeAreaView style={styles.container}>
      {isMain && (
        <View style={{ flex: 1 }}>
          {/* Role button overlaid on top of content */}
          <View style={styles.roleButtonOverlay}>
            <RoleMenuButton />
          </View>
          <View style={{ flex: 1, paddingTop: 52 }}>
            {state.cTab === 'home' && <CustomerHome />}
            {state.cTab === 'map' && <CustomerMap />}
            {state.cTab === 'coupons' && <CustomerCoupons />}
            {state.cTab === 'favorites' && <CustomerFavorites />}
          </View>
          <TabBar />
        </View>
      )}
      {isDetail && <StoreDetail />}
      {isRedeem && <CouponRedeem />}
      <RoleDropdown />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  roleButtonOverlay: { position: 'absolute', top: 14, left: 18, zIndex: 50 },
  tabBar: { flexDirection: 'row', height: 84, backgroundColor: C.bgDark, borderTopWidth: 1, borderTopColor: '#1A1F27', paddingBottom: 16 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 10, fontWeight: '600' },
  badge: { position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 9.5, fontWeight: '800', color: '#fff', fontFamily: 'monospace' },
});
