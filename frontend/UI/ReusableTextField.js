// text fields for log in + sign up
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

const ReusableTextField = ({
  onChangeText,
  value,
  placeholder,
  imageSource,
  secure,
  }) => {
  return (
    <View style={styles.textFieldContainer}>
      <Image source={imageSource} style={styles.imageStyle} />
      <TextInput
        style={styles.form}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor="#ada4a5"
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secure}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  form: {
    color: "black",
    fontSize: 16, // Adjust the font size as needed
    borderRadius: 14,
    fontFamily: Poppins, // Assuming Poppins is a string representing the font family
    width: "95%",
    height: 50, // Adjust the height as needed
    backgroundColor: "white",
    paddingLeft: 45,
  },
  textFieldContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageStyle: {
    position: "absolute",
    left: 35,
    zIndex: 100,
    height: 30,
    width: 30,
  },
});
export default ReusableTextField;
