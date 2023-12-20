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
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from "apollo-link-context";
import awsmobile from "./src/aws-exports.js";

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
			'x-api-key': "da2-t4mbt7yumreztnlwdgejptkpyu"
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

	return (
		<ApolloProvider client={client}>
        <ClerkProvider publishableKey={Constants.expoConfig.extra.clerkPublishableKey}>
             <NavigationContainer>
             <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignInScreen} />
             <Stack.Screen name="SignUp" component={SignUpScreen}  />
            <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false }} />
			<Stack.Screen name="Payments" component={PayScreen} />
			<Stack.Screen name="ToDo" component={TodoScreen} />
            </Stack.Navigator>
                 </NavigationContainer>
        </ClerkProvider>
		</ApolloProvider> 
	); 
}; 

export default App;