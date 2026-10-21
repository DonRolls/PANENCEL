import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

const N = 21; // módulos por lado (QR versión 1)

// Genera una matriz pseudo-aleatoria (siempre igual para el mismo texto)
// con los 3 cuadros de esquina típicos de un QR. NO es un QR real.
function buildMatrix(seed: string): boolean[][] {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };

  const m: boolean[][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => rand() > 0.5),
  );

  const finder = (r0: number, c0: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r < 0 || c < 0 || r >= N || c >= N) continue;
        const inside = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const edge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const core = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        m[r][c] = inside && (edge || core);
      }
    }
  };
  finder(0, 0);
  finder(0, N - 7);
  finder(N - 7, 0);
  return m;
}

export function QrPlaceholder({ seed, size = 180 }: { seed: string; size?: number }) {
  const matrix = useMemo(() => buildMatrix(seed), [seed]);
  const cell = size / N;

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="image"
      accessibilityLabel="Ejemplo visual de código QR"
    >
      {matrix.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((on, c) => (
            <View
              key={c}
              style={{ width: cell, height: cell, backgroundColor: on ? colors.text : 'transparent' }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row' } });
