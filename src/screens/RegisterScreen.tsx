import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { errorMessage, type RegisterInput } from "../lib/types";
import { colors } from "../lib/theme";
import { AuthHeader } from "../components/AuthHeader";
import { GoogleButton } from "../components/GoogleButton";
import { Button, ErrorBox, Input, Screen } from "../components/ui";
import type { AuthStackParams } from "../navigation/types";

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  tag: string;
  phone: string;
  password: string;
  confirm: string;
}

const empty: Form = {
  firstName: "",
  lastName: "",
  email: "",
  tag: "",
  phone: "",
  password: "",
  confirm: "",
};

export default function RegisterScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParams, "Register">) {
  const { register } = useAuth();
  const [f, setF] = useState<Form>(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: keyof Form) => (value: string) =>
    setF((prev) => ({ ...prev, [key]: value }));

  const strongEnough =
    f.password.length >= 8 &&
    /[A-Za-z]/.test(f.password) &&
    /\d/.test(f.password);
  const canSubmit =
    f.firstName &&
    f.lastName &&
    f.email &&
    strongEnough &&
    f.password === f.confirm;

  const submit = async () => {
    setBusy(true);
    setError("");
    const input: RegisterInput = {
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      email: f.email.trim().toLowerCase(),
      password: f.password,
      ...(f.tag.trim() ? { tag: f.tag.trim().replace(/^@/, "") } : {}),
      ...(f.phone.trim() ? { phone: f.phone.trim() } : {}),
    };
    try {
      await register(input);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Screen edges={["top", "bottom"]} background={colors.surface}>
      <AuthHeader
        title="Create your account"
        subtitle="Get a free wallet and virtual card in seconds"
      />
      <ErrorBox message={error} />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Input
            label="First name"
            value={f.firstName}
            onChangeText={set("firstName")}
            placeholder="Lola"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Last name"
            value={f.lastName}
            onChangeText={set("lastName")}
            placeholder="Omotayo"
          />
        </View>
      </View>
      <Input
        label="Email"
        icon="mail"
        value={f.email}
        onChangeText={set("email")}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <Input
        label="LolaPay tag (optional)"
        icon="at-sign"
        value={f.tag}
        onChangeText={set("tag")}
        autoCapitalize="none"
        placeholder="lola"
        hint="Others can send to you with @tag"
      />
      <Input
        label="Phone (optional)"
        icon="phone"
        value={f.phone}
        onChangeText={set("phone")}
        keyboardType="phone-pad"
        placeholder="+2348012345678"
      />
      <Input
        label="Password"
        icon="lock"
        value={f.password}
        onChangeText={set("password")}
        secureTextEntry
        placeholder="8+ characters with a letter and a number"
      />
      <Input
        label="Confirm password"
        icon="lock"
        value={f.confirm}
        onChangeText={set("confirm")}
        secureTextEntry
        placeholder="Repeat your password"
        {...(f.confirm && f.confirm !== f.password
          ? { hint: "Passwords do not match" }
          : {})}
      />
      <Button
        title="Create account"
        onPress={submit}
        loading={busy}
        disabled={!canSubmit}
      />
      <GoogleButton onError={setError} />
      <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 24 }}>
        <Text style={s.switch}>
          Already have an account? <Text style={s.link}>Log in</Text>
        </Text>
      </Pressable>
    </Screen>
  );
}

const s = StyleSheet.create({
  switch: { textAlign: "center", color: colors.muted },
  link: { color: colors.primary, fontWeight: "700" },
});
