import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../lib/theme";
import { initials } from "../../lib/format";

interface Props {
  user: { firstName: string; lastName: string; avatarUrl: string | null };
  size?: number;
}

export function Avatar({ user, size = 40 }: Props) {
  return (
    <View
      style={[s.wrap, { width: size, height: size, borderRadius: size / 2 }]}
    >
      {user.avatarUrl ? (
        <Image
          source={{ uri: user.avatarUrl }}
          style={{ width: size, height: size }}
        />
      ) : (
        <Text
          style={{
            color: colors.primary,
            fontWeight: "700",
            fontSize: size / 2.8,
          }}
        >
          {initials(user.firstName, user.lastName)}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
