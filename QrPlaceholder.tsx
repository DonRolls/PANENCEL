import React from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export function QrPlaceholder({ seed, size = 200 }: { seed: string; size?: number }) {
  return (
    <View style={styles.frame} accessibilityLabel="Código QR de la orden">
      <QRCode value={`PANENCEL:ORDER:${seed}`} size={size} quietZone={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', backgroundColor: '#FFFFFF', padding: 8 },
});
