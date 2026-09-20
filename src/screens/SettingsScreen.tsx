import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSettings, useUpdateSettings } from "../hooks/queries";
import { colors, radius } from "../lib/theme";
import { errorMessage, type UserSettings } from "../lib/types";
import { usersService } from "../services";
import { Card, ListRow, Loader, Screen } from "../components/ui";

const CURRENCIES: UserSettings["currency"][] = ["NGN", "USD", "GBP", "EUR"];
const LANGUAGES: { value: UserSettings["language"]; label: string }[] = [
  { value: "en", label: "English" },
  { value: "yo", label: "Yorùbá" },
  { value: "ha", label: "Hausa" },
  { value: "ig", label: "Igbo" },
  { value: "fr", label: "Français" },
];
const THEMES: UserSettings["theme"][] = ["light", "dark", "system"];

type Toggle =
  | "transactionAlerts"
  | "pushNotifications"
  | "emailNotifications"
  | "marketingEmails";
const TOGGLES: {
  key: Toggle;
  title: string;
  subtitle: string;
  icon: "bell" | "smartphone" | "mail" | "tag";
}[] = [
  {
    key: "transactionAlerts",
    title: "Transaction alerts",
    subtitle: "Every debit and credit",
    icon: "bell",
  },
  {
    key: "pushNotifications",
    title: "Push notifications",
    subtitle: "Real-time alerts on this device",
    icon: "smartphone",
  },
  {
    key: "emailNotifications",
    title: "Email notifications",
    subtitle: "Receipts & security alerts",
    icon: "mail",
  },
  {
    key: "marketingEmails",
    title: "Product updates",
    subtitle: "Occasional news and offers",
    icon: "tag",
  },
];

export default function SettingsScreen() {
  const { logout } = useAuth();
  const settings = useSettings();
  const update = useUpdateSettings();
  const data = settings.data;

  const patch = (input: Partial<UserSettings>) =>
    update.mutate(input, {
      onError: (e) => Alert.alert("Could not save", errorMessage(e)),
    });

  const confirmDeactivate = () =>
    Alert.alert(
      "Deactivate account",
      "Your wallet must be empty. You will be signed out and will not be able to log in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            try {
              await usersService.deleteAccount();
              await logout();
            } catch (e) {
              Alert.alert("Could not deactivate", errorMessage(e));
            }
          },
        },
      ],
    );

  if (!data) {
    return (
      <Screen edges={[]}>
        <Loader />
      </Screen>
    );
  }

  return (
    <Screen edges={[]}>
      <Text style={s.section}>Preferences</Text>
      <Card style={{ marginBottom: 16 }}>
        <ListRow
          icon="globe"
          title="Display currency"
          right={
            <Pills
              options={CURRENCIES}
              value={data.currency}
              onChange={(v) => patch({ currency: v })}
            />
          }
        />
        <ListRow
          icon="sun"
          title="Theme"
          right={
            <Pills
              options={THEMES}
              value={data.theme}
              onChange={(v) => patch({ theme: v })}
            />
          }
        />
        <View style={{ paddingVertical: 12 }}>
          <Text
            style={{ fontWeight: "600", color: colors.text, marginBottom: 8 }}
          >
            Language
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {LANGUAGES.map((l) => (
              <Pressable
                key={l.value}
                onPress={() => patch({ language: l.value })}
                style={[s.pill, data.language === l.value && s.pillOn]}
              >
                <Text
                  style={[
                    s.pillText,
                    data.language === l.value && { color: "#fff" },
                  ]}
                >
                  {l.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Card>

      <Text style={s.section}>Notifications</Text>
      <Card style={{ marginBottom: 16 }}>
        {TOGGLES.map((t) => (
          <ListRow
            key={t.key}
            icon={t.icon}
            title={t.title}
            subtitle={t.subtitle}
            right={
              <Switch
                value={data[t.key]}
                onValueChange={(v) => patch({ [t.key]: v })}
                disabled={update.isPending}
                trackColor={{ true: colors.primary }}
              />
            }
          />
        ))}
      </Card>

      <Text style={s.section}>Danger zone</Text>
      <Card>
        <ListRow
          icon="user-x"
          title="Deactivate account"
          subtitle="Requires an empty wallet"
          onPress={confirmDeactivate}
          danger
        />
      </Card>
    </Screen>
  );
}

function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {options.map((o) => (
        <Pressable
          key={o}
          onPress={() => onChange(o)}
          style={[s.pill, value === o && s.pillOn]}
        >
          <Text style={[s.pillText, value === o && { color: "#fff" }]}>
            {o.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
  },
  pillOn: { backgroundColor: colors.primary },
  pillText: { fontSize: 11, fontWeight: "700", color: colors.muted },
});
