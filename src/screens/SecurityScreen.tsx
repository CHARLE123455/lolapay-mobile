import { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import {
  useChangePassword,
  useRevokeSession,
  useSessions,
  useSettings,
  useUpdateSettings,
} from "../hooks/queries";
import { formatWhen } from "../lib/format";
import { colors } from "../lib/theme";
import { errorMessage } from "../lib/types";
import { authService } from "../services";
import {
  Button,
  Card,
  Chip,
  ErrorBox,
  Input,
  Loader,
  SuccessBox,
  Screen,
} from "../components/ui";

export default function SecurityScreen() {
  const { user, logout } = useAuth();
  const sessions = useSessions();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const changePassword = useChangePassword();
  const revoke = useRevokeSession();
  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const strongEnough =
    pw.newPassword.length >= 8 &&
    /[A-Za-z]/.test(pw.newPassword) &&
    /\d/.test(pw.newPassword);

  const submitPassword = () => {
    setError("");
    setOk("");
    if (pw.newPassword !== pw.confirm)
      return setError("New passwords do not match");
    changePassword.mutate(
      { currentPassword: pw.currentPassword, newPassword: pw.newPassword },
      {
        onSuccess: () => {
          setOk("Password changed. Other devices were signed out.");
          setPw({ currentPassword: "", newPassword: "", confirm: "" });
          void sessions.refetch();
        },
        onError: (e) => setError(errorMessage(e)),
      },
    );
  };

  const signOutEverywhere = () =>
    Alert.alert(
      "Sign out everywhere",
      "This signs out every device, including this one.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logoutAll();
            } finally {
              await logout();
            }
          },
        },
      ],
    );

  return (
    <Screen edges={[]}>
      <Card style={{ marginBottom: 16 }}>
        <Text style={s.h2}>
          {user?.hasPassword ? "Change password" : "Set a password"}
        </Text>
        {!user?.hasPassword && (
          <Text style={s.hint}>
            You signed up with Google. Set a password to also log in with email.
          </Text>
        )}
        <ErrorBox message={error} />
        <SuccessBox message={ok} />
        {user?.hasPassword && (
          <Input
            label="Current password"
            icon="lock"
            secureTextEntry
            value={pw.currentPassword}
            onChangeText={(v) => setPw({ ...pw, currentPassword: v })}
          />
        )}
        <Input
          label="New password"
          icon="key"
          secureTextEntry
          value={pw.newPassword}
          onChangeText={(v) => setPw({ ...pw, newPassword: v })}
          placeholder="8+ chars with a letter and a number"
        />
        <Input
          label="Confirm new password"
          icon="key"
          secureTextEntry
          value={pw.confirm}
          onChangeText={(v) => setPw({ ...pw, confirm: v })}
        />
        <Button
          title="Update password"
          loading={changePassword.isPending}
          disabled={
            !strongEnough || (user?.hasPassword === true && !pw.currentPassword)
          }
          onPress={submitPassword}
        />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Two-factor authentication</Text>
            <Text style={s.hint}>Require a one-time code on new devices</Text>
          </View>
          <Switch
            value={Boolean(settings.data?.twoFactorEnabled)}
            disabled={!settings.data || updateSettings.isPending}
            onValueChange={(v) =>
              updateSettings.mutate(
                { twoFactorEnabled: v },
                {
                  onError: (e) =>
                    Alert.alert("Could not update", errorMessage(e)),
                },
              )
            }
            trackColor={{ true: colors.primary }}
          />
        </View>
      </Card>

      <Card>
        <View style={[s.row, { marginBottom: 8 }]}>
          <Text style={s.h2}>Active sessions</Text>
          <Pressable onPress={signOutEverywhere} hitSlop={6}>
            <Text
              style={{ color: colors.danger, fontWeight: "700", fontSize: 12 }}
            >
              Sign out everywhere
            </Text>
          </Pressable>
        </View>
        {sessions.isLoading && <Loader />}
        {sessions.data?.map((sess) => (
          <View key={sess.id} style={s.session}>
            <Feather
              name={
                /mobile|android|iphone|lolapaymobile/i.test(
                  `${sess.device} ${sess.userAgent ?? ""}`,
                )
                  ? "smartphone"
                  : "monitor"
              }
              size={20}
              color={colors.primary}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 6,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Text style={s.title}>{sess.device}</Text>
                {sess.isCurrent && <Chip text="This device" tone="green" />}
              </View>
              <Text style={s.hint}>
                {sess.ipAddress ?? "Unknown IP"} · {formatWhen(sess.lastUsedAt)}
              </Text>
            </View>
            {!sess.isCurrent && (
              <Pressable
                onPress={() =>
                  revoke.mutate(sess.id, {
                    onError: (e) =>
                      Alert.alert("Could not revoke", errorMessage(e)),
                  })
                }
                hitSlop={6}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  Revoke
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  h2: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  title: { fontWeight: "600", color: colors.text },
  hint: { color: colors.muted, fontSize: 12, marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  session: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
