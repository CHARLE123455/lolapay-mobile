import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius } from "../../lib/theme";

interface Props {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
  danger?: boolean;
}

export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
  danger,
}: Props) {
  const tint = danger ? colors.danger : colors.primary;
  return (
    <Pressable
      style={({ pressed }) => [
        s.row,
        pressed && onPress ? { opacity: 0.7 } : null,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={[s.icon, danger && { backgroundColor: "rgba(229,72,77,.1)" }]}
      >
        <Feather name={icon} size={16} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.title, danger && { color: colors.danger }]}>
          {title}
        </Text>
        {subtitle && <Text style={s.sub}>{subtitle}</Text>}
      </View>
      {right ??
        (onPress ? (
          <Feather name="chevron-right" size={18} color={colors.muted} />
        ) : null)}
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
    width: 32,
    height: 32,
    borderRadius: radius.sm - 2,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "600", color: colors.text },
  sub: { color: colors.muted, fontSize: 12, marginTop: 1 },
});
