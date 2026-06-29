import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/state/AppState';
import { CustomerScreen } from './src/screens/CustomerScreen';
import { OwnerScreen } from './src/screens/OwnerScreen';
import { Toast } from './src/components/Toast';
import { C } from './src/components/Colors';

function RootNavigator() {
  const { state } = useApp();
  return (
    <View style={styles.root}>
      {state.role === 'customer' ? <CustomerScreen /> : <OwnerScreen />}
      <Toast message={state.toast} />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
});
