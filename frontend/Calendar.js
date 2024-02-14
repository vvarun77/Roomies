import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";
import _, { times } from 'lodash';
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
import groupBy from 'lodash/groupBy';
import {
  useMutation,
  useQuery,
  gql,
  selectHttpOptionsAndBody,
} from "@apollo/client";
import { createTodo, updateTodo, deleteTodo } from "./mutations.js";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
  TimelineProps,
  TimelineEventProps,
  CalendarUtils
  
} from "react-native-calendars";
import AgendaItem from "./calendarComponents/AgendaItem.js"
import { FlatList } from "react-native-gesture-handler";

export function CalendarScreen({ route }, components) {
  const bottomSheetModalRef = useRef(null);
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());
  // variables
  const snapPoints = useMemo(() => ["85%"], []);
  const { user } = useUser();
  const groupid = user.unsafeMetadata.groupid;
  const [event, setEvent] = useState("");
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showMode, setShowMode] = useState("");
  const [showMode2, setShowMode2] = useState("");
  const [dayDate, setDayDate] = useState({
    "2024-02-20": { selected: true, user: "far" },
    "2024-02-20": { marked: true, user: "far" },
  });
  const [addTodoHook, { data: createData, loading: createLoading, error: createError }] = useMutation(createTodo);
	const [updateTodoHook, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(updateTodo);
	const [deleteTodoHook, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(deleteTodo);
  const EVENT_COLOR = '#e6add8';
  const INITIAL_TIME = {hour: 9, minutes: 0};
  const today = new Date();
  const getDate = (offset = 0) => {
    return CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));
  };
  const isMounted = useRef(false);

  const [timelineEvents, setTimelineEvents] = useState();
  const[eventsByDate, setEventsByDate] = useState(groupBy(timelineEvents, e => CalendarUtils.getCalendarDateString(e.start)));
  
  const { data , loading , error } = useQuery(getTodo, 
		{
			variables: {id: groupid}, 
			pollInterval: 500
		});

    useEffect(() => {
  
      if (!loading && data){
        var temp = JSON.parse(data.getTodo.events)
        console.log(temp)
        setEventsByDate(temp)
      }
      
      }, [data]);

      /*
      useEffect(() => {
        function updateTodo() {
         console.log("updating! ")
         console.log(JSON.stringify(eventsByDate))
          updateTodoHook({
          variables: { input: { id: user.unsafeMetadata.groupid, events: JSON.stringify(eventsByDate) } },
          });
          if(loading) console.log("loading!");
          if(error) console.log("error in api");
        }
      	const statusChanged = !_.isEqual(eventsByDate, JSON.parse(JSON.stringify(data.getTodo.events)));
        if(statusChanged){
          updateTodo();
        }
      
        }, [eventsByDate]);
        */
  // when u levae the page it closes the is exapnded need to fic
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const completeEvent = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    Keyboard.dismiss();
    setEvent("");
    setStartTime(new Date());
    setStart(dayjs());
    setEnd(dayjs())
    setEndTime(new Date());
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
  const handleExpand2 = (picker2) => {
    Keyboard.dismiss();
    if (isExpanded) {
      setIsExpanded2(false);
    } else if (showMode2 == picker2) {
      setIsExpanded2(true);
    }
    setShowMode2(picker2);
    console.log(showMode2);
    console.log(isExpanded);
  };


  createNewEvent = async () => {
   // const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
    //const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;
    const timeStart = startTime.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    timePM = timeStart.slice(timeStart.length - 2, timeStart.length);
    //console.log("The time in 12hr: " + timePM)

    let hour = parseInt(timeStart.slice(0, -6));
    if (hour !== 12 && timePM === 'PM') {
      // If it's PM and not already in 24-hour format, add 12 to convert
      hour = (hour + 12) % 24;
  } else if (hour === 12 && timePM === 'AM') {
      // If it's 12 AM (midnight), convert it to 0 in 24-hour format
      hour = 0;
  }
    let formattedTimeStart = hour.toString().padStart(2, '0') + timeStart.slice(-6, -3);
    const timex = (new Date(start).toISOString().slice(0, 10)); // timex = date
    const finalStart = timex + " " + formattedTimeStart; // hour minute shit
    const timeEnd = endTime.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    let hour2 = parseInt(timeEnd.slice(0, -6));
    hour2 = (hour2 + 12) % 24;
    let formattedTimeStart2 = hour2.toString().padStart(2, '0') + timeEnd.slice(-6, -3);
    const timez = (new Date(end).toISOString().slice(0, 10)); // timez = date
    const finalEnd = timez + " " + formattedTimeStart2; // hour minute shit
    const newEvent = {
      start: finalStart,
      end: finalEnd,
      title: event,
      color: 'purple',
      summary: 'i love men',
      createdBy: user.firstName
    };

    if (eventsByDate[timex]) {
      eventsByDate[timex] = [...eventsByDate[timex], newEvent];
    } else {
      eventsByDate[timex] = [newEvent];
    }
    completeEvent();
    setEventsByDate(eventsByDate);
    
    console.log("updating! ")
   
     await updateTodoHook({
     variables: { input: { id: user.unsafeMetadata.groupid, events: JSON.stringify(eventsByDate) } },
     });
     
  };

  function handleTimePickerChange(event, time) {
    setStartTime(time);
  }
  function handleTimePickerChange2(event, time) {
    setEndTime(time);
  }

  const returnPicker = () => {
    switch (showMode) {
      case "time":
        return (
          <RNDateTimePicker
            value={startTime}
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
            date={start}
            onChange={(params) => {setStart(params.date); console.log(start)}}
            selectedItemColor="#ccc0ef"
          />
        );
    }
  };
  const returnPicker2 = () => {
    switch (showMode2) {
      case "time":
        return (
          <RNDateTimePicker
            value={endTime}
            display="spinner"
            mode="time"
            onChange={handleTimePickerChange2}
          />
        );
      case "date":
      default:
        return (
          <DateTimePicker
            mode="single"
            date={end}
            onChange={(params) => {setEnd(params.date); console.log(start)}}
            selectedItemColor="#ccc0ef"
          />
        );
    }
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
          <CalendarProvider date={selectedDay} >
            <ExpandableCalendar
            firstDay={1} 
            onDayPress={(day) => {
              setSelectedDay(day.dateString);
              console.log(day.dateString)
            }}
            maxToRenderPerBatch={10}
            animateScroll={true}
            theme={{
              selectedDayBackgroundColor: "#ccc0ef"
            }}
            />
            <View style={{height:"100%"}}>
            <TimelineList
          
            onDayPress={(day) => {
              setSelectedDay(day.dateString);
              console.log(day.dateString)
            }}
           events={eventsByDate}
           timelineProps={{format24h:false}}
           //timelineProps={}
           //showNowIndicator
           firstDay={1}
           //selected={selectedDay}
           scrollToNow
           initialTime={INITIAL_TIME}
 
          />
          </View>
          
                    </CalendarProvider>
          </View>
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
                flexWrap:'wrap'
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
                  {new Date(start).toISOString().slice(0, 10)}
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
                  {`${startTime.toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })} ${new Date(startTime).toISOString().slice(11, 11)}`}
                </Text>
                
              </TouchableOpacity>
              <Collapsible collapsed={isExpanded}>{returnPicker()}</Collapsible>
              <TouchableOpacity
                style={{
                  borderColor: "#ccc0ef",
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                onPress={() => handleExpand2("date")}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  {new Date(end).toISOString().slice(0, 10)}
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
                onPress={() => handleExpand2("time")}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  {`${endTime.toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })} ${new Date(endTime).toISOString().slice(11, 11)}`}
                </Text>
              </TouchableOpacity>
              
              
            </View>
            <Collapsible collapsed={isExpanded2}>{returnPicker2()}</Collapsible>

            <TouchableOpacity style={styles.addButton} onPress={createNewEvent}>
              <Text style={styles.addButtonText}>Add event</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
