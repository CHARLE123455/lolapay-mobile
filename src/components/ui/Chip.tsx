import { Text, View } from "react-native";
import { colors, radius } from "../../lib/theme";

type Tone = "blue" | "green" | "red" | "amber" | "grey";

const tones: Record<Tone, [string, string]> = {
  blue: [colors.primarySoft, colors.primary],
  green: ["rgba(23,178,106,.12)", colors.success],
  red: ["rgba(229,72,77,.12)", colors.danger],
  amber: ["rgba(245,158,11,.14)", colors.warning],
  grey: [colors.bg, colors.muted],
};

export function Chip({ text, tone = "blue" }: { text: string; tone?: Tone }) {
  const [bg, fg] = tones[tone];
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.pill,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: fg, fontSize: 11, fontWeight: "700" }}>{text}</Text>
    </View>
  );
}
