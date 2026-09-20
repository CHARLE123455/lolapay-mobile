import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  useAccountSummary,
  useBeneficiaries,
  useBeneficiaryMutations,
  useSendMoney,
  useUserSearch,
} from "../hooks/queries";
import { formatCompact, formatMoney } from "../lib/format";
import { colors, radius } from "../lib/theme";
import { errorMessage, type Transfer, type UserSummary } from "../lib/types";
import { PersonRow } from "../components/PersonRow";
import { ReceiptModal } from "../components/ReceiptModal";
import {
  Avatar,
  Button,
  Card,
  Empty,
  ErrorBox,
  Loader,
  Screen,
  ScreenTitle,
  SectionTitle,
} from "../components/ui";
import type { MainTabParams } from "../navigation/types";

const QUICK_AMOUNTS = [1000, 5000, 10000, 50000];
const MIN_TRANSFER = 50;

export default function SendScreen({
  route,
  navigation,
}: BottomTabScreenProps<MainTabParams, "Send">) {
  const [recipient, setRecipient] = useState<UserSummary | null>(null);
  const [q, setQ] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Transfer | null>(null);

  const summary = useAccountSummary();
  const beneficiaries = useBeneficiaries();
  const search = useUserSearch(q);
  const send = useSendMoney();
  const { add: addBeneficiary } = useBeneficiaryMutations();

  const cur = summary.data?.currency ?? "NGN";
  const balance = Number(summary.data?.totalBalance ?? 0);
  const amt = Number(amount);

  useEffect(() => {
    if (route.params?.recipient) {
      setRecipient(route.params.recipient);
      navigation.setParams({});
    }
  }, [route.params?.recipient, navigation]);

  const isBeneficiary = recipient
    ? (beneficiaries.data?.some((b) => b.user.id === recipient.id) ?? false)
    : false;
  const tooLow = amt > 0 && amt < MIN_TRANSFER;
  const tooHigh = amt > balance;
  const canSend =
    Boolean(recipient) && amt >= MIN_TRANSFER && !tooHigh && !send.isPending;

  const submit = () => {
    if (!recipient) return;
    setError("");
    send.mutate(
      {
        recipientId: recipient.id,
        amount: amt,
        ...(note.trim() ? { note: note.trim() } : {}),
      },
      {
        onSuccess: (t) => {
          setReceipt(t);
          setAmount("");
          setNote("");
        },
        onError: (e) => setError(errorMessage(e)),
      },
    );
  };

  const saveBeneficiary = () => {
    if (!recipient) return;
    addBeneficiary.mutate(
      { userId: recipient.id },
      {
        onError: (e) =>
          Alert.alert("Could not add beneficiary", errorMessage(e)),
      },
    );
  };

  const sorted = [...(beneficiaries.data ?? [])].sort(
    (a, b) => Number(b.isFavourite) - Number(a.isFavourite),
  );

  return (
    <Screen>
      <ScreenTitle
        title="Send Money"
        subtitle={`Available: ${summary.data ? formatMoney(summary.data.totalBalance, cur) : "…"}`}
      />

      {!recipient ? (
        <Card>
          <SectionTitle title={q ? "Search results" : "Choose a recipient"} />
          <View style={s.search}>
            <Feather name="search" size={16} color={colors.muted} />
            <TextInput
              style={s.searchInput}
              placeholder="Name, @tag, email or account no."
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

          {!q && beneficiaries.isLoading && <Loader />}
          {!q && !beneficiaries.isLoading && sorted.length === 0 && (
            <Empty text="No beneficiaries yet. Search for someone above." />
          )}
          {!q &&
            sorted.map((b) => (
              <PersonRow
                key={b.id}
                user={b.user}
                title={b.displayName}
                subtitle={`@${b.user.tag}${b.lastTransfer ? ` · last ${formatMoney(b.lastTransfer.amount, cur)}` : ""}`}
                onPress={() => setRecipient(b.user)}
                right={
                  b.isFavourite ? (
                    <Feather name="star" size={16} color={colors.warning} />
                  ) : (
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={colors.muted}
                    />
                  )
                }
              />
            ))}

          {q && search.isFetching && <Loader />}
          {q && q.trim().length < 2 && (
            <Empty text="Type at least 2 characters" />
          )}
          {q && search.data?.length === 0 && (
            <Empty text={`No users match “${q}”`} />
          )}
          {q &&
            search.data?.map((u) => (
              <PersonRow
                key={u.id}
                user={u}
                onPress={() => setRecipient(u)}
                right={
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={colors.muted}
                  />
                }
              />
            ))}
        </Card>
      ) : (
        <Card>
          <View style={s.recipient}>
            <Avatar user={recipient} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{recipient.fullName}</Text>
              <Text style={s.meta}>@{recipient.tag}</Text>
            </View>
            {!isBeneficiary && (
              <Pressable
                onPress={saveBeneficiary}
                hitSlop={8}
                disabled={addBeneficiary.isPending}
              >
                <Feather name="user-plus" size={18} color={colors.primary} />
              </Pressable>
            )}
            <Pressable onPress={() => setRecipient(null)} hitSlop={8}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                Change
              </Text>
            </Pressable>
          </View>

          <ErrorBox message={error} />

          <Text style={s.label}>Amount ({cur})</Text>
          <TextInput
            style={s.amount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.line}
            value={amount}
            onChangeText={setAmount}
          />
          <View style={s.quickRow}>
            {QUICK_AMOUNTS.map((v) => (
              <Pressable
                key={v}
                style={[s.quick, amt === v && s.quickOn]}
                onPress={() => setAmount(String(v))}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 12,
                    color: amt === v ? colors.primary : colors.text,
                  }}
                >
                  {formatCompact(v, cur)}
                </Text>
              </Pressable>
            ))}
          </View>
          {tooHigh && <Text style={s.warn}>Insufficient balance</Text>}
          {tooLow && (
            <Text style={s.warn}>
              Minimum transfer is {formatMoney(MIN_TRANSFER, cur)}
            </Text>
          )}

          <Text style={s.label}>Note (optional)</Text>
          <TextInput
            style={s.note}
            placeholder="What's it for?"
            placeholderTextColor={colors.muted}
            value={note}
            onChangeText={setNote}
            maxLength={140}
          />

          <Button
            title={amt > 0 ? `Send ${formatMoney(amt, cur)}` : "Send"}
            onPress={submit}
            disabled={!canSend}
            loading={send.isPending}
          />
        </Card>
      )}

      <ReceiptModal
        transfer={receipt}
        onClose={() => setReceipt(null)}
        onViewHistory={() => {
          setReceipt(null);
          navigation.navigate("History");
        }}
      />
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
    marginBottom: 8,
  },
  searchInput: { flex: 1, paddingVertical: 10, color: colors.text },
  recipient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  name: { fontWeight: "700", color: colors.text, fontSize: 16 },
  meta: { color: colors.muted, fontSize: 12 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 16,
    marginBottom: 6,
  },
  amount: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    color: colors.text,
    paddingVertical: 12,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    marginBottom: 10,
  },
  quickRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 8,
  },
  quick: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  warn: {
    color: colors.danger,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  note: {
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    padding: 12,
    color: colors.text,
    marginBottom: 16,
  },
});
