import { Feather } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, View } from "react-native";
import { formatMoney, formatWhen } from "../lib/format";
import { colors, radius } from "../lib/theme";
import type { Transfer } from "../lib/types";
import { Button } from "./ui";

interface Props {
  transfer: Transfer | null;
  onClose: () => void;
  onViewHistory: () => void;
}

export function ReceiptModal({ transfer, onClose, onViewHistory }: Props) {
  return (
    <Modal
      visible={Boolean(transfer)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <Feather name="check-circle" size={56} color={colors.success} />
          <Text style={s.title}>Transfer successful</Text>
          {transfer && (
            <>
              <Text style={s.amount}>
                {formatMoney(transfer.amount, transfer.currency)}
              </Text>
              <Text style={{ color: colors.muted }}>
                sent to {transfer.recipient.fullName}
              </Text>
              <View style={s.details}>
                <Row label="Reference" value={transfer.reference} />
                <Row label="Recipient" value={`@${transfer.recipient.tag}`} />
                {transfer.note && <Row label="Note" value={transfer.note} />}
                <Row label="Date" value={formatWhen(transfer.createdAt)} />
                <Row
                  label="New balance"
                  value={
                    transfer.newBalance
                      ? formatMoney(transfer.newBalance, transfer.currency)
                      : "—"
                  }
                />
              </View>
            </>
          )}
          <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
            <Button
              title="History"
              variant="outline"
              style={{ flex: 1 }}
              onPress={onViewHistory}
            />
            <Button title="Done" style={{ flex: 1 }} onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
      <Text
        style={{
          color: colors.text,
          fontWeight: "600",
          fontSize: 12,
          maxWidth: "60%",
          textAlign: "right",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", marginTop: 10, color: colors.text },
  amount: {
    fontSize: 32,
    fontWeight: "800",
    marginVertical: 6,
    color: colors.text,
  },
  details: {
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    padding: 14,
    width: "100%",
    marginVertical: 18,
    gap: 8,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
});
