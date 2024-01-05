import React, { useState, useEffect } from "react"; 
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
import InviteScreen from "./Invite.js";
import SignUpScreen from "./SignUpScreen.js";
import GroupingScreen from "./GroupingScreen.js";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import HomeScreen from "./HomeScreen.js";
import SignInScreen from "./SignInScreen.js";
import { createStackNavigator } from '@react-navigation/stack';
import { SignUpButton } from "@clerk/clerk-react";
import { SignInWithMetamaskButton } from "@clerk/clerk-react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from "apollo-link-context";
import awsmobile from "./aws-exports.js";

const App = () => { 
	
	const Stack = createStackNavigator();
	// Initialize Apollo Client
	const httpLink = createHttpLink({
		uri: 'https://jm25ykb3inhvvnihz3btl7yw6a.appsync-api.us-west-2.amazonaws.com/graphql',
	  });
	  const authLink = setContext((_, { headers }) => {
		// get the authentication token from local storage if it exists
		return {
		  headers: {
			...headers,
			'x-api-key': "da2-64cftv3ewvesfjjuoyfdjzihha"
		  }
		};
	  });
	  const client = new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache(),
		region: awsmobile.aws_appsync_region,
		auth: {
		  type: awsmobile.aws_appsync_authenticationType,
		  apiKey: awsmobile.aws_appsync_apiKey
		}
	  });
	  
	  //this would be used to pass parameters to the log in screen?
	  //if it contains clerk token route to signUp?
	  //const prefix = Linking.createURL('/')
	  /*
		const config = {
			screens: {
			  SignIn: 'signin', // Add this line for deep linking to SignIn screen
			  SignUp: 'signup',
			  Home: 'home',
			  Invite: 'invite',
			  Payments: 'payments',
			  ToDo: 'todo',
			  Groups: 'groups',
			},
		  };
    		//console.log(prefix);
			const linking = {
			prefixes: [Linking.createURL('/'), 'exp://i8-72z.farhankhan2.8081.exp.direct']
		};
		*/
	

	return (
		<ApolloProvider client={client}>
        <ClerkProvider publishableKey={Constants.expoConfig.extra.clerkPublishableKey}>
             <NavigationContainer>
        	<Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignInScreen} />
             <Stack.Screen name="SignUp" component={SignUpScreen}  />
            <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false }} />
			<Stack.Screen name="Invite" component={InviteScreen}/>
			<Stack.Screen name="Payments" component={PayScreen} />
			<Stack.Screen name="ToDo" component={TodoScreen} />
			<Stack.Screen name="Groups" component={GroupingScreen} />
            </Stack.Navigator>
                 </NavigationContainer>
        </ClerkProvider>
		</ApolloProvider> 
	); 
}; 

export default App;