import {TodoScreen} from "./TodoTab.js";
import { PayScreen } from "./PayTab.js";
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import {styles} from "./Style.js";
import React, { useState } from "react"; 
import {useNavigation} from '@react-navigation/native';
import { Button } from "react-native";
import { useClerk } from "@clerk/clerk-react";

export default function HomeScreen () { 
    const navigation = useNavigation();
    const { signOut } = useClerk();
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: null,
        });
      }, [navigation]);
    const handleTodoClick = async () =>{
        navigation.navigate('ToDo')
    }
    const handlePayClick = async () => {
        navigation.navigate('Payments')
    }
    const handleLogOut = async () => {
        signOut()
        navigation.navigate('SignIn')
    }
    const handleInvite = async () => {
        // navigate user to new page where axios post is made
        navigation.navigate('SignIn')
    }
	return ( 
		<View style={styles.container}> 
		<Text style={styles.heading}>Roomie</Text> 
        <Button onPress={handleTodoClick} title="todo"> Todo List </Button>
        <Button onPress={handlePayClick} title="pay"> Payments </Button>
        <Button onPress={handleInvite} title="pay"> Invite Friends</Button>
        <Button onPress={handleLogOut} title="logout"> Logout </Button>
		</View> 
	); 
}; 
