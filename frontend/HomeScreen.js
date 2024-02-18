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
  TouchableWithoutFeedback
} from "react-native";
import { styles } from "./Style.js";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
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
import ReusableButton from "./UI/ReusableButton";
import { Modal } from "./UI/Modal";
import ReusableTextField from "./UI/ReusableTextField.js";
import _ from "lodash";
import {Keyboard} from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [currentUser, setCurrentUser] = useState(user.firstName);
  const [groupMembers, setGroupMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [tappedUser, setTappedUser] = useState("");
  const [tappedStatus, setTappedStatus] = useState("");
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
  const handleCalendar = async () => {
    // navigate user to new page where axios post is made (page still needs to be made)
    navigation.navigate("Calendar");
  };
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };
  const handlePressStatus = (item) => {
    setTappedUser(item.id);
    setTappedStatus(item.status);
    if (item.id == user.firstName + " " + user.lastName) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
    //varun would need to do this -> https://www.npmjs.com/package/react-native-haptic-feedback#manual-setup-guide---ios 
  //ReactNativeHapticFeedback.trigger("impactLight", options);
    setIsModalVisible(true);
  };

  const handleSubmit = async (ns) => {
    setIsModalVisible(false);
    await handleAddStatus(ns);
    setIsUser(false);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleAddStatus = async (newStatus) => {
    const groupMembers2 = JSON.parse(JSON.stringify(data.getTodo.groupMembers));
    var newData = groupMembers2.map((member) => ({
      id: member.id,
      status: member.status,
    }));
    let index = _.findIndex(
      groupMembers2,
      (el) => el?.id === user.firstName + " " + user.lastName
    );
    newData[index].status[0] = newStatus;
    await updateStatusHook({
      variables: { input: { id: groupid, groupMembers: newData } },
    });
    //console.log("aaa")
  };

  //useless detective
  const randomStrings = [
    '🕵️',
    '🕵🏼',
    '🕵🏽',
    '🕵🏾',
    '🕵🏿',
    '🕵️‍♂️',
];

// Function to pick a random string from the array
const getRandomString = () => {
    const randomIndex = Math.floor(Math.random() * randomStrings.length);
    return "is currently " + randomStrings[randomIndex] + ": ";
};

  function renderModal() {
    if (isUser) {
      return (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
        >
      
          <Modal.Container>
         
            <Modal.Header title="update status"/>
            <Modal.Body>
              <Text style={{fontFamily: Poppins, fontSize:20, paddingTop: "10%", fontWeight:"bold",}}>what are you up to? 👀</Text>
              <TextInput
                style={{
                  width: "20",
                  borderBottomWidth: 4,
                  textAlign: "center",
                  fontSize: 24,
                  marginTop: "20%",
                  marginBottom:"10%",
                }}
                placeholder="enter your status"
                placeholderTextColor="#ada4a5" 
                value={inputValue}
                onChangeText={handleInputChange}
              />
              <ReusableButton
                name="send it"
                function={() => handleSubmit(inputValue)}
                width={"80%"}
                height={"20%"}
  
              />
            </Modal.Body>
          </Modal.Container>
        </Modal>
      );
    } 
    else {
      return (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
        >
          <Modal.Container>
            <Modal.Header title={tappedUser + " " + getRandomString()} />
            <Modal.Body>
              <Text style={{fontFamily: Poppins, fontSize:20, paddingTop: "10%", fontWeight:"bold", paddingBottom:"10%"}}>{tappedStatus}</Text>
            </Modal.Body>
          </Modal.Container>
        </Modal>
      );
    }
  }

  const renderItemGroup = ({ item, index }) => (
    <TouchableOpacity onPress={() => handlePressStatus(item)}>
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
    </TouchableOpacity>
  );
  const renderItemTask = ({ item, index }) => (
    <View style={styles.task}>
      <Text style={styles.itemList}>{item}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.homeContainer}>
       
      <Modal isVisible={isModalVisible}>{renderModal()}</Modal>
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
