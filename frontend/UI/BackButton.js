//reusable back button used throughout project
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
import BackArrow from "../assets/buttonIcons/backarrow.png"
import {useNavigation} from '@react-navigation/native';


// import styles too
// make size able to change based on props base in big small
// https://stackoverflow.com/questions/71917026/how-to-pass-in-props-to-an-element-that-changes-in-size-depending-on-prop
const BackButton = (props) => {
const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.shape} onPress={() => navigation.navigate(props.back)}>
        <Image style={styles.iconStyle} source={BackArrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  shape: {
    alignSelf:'flex-start',
    zIndex:1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30, 
    borderRadius: 60,
    backgroundColor: "#ccc0ef",
    left: 20,
  }
});

export default BackButton;