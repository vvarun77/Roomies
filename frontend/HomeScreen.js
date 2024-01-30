import { TodoScreen } from "./TodoTab.js";
import { PayScreen } from "./PayTab.js";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { styles } from "./Style.js";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import { getTodo } from "./queries.js";
import { Poppins } from "@expo-google-fonts/poppins";

import { useUser, useClerk } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileButton from "./UI/ProfileButton.js";
import { ScrollView } from "react-native-gesture-handler";
import {
  useMutation,
  useQuery,
  gql,
  selectHttpOptionsAndBody,
} from "@apollo/client";
import { createTodo, updateTodo, deleteTodo } from "./mutations.js";
import Profile from "./assets/tabbarIcons/Profile.png";
import Group from "./assets/buttonIcons/usersmultiple.png";
import ReusableFlatList from "./UI/FlatlistStyled.js";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [currentUser, setCurrentUser] = useState(user.firstName);
  const [groupMembers, setGroupMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [
    addStatusHook,
    { data: createData, loading: createLoading, error: createError },
  ] = useMutation(createTodo);
  const [
    updateStatusHook,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(updateTodo);
  const [
    deleteStatusHook,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(deleteTodo);

  const groupid = user.unsafeMetadata.groupid;
  const groupName = user.unsafeMetadata.groupname;

  const { data, loading, error } = useQuery(getTodo, {
    variables: { id: groupid },
    pollInterval: 500,
  });

  useEffect(() => {
    if (!loading && error) {
      async function addEmpty() {
        if (user.unsafeMetadata.groupid != null) {
          await addStatusHook({
            variables: {
              input: { id: user.unsafeMetadata.groupid, groupMembers: [] },
            },
          });
          await addStatusHook({
            variables: {
              input: { id: user.unsafeMetadata.groupid, todos: [] },
            },
          });
        }
      }
      addEmpty().then();
      console.log(error);
    }
    if (!loading && data.getTodo.groupMembers.length != 0) {
      setGroupMembers(JSON.parse(JSON.stringify(data.getTodo.groupMembers)));
      setTasks(data.getTodo.todos);
    }
  }, [data]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);
  const handleTodoClick = async () => {
    navigation.navigate("ToDo");
  };
  const handlePayClick = async () => {
    navigation.navigate("Payments");
  };
  const handleLogOut = async () => {
    signOut();
    navigation.navigate("SignIn");
  };
  const handleInvite = async () => {
    // navigate user to new page where axios post is made (page still needs to be made)
    navigation.navigate("Invite");
  };

  const handleGrocery = async () => {
    // navigate user to new page where axios post is made (page still needs to be made)
    navigation.navigate("Groceries");
  };
  const renderItemGroup = ({ item, index }) => (
    <View
      style={{ justifyContent: "center", alignItems: "center", width: 150 }}
    >
      <View
        style={{
          borderRadius: 50,
          backgroundColor: "#ccc0ef",
          height: 50,
          width: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: 30, width: 30, tintColor: "white" }}
          source={Profile}
        />
      </View>

      <Text
        style={{
          fontFamily: Poppins,
          fontSize: 16,
          fontWeight: "bold",
          paddingTop: "2%",
        }}
      >
        {item.id}
      </Text>
      <Text style={{ fontFamily: Poppins, fontSize: 16, fontWeight: "bold" }}>
        {item.status}
      </Text>
    </View>
  );
  const renderItemTask = ({ item, index }) => (
    <View style={styles.task}>
      <Text style={styles.itemList}>{item}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.homeContainer}>
      <ProfileButton />
      <Text style={styles.homeTitle}>{currentUser + "!"}</Text>
      <View style={{ height: "10%" }}></View>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <TouchableOpacity style={styles.groupButton}>
          <Text
            style={{
              fontFamily: Poppins,
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {groupName}
          </Text>
          <Image style={{ height: 45, width: 45 }} source={Group} />
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>status 🪩</Text>
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: "#ccc0ef",
              left: 10,
              width: "95%",
              height: 25,
            }}
          />
          <View style={{ justifyContent: "center", padding: 20 }}>
            <FlatList
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
              ItemSeparatorComponent={() => (
                <View style={{ height: 20, width: 20 }} />
              )}
              data={groupMembers}
              renderItem={renderItemGroup}
              keyExtractor={(item, index) => index.toString()}
              horizontal={false}
              scrollEnabled={false}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View
            style={{
              backgroundColor: "#ccc0ef",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              height: 60,
            }}
          >
            <Text
              style={{
                fontFamily: Poppins,
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                left: 10,
                top: 15,
              }}
            >
              to-do ✏️
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingBottom: 30,
            }}
          >
            <FlatList
              nestedScrollEnabled={true}
              scrollEnabled={false}
              data={tasks.slice(0, 3)}
              maxToRenderPerBatch={3}
              renderItem={renderItemTask}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/*
<View style={styles.container}> 
		<Text style={styles.heading}>Roomie</Text> 
        <Button onPress={handleTodoClick} title="todo"> Todo List </Button>
        <Button onPress={handlePayClick} title="pay"> Payments </Button>
        <Button onPress={handleInvite} title="invite"> Invite Friends </Button>
        <Button onPress={handleLogOut} title="logout"> Logout </Button>
        <Button onPress={handleGrocery} title="grocery"> Grocery </Button>

		</View> 
*/
