import React, { useState } from "react";
import {
  Header,
  Body,
  Title,
  View,
  Left,
  Right,
  Button,
  Input,
  MenuIcon,
  SearchIcon,
  ButtonIcon,
  Box,
  Text,
  Heading,
  HStack,
  ClockIcon,
  Icon,
  InputIcon,
  InputField,
  CloseIcon,
  Pressable,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Colors, Strings, strings } from "../config";

export default ({ navigation, title, onSearchChange, search, onClick }) => {
  const [isSearch, setIsSearch] = useState(false);

  const onMenuClick = () => {
    navigation.navigate("EditProfile");
  };

  const onSearchClose = () => {
    setIsSearch(false);
    onSearchChange("");
  };

  if (isSearch) {
    return (
      <Box style={styles.header}>
        <HStack>
          <Input
            variant="outlien"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            w={"$full"}
          >
            <Pressable alignSelf="center" onPress={onSearchClose}>
              <InputIcon ml={"$3"} alignSelf="center">
                <Icon as={CloseIcon} size={"lg"} />
              </InputIcon>
            </Pressable>
            <InputField
              textAlign="right"
              placeholder={Strings.SEARCH}
              value={search}
              onChangeText={onSearchChange}
              color="white"
            />
            <InputIcon mr={"$3"} alignSelf="center">
              <Icon as={SearchIcon} size={"lg"} />
            </InputIcon>
          </Input>
        </HStack>
      </Box>
    );
  }

  return (
    <Box px={"$5"} py={"$2"} style={styles.container}>
      <Box style={styles.header}>
        <HStack>
          <View>
            <Button size="md" variant="link" action="primary" onPress={onClick}>
              <ButtonIcon color="white" size="xl" as={MenuIcon} />
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Heading style={{ alignSelf: "center", height: 50 }}>
              {title}
            </Heading>
          </View>
          <View>
            <Button
              size="md"
              variant="link"
              action="primary"
              onPress={() => setIsSearch(true)}
            >
              <ButtonIcon color="white" size="xl" as={SearchIcon} />
            </Button>
          </View>
        </HStack>
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.GRAY,
  },
  header: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: Colors.GRAY,
    marginTop: Constants.statusBarHeight,
  },
});
