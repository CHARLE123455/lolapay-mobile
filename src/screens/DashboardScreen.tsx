import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  useAccountSummary,
  useBeneficiaries,
  useNotifications,
  useTransactions,
} from "../hooks/queries";
import { formatMoney } from "../lib/format";
import { colors } from "../lib/theme";
import { BalanceCard } from "../components/BalanceCard";
import { StatCard } from "../components/StatCard";
import { TransactionRow } from "../components/TransactionRow";
import {
  Avatar,
  Card,
  Empty,
  Loader,
  Screen,
  SectionTitle,
} from "../components/ui";
import type { RootNav } from "../navigation/types";

export default function DashboardScreen() {
  const { user } = useAuth();
  const nav = useNavigation<RootNav>();
  const qc = useQueryClient();
  const summary = useAccountSummary();
  const transactions = useTransactions({ limit: 5 });
  const beneficiaries = useBeneficiaries();
  const notifications = useNotifications();

  const cur = summary.data?.currency ?? "NGN";
  const unread =
    notifications.data?.unread ?? summary.data?.unreadNotifications ?? 0;
  const recent = transactions.data?.data ?? [];

  return (
    <Screen
      refreshing={summary.isRefetching || transactions.isRefetching}
      onRefresh={() => void qc.invalidateQueries()}
    >
      <View style={s.top}>
        <View>
          <Text style={{ color: colors.muted }}>Welcome back,</Text>
          <Text style={s.name}>{user?.firstName}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            style={s.bell}
            onPress={() => nav.navigate("Notifications")}
            hitSlop={6}
          >
            <Feather name="bell" size={20} color={colors.text} />
            {unread > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{unread > 9 ? "9+" : unread}</Text>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() => nav.navigate("Tabs", { screen: "Profile" })}
          >
            {user && <Avatar user={user} size={44} />}
          </Pressable>
        </View>
      </View>

      <BalanceCard
        summary={summary.data}
        onSend={() => nav.navigate("Tabs", { screen: "Send" })}
        onHistory={() => nav.navigate("Tabs", { screen: "History" })}
        onCard={() => nav.navigate("Cards")}
      />

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        <StatCard
          icon="arrow-up-right"
          tint={colors.danger}
          label="Sent this month"
          value={
            summary.data ? formatMoney(summary.data.sentThisMonth, cur) : "—"
          }
          {...(summary.data
            ? { hint: `${summary.data.sentCount} transfers` }
            : {})}
        />
        <StatCard
          icon="arrow-down-left"
          tint={colors.success}
          label="Received"
          value={
            summary.data
              ? formatMoney(summary.data.receivedThisMonth, cur)
              : "—"
          }
          {...(summary.data
            ? { hint: `${summary.data.receivedCount} transfers` }
            : {})}
        />
      </View>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle
          title="Send Money"
          action="See all"
          onAction={() => nav.navigate("Beneficiaries")}
        />
        {beneficiaries.isLoading && <Loader />}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
        >
          {beneficiaries.data?.map((b) => (
            <Pressable
              key={b.id}
              style={s.person}
              onPress={() =>
                nav.navigate("Tabs", {
                  screen: "Send",
                  params: { recipient: b.user },
                })
              }
            >
              <Avatar user={b.user} size={52} />
              <Text numberOfLines={1} style={s.personName}>
                {b.displayName.split(" ")[0]}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={s.person}
            onPress={() => nav.navigate("Beneficiaries")}
          >
            <View style={s.addCircle}>
              <Feather name="plus" size={20} color={colors.primary} />
            </View>
            <Text style={[s.personName, { color: colors.muted }]}>Add</Text>
          </Pressable>
        </ScrollView>
      </Card>

      <Card>
        <SectionTitle
          title="Transaction History"
          action="View all"
          onAction={() => nav.navigate("Tabs", { screen: "History" })}
        />
        {transactions.isLoading && <Loader />}
        {!transactions.isLoading && recent.length === 0 && (
          <Empty text="No transactions yet" />
        )}
        {recent.map((t, i) => (
          <TransactionRow
            key={t.id}
            tx={t}
            currency={cur}
            last={i === recent.length - 1}
          />
        ))}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: "800", color: colors.text },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  person: { alignItems: "center", width: 64 },
  personName: {
    fontSize: 11,
    marginTop: 6,
    color: colors.text,
    fontWeight: "600",
  },
  addCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
