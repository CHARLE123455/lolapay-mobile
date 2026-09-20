import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNotificationMutations, useNotifications } from "../hooks/queries";
import { formatWhen } from "../lib/format";
import { colors } from "../lib/theme";
import type { Notification } from "../lib/types";
import { Card, Empty, Loader, Screen } from "../components/ui";

const iconFor = (type: string): keyof typeof Feather.glyphMap => {
  if (type.includes("transfer"))
    return type.includes("received") ? "arrow-down-left" : "arrow-up-right";
  if (type.includes("beneficiary")) return "user-plus";
  if (
    type.includes("security") ||
    type.includes("login") ||
    type.includes("password")
  )
    return "shield";
  if (type.includes("card")) return "credit-card";
  return "bell";
};

export default function NotificationsScreen() {
  const notifications = useNotifications();
  const { markRead, markAllRead } = useNotificationMutations();
  const items = notifications.data?.data ?? [];
  const unread = notifications.data?.unread ?? 0;

  const open = (n: Notification) => {
    if (!n.isRead) markRead.mutate(n.id);
  };

  return (
    <Screen
      edges={[]}
      refreshing={notifications.isRefetching}
      onRefresh={() => void notifications.refetch()}
    >
      <View style={s.head}>
        <Text style={{ color: colors.muted }}>
          {unread ? `${unread} unread` : "All caught up"}
        </Text>
        {unread > 0 && (
          <Pressable onPress={() => markAllRead.mutate()} hitSlop={6}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              Mark all read
            </Text>
          </Pressable>
        )}
      </View>
      <Card style={{ paddingVertical: 4 }}>
        {notifications.isLoading && <Loader />}
        {!notifications.isLoading && items.length === 0 && (
          <Empty text="No notifications yet" />
        )}
        {items.map((n, i) => (
          <Pressable
            key={n.id}
            style={[s.row, i === items.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => open(n)}
          >
            <View
              style={[
                s.icon,
                !n.isRead && { backgroundColor: colors.primarySoft },
              ]}
            >
              <Feather
                name={iconFor(n.type)}
                size={16}
                color={n.isRead ? colors.muted : colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.title, !n.isRead && { fontWeight: "700" }]}>
                {n.title}
              </Text>
              <Text style={s.body}>{n.body}</Text>
              <Text style={s.when}>{formatWhen(n.createdAt)}</Text>
            </View>
            {!n.isRead && <View style={s.dot} />}
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    alignItems: "flex-start",
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: colors.text, fontWeight: "600" },
  body: { color: colors.muted, fontSize: 13, marginTop: 2 },
  when: { color: colors.muted, fontSize: 11, marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
});
