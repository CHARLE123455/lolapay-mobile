import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../lib/theme";

export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <View style={s.brand}>
        <View style={s.mark}>
          <Feather name="credit-card" size={14} color="#fff" />
        </View>
        <Text style={s.brandText}>LolaPay</Text>
      </View>
      <Text style={s.title}>{title}</Text>
      <Text style={{ color: colors.muted, marginTop: 4 }}>{subtitle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  mark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { fontSize: 22, fontWeight: "800", color: colors.text },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, marginTop: 24 },
});
