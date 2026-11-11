import React, { useState } from 'react';
import {
  CameraView,
  BarcodeScanningResult,
  useCameraPermissions,
} from 'expo-camera';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { OrderPreview } from '../../components/OrderPreview';
import { Order } from '../../models/pedido';
import { colors, radius, spacing } from '../../theme';

type ScreenMode = 'list' | 'scanner' | 'detail';

interface Props {
  orders: Order[];
  onConfirmCashPayment: (code: string) => void;
  onMarkCompleted: (code: string) => void;
}

const QR_PREFIX = 'PANENCEL:ORDER:';

const fulfillmentLabels: Record<Order['fulfillmentStatus'], string> = {
  pending: 'Por preparar',
  preparing: 'En preparación',
  ready: 'Listo para entregar',
  completed: 'Entregado',
  cancelled: 'Cancelado',
};

export function OrdersScreen({
  orders,
  onConfirmCashPayment,
  onMarkCompleted,
}: Props) {
  const [mode, setMode] = useState<ScreenMode>('list');
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const selectedOrder = orders.find((order) => order.code === selectedCode);

  const openScanner = () => {
    setHasScanned(false);
    setScanMessage('');
    setMode('scanner');
  };

  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (hasScanned) return;
    setHasScanned(true);

    if (!data.startsWith(QR_PREFIX)) {
      setScanMessage('Este código QR no pertenece a un pedido de PANENCEL.');
      return;
    }

    const code = data.slice(QR_PREFIX.length);
    const matchingOrder = orders.find((order) => order.code === code);
    if (!matchingOrder) {
      setScanMessage('No encontramos ese pedido. Revisa que el QR sea válido.');
      return;
    }

    setSelectedCode(matchingOrder.code);
    setMode('detail');
  };

  const backToList = () => {
    setSelectedCode(null);
    setMode('list');
  };

  if (mode === 'scanner') {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Escanear pedido</Text>
          <Text style={styles.subtitle}>Enfoca el código QR del cliente.</Text>
        </View>
        {!permission ? (
          <Text style={styles.permissionText}>Comprobando permiso de cámara…</Text>
        ) : !permission.granted ? (
          <View style={styles.permission}>
            <Text style={styles.permissionText}>
              Necesitamos permiso de cámara para leer el QR del pedido.
            </Text>
            <AppButton title="Permitir cámara" onPress={requestPermission} />
          </View>
        ) : (
          <View style={styles.cameraFrame}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={hasScanned ? undefined : handleScan}
            />
            <View pointerEvents="none" style={styles.scanOverlay}>
              <View style={styles.scanWindow} />
              <Text style={styles.scanHint}>Alinea el QR dentro del recuadro</Text>
            </View>
          </View>
        )}
        {scanMessage ? (
          <View style={styles.scanError}>
            <Text style={styles.scanErrorText}>{scanMessage}</Text>
            <AppButton title="Intentar de nuevo" onPress={openScanner} />
          </View>
        ) : null}
        <View style={styles.bottomAction}>
          <AppButton variant="link" title="Volver a pedidos" onPress={backToList} />
        </View>
      </View>
    );
  }

  if (mode === 'detail' && selectedOrder) {
    const canConfirmPayment =
      selectedOrder.method === 'efectivo' &&
      selectedOrder.paymentStatus === 'pending' &&
      selectedOrder.fulfillmentStatus !== 'cancelled';
    const canComplete =
      selectedOrder.paymentStatus === 'paid' &&
      selectedOrder.fulfillmentStatus !== 'completed' &&
      selectedOrder.fulfillmentStatus !== 'cancelled';

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={backToList} accessibilityRole="button">
          <Text style={styles.back}>‹ Volver a pedidos</Text>
        </Pressable>
        <Text style={styles.title}>Vista previa del pedido</Text>
        <Text style={styles.subtitle}>
          Estado de entrega: {fulfillmentLabels[selectedOrder.fulfillmentStatus]}
        </Text>
        <OrderPreview order={selectedOrder} />
        {canConfirmPayment ? (
          <View style={styles.action}>
            <AppButton
              variant="dark"
              title="Confirmar pago en efectivo"
              onPress={() => onConfirmCashPayment(selectedOrder.code)}
            />
          </View>
        ) : null}
        {canComplete ? (
          <View style={styles.action}>
            <AppButton
              title="Marcar pedido como entregado"
              onPress={() => onMarkCompleted(selectedOrder.code)}
            />
          </View>
        ) : null}
        {!canConfirmPayment && !canComplete ? (
          <Text style={styles.completedNote}>
            {selectedOrder.fulfillmentStatus === 'completed'
              ? 'Este pedido ya fue entregado.'
              : 'El estado actual no permite validar más acciones.'}
          </Text>
        ) : null}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pedidos</Text>
      <Text style={styles.subtitle}>
        Escanea el QR o selecciona un pedido para revisar su pago y entrega.
      </Text>
      <AppButton title="Escanear código QR" onPress={openScanner} />
      {orders.length === 0 ? (
        <Text style={styles.empty}>No hay pedidos para mostrar.</Text>
      ) : (
        orders.map((order) => (
          <Pressable
            key={order.code}
            onPress={() => {
              setSelectedCode(order.code);
              setMode('detail');
            }}
            accessibilityRole="button"
            accessibilityLabel={`Abrir pedido ${order.code}, ${
              order.paymentStatus === 'paid' ? 'pagado' : 'pendiente de pago'
            }`}
            style={styles.orderCard}
          >
            <OrderPreview order={order} />
            <Text style={styles.fulfillment}>
              Entrega: {fulfillmentLabels[order.fulfillmentStatus]}
            </Text>
            <Text style={styles.openHint}>Toca para abrir el pedido</Text>
          </Pressable>
        ))
      )}
      <Text style={styles.demoNote}>
        Los pedidos mostrados son datos de demostración hasta conectar Supabase.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.lg, gap: spacing.md },
  content: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  header: { gap: spacing.xs },
  title: { color: colors.text, fontSize: 28, fontWeight: '900' },
  subtitle: { color: colors.muted, lineHeight: 21 },
  orderCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  fulfillment: {
    color: colors.text,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
  },
  openHint: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  demoNote: { color: colors.muted, fontSize: 12, textAlign: 'center' },
  empty: { color: colors.muted, paddingVertical: spacing.xl, textAlign: 'center' },
  permission: { gap: spacing.md },
  permissionText: { color: colors.text, lineHeight: 22 },
  cameraFrame: {
    minHeight: 340,
    flex: 1,
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: '#171717',
  },
  camera: { flex: 1 },
  scanOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  scanWindow: {
    width: 240,
    height: 240,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: radius.md,
  },
  scanHint: {
    color: '#FFFFFF',
    backgroundColor: '#00000099',
    overflow: 'hidden',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  scanError: {
    backgroundColor: '#FDECEA',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  scanErrorText: { color: '#B71C1C', fontWeight: '700' },
  bottomAction: { marginTop: 'auto' },
  back: { color: colors.primaryDark, fontSize: 16, fontWeight: '800' },
  action: { marginTop: spacing.sm },
  completedNote: {
    color: colors.muted,
    padding: spacing.md,
    textAlign: 'center',
  },
});
