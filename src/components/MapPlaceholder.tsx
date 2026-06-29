import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { C } from './Colors';
import { STORES, MAP_PINS } from '../data/stores';

type Pin = { id: string; left: number; top: number };

export function MapPlaceholder({
  height = 172,
  pins,
  onPinPress,
  showLiveBadge = true,
  dealCount = 0,
}: {
  height?: number;
  pins: Pin[];
  onPinPress?: (id: string) => void;
  showLiveBadge?: boolean;
  dealCount?: number;
}) {
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 2.6, duration: 1400, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.map, { height }]}>
      {/* Grid lines */}
      <View style={StyleSheet.absoluteFill}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.hLine, { top: (i + 1) * (height / 5) }]} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.vLine, { left: (i + 1) * 55 }]} />
        ))}
      </View>
      {/* Roads */}
      <View style={[styles.road, { top: '48%', width: '130%', left: '-10%', transform: [{ rotate: '-8deg' }] }]} />
      <View style={[styles.roadV, { left: '34%', top: '-10%' }]} />
      {/* My location */}
      <View style={styles.locationWrap}>
        <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse }], opacity: pulseOpacity }]} />
        <View style={styles.locationDot} />
      </View>
      {/* Pins */}
      {pins.map(pin => {
        const store = STORES.find(s => s.id === pin.id);
        if (!store) return null;
        const badge = store.type === '1+1' ? '1+1' : `${store.pct}%`;
        const color = store.urgent ? C.orange : C.yellow;
        const fg = store.urgent ? '#fff' : C.bg;
        return (
          <View
            key={pin.id}
            style={[styles.pin, { left: `${pin.left}%` as any, top: `${pin.top}%` as any }]}
          >
            <View style={[styles.pinBadge, { backgroundColor: color }]}>
              <Text style={[styles.pinText, { color: fg }]}>{badge}</Text>
            </View>
            <View style={[styles.pinTail, { borderTopColor: color }]} />
          </View>
        );
      })}
      {showLiveBadge && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
          <Text style={styles.liveCount}>내 주변 {dealCount}곳 할인 중</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    backgroundColor: '#0F141B',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262D38',
    position: 'relative',
  },
  hLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#161D26' },
  vLine: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#161D26' },
  road: { position: 'absolute', height: 20, backgroundColor: '#1C242E' },
  roadV: { position: 'absolute', width: 18, height: '120%', backgroundColor: '#1C242E', transform: [{ rotate: '5deg' }] },
  locationWrap: { position: 'absolute', left: '50%', top: '52%', transform: [{ translateX: -7.5 }, { translateY: -7.5 }] },
  pulseRing: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: C.yellow, opacity: 0.4, top: -4, left: -4 },
  locationDot: { width: 15, height: 15, borderRadius: 7.5, backgroundColor: C.yellow, borderWidth: 3, borderColor: C.bg },
  pin: { position: 'absolute', alignItems: 'center', transform: [{ translateX: -20 }, { translateY: -30 }] },
  pinBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  pinText: { fontSize: 11, fontWeight: '800' },
  pinTail: { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderTopWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
  liveBadge: { position: 'absolute', left: 14, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(14,17,22,0.85)', borderWidth: 1, borderColor: '#262D38', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  liveText: { fontFamily: 'monospace', fontSize: 11, fontWeight: '700', color: C.yellow },
  liveCount: { fontSize: 12, color: '#C4CAD2', fontWeight: '600' },
});
