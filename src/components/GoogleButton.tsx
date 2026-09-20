import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  type DiscoveryDocument,
} from "expo-auth-session";
import { useAuth } from "../context/AuthContext";
import { useAuthProviders } from "../hooks/queries";
import { errorMessage } from "../lib/types";
import { colors } from "../lib/theme";
import { Button } from "./ui";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

const discovery: DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export function GoogleButton({
  onError,
}: {
  onError: (message: string) => void;
}) {
  const { loginWithGoogle } = useAuth();
  const providers = useAuthProviders();
  const redirectUri = makeRedirectUri({ scheme: "lolapay", path: "oauth" });
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID ?? "missing",
      scopes: ["openid", "email", "profile"],
      redirectUri,
      usePKCE: true,
    },
    discovery,
  );

  useEffect(() => {
    if (
      response?.type !== "success" ||
      !request?.codeVerifier ||
      !GOOGLE_CLIENT_ID
    )
      return;
    exchangeCodeAsync(
      {
        clientId: GOOGLE_CLIENT_ID,
        code: response.params.code ?? "",
        redirectUri,
        extraParams: { code_verifier: request.codeVerifier },
      },
      discovery,
    )
      .then((t) => {
        if (!t.idToken) throw new Error("Google did not return an id_token");
        return loginWithGoogle(t.idToken);
      })
      .catch((e: unknown) => onError(errorMessage(e)));
  }, [response, request, redirectUri, loginWithGoogle, onError]);

  if (!providers.data?.google || !GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <View style={s.divider}>
        <View style={s.line} />
        <Text style={{ color: colors.muted, fontSize: 12 }}>
          or continue with
        </Text>
        <View style={s.line} />
      </View>
      <Button
        title="Google"
        variant="outline"
        icon="chrome"
        disabled={!request}
        onPress={() => void promptAsync()}
      />
    </>
  );
}

const s = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 18,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.line },
});
