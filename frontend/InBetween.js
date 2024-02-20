import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { styles } from "./Style.js";
import { useAuth } from "@clerk/clerk-expo";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import ReusableButton from "./UI/ReusableButton.js";
import ReusableTextField from "./UI/ReusableTextField.js";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./UI/BackButton.js";
import { Poppins } from "@expo-google-fonts/poppins"


const InBetweenScreen = () => {
    const navigation = useNavigation();
    const handleNewUserClick = async () => {
        navigation.navigate("Names");
      };
      const handleSignInClick = async () => {
        navigation.navigate("JoinGroupSignIn");
      };

  return (
    <SafeAreaView style={styles.newcontainer}>
      <View style={{justifyContent:"flex-end", alignItems:"center", width:"100%", height:"100%"}}>
      <Text style={styles.header3}>Create a New Account  or Join a Group 🔮</Text>
      <ReusableButton function={handleNewUserClick} name="New Account" width={"150%"} height={"20%"}/>
      <ReusableButton function={handleSignInClick} name="Join Group" width={"150%"} height={"20%"}/>
      </View>
    </SafeAreaView>
  );
};
export default InBetweenScreen;
