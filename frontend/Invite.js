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

const InviteScreen = () =>  { 
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
/*
import axios from "axios";
// this function creates an invitation for a user to join the app, although I also need to set
// up the seperate signup page 
export const handler = async (event) => {
  // curl https://api.clerk.com/v1/invitations -X POST -d '{"email_address": "email@example.com", "redirect_url": "https://www.example.com/my-sign-up"}' 
  //-H "Authorization:Bearer {{bapi}}" -H 'Content-Type:application/json'
  //key -> pk_test_Zmlyc3QtZG9scGhpbi05OS5jbGVyay5hY2NvdW50cy5kZXYk
  // or sk_test_mRxO1J7Wy4ea8bbTK71socEYQEcP48mud9xjNdtN5s depending on where it's used
  var email_address = ""
  //var redirect_url = ""
  var authkey = ""
  var bearer = "Bearer "
        await axios.post('https://api.clerk.com/v1/invitations', 
          {
            "email_address": email_address,
          },
          {
            headers: {
              'Authorization': bearer + authkey,
              'Content-Type': "application/json",
            }  
          }
        );
      }
};
*/
