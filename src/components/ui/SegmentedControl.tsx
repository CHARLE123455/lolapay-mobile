import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../lib/theme";

interface Props<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <View style={s.wrap}>
      {options.map((o) => (
        <Pressable
          key={o.value}
          style={[s.tab, value === o.value && s.on]}
          onPress={() => onChange(o.value)}
        >
          <Text
            style={{
              fontWeight: "600",
              color: value === o.value ? colors.primary : colors.muted,
            }}
          >
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: "#e9edf5",
    padding: 4,
    borderRadius: radius.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: radius.sm - 3,
  },
  on: { backgroundColor: colors.surface },
});
