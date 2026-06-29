import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { C } from './Colors';

export function Toast({ message }: { message: string | null }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 14, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 108,
    alignSelf: 'center',
    backgroundColor: C.text,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    zIndex: 90,
  },
  text: { color: C.bg, fontSize: 13.5, fontWeight: '700' },
});
