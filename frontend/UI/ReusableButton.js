//reusable purple buttomn
import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Poppins } from "@expo-google-fonts/poppins";

// import styles too
// make size able to change based on props base in big small
// https://stackoverflow.com/questions/71917026/how-to-pass-in-props-to-an-element-that-changes-in-size-depending-on-prop
const ReusableButton = (props) => {
  return (
    <TouchableOpacity style={styles.center} onPress={props.function}>
      <LinearGradient
        style={styles.buttonGradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={["#CCC0EF", "#4A5AB2"]}
      >
        <Image style={styles.iconStyle} source={props.icon} />
        <Text style={styles.textStyling}>{props.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGradient: {
    flexDirection: "row",
    borderRadius: "100%",
    height: "30%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyling: {
    fontFamily: Poppins,
    color: "#fff",
    //textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    alignSelf: "center",
    marginRight: 40,
  },
  iconStyle: {
    aspectRatio: 3,
    resizeMode: "contain",
  },
});

export default ReusableButton;
