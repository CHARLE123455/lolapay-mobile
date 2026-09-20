import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useAccountSummary, useNotifications } from "../hooks/queries";
import { formatDateLong, formatMoney } from "../lib/format";
import { colors, radius } from "../lib/theme";
import { Avatar, Card, ListRow, Screen } from "../components/ui";
import type { RootNav } from "../navigation/types";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const nav = useNavigation<RootNav>();
  const summary = useAccountSummary();
  const notifications = useNotifications();
  if (!user) return null;

  const cur = user.account?.currency ?? "NGN";
  const unread = notifications.data?.unread ?? 0;

  const confirmLogout = () =>
    Alert.alert("Log out", "Sign out of LolaPay on this device?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => void logout() },
    ]);

  return (
    <Screen>
      <View style={s.hero}>
        <Avatar user={user} size={88} />
        <Text style={s.name}>{user.fullName}</Text>
        <Text style={{ color: colors.muted }}>
          @{user.tag} · {user.email}
        </Text>
        <Pressable
          style={s.editBtn}
          onPress={() => nav.navigate("EditProfile")}
        >
          <Feather name="edit-2" size={14} color={colors.primary} />
          <Text
            style={{ color: colors.primary, fontWeight: "700", fontSize: 13 }}
          >
            Edit profile
          </Text>
        </Pressable>
      </View>

      <Card style={{ marginBottom: 16 }}>
        <ListRow
          icon="hash"
          title="Account number"
          subtitle="Share this to receive money"
          right={
            <Text style={s.value}>{user.account?.accountNumber ?? "—"}</Text>
          }
        />
        <ListRow
          icon="dollar-sign"
          title="Balance"
          right={
            <Text style={s.value}>
              {user.account ? formatMoney(user.account.balance, cur) : "—"}
            </Text>
          }
        />
        <ListRow
          icon="phone"
          title="Phone"
          right={<Text style={s.value}>{user.phone ?? "Not set"}</Text>}
        />
        <ListRow
          icon="calendar"
          title="Member since"
          right={<Text style={s.value}>{formatDateLong(user.createdAt)}</Text>}
        />
      </Card>

      <Text style={s.section}>Wallet</Text>
      <Card style={{ marginBottom: 16 }}>
        <ListRow
          icon="users"
          title="Beneficiaries"
          subtitle={`${summary.data?.beneficiaries ?? 0} saved`}
          onPress={() => nav.navigate("Beneficiaries")}
        />
        <ListRow
          icon="credit-card"
          title="My cards"
          subtitle={
            user.defaultCard
              ? `${user.defaultCard.brand} •••• ${user.defaultCard.last4}`
              : "No card yet"
          }
          onPress={() => nav.navigate("Cards")}
        />
        <ListRow
          icon="bell"
          title="Notifications"
          subtitle={unread ? `${unread} unread` : "All caught up"}
          onPress={() => nav.navigate("Notifications")}
        />
      </Card>

      <Text style={s.section}>Account</Text>
      <Card style={{ marginBottom: 16 }}>
        <ListRow
          icon="shield"
          title="Security"
          subtitle="Password, 2FA, active sessions"
          onPress={() => nav.navigate("Security")}
        />
        <ListRow
          icon="settings"
          title="Settings"
          subtitle="Currency, language, notifications"
          onPress={() => nav.navigate("Settings")}
        />
        <ListRow
          icon="log-out"
          title="Log out"
          onPress={confirmLogout}
          danger
          right={<View />}
        />
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: "center", marginBottom: 20 },
  name: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 12 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  value: { fontWeight: "700", color: colors.text, fontSize: 13 },
  section: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
});
