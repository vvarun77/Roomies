import React, { useState } from "react"; 
import { NavigationContainer } from '@react-navigation/native';
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import {styles} from "./Style.js";
import {TodoScreen} from "./TodoTab.js";
import { PayScreen } from "./PayTab.js";
import SignUpScreen from "./SignUpScreen.tsx";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import HomeScreen from "./HomeScreen.js";
import SignInScreen from "./SignInScreen.tsx";
import { createStackNavigator } from '@react-navigation/stack';
import { SignUpButton } from "@clerk/clerk-react";
import { SignInWithMetamaskButton } from "@clerk/clerk-react";


const App = () => { 
	
	const Stack = createStackNavigator();
	return ( 
        <ClerkProvider publishableKey={Constants.expoConfig.extra.clerkPublishableKey}>
             <NavigationContainer>
             <Stack.Navigator>
                <Stack.Screen name="SignIn" component={SignInScreen} />
             <Stack.Screen name="SignUp" component={SignUpScreen}  />
            <Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="ToDo" component={TodoScreen} />
			<Stack.Screen name="Payments" component={PayScreen} />
            </Stack.Navigator>
                 </NavigationContainer>
        </ClerkProvider>
	); 
}; 

export default App;