import React from "react";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Colors } from "../config";
import { HStack, Heading, View } from "@gluestack-ui/themed";

export default ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HStack alignSelf="center">
          <Heading style={styles.center}>{title}</Heading>
        </HStack>
      </View>
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
  center: {
    alignSelf: "center",
  },
});
