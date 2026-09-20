import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAccountSummary, useTransactions } from "../hooks/queries";
import { colors, radius } from "../lib/theme";
import type { TransactionType } from "../lib/types";
import { TransactionRow } from "../components/TransactionRow";
import {
  Card,
  Empty,
  Loader,
  Screen,
  ScreenTitle,
  SegmentedControl,
} from "../components/ui";

type Filter = "all" | TransactionType;
const PAGE_SIZE = 15;

export default function HistoryScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const summary = useAccountSummary();
  const transactions = useTransactions({
    page,
    limit: PAGE_SIZE,
    ...(filter !== "all" ? { type: filter } : {}),
    ...(q.trim() ? { q: q.trim() } : {}),
  });

  const cur = summary.data?.currency ?? "NGN";
  const meta = transactions.data?.meta;
  const rows = transactions.data?.data ?? [];

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <Screen scroll={false}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <ScreenTitle
          title="Transaction History"
          {...(meta ? { subtitle: `${meta.total} transactions` } : {})}
        />
        <SegmentedControl<Filter>
          value={filter}
          onChange={changeFilter}
          options={[
            { value: "all", label: "All" },
            { value: "CREDIT", label: "Received" },
            { value: "DEBIT", label: "Sent" },
          ]}
        />
        <View style={s.search}>
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name, note or reference"
            placeholderTextColor={colors.muted}
            value={q}
            onChangeText={(v) => {
              setQ(v);
              setPage(1);
            }}
          />
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 20, paddingTop: 12 }}
        data={rows}
        keyExtractor={(t) => t.id}
        refreshing={transactions.isRefetching}
        onRefresh={() => void transactions.refetch()}
        ListEmptyComponent={
          transactions.isLoading ? (
            <Loader />
          ) : (
            <Card>
              <Empty
                text={q ? `Nothing matches “${q}”` : "No transactions yet"}
              />
            </Card>
          )
        }
        renderItem={({ item }) => (
          <Card style={{ paddingVertical: 4, marginBottom: 8 }}>
            <TransactionRow tx={item} currency={cur} last />
          </Card>
        )}
        ListFooterComponent={
          meta && meta.totalPages > 1 ? (
            <View style={s.pager}>
              <Pressable
                disabled={page <= 1}
                onPress={() => setPage((p) => p - 1)}
              >
                <Text style={[s.pageBtn, page <= 1 && { color: colors.line }]}>
                  Previous
                </Text>
              </Pressable>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                Page {meta.page} of {meta.totalPages}
              </Text>
              <Pressable
                disabled={page >= meta.totalPages}
                onPress={() => setPage((p) => p + 1)}
              >
                <Text
                  style={[
                    s.pageBtn,
                    page >= meta.totalPages && { color: colors.line },
                  ]}
                >
                  Next
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, color: colors.text },
  pager: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  pageBtn: { color: colors.primary, fontWeight: "700" },
});
