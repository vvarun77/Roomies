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

const Tab = createMaterialTopTabNavigator();
const tabs = [{name: "Todo", component: TodoScreen}, {name: "Purchases", component: PayScreen}];

const HomeScreen = () => { 
	return ( 
		<View style={styles.container}> 
			<Text style={styles.heading}>Roomie</Text> 
			<NavigationContainer independent={true}>
    <Tab.Navigator>
      {
        tabs.map(tab => <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />)
      }
    </Tab.Navigator>
  </NavigationContainer>
		</View> 
	); 
}; 

export default HomeScreen;