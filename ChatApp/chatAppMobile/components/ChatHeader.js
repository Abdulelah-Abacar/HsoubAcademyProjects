import React from "react";
import {
  Box,
  Heading,
  View,
  Button,
  ButtonIcon,
  Text,
  HStack,
  ArrowRightIcon,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Colors } from "../config";
import Avatar from "./Avatar";

export default ({ contact, status, onBack, onProfile }) => {
  return (
    <View style={styles.container}>
      <Box style={styles.header}>
        <HStack ml={"auto"} py={"$3"} px={"$6"} space="md">
          <View>
            <Button
              size="md"
              variant="link"
              action="primary"
              onPress={onProfile}
            >
              <View>
                <View>
                  <Heading style={styles.right}>{contact.name}</Heading>
                </View>
                <View>
                  <Text style={styles.status}>{status}</Text>
                </View>
              </View>
            </Button>
          </View>
          <View style={styles.avatarContainer}>
            <Button
              size="md"
              variant="link"
              action="primary"
              onPress={onProfile}
            >
              <Avatar source={contact.avatar} type="header" />
            </Button>
          </View>
          <Button size="md" variant="link" action="primary" onPress={onBack}>
            <ButtonIcon color="white" as={ArrowRightIcon} size="lg" />
          </Button>
        </HStack>
      </Box>
    </View>
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
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  right: {
    textAlign: "right",
  },
  status: {
    color: Colors.WHITE,
    fontSize: 12,
  },
});
