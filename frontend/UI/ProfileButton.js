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
import Profile from "../assets/tabbarIcons/Profile.png"
import {useNavigation} from '@react-navigation/native';

class MyTreeDataProvider {
  // Implement your tree data provider methods here
}
// import styles too
// make size able to change based on props base in big small
// https://stackoverflow.com/questions/71917026/how-to-pass-in-props-to-an-element-that-changes-in-size-depending-on-prop
// onPress={() => navigation.navigate(props.back)}
const ProfileButton = (props) => {
const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.shape}>
        <Image style={styles.iconStyle} source={Profile} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({ 
  iconStyle: {
    tintColor:'white',
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  shape: {
    alignSelf:'flex-end',
    zIndex:2,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    height: 35, 
    borderRadius: 60,
    backgroundColor: "#ccc0ef",
    right: 20,
    top:75,
  }
});

export default ProfileButton;