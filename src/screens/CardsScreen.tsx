import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCardMutations, useCards } from "../hooks/queries";
import { colors } from "../lib/theme";
import { errorMessage, type Card as CardModel } from "../lib/types";
import { BankCard } from "../components/BankCard";
import { Button, Card, Chip, Empty, Loader, Screen } from "../components/ui";

const BRANDS = ["Visa", "Mastercard", "Verve"] as const;

export default function CardsScreen() {
  const cards = useCards();
  const { create, setStatus, setDefault, remove } = useCardMutations();
  const fail = (title: string) => (e: unknown) =>
    Alert.alert(title, errorMessage(e));
  const active = cards.data?.filter((c) => c.status !== "CANCELLED") ?? [];

  const confirmCancel = (c: CardModel) =>
    Alert.alert(
      "Cancel card",
      `Cancel ${c.brand} •••• ${c.last4}? This cannot be undone.`,
      [
        { text: "Keep card", style: "cancel" },
        {
          text: "Cancel card",
          style: "destructive",
          onPress: () =>
            remove.mutate(c.id, { onError: fail("Could not cancel") }),
        },
      ],
    );

  return (
    <Screen
      edges={[]}
      refreshing={cards.isRefetching}
      onRefresh={() => void cards.refetch()}
    >
      {cards.isLoading && <Loader />}
      {!cards.isLoading && active.length === 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Empty text="No cards yet — issue your first virtual card below." />
        </Card>
      )}

      {active.map((c) => {
        const frozen = c.status === "FROZEN";
        return (
          <Card key={c.id} style={{ marginBottom: 16 }}>
            <BankCard card={c} />
            <View style={s.actions}>
              {c.isDefault ? (
                <Chip text="Default" />
              ) : (
                <Pressable
                  onPress={() =>
                    setDefault.mutate(c.id, {
                      onError: fail("Could not update"),
                    })
                  }
                  hitSlop={6}
                >
                  <Text style={s.link}>Make default</Text>
                </Pressable>
              )}
              <Chip
                text={frozen ? "Frozen" : "Active"}
                tone={frozen ? "amber" : "green"}
              />
              <View style={{ flex: 1 }} />
              <Pressable
                style={s.iconBtn}
                onPress={() =>
                  setStatus.mutate(
                    { id: c.id, status: frozen ? "ACTIVE" : "FROZEN" },
                    { onError: fail("Could not update") },
                  )
                }
              >
                <Feather
                  name={frozen ? "play" : "pause"}
                  size={16}
                  color={colors.text}
                />
              </Pressable>
              <Pressable style={s.iconBtn} onPress={() => confirmCancel(c)}>
                <Feather name="trash-2" size={16} color={colors.danger} />
              </Pressable>
            </View>
          </Card>
        );
      })}

      <Text style={s.section}>Issue a new card</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {BRANDS.map((brand) => (
          <Button
            key={brand}
            title={brand}
            variant="outline"
            style={{ flex: 1 }}
            loading={create.isPending && create.variables?.brand === brand}
            disabled={create.isPending}
            onPress={() =>
              create.mutate(
                { brand },
                { onError: fail("Could not issue card") },
              )
            }
          />
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  link: { color: colors.primary, fontWeight: "700", fontSize: 12 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
});
