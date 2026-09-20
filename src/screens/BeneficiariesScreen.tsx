import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useBeneficiaries,
  useBeneficiaryMutations,
  useFollowers,
  useUserSearch,
} from "../hooks/queries";
import { formatWhen } from "../lib/format";
import { colors, radius } from "../lib/theme";
import { errorMessage, type Beneficiary } from "../lib/types";
import { PersonRow } from "../components/PersonRow";
import {
  Card,
  Empty,
  Loader,
  Screen,
  SectionTitle,
  SegmentedControl,
} from "../components/ui";
import type { RootNav } from "../navigation/types";

type Tab = "mine" | "followers";

export default function BeneficiariesScreen() {
  const nav = useNavigation<RootNav>();
  const [tab, setTab] = useState<Tab>("mine");
  const [q, setQ] = useState("");
  const beneficiaries = useBeneficiaries();
  const followers = useFollowers();
  const search = useUserSearch(q);
  const { add, update, remove } = useBeneficiaryMutations();

  const alreadyAdded = (userId: string) =>
    beneficiaries.data?.some((b) => b.user.id === userId) ?? false;
  const fail = (title: string) => (e: unknown) =>
    Alert.alert(title, errorMessage(e));

  const confirmRemove = (b: Beneficiary) =>
    Alert.alert(
      "Remove beneficiary",
      `Remove ${b.displayName} from your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            remove.mutate(b.id, { onError: fail("Could not remove") }),
        },
      ],
    );

  const sorted = [...(beneficiaries.data ?? [])].sort(
    (a, b) =>
      Number(b.isFavourite) - Number(a.isFavourite) ||
      a.displayName.localeCompare(b.displayName),
  );

  return (
    <Screen edges={[]}>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle title="Add a beneficiary" />
        <View style={s.search}>
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name, @tag, email or account no."
            placeholderTextColor={colors.muted}
            value={q}
            onChangeText={setQ}
            autoCapitalize="none"
          />
          {q.length > 0 && (
            <Pressable onPress={() => setQ("")} hitSlop={8}>
              <Feather name="x" size={16} color={colors.muted} />
            </Pressable>
          )}
        </View>
        {q.trim().length >= 2 && search.isFetching && <Loader />}
        {q.trim().length >= 2 && search.data?.length === 0 && (
          <Empty text={`No users match “${q}”`} />
        )}
        {search.data?.map((u) => {
          const added = alreadyAdded(u.id);
          return (
            <PersonRow
              key={u.id}
              user={u}
              right={
                added ? (
                  <Feather name="check" size={18} color={colors.success} />
                ) : (
                  <Pressable
                    style={s.addBtn}
                    onPress={() =>
                      add.mutate(
                        { userId: u.id },
                        {
                          onSuccess: () => setQ(""),
                          onError: fail("Could not add"),
                        },
                      )
                    }
                    disabled={add.isPending}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}
                    >
                      Add
                    </Text>
                  </Pressable>
                )
              }
            />
          );
        })}
      </Card>

      <SegmentedControl<Tab>
        value={tab}
        onChange={setTab}
        options={[
          {
            value: "mine",
            label: `My beneficiaries (${beneficiaries.data?.length ?? 0})`,
          },
          {
            value: "followers",
            label: `Added me (${followers.data?.length ?? 0})`,
          },
        ]}
      />

      <Card style={{ marginTop: 12 }}>
        {tab === "mine" && (
          <>
            {beneficiaries.isLoading && <Loader />}
            {!beneficiaries.isLoading && sorted.length === 0 && (
              <Empty text="No beneficiaries yet. Search above to add one." />
            )}
            {sorted.map((b) => (
              <PersonRow
                key={b.id}
                user={b.user}
                title={b.displayName}
                subtitle={`@${b.user.tag}${b.lastTransfer ? ` · last sent ${formatWhen(b.lastTransfer.at)}` : ""}`}
                onPress={() =>
                  nav.navigate("Tabs", {
                    screen: "Send",
                    params: { recipient: b.user },
                  })
                }
                right={
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 14,
                      alignItems: "center",
                    }}
                  >
                    <Pressable
                      hitSlop={8}
                      onPress={() =>
                        update.mutate(
                          { id: b.id, isFavourite: !b.isFavourite },
                          { onError: fail("Could not update") },
                        )
                      }
                    >
                      <Feather
                        name="star"
                        size={18}
                        color={b.isFavourite ? colors.warning : colors.line}
                      />
                    </Pressable>
                    <Pressable hitSlop={8} onPress={() => confirmRemove(b)}>
                      <Feather name="trash-2" size={18} color={colors.muted} />
                    </Pressable>
                  </View>
                }
              />
            ))}
          </>
        )}
        {tab === "followers" && (
          <>
            {followers.isLoading && <Loader />}
            {!followers.isLoading && (followers.data?.length ?? 0) === 0 && (
              <Empty text="Nobody has added you yet." />
            )}
            {followers.data?.map((f) => (
              <PersonRow
                key={f.id}
                user={f.user}
                subtitle={`@${f.user.tag} · since ${formatWhen(f.since)}`}
                right={
                  alreadyAdded(f.user.id) ? (
                    <Feather name="check" size={18} color={colors.success} />
                  ) : (
                    <Pressable
                      style={s.addBtn}
                      onPress={() =>
                        add.mutate(
                          { userId: f.user.id },
                          { onError: fail("Could not add") },
                        )
                      }
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: 12,
                        }}
                      >
                        Add back
                      </Text>
                    </Pressable>
                  )
                }
              />
            ))}
          </>
        )}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, paddingVertical: 10, color: colors.text },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
});
