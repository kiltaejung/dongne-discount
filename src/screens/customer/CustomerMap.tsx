import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { C } from '../../components/Colors';
import { MapPlaceholder } from '../../components/MapPlaceholder';
import { STORES, MAP_PINS } from '../../data/stores';
import { useApp } from '../../state/AppState';

const { width, height } = Dimensions.get('window');

export function CustomerMap() {
  const { dispatch } = useApp();
  return (
    <View style={styles.container}>
      <MapPlaceholder
        height={height}
        pins={MAP_PINS}
        showLiveBadge
        dealCount={STORES.length}
        onPinPress={(id) => dispatch({ type: 'OPEN_DETAIL', payload: id })}
      />
      <Text style={styles.title}>지도</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F141B' },
  title: { position: 'absolute', top: 60, left: 18, fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.4 },
});
