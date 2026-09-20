import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { useUpdateProfile, useUploadAvatar } from "../hooks/queries";
import { errorMessage, type UpdateProfileInput } from "../lib/types";
import { colors } from "../lib/theme";
import { usersService } from "../services";
import {
  Avatar,
  Button,
  Card,
  ErrorBox,
  Input,
  Screen,
} from "../components/ui";

export default function EditProfileScreen() {
  const { user, refreshUser } = useAuth();
  const nav = useNavigation();
  const update = useUpdateProfile();
  const upload = useUploadAvatar();
  const [f, setF] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    tag: user?.tag ?? "",
  });
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);
  if (!user) return null;

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted)
      return Alert.alert(
        "Permission needed",
        "Allow photo access to change your picture.",
      );
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    upload.mutate(
      {
        uri: asset.uri,
        name: asset.fileName ?? "avatar.jpg",
        type: asset.mimeType ?? "image/jpeg",
      },
      {
        onSuccess: () => void refreshUser(),
        onError: (e) => Alert.alert("Upload failed", errorMessage(e)),
      },
    );
  };

  const removeAvatar = async () => {
    setRemoving(true);
    try {
      await usersService.removeAvatar();
      await refreshUser();
    } catch (e) {
      Alert.alert("Could not remove", errorMessage(e));
    } finally {
      setRemoving(false);
    }
  };

  const save = () => {
    setError("");
    const input: UpdateProfileInput = {
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      phone: f.phone.trim() || null,
      ...(f.tag.trim() && f.tag.trim() !== user.tag
        ? { tag: f.tag.trim().replace(/^@/, "") }
        : {}),
    };
    update.mutate(input, {
      onSuccess: async () => {
        await refreshUser();
        nav.goBack();
      },
      onError: (e) => setError(errorMessage(e)),
    });
  };

  return (
    <Screen edges={[]}>
      <View style={s.avatarWrap}>
        <Pressable onPress={pickAvatar} disabled={upload.isPending}>
          <Avatar user={user} size={96} />
          <View style={s.camera}>
            <Feather name="camera" size={14} color="#fff" />
          </View>
        </Pressable>
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>
          {upload.isPending ? "Uploading…" : "JPEG, PNG or WebP · up to 5 MB"}
        </Text>
        {user.avatarUrl && (
          <Pressable
            onPress={removeAvatar}
            disabled={removing}
            style={{ marginTop: 6 }}
          >
            <Text
              style={{ color: colors.danger, fontWeight: "600", fontSize: 12 }}
            >
              {removing ? "Removing…" : "Remove photo"}
            </Text>
          </Pressable>
        )}
      </View>

      <Card>
        <ErrorBox message={error} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Input
              label="First name"
              value={f.firstName}
              onChangeText={(v) => setF({ ...f, firstName: v })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Last name"
              value={f.lastName}
              onChangeText={(v) => setF({ ...f, lastName: v })}
            />
          </View>
        </View>
        <Input
          label="LolaPay tag"
          icon="at-sign"
          value={f.tag}
          onChangeText={(v) => setF({ ...f, tag: v })}
          autoCapitalize="none"
        />
        <Input
          label="Phone"
          icon="phone"
          value={f.phone}
          onChangeText={(v) => setF({ ...f, phone: v })}
          keyboardType="phone-pad"
          placeholder="+2348012345678"
        />
        <Input
          label="Email"
          icon="mail"
          value={user.email}
          editable={false}
          hint="Email cannot be changed"
        />
        <Button
          title="Save changes"
          onPress={save}
          loading={update.isPending}
          disabled={!f.firstName.trim() || !f.lastName.trim()}
        />
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  avatarWrap: { alignItems: "center", marginBottom: 20 },
  camera: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.bg,
  },
});
