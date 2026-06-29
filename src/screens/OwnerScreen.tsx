import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { C } from '../components/Colors';
import { useApp } from '../state/AppState';
import { OwnerHome } from './owner/OwnerHome';
import { OwnerStats } from './owner/OwnerStats';
import { OwnerCoach } from './owner/OwnerCoach';
import { OwnerStore } from './owner/OwnerStore';
import { EventRegister } from './owner/EventRegister';
import { QRAuth } from './owner/QRAuth';
import { RoleMenuButton, RoleDropdown } from '../components/RoleMenu';

function TabBar() {
  const { state, dispatch } = useApp();
  const t = state.oTab;
  const c = (tab: string) => t === tab ? C.yellow : C.textDim2;
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_OTAB', payload: 'home' })}>
        <Text style={[styles.tabIcon, { color: c('home') }]}>⌂</Text>
        <Text style={[styles.tabLabel, { color: c('home') }]}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_OTAB', payload: 'stats' })}>
        <Text style={[styles.tabIcon, { color: c('stats') }]}>📊</Text>
        <Text style={[styles.tabLabel, { color: c('stats') }]}>통계</Text>
      </TouchableOpacity>
      <View style={[styles.tab, { justifyContent: 'flex-end', paddingBottom: 16 }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => dispatch({ type: 'OPEN_REGISTER', payload: null })}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_OTAB', payload: 'coach' })}>
        <Text style={[styles.tabIcon, { color: c('coach') }]}>✦</Text>
        <Text style={[styles.tabLabel, { color: c('coach') }]}>AI코치</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => dispatch({ type: 'SET_OTAB', payload: 'store' })}>
        <Text style={[styles.tabIcon, { color: c('store') }]}>🏪</Text>
        <Text style={[styles.tabLabel, { color: c('store') }]}>내매장</Text>
      </TouchableOpacity>
    </View>
  );
}

export function OwnerScreen() {
  const { state } = useApp();
  const isMain = state.oScreen === 'main';

  return (
    <SafeAreaView style={styles.container}>
      {isMain && (
        <View style={{ flex: 1 }}>
          <View style={styles.roleButtonOverlay}>
            <RoleMenuButton />
          </View>
          <View style={{ flex: 1, paddingTop: 52 }}>
            {state.oTab === 'home' && <OwnerHome />}
            {state.oTab === 'stats' && <OwnerStats />}
            {state.oTab === 'coach' && <OwnerCoach />}
            {state.oTab === 'store' && <OwnerStore />}
          </View>
          <TabBar />
        </View>
      )}
      {state.oScreen === 'register' && <EventRegister />}
      {state.oScreen === 'qr' && <QRAuth />}
      <RoleDropdown />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  roleButtonOverlay: { position: 'absolute', top: 14, left: 18, zIndex: 50 },
  tabBar: { flexDirection: 'row', alignItems: 'flex-end', height: 84, backgroundColor: C.bgDark, borderTopWidth: 1, borderTopColor: '#1A1F27', paddingBottom: 16, position: 'relative' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 10, fontWeight: '600' },
  fab: { width: 58, height: 58, borderRadius: 29, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: -8, borderWidth: 4, borderColor: C.bgDark },
  fabIcon: { fontSize: 28, fontWeight: '700', color: C.bg },
});
