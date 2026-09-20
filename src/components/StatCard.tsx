import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";
import { colors } from "../lib/theme";
import { Card } from "./ui";

interface Props {
  icon: keyof typeof Feather.glyphMap;
  tint: string;
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ icon, tint, label, value, hint }: Props) {
  return (
    <Card style={{ flex: 1 }}>
      <Feather name={icon} size={16} color={tint} />
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
      {hint && <Text style={s.hint}>{hint}</Text>}
    </Card>
  );
}

const s = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, marginTop: 8 },
  value: { fontSize: 18, fontWeight: "800", color: colors.text, marginTop: 2 },
  hint: { color: colors.muted, fontSize: 11, marginTop: 2 },
});
