import React from "react";
import { StyleSheet } from "react-native";
import { Colors } from "../../config";

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: Colors.GRAY,
    padding: 30,
    height: 200,
  },
  form: {
    margin: 20,
  },
  inputItem: {
    height: 70,
    marginBottom: 20,
    textAlign: "right",
  },
  input: {
    textAlign: "right",
  },
  button: {
    marginBottom: 20,
  },
});

export default styles;
