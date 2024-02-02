import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { styles } from "./Style.js";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigation } from "@react-navigation/native";
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
import { Agenda } from "react-native-calendars";
import CalendarPicker from "react-native-calendar-picker";

export function CalendarScreen({ route }, components) {
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["80%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    //console.log("handleSheetChanges", index);
  }, []);

  // const [showCal, setShowCal] = useState(true);
  const { user } = useUser();
  const [event, setEvent] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [events, setEvents] = useState({
    "2024-02-16": [
      { name: "bozo", time: "12:00", createdBy: "user.firstName" },
    ],
    "2024-02-22": [{ name: "item 1 - any js object" }],
    "2024-02-23": [{ name: "item 2 - any js object", height: 80 }],
    "2024-02-24": [],
    "2024-02-25": [
      { name: "item 3 - any js object" },
      { name: "any js object" },
    ],
  });

  const handleAddEvent = async () => {
    const updatedEvents = { ...events };
    var createdEvent = { name: "bozo" };
    console.log("selected day is: " + selectedDay);
    if (updatedEvents[selectedDay]) {
      updatedEvents[selectedDay].push(createdEvent);
    } else {
      updatedEvents[selectedDay] = [createdEvent];
    }

    //setEvent([day.dateString].push(createdEvent));
    //"2012-05-16"
    setEvents(updatedEvents);
  };
  return (
    <SafeAreaView style={styles.newcontainer}>
      <BottomSheetModalProvider>
        <Text style={styles.header2}>Calendar 🗓️</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handlePresentModalPress}
        >
          <Text style={styles.addButtonText}>Add event</Text>
        </TouchableOpacity>
        <View style={{ height: "100%", width: "100%" }}>
          <Agenda
            items={events}
            // Callback that gets called when items for a certain month should be loaded (month became visible)
            loadItemsForMonth={(month) => {
              console.log("trigger items loading");
            }}
            // Callback that fires when the calendar is opened or closed
            onCalendarToggled={(calendarOpened) => {
              console.log(calendarOpened);
            }}
            // Callback that gets called on day press
            // Callback that gets called when day changes while scrolling agenda list
            onDayChange={(day) => {
              console.log("day changed");
            }}
            // Initially selected day
            //selected={""}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={"2024-01-01"}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={"2024-12-31"}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={1}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={25}
            // Specify how each item should be rendered in agenda
            onDayPress={(day) => {
              setSelectedDay(day.dateString);
              console.log(selectedDay);
            }}
            //increase performance a bit

            initialNumToRender={10}
            renderItem={(item, firstItemInDay) => (
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  flex: 1,
                  borderRadius: 5,
                  padding: 10,
                  marginRight: 10,
                  marginTop: 17,
                }}
              >
                <Text style={{ color: "black", fontSize: 16 }}>
                  {item.name + " " + item.time + " " + item.createdBy}
                </Text>
              </TouchableOpacity>
            )}
            // Specify how each date should be rendered. day can be undefined if the item is not first in that day
            renderDay={(day, item) => {
              console.log(" the day has been seelected");
            }}
            // Specify how empty date content with no items should be rendered
            renderEmptyDate={() => {
              console.log("day is empty");
              return (
                <View style={{ height: 100 }}>
                  <Text>nothing here</Text>
                </View>
              );
            }}
            // Specify how agenda knob should look like
            renderKnob={() => {
              return (
                <View
                  style={{
                    height: 10,
                    width: 40,
                    backgroundColor: "#dcd5ed",
                    borderRadius: 25,
                  }}
                />
              );
            }}
            // Override inner list with a custom implemented component
            /*
          renderList={(listProps) => {

          }}
          */
            // Specify what should be rendered instead of ActivityIndicator
            renderEmptyData={() => {
              return <View />;
            }}
            // Specify your item comparison function for increased performance
            rowHasChanged={(r1, r2) => {
              return r1.text !== r2.text;
            }}
            // Hide knob button. Default = false
            hideKnob={false}
            // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
            showClosingKnob={false}
            showOnlySelectedDayItems={true}
            // By default, agenda dates are marked if they have at least one item, but you can override this if needed
            markedDates={{
              "2024-02-16": { marked: true },
              "2024-02-17": { marked: true },
              "2024-02-18": { disabled: true },
            }}
            // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
            disabledByDefault={false}
            // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
            onRefresh={() => console.log("refreshing...")}
            // Set this true while waiting for new data from a refresh
            refreshing={false}
            // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
            refreshControl={null}
            // Agenda theme
            theme={{
              agendaDayTextColor: "black",
              agendaDayNumColor: "black",
              todayBackgroundColor: "red",
              todayTextColor: "white",
              selectedDayBackgroundColor: "yellow",
              selectedDayBackgroundColor: "#ccc0ef",
              selectedDotColor: "orange",
            }}
            // Agenda container style
            style={{}}
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            
            onChange={handleSheetChanges}
          >
            <View style={styles.buttonContainer}>
              <Text>Awesome 🎉</Text>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
