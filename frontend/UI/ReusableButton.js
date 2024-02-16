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
  if (props.icon) {
    // Render button with image
    return (
      <View style={styles.center}>
        <TouchableOpacity style={{ width: props.width }} onPress={props.function}>
          <LinearGradient
            style={styles.buttonGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={["#CCC0EF", "#4A5AB2"]}
          >
            <View style={styles.button}>
              <Image style={styles.iconStyle} source={props.icon} />
              <Text style={styles.textStyling}>{props.name}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  } else {
    // Render button without image
    return (
      <View style={styles.center2}>
        <TouchableOpacity style={[styles.buttonGradient, { width: props.width }]} onPress={props.function}>
          <LinearGradient
            style={styles.buttonGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={["#CCC0EF", "#4A5AB2"]}
          >
            <Text style={styles.textStyling2}>{props.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  button: {
    flexDirection: "row",
    height:60,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10, 
    marginRight:10,
    textAlign:'center',
  },
  buttonGradient: {
    borderRadius: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sizer: {
    width: "60%",
  },
  textStyling: {
    fontFamily: Poppins,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    alignSelf: "center"
  },
  textStyling2: {
    fontFamily: Poppins,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    alignSelf: "center",
    paddingVertical:"7%",
  },
  iconStyle: {
    height:30,
    width: 40,
    resizeMode: "contain",
  },
  center2: {
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
    width: "50%",
  },
});

export default ReusableButton;
