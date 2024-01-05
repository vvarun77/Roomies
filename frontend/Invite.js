import React, { useState } from "react";
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import {styles} from "./Style.js"; 
import {useNavigation} from '@react-navigation/native';
import { Button } from "react-native";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";
import * as Linking from 'expo-linking';
const InviteScreen = () =>  { 
    //create invite deep link and maybe add group id to redirect URL
    // ex of https://www.example.com/my-sign-up?__clerk_ticket=..... I will create param for group id, here just get it from the current user
    // i want to create a link to the sign up page with the group ID, which will then be checked by app.js to see if the app was opened with
    // a clerk token which will add the group id to the user when they sign up
    //this is so when we generate links when testing -> we can open our own, later we would need to use a scheme
    const prefix = Linking.useURL();
    	//console.log(prefix);
		const linking = {
		prefixes: [prefix],
    };
    const [emailAddress, setEmailAddress] = useState("");
    const redirectUrl = "";
    const bearer = "Bearer sk_test_mRxO1J7Wy4ea8bbTK71socEYQEcP48mud9xjNdtN5s"
    const handleInvite = async () => {
        // Handle joining a group
        console.log('sending invite');
        await axios.post('https://api.clerk.com/v1/invitations', 
        {
          "email_address": emailAddress,
          //"redirect_url": "www.google.com"
        },
        {
          headers: {
            'Authorization': bearer,
            'Content-Type': "application/json",
          }  
        }
      )
      .then(response => {
        console.log(JSON.stringify(response));
      }).catch(error => {
        // Handle error
        console.error('Axios request error:', error);
    });
      };

	return ( 
		<View style={styles.container}> 
		    <Text style={styles.heading}> Invite Roomies </Text> 
            <View>
                <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email"
                placeholderTextColor="#000"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>
            <Button onPress={handleInvite} title="Invite"> Invite </Button>
		</View> 
	); 
}; 

export default InviteScreen;
