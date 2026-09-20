import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius } from "../../lib/theme";

type Variant = "primary" | "outline" | "ghost" | "danger";

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: "#fff", border: colors.primary },
  danger: { bg: colors.danger, fg: "#fff", border: colors.danger },
  outline: { bg: "transparent", fg: colors.text, border: colors.line },
  ghost: { bg: "transparent", fg: colors.primary, border: "transparent" },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  icon,
  style,
}: Props) {
  const { bg, fg, border } = palette[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        s.btn,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: inactive ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && (
            <Feather
              name={icon}
              size={16}
              color={fg}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={{ color: fg, fontWeight: "700", fontSize: 15 }}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
});
