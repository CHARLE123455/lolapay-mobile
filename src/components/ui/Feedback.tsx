import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../lib/theme";

export function ErrorBox({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <View style={s.error}>
      <Text style={{ color: colors.danger, fontSize: 13 }}>{message}</Text>
    </View>
  );
}

export function SuccessBox({
  message,
}: {
  message: string | null | undefined;
}) {
  if (!message) return null;
  return (
    <View style={s.success}>
      <Text style={{ color: colors.success, fontSize: 13 }}>{message}</Text>
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  return <Text style={s.empty}>{text}</Text>;
}

export function Loader({ padded = true }: { padded?: boolean }) {
  return (
    <ActivityIndicator
      color={colors.primary}
      style={padded ? { padding: 24 } : undefined}
    />
  );
}

export function FullScreenLoader() {
  return (
    <View style={s.full}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const s = StyleSheet.create({
  error: {
    backgroundColor: "rgba(229,72,77,.08)",
    padding: 10,
    borderRadius: radius.sm,
    marginBottom: 12,
  },
  success: {
    backgroundColor: "rgba(23,178,106,.1)",
    padding: 10,
    borderRadius: radius.sm,
    marginBottom: 12,
  },
  empty: { color: colors.muted, textAlign: "center", padding: 24 },
  full: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
});
