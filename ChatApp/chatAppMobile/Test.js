import { Pressable, Text } from "@gluestack-ui/themed";
import { View } from "@gluestack-ui/themed";
import { Image, StyleSheet } from "react-native";
export default function Test() {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.metaContainer}>
          <View>
            <Text style={styles.timings}>Today @ 9PM</Text>
            <Text style={styles.description}>Let's talk about avatar!</Text>
          </View>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Remind me</Text>
          </Pressable>
        </View>
        <Image
          source={{
            uri: "https://media.vanityfair.com/photos/5ba12e6d42b9d16f4545aa19/3:2/w_1998,h_1332,c_limit/t-Avatar-The-Last-Airbender-Live-Action.jpg",
          }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0891b2",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "center",
    width: 375,
    maxWidth: "100%",
    maxHeight: "100%",
  },
  timings: {
    color: "#fff",
    fontSize: 14,
  },
  metaContainer: {
    justifyContent: "space-between",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  description: {
    color: "white",
    marginTop: 5,
    fontSize: 20,
  },
  button: {
    backgroundColor: "#22d3ee",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    fontSize: 14,
  },
});
