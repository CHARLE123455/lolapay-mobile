import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatMoney } from "../lib/format";
import { colors, radius } from "../lib/theme";
import type { AccountSummary } from "../lib/types";

interface Props {
  summary: AccountSummary | undefined;
  onSend: () => void;
  onHistory: () => void;
  onCard: () => void;
}

export function BalanceCard({ summary, onSend, onHistory, onCard }: Props) {
  const cur = summary?.currency ?? "NGN";
  const actions: {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    onPress: () => void;
  }[] = [
    { label: "Send", icon: "arrow-up-right", onPress: onSend },
    { label: "History", icon: "clock", onPress: onHistory },
    { label: "Card", icon: "credit-card", onPress: onCard },
  ];
  return (
    <View style={s.card}>
      <Text style={s.label}>Total Balance</Text>
      <Text style={s.amount}>
        {summary ? formatMoney(summary.totalBalance, cur) : "—"}
      </Text>
      <Text style={s.meta}>
        Account {summary?.accountNumber ?? "…"} ·{" "}
        {summary?.primaryCard
          ? `${summary.primaryCard.brand} •••• ${summary.primaryCard.last4}`
          : "No card yet"}
      </Text>
      <View style={s.actions}>
        {actions.map((a) => (
          <Pressable key={a.label} style={s.action} onPress={a.onPress}>
            <Feather name={a.icon} size={16} color={colors.primary} />
            <Text style={s.actionText}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 22,
    marginBottom: 16,
  },
  label: { color: "rgba(255,255,255,.8)", fontWeight: "600" },
  amount: { color: "#fff", fontSize: 34, fontWeight: "800", marginVertical: 6 },
  meta: { color: "rgba(255,255,255,.8)", fontSize: 12 },
  actions: { flexDirection: "row", gap: 10, marginTop: 18 },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  actionText: { color: colors.primary, fontWeight: "700" },
});
