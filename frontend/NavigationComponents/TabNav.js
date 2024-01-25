import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TodoScreen } from "../TodoTab.js";
import { PayScreen } from "../PayTab.js";
import { ActivityScreen } from "../Activities.js";
import InviteScreen from "../Invite.js";
import HomeScreen from "../HomeScreen.js";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {useUser, useClerk} from "@clerk/clerk-react";
import {useAuth, SignedIn} from "@clerk/clerk-expo"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


/*
*/



const Tab = createBottomTabNavigator();
export const TabNavigation = ({ navigation }) => {
  /*
  const { isLoaded, userId, sessionId, getToken, User } = useAuth()
  const { user } = useUser();
  var signedInStatus = false;
  useEffect(() => {
    if(user != null) {
      signedInStatus = true;
      console.log(signedInStatus);
    }
  }, [user]);
  */
  const renderTabBar = () => (
    <SignedIn>
    <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown:false, gestureEnabled: false }}>
        <Tab.Screen
          name="ToDo"
          component={TodoScreen}
          options={{
            tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#ccc0ef":"#ADA4A5", fontSize:10}}>ToDo</Text>),
            tabBarIcon: ({focused}) => (
              <Image
                source={require("../assets/tabbarIcons/Users.png")}
                style={{ width: 24, height: 24, tintColor: focused?"#ccc0ef":"#ADA4A5" }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Payments"
          component={PayScreen}
          options={{
            tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#ccc0ef":"#ADA4A5", fontSize:10}}>Payments</Text>),
            tabBarIcon: ({focused,color}) => (
              <Image
                source={require("../assets/tabbarIcons/Buy.png")}
                style={{ width: 24, height: 24, tintColor: focused?"#ccc0ef":"#ADA4A5" }}
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
          name="Status"
          component={ActivityScreen}
          screenOptions={{headerShown:false}}
          options={{
            tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#ccc0ef":"#ADA4A5", fontSize:10}}>Status</Text>),
            tabBarIcon: ({ focused, tintColor }) => (
              <Image
                source={require("../assets/tabbarIcons/Activity.png")}
                style={{ width: 24, height: 24, tintColor: focused?"#ccc0ef":"#ADA4A5" }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Invite"
          component={InviteScreen}
          screenOptions={{headerShown:false}}
          options={{
            tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#ccc0ef":"#ADA4A5", fontSize:10}}>Invite</Text>),
            tabBarIcon: ({ focused, tintColor }) => (
              <Image
                source={require("../assets/tabbarIcons/Profile.png")}
                style={{ width: 24, height: 24, tintColor: focused?"#ccc0ef":"#ADA4A5" }}
              />
            ),
          }}
        />
      </Tab.Navigator>
      </SignedIn>
  ); 
  return (
    renderTabBar()
  );
};
