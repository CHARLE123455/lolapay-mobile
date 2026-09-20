import { Feather } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    type TextInputProps,
} from "react-native";
import { colors, radius } from "../../lib/theme";

interface Props extends TextInputProps {
  label?: string;
  icon?: keyof typeof Feather.glyphMap;
  hint?: string;
}

export function Input({ label, icon, hint, style, ...props }: Props) {
  return (
    <View style={s.wrap}>
      {label && <Text style={s.label}>{label}</Text>}
      <View style={[s.field, props.editable === false && s.readonly]}>
        {icon && (
          <Feather
            name={icon}
            size={16}
            color={colors.muted}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          placeholderTextColor={colors.muted}
          style={[s.input, style]}
          {...props}
        />
      </View>
      {hint && <Text style={s.hint}>{hint}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 6,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
  },
  readonly: { opacity: 0.6 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  hint: { fontSize: 11, color: colors.muted, marginTop: 4 },
});
