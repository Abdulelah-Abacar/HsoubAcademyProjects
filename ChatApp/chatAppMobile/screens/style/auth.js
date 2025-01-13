import React from "react";
import { StyleSheet } from "react-native";
import { w, h } from "../../api/Dimensions";
import { Colors } from "../../config";

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: Colors.GRAY,
    height: 250,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: w(65),
    height: h(10),
  },
  icon: {
    color: Colors.GRAY,
    // marginTop: 10,
    marginRight: 15,
    alignSelf: "center",
  },
  title: {
    color: Colors.GRAY,
    fontSize: 26,
    marginBottom: 20,
    height: 30,
  },
  input: {
    height: 45,
    textAlign: "right",
  },
  form: {
    alignItems: "center",
    textAlign: "center",
    margin: 20,
  },
  inputItem: {
    width: "100%",
    height: 45,
    marginBottom: 20,
  },
  button: {
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 100,
    width: "100%",
  },
});

export default styles;
