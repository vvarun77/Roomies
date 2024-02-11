import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
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
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import Collapsible from "react-native-collapsible";
import Accordian from "react-native-collapsible";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

import {
  useMutation,
  useQuery,
  gql,
  selectHttpOptionsAndBody,
} from "@apollo/client";
import { createTodo, updateTodo, deleteTodo } from "./mutations.js";
import {
  Agenda,
  CalendarList,
  WeekCalendar,
  CalendarProvider,
  AgendaList,
} from "react-native-calendars";
import AgendaItem from "./calendarComponents/AgendaItem.js"
import { FlatList } from "react-native-gesture-handler";

export function CalendarScreen({ route }, components) {
  const bottomSheetModalRef = useRef(null);
  const [date, setDate] = useState(dayjs());
  // variables
  const snapPoints = useMemo(() => ["85%"], []);
  const { user } = useUser();
  const [event, setEvent] = useState("");
  const [selectedDay, setSelectedDay] = useState("2024-02-08");
  const [time, setTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCalendarExpanded, setCalendarExpanded] = useState(false);
  const [isWeekExpanded, setWeekExpanded] = useState(true);
  const [showMode, setShowMode] = useState("");
  const [dayDate, setDayDate] = useState({
    "2024-02-20": { selected: true, user: "far" },
    "2024-02-20": { marked: true, user: "far" },
  });
  const itemArr = [
    {
      title: "2024-02-03",
      data: [{ hour: "12am", duration: "1h", title: "First sYoga" }],
    },
    {
      title: "2024-02-04",
      data: [{ hour: "12am", duration: "1h", title: "First dYoga" }],
    },
    {
      title: "2024-02-05",
      data: [{ hour: "12am", duration: "1h", title: "First dYoga" }],
    },
    {
      title: "2024-02-06",
      data: [{ hour: "12am", duration: "1h", title: "First xYoga" }],
    },
  ];
  // when u levae the page it closes the is exapnded need to fic
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const completeEvent = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    Keyboard.dismiss();
    setEvent("");
    setTime(new Date());
    setDate(dayjs());
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    Keyboard.dismiss();
    setIsExpanded(true);
  }, []);

  const [events, setEvents] = useState();
  const handleExpand = (picker2) => {
    Keyboard.dismiss();
    if (isExpanded) {
      setIsExpanded(false);
    } else if (showMode == picker2) {
      setIsExpanded(true);
    }
    setShowMode(picker2);
    console.log(showMode);
    console.log(isExpanded);
  };

  const handleCalendarExpand = () => {
    if (isCalendarExpanded) {
      setCalendarExpanded(false);
    } else {
      setCalendarExpanded(true);
    }
    handleWeekExpand();
  };
  const handleWeekExpand = () => {
    if (isCalendarExpanded) {
      setWeekExpanded(true);
    } else {
      setWeekExpanded(false);
    }
  };

  const handleAddEvent = async () => {
    const updatedEvents = { ...events };
    const timestamp = date;
    const date2 = new Date(timestamp);
    const formattedDate = date2.toISOString().slice(0, 10); // Extracting YYYY-MM-DD
    // Output: 2024-02-07
    const newTime = `${time.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} ${new Date(time).toISOString().slice(11, 11)}`;
    var createdEvent = {
      name: event,
      date: formattedDate,
      time: newTime,
      user: user.firstName,
    };
    console.log("selected day is: " + formattedDate);
    if (updatedEvents[formattedDate] && event) {
      updatedEvents[formattedDate].push(createdEvent);
    } else if (!updatedEvents[formattedDate] && event) {
      updatedEvents[formattedDate] = [createdEvent];
    }
    completeEvent();
    console.log(updatedEvents);
    setEvents(updatedEvents);
  };

  function handleTimePickerChange(event, time) {
    setTime(time);
  }

  const returnPicker = () => {
    switch (showMode) {
      case "time":
        return (
          <RNDateTimePicker
            value={time}
            display="spinner"
            mode="time"
            onChange={handleTimePickerChange}
          />
        );
      case "date":
      default:
        return (
          <DateTimePicker
            mode="single"
            date={date}
            onChange={(params) => setDate(params.date)}
            selectedItemColor="#ccc0ef"
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.newcontainer}>
      <BottomSheetModalProvider>
        <Text style={styles.header3}>Calendar 🗓️</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handlePresentModalPress}
        >
          <Text style={styles.addButtonText}>Add event</Text>
        </TouchableOpacity>
        <View style={{ height: "100%", width: "100%" }}>
          <CalendarProvider date={selectedDay}>
            <Collapsible collapsed={isWeekExpanded}>
              <View style={{ minHeight: 1, minWidth: 1 }}>
                <WeekCalendar
                  minDate={"2024-01-01"}
                  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                  maxDate={"2024-12-31"}
                  markedDates={dayDate}
                  renderScrollComponent={FlatList}
                  //current={selectedDay}

                  onDayPress={(day) => {
                    setSelectedDay(day.dateString);
                    let day2 = day.dateString;
                    setDayDate({
                      [day2]: { selected: true, selectedColor: "#ccc0ef" },
                    });
                  }}
                  duration={500}
                  calendarStyle={{
                    todayBackgroundColor: "red",
                    todayTextColor: "white",
                    selectedItemColor: "#ccc0ef",
                    selectedDayBackgroundColor: "#ccc0ef",
                    selectedDotColor: "orange",
                  }}
                />
                <View
                  style={{
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 10,
                      width: 30,
                      backgroundColor: "#ccc0ef",
                      borderRadius: 25,
                    }}
                    onPress={handleCalendarExpand}
                    duration={400}
                  />
                </View>
                <AgendaList
                  sections={itemArr}
                  renderItem={(item) => (
                   <AgendaItem item={item}/>
                  )}
                  // scrollToNextEvent

                  // dayFormat={'yyyy-MM-d'}
                />
              </View>
            </Collapsible>
          </CalendarProvider>

          <Collapsible
            collapsed={isCalendarExpanded}
            style={{ height: 1000 }}
            duration={500}
          >
            <CalendarList
              // collapsible height fixed so scrolling doesn't lock up, this is the shittiest solution possible.
              // collapsible will eventually need ot be written by us I believe
              onDayChange={(day) => {
                console.log("day changed");
              }}
              // Callback which gets executed when visible months change in scroll view. Default = undefined
              onVisibleMonthsChange={(months) => {
                console.log("now these months are visible", months);
              }}
              onDayPress={(day) => {
                setSelectedDay(day.dateString);
                let day2 = day.dateString;
                setDayDate({
                  [day2]: { selected: true, selectedColor: "#ccc0ef" },
                });
                handleCalendarExpand();
                //console.log(dayDate);
              }}
              minDate={"2024-01-01"}
              // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
              maxDate={"2024-12-31"}
              markedDates={dayDate}
              rowHasChanged={(r1, r2) => {
                return r1.text !== r2.text;
              }}
              // Max amount of months allowed to scroll to the past. Default = 50
              pastScrollRange={1}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={12}
              // Enable or disable scrolling of calendar list
              scrollEnabled={true}
              //renderScrollComponent={FlatList}
              nestedScrollEnabled={true}
              theme={{
                todayBackgroundColor: "red",
                todayTextColor: "white",
                selectedItemColor: "#ccc0ef",
                selectedDayBackgroundColor: "#ccc0ef",
                selectedDotColor: "orange",
              }}
            />
          </Collapsible>
        </View>
        <TouchableOpacity
          style={{
            height: 100,
            width: 30,
            backgroundColor: "#ccc0ef",
            borderRadius: 25,
          }}
          onPress={handleCalendarExpand}
        />

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.buttonContainer}>
            <Text
              style={{
                fontSize: 30,
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "2%",
              }}
            >
              new event 🏞️
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: "20%",
              }}
            >
              <TextInput
                placeholder="Event Name"
                value={event}
                onChangeText={(text) => setEvent(text)}
                style={{
                  width: "70",
                  borderBottomWidth: 4,
                  textAlign: "center",
                  fontSize: 24,
                  marginTop: "10%",
                  marginBottom: "5%",
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: Poppins,
                  fontWeight: "bold",
                }}
              >
                Date:{" "}
              </Text>
              <TouchableOpacity
                style={{
                  borderColor: "#ccc0ef",
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                onPress={() => handleExpand("date")}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  {new Date(date).toISOString().slice(0, 10)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: "#ccc0ef",
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                onPress={() => handleExpand("time")}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  {`${time.toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })} ${new Date(time).toISOString().slice(11, 11)}`}
                </Text>
              </TouchableOpacity>
            </View>
            <Collapsible collapsed={isExpanded}>{returnPicker()}</Collapsible>

            <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
              <Text style={styles.addButtonText}>Add event</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
