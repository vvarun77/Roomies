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
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import ReusableButton from "./UI/ReusableButton.js";
import ReusableTextField from "./UI/ReusableTextField.js";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./UI/BackButton.js";
import { Poppins } from "@expo-google-fonts/poppins";
import { useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";


const JoinGroupScreen = () => {
    const navigation = useNavigation();
    const[groupName, setGroupName] = useState("");
    const[groupCode, setGroupCode] = useState("");
    const { user } = useUser();
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const handleJoinGroup = async () => {
        // Handle joining a group

        await axios
        .post(
          "https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie",
          {
            userId: userId,
            groupId: groupCode,
            groupName: groupName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          navigation.navigate("Loading", {
            groupid: groupCode,
          });
        });
    };
// add a variable for back --> that way it can be dynamic between screens

  return (
    <SafeAreaView style={styles.newcontainer}>
       
      <View style={{alignItems:"center", width:"100%", height:"100%"}}>
      <BackButton back={"InBetween"} />
<Text style={{paddingTop:"10%",
		fontFamily: Poppins,
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
        paddingBottom:"20%",
		color:'#1D1617',}}>Join a Group 🕺</Text>
<Text style={{
    paddingTop:"10%",
		fontFamily: Poppins,
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
		color:'#1D1617',}}>Group Name:</Text>
      <TextInput
        style={{
          width: "70",
          borderBottomWidth: 4,
          fontSize: 24,
          marginTop: "10%",
        }}
        placeholder="Group Name"
        value={groupName}
        onChangeText={(text) => setGroupName(text)}
      />
      <Text style={{
    paddingTop:"10%",
		fontFamily: Poppins,
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
		color:'#1D1617',}}>Group Code:</Text>
            <TextInput
        style={{
          width: "70",
          borderBottomWidth: 4,
          fontSize: 24,
          marginTop: "10%",
        }}
        placeholder="Group Name"
        value={groupCode}
        onChangeText={(text) => setGroupCode(text)}
      />
      <ReusableButton function={handleJoinGroup} name="Join" width={"100%"} height={"40%"}/>
      </View>
    </SafeAreaView>
  );
};
export default JoinGroupScreen;
