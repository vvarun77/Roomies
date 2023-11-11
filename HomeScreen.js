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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from "react"; 
import { NavigationContainer } from "@react-navigation/native";
import {useNavigation} from '@react-navigation/native';
import { Button } from "react-native";
import { SignOutButton } from "@clerk/clerk-react";
import signOutCallback from "@clerk/types"
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'


const Tab = createMaterialTopTabNavigator();
const tabs = [{name: "Todo", component: TodoScreen}, {name: "Purchases", component: PayScreen}];

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
	return ( 
		<View style={styles.container}> 
		<Text style={styles.heading}>Roomie</Text> 
        <Button onPress={handleTodoClick} title="todo"> Todo List </Button>
        <Button onPress={handlePayClick} title="pay"> Payments </Button>
        <Button onPress={handleLogOut} title="logout"> Logout </Button>
		</View> 
	); 
}; 
