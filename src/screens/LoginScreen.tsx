import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../lib/types";
import { colors, radius } from "../lib/theme";
import { AuthHeader } from "../components/AuthHeader";
import { GoogleButton } from "../components/GoogleButton";
import { Button, ErrorBox, Input, Screen } from "../components/ui";
import type { AuthStackParams } from "../navigation/types";

const DEMO_PASSWORD = "Password123";
const DEMO_ACCOUNTS = [
  { email: "lola@lolapay.com", name: "Lola" },
  { email: "emma@lolapay.com", name: "Emma" },
  { email: "tobi@lolapay.com", name: "Tobi" },
];

export default function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParams, "Login">) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      await login({ email: email.trim().toLowerCase(), password });
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Screen edges={["top", "bottom"]} background={colors.surface}>
      <View style={s.body}>
        <AuthHeader
          title="Welcome back"
          subtitle="Log in to your LolaPay account"
        />
        <ErrorBox message={error} />
        <Input
          label="Email"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          onSubmitEditing={submit}
        />
        <Button
          title="Log in"
          onPress={submit}
          loading={busy}
          disabled={!email || !password}
        />
        <GoogleButton onError={setError} />

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 24 }}
        >
          <Text style={s.switch}>
            New to LolaPay? <Text style={s.link}>Create an account</Text>
          </Text>
        </Pressable>

        {__DEV__ && (
          <View style={s.demo}>
            <Text style={{ fontSize: 12, color: colors.primaryDark }}>
              Demo accounts (password {DEMO_PASSWORD}):
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              {DEMO_ACCOUNTS.map((d) => (
                <Pressable
                  key={d.email}
                  style={s.demoChip}
                  onPress={() => {
                    setEmail(d.email);
                    setPassword(DEMO_PASSWORD);
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontWeight: "700",
                      fontSize: 12,
                    }}
                  >
                    {d.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  body: { flexGrow: 1, justifyContent: "center", paddingVertical: 12 },
  switch: { textAlign: "center", color: colors.muted },
  link: { color: colors.primary, fontWeight: "700" },
  demo: {
    marginTop: 24,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    padding: 12,
  },
  demoChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
