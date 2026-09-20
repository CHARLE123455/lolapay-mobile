import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";
import type { UserSummary } from "../lib/types";
import { Avatar } from "./ui";

interface Props {
  user: UserSummary;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
}

export function PersonRow({ user, title, subtitle, onPress, right }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        s.row,
        pressed && onPress ? { opacity: 0.7 } : null,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Avatar user={user} />
      <View style={{ flex: 1 }}>
        <Text style={s.name} numberOfLines={1}>
          {title ?? user.fullName}
        </Text>
        <Text style={s.meta} numberOfLines={1}>
          {subtitle ?? `@${user.tag}`}
        </Text>
      </View>
      {right}
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
  name: { fontWeight: "600", color: colors.text },
  meta: { color: colors.muted, fontSize: 12, marginTop: 1 },
});
