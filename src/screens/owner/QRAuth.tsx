import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';

export function QRAuth() {
  const { state, dispatch, prod } = useApp();
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (state.qrState === 'success') {
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    }
  }, [state.qrState]);

  const qrEvObj = state.events.find(e => e.id === state.qrEventId);
  const qrEv = qrEvObj ? prod(qrEvObj.pid) : null;

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => dispatch({ type: 'CLOSE_QR' })}>
          <Text style={{ color: C.text, fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>쿠폰 QR 인증</Text>
      </View>

      {state.qrState === 'scan' && (
        <View style={styles.scanView}>
          {/* Scanner frame */}
          <View style={styles.scannerFrame}>
            {/* Corner brackets */}
            <View style={[styles.corner, { top: 18, left: 18, borderRightWidth: 0, borderBottomWidth: 0 }]} />
            <View style={[styles.corner, { top: 18, right: 18, borderLeftWidth: 0, borderBottomWidth: 0 }]} />
            <View style={[styles.corner, { bottom: 18, left: 18, borderRightWidth: 0, borderTopWidth: 0 }]} />
            <View style={[styles.corner, { bottom: 18, right: 18, borderLeftWidth: 0, borderTopWidth: 0 }]} />
            {/* Scan line */}
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]} />
          </View>
          <Text style={styles.scanInstructions}>고객의 쿠폰 QR을 비춰주세요</Text>
          <Text style={styles.scanEvent}>{qrEv?.name ?? ''} · {qrEvObj ? `${qrEvObj.pct}%` : ''} 할인</Text>
          <TouchableOpacity
            style={styles.simulateBtn}
            onPress={() => dispatch({ type: 'SCAN_DONE' })}
          >
            <Text style={styles.simulateBtnText}>쿠폰 인식 (시뮬레이션)</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.qrState === 'success' && (
        <Animated.View style={[styles.successView, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.successCheck}>
            <Text style={{ color: C.green, fontSize: 40 }}>✓</Text>
          </View>
          <Text style={styles.successTitle}>인증 완료</Text>
          <Text style={styles.successSub}>{qrEv?.name ?? ''} {qrEvObj ? `${qrEvObj.pct}%` : ''} 쿠폰을 사용했어요</Text>
          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>차감 수량</Text>
              <Text style={styles.resultDeducted}>−1개</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>남은 수량</Text>
              <Text style={styles.resultRemain}>{qrEvObj?.qty ?? 0}개</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => dispatch({ type: 'CLOSE_QR' })}>
            <Text style={styles.confirmBtnText}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={() => dispatch({ type: 'SCAN_AGAIN' })}>
            <Text style={styles.nextBtnText}>다음 쿠폰 인증</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090D' },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 56, paddingHorizontal: 18, paddingBottom: 14 },
  closeBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  scanView: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  scannerFrame: { width: 248, height: 248, borderRadius: 28, overflow: 'hidden', backgroundColor: '#0E1116', position: 'relative' },
  corner: { position: 'absolute', width: 34, height: 34, borderWidth: 3, borderColor: C.yellow, borderRadius: 6 },
  scanLine: { position: 'absolute', left: '10%', right: '10%', height: 2, backgroundColor: C.yellow, opacity: 0.8 },
  scanInstructions: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 26 },
  scanEvent: { fontSize: 12.5, color: C.textDim, marginTop: 6 },
  simulateBtn: { marginTop: 28, width: '100%', maxWidth: 280, height: 52, backgroundColor: C.yellow, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  simulateBtnText: { fontSize: 15, fontWeight: '800', color: C.bg },
  successView: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  successCheck: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 23, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 22 },
  successSub: { fontSize: 14, color: C.textSub, marginTop: 8 },
  resultCard: { marginTop: 24, width: '100%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 18 },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultLabel: { fontSize: 13, color: C.textSub },
  resultDeducted: { fontFamily: 'monospace', fontSize: 15, fontWeight: '700', color: C.orangeText },
  resultDivider: { height: 1, backgroundColor: C.cardInput, marginVertical: 13 },
  resultRemain: { fontFamily: 'monospace', fontSize: 18, fontWeight: '700', color: C.yellow },
  confirmBtn: { marginTop: 26, width: '100%', height: 52, backgroundColor: C.yellow, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  confirmBtnText: { fontSize: 15.5, fontWeight: '800', color: C.bg },
  nextBtn: { marginTop: 10, width: '100%', height: 48, alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { fontSize: 14, fontWeight: '700', color: C.textSub },
});
