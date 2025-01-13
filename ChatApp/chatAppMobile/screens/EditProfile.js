import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import {
  FormControlLabel,
  FormControlLabelText,
  HStack,
  InputField,
  Input,
  Button,
  ButtonText,
  Toast,
  ToastTitle,
  View,
  useToast,
  VStack,
  FormControl,
} from "@gluestack-ui/themed";
import { withChatContext } from "../context/ChatProvider";
import { Strings, Axios, Auth, Urls } from "../config";
import { Header, Avatar } from "../components";
import styles from "./style/editProfile";
import * as ImagePicker from "expo-image-picker";

let fd = global.FormData;

const EditProfile = ({ route, chat, navigation }) => {
  const user = chat.account;
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about);
  const [avatar, setAvatar] = useState(user?.avatar);
  const { setUser } = route.params;

  const onNameChange = (name) => setName(name);

  const onAboutChange = (about) => setAbout(about);

  const handleChoosePhoto = async () => {
    await ImagePicker;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const toast = useToast();

  const validate = () => {
    Keyboard.dismiss();
    if (!name) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{Strings.NAME_REQUIRED}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      return false;
    }
    if (!about) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{Strings.ABOUT_REQUIRED}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      return false;
    }
    return true;
  };

  const send = async () => {
    if (!validate()) return;
    const data = new FormData();
    data.append("name", name);
    data.append("about", about);
    if (avatar instanceof Object) {
      let fileType = avatar.uri.split(".").pop();
      data.append("avatar", {
        uri: avatar.uri,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      Axios.defaults.headers.common.Authorization = await Auth.getToken();
      await Axios.post(Urls.UPDATE_PROFILE, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>{Strings.PROFILE_UPDATED}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    } catch (e) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{e.response?.data.message}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  const logout = async () => {
    await Auth.logout();
    chat.logout();
    setUser(null);
  };
  const navToPassword = () => navigation.navigate("Password");

  return (
    <View flex={1}>
      <Header title={Strings.TITLE_MY_ACCOUNT} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View>
          <View style={styles.avatarContainer}>
            <View>
              <HStack alignSelf="center">
                <TouchableOpacity onPress={handleChoosePhoto}>
                  <Avatar type="profile" source={avatar} />
                </TouchableOpacity>
              </HStack>
            </View>
          </View>
          <View style={styles.form}>
            <FormControl style={styles.inputItem}>
              <FormControlLabel alignSelf="flex-end">
                <FormControlLabelText>
                  {Strings.NAME_PLACEHOLDER}
                </FormControlLabelText>
              </FormControlLabel>
              <Input rounded={"$full"}>
                <InputField
                  style={styles.input}
                  value={name}
                  onChangeText={onNameChange}
                />
              </Input>
            </FormControl>
            <FormControl style={styles.inputItem}>
              <FormControlLabel alignSelf="flex-end">
                <FormControlLabelText>
                  {Strings.ABOUT_PLACEHOLDER}
                </FormControlLabelText>
              </FormControlLabel>
              <Input rounded={"$full"}>
                <InputField
                  style={styles.input}
                  value={about}
                  onChangeText={onAboutChange}
                />
              </Input>
            </FormControl>
            <FormControl>
              <Button rounded={"$full"} style={styles.button} onPress={send}>
                <ButtonText fontSize="$sm" fontWeight="$medium">
                  {Strings.SAVE}
                </ButtonText>
              </Button>
              <Button
                rounded={"$full"}
                variant="outline"
                style={styles.button}
                onPress={logout}
              >
                <ButtonText fontSize="$sm" fontWeight="$medium">
                  {Strings.LOGOUT}
                </ButtonText>
              </Button>
              <Button
                rounded={"$full"}
                variant="outline"
                style={styles.button}
                onPress={logout}
              >
                <ButtonText
                  onPress={navToPassword}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {Strings.CHANGE_PASSWORD}
                </ButtonText>
              </Button>
            </FormControl>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default withChatContext(EditProfile);
