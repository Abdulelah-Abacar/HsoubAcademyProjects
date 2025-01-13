import { Keyboard } from "react-native";
import {
  Toast,
  Text,
  View,
  Button,
  Input,
  Icon,
  Box,
  useToast,
  ButtonText,
  InputField,
  InputIcon,
  VStack,
  ToastTitle,
  GlobeIcon,
  LockIcon,
  KeyboardAvoidingView,
  Image,
} from "@gluestack-ui/themed";
import { useState } from "react";
import strings from "../config/strings";
import styles from "./style/auth";
import companyLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import { Axios, Urls, Auth } from "../config";
import { Loader } from "../components";

const Login = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = route.params;

  const onUsernameChange = (value) => setUsername(value);
  const onPasswordChange = (value) => setPassword(value);

  const toast = useToast();
  const validate = () => {
    Keyboard.dismiss();
    if (!username) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{strings.USERNAME_REQUIRED}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      return false;
    }
    if (!password) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{strings.PASSWORD_REQUIRED}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      return false;
    }
    return true;
  };

  const login = async () => {
    if (!validate()) return;
    let data = {
      username,
      password,
    };
    try {
      setIsLoading(true);
      let response = await Axios.post(Urls.AUTH, data);
      Auth.setUser(response.data);
      setIsLoading(false);
      setUser(Auth.getToken());
    } catch (err) {
      setIsLoading(false);
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>{err.response.data.message}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  const navToRegister = () => navigation.navigate("Register");
  return (
    <View flex={1}>
      <Loader title={strings.PLEASE_WAIT} loading={isLoading} />
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <Box>
          <Box style={styles.logoContainer}>
            <Image style={styles.logo} alt="logo" source={companyLogo} />
          </Box>
          <View style={styles.form}>
            <Text style={styles.title} color={colors.GRAY}>
              {strings.LOGIN}
            </Text>

            <Box style={styles.inputItem}>
              <Input
                variant="rounded"
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                style={styles.input}
              >
                <InputField
                  textAlign="right"
                  value={username}
                  placeholder={strings.USERNAME_PLACEHOLDER}
                  onChangeText={onUsernameChange}
                />
                <InputIcon style={styles.icon}>
                  <Icon as={GlobeIcon} size={"sm"} />
                </InputIcon>
              </Input>
            </Box>
            <Box style={styles.inputItem}>
              <Input
                variant="rounded"
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                style={styles.input}
              >
                <InputField
                  textAlign="right"
                  value={password}
                  type="password"
                  placeholder={strings.PASSWORD_PLACEHOLDER}
                  onChangeText={onPasswordChange}
                />
                <InputIcon style={styles.icon}>
                  <Icon as={LockIcon} size="sm" />
                </InputIcon>
              </Input>
            </Box>
            <Button
              size="md"
              variant="solid"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}
              style={styles.button}
              onPress={login}
            >
              <ButtonText>{strings.LOGIN}</ButtonText>
            </Button>
            <Button
              size="md"
              variant="outline"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}
              style={styles.button}
              onPress={navToRegister}
            >
              <ButtonText>{strings.CREATE_NEW_ACCOUNT}</ButtonText>
            </Button>
          </View>
        </Box>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
