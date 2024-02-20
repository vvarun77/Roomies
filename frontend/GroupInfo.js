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
import * as Clipboard from 'expo-clipboard';


const GroupInfoScreen = () => {
  const { user } = useUser();
  const groupid = user.unsafeMetadata.groupid;
  const groupName = user.unsafeMetadata.groupname;
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(groupid);
  };
  return (
    <SafeAreaView style={styles.newcontainer}>
      <View style={styles.containerClass}>
        <BackButton back={"Invite"} />
        <Text style={[styles.header2, {paddingBottom:"10%"}]}>group info ℹ️</Text>
        <View
          style={styles.card}
        >
          <Text
            style={{
            marginTop:"20%",
              fontFamily: Poppins,
              fontSize: 24,
              fontWeight: "bold",
              left: 10,
              top: 15,
              marginBottom:"10%",
            }}
          >
            {"Group Name:" +" " +  groupName}
          </Text>
          <Text
            style={{
              fontFamily: Poppins,
              fontSize: 24,
              fontWeight: "bold",
              left: 10,
              top: 15,
              height:25,
              
            }}
          >
            Group Code: 
          </Text>
          
          <Text style={{
              fontFamily: Poppins,
              fontSize: 24,
              fontWeight: "bold",
              left: 10,
              top: 15,
              marginBottom:"10%",
            }}>{" " + groupid + " "} <TouchableOpacity onPress={copyToClipboard}>
            <Text style={{fontSize:32}}>📋</Text>
          </TouchableOpacity></Text>
          <Text style={{
              fontFamily: Poppins,
              fontSize: 18,
              left: 10,
              top: 15,
              marginBottom:"20%",
            }}>(click the clipboard to copy your group code)</Text>
       
        </View>
      </View>
    </SafeAreaView>
  );
};
export default GroupInfoScreen;
