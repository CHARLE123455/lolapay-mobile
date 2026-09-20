import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../lib/theme";

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, action, onAction }: Props) {
  return (
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={s.action}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function ScreenTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.h1}>{title}</Text>
      {subtitle && (
        <Text style={{ color: colors.muted, marginTop: 2 }}>{subtitle}</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 17, fontWeight: "700", color: colors.text },
  action: { color: colors.primary, fontWeight: "600" },
  h1: { fontSize: 22, fontWeight: "800", color: colors.text },
});
