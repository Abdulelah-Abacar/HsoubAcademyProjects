import React from "react";
import { StyleSheet } from "react-native";
import { Text, View, Badge, Box, HStack, VStack } from "@gluestack-ui/themed";
import { Strings, Moment } from "../config";
import Avatar from "./Avatar";
import online from "../assets/images/online.png";
import { BadgeText } from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";

export default ({ contact, onClick }) => {
  const { name, avatar, counter, status, lastMessage } = contact;

  const { date, content } = lastMessage ? lastMessage : {};

  return (
    <Pressable onPress={() => onClick(contact)}>
      <Box p="$2" borderBottomWidth={"$1"} borderBottomColor="$coolGray300">
        <Box>
          <HStack reversed={true} space="xs" justifyContent="space-around">
            <Avatar source={avatar} status={status} />
            <VStack flex={0.8}>
              <Text style={styles.right}>{name}</Text>
              <Text opacity={"$50"} style={styles.right}>
                {content || Strings.CLICK_HERE_TO_START_CHAT}
              </Text>
            </VStack>
            <View>
              <View>
                <Text opacity={"$50"}>
                  {Moment(date).format("hh:mm a") || ""}
                </Text>
              </View>
              <View w={"$1"} style={styles.counter}>
                {counter > 0 ? (
                  <Badge
                    h={25}
                    w={25}
                    variant="outline"
                    borderRadius="$full"
                    action="success"
                  >
                    <BadgeText>{counter}</BadgeText>
                  </Badge>
                ) : null}
              </View>
            </View>
          </HStack>
        </Box>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 0.7,
  },
  right: {
    textAlign: "right",
  },
  counter: {
    margin: 5,
    textAlign: "center",
  },
});
