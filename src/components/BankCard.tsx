import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../lib/theme";
import type { Card } from "../lib/types";

const brandColors: Record<string, string> = {
  Visa: "#1e3a8a",
  Mastercard: "#111827",
  Verve: "#064e3b",
};

export function BankCard({ card }: { card: Card }) {
  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: brandColors[card.brand] ?? colors.primary,
          opacity: card.status === "FROZEN" ? 0.55 : 1,
        },
      ]}
    >
      <View style={s.between}>
        <Text style={s.brandName}>LolaPay</Text>
        <Text style={s.network}>{card.brand.toUpperCase()}</Text>
      </View>
      <Text style={s.number}>{card.maskedNumber.replace(/\*/g, "•")}</Text>
      <View style={s.between}>
        <View>
          <Text style={s.label}>CARD HOLDER</Text>
          <Text style={s.value}>{card.holderName}</Text>
        </View>
        <View>
          <Text style={s.label}>EXPIRES</Text>
          <Text style={s.value}>{card.expiry}</Text>
        </View>
      </View>
      {card.status === "FROZEN" && (
        <View style={s.frozen}>
          <Text style={{ color: "#fff", fontWeight: "800", letterSpacing: 2 }}>
            FROZEN
          </Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 20,
    height: 190,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  brandName: { color: "#fff", fontWeight: "800", fontSize: 16 },
  network: { color: "#fff", fontWeight: "800", fontStyle: "italic" },
  number: { color: "#fff", fontSize: 22, letterSpacing: 3, fontWeight: "600" },
  label: {
    color: "rgba(255,255,255,.65)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  value: { color: "#fff", fontSize: 13, fontWeight: "600", marginTop: 2 },
  frozen: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,.35)",
  },
});
