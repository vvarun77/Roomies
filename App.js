import React, { useState } from "react"; 
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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

const Tab = createMaterialTopTabNavigator();
const tabs = [{name: "Todo", component: TodoScreen}, {name: "Purchases", component: PayScreen}];

const App = () => { 
	return ( 
		<View style={styles.container}> 
			<Text style={styles.heading}>Roomie</Text> 
			<NavigationContainer>
    <Tab.Navigator>
      {
        tabs.map(tab => <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />)
      }
    </Tab.Navigator>
  </NavigationContainer>
		</View> 
	); 
}; 

export default App;
