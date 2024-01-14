import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TodoScreen } from "../TodoTab.js";
import { PayScreen } from "../PayTab.js";
import InviteScreen from "../Invite.js";
import HomeScreen from "../HomeScreen.js";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";


const Tab = createBottomTabNavigator();

export const TabNavigation = ({ navigation }) => {
  return (
   //tabBarShowLabel: false - to remove labels
    <Tab.Navigator screenOptions={{headerShown:false }}>
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({}) => (
            <Image
              source={require("../assets/tabbarIcons/Users.png")}
              style={{ width: 24, height: 24, tintColor: "#ADA4A5" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PayScreen}
        options={{
          tabBarIcon: ({}) => (
            <Image
              source={require("../assets/tabbarIcons/Buy.png")}
              style={{ width: 24, height: 24, tintColor: "#ADA4A5" }}
            />
          ),
        }}
      />
       <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
         tabBarLabel:"",
          tabBarIcon: ({}) => (
            <View style={{backgroundColor:"#ccc0ef", bottom: 15, width:70, height: 70, 
            justifyContent:"center", alignItems:"center", borderRadius: 50 }}> 
            <Image
              source={require("../assets/tabbarIcons/Home.png")}
              style={{ width:30, height: 30, tintColor: "#FFFFFF", }}
            />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Invite"
        component={InviteScreen}
        screenOptions={{headerShown:false}}
        options={{
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              source={require("../assets/tabbarIcons/Profile.png")}
              style={{ width: 24, height: 24, tintColor: "#ADA4A5" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={InviteScreen}
        screenOptions={{headerShown:false}}
        options={{
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              source={require("../assets/tabbarIcons/Activity.png")}
              style={{ width: 24, height: 24, tintColor: "#ADA4A5" }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
