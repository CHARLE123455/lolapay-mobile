import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatSigned, formatWhen } from "../lib/format";
import { colors } from "../lib/theme";
import type { Transaction } from "../lib/types";

interface Props {
  tx: Transaction;
  currency?: string;
  onPress?: () => void;
  last?: boolean;
}

export function TransactionRow({ tx, currency = "NGN", onPress, last }: Props) {
  const credit = tx.type === "CREDIT";
  const tint = credit ? colors.success : colors.danger;
  return (
    <Pressable
      style={[s.row, last && { borderBottomWidth: 0 }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={[
          s.icon,
          {
            backgroundColor: credit
              ? "rgba(23,178,106,.12)"
              : "rgba(229,72,77,.1)",
          },
        ]}
      >
        <Feather
          name={credit ? "arrow-down-left" : "arrow-up-right"}
          size={18}
          color={tint}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.title} numberOfLines={1}>
          {tx.counterparty?.name ?? tx.description}
        </Text>
        <Text style={s.meta}>
          {formatWhen(tx.createdAt)}
          {tx.note ? ` · ${tx.note}` : ""}
        </Text>
      </View>
      <Text style={[s.amount, { color: tint }]}>
        {formatSigned(tx.signedAmount, currency)}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "600", color: colors.text },
  meta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  amount: { fontWeight: "700" },
});
