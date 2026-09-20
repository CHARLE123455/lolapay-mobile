import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AuthHeader } from "../components/AuthHeader";
import { GoogleButton } from "../components/GoogleButton";
import { Button, ErrorBox, Input, Screen } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { colors } from "../lib/theme";
import { errorMessage } from "../lib/types";
import type { AuthStackParams } from "../navigation/types";

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
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  body: { flexGrow: 1, justifyContent: "center", paddingVertical: 12 },
  switch: { textAlign: "center", color: colors.muted },
  link: { color: colors.primary, fontWeight: "700" },
});
