import React, { Component, useState } from "react";
import { Keyboard, KeyboardAvoidingView } from "react-native";
import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  InputIcon,
  LockIcon,
  Toast,
  useToast,
  View,
  VStack,
} from "@gluestack-ui/themed";
import { Header } from "../components";
import { Auth, Axios, Strings, Urls } from "../config";
import styles from "./style/auth";

const Password = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const toast = useToast();

  /**
   * On password change listener.
   */
  const onPasswordChange = (password) => setPassword(password);

  /**
   * On new password change listener.
   */
  const onNewPasswordChange = (newPassword) => setNewPassword(newPassword);

  /**
   * Validate password and new password.
   */
  const validate = () => {
    Keyboard.dismiss();
    if (!password) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{Strings.PASSWORD_REQUIRED}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      return false;
    }
    if (!newPassword) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{Strings.NEW_PASSWORD_REQUIRED}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      return false;
    }
    return true;
  };

  /**
   * Send change password request to server.
   */
  const send = async () => {
    if (!validate()) return;
    let data = {
      password,
      newPassword,
    };
    try {
      Axios.defaults.headers.common.Authorization = await Auth.getToken();
      await Axios.post(Urls.CHANGE_PASSWORD, data);
      setPassword("");
      setNewPassword("");
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>{Strings.PASSWORD_CHANGED}</ToastTitle>
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
                <ToastTitle>{e.response.data.message}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <View>
      <Header title={Strings.TITLE_CHANGE_PASSWORD} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Box>
          <View style={styles.form}>
            <Box rounded={"$full"} style={styles.inputItem}>
              <Input style={styles.input}>
                <InputField
                  placeholder={Strings.PASSWORD_PLACEHOLDER}
                  secureTextEntry={true}
                  onChangeText={onPasswordChange}
                  value={password}
                />
                <InputIcon as={LockIcon} style={styles.icon} />
              </Input>
            </Box>
            <Box rounded={"$full"} style={styles.inputItem}>
              <Input style={styles.input}>
                <InputField
                  placeholder={Strings.NEW_PASSWORD_PLACEHOLDER}
                  secureTextEntry={true}
                  onChangeText={onNewPasswordChange}
                  value={newPassword}
                />
                <InputIcon as={LockIcon} style={styles.icon} />
              </Input>
            </Box>
            <Button rounded info block style={styles.button} onPress={send}>
              <ButtonText>{Strings.SEND}</ButtonText>
            </Button>
          </View>
        </Box>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Password;
