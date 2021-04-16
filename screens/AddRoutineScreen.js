import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  TouchableOpacity,
  Button,
  FlatList,
  Dimensions,
} from "react-native";
import { Input } from "react-native-elements";
import PropTypes from "prop-types";
import { db, auth } from "../firebase";
import WeekdayPicker from "react-native-weekday-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  MaterialCommunityIcons,
  FontAwesome,
  EvilIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import { FloatingLabelInput } from "react-native-floating-label-input";

import colors from "../config/colors";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";

const width = Dimensions.get("window").width;

const editIcon = () => {
  return <MaterialCommunityIcons name="pencil" size={24} color="black" />;
};

const AddRoutineScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isNotesFocused, setIsNotesFocused] = useState(false);

  const [pressed, setPressed] = useState();
  //const [modalVisible, setModalVisible] = useState(false);
  const [days, setDays] = useState({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 0,
    0: 0,
  });
  const [times, setTimes] = useState([{ key: 1, hours: 10, minutes: 30 }]);
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [editing, setIsEditing] = useState(false);
  const [clickedTime, setClickedTime] = useState();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    if (event.type == "set") {
      //ok button clicked
      if (!editing) {
        addItem(currentDate);
      } else {
        console.log(clickedTime);
        setIsEditing(false);
        //setTimes(times.find(key => key === clicked))
        //ändra times[clicked] till currentDate

        const newTimes = times;
        newTimes[clickedTime].hours = currentDate.getHours();
        newTimes[clickedTime].minutes = currentDate.getMinutes();
        setTimes(newTimes);
        setRefresh(!refresh);
      }
    } else {
      //cancel button clicked
      console.log("Cancel button pressed");
    }
  };

  const showTimepicker = () => {
    setShow(true);
  };

  const createRoutine = () => {
    if (!name.trim()) {
      alert("Please Enter a Name");
      return;
    } else {
      db.collection("Users")
        .doc(user.uid)
        .collection("routines")
        .doc(name)
        .set({
          routine: name,
          note: note,
          days: JSON.stringify(days),
          routineTimes: JSON.stringify(times),
          removed: false,
        })
        .then(() => {
          console.log("Document successfully written!");
          alert("Routine Created!");
        })
        .catch((error) => {
          console.error("Catch: Error writing document: ", error);
        });
    }
  };

  const handleChange = (days) => {
    setDays(days);
  };

  const removeTime = (clicked) => {
    console.log("remove" + clicked);
    setRefresh(!refresh);

    const filteredData = times.filter((item, index) => index !== clicked);
    setTimes(filteredData);
  };

  const addItem = (currentDate) => {
    setTimes((previousTimes) => [
      ...previousTimes,
      {
        key: previousTimes.length
          ? previousTimes[previousTimes.length - 1].key + 1
          : 0,
        hours: currentDate.getHours(),
        minutes: currentDate.getMinutes(),
      },
    ]);
    console.log("addItem() ran with times: " + times);
    setRefresh(true);
  };
  const checkNumber = (number) => {
    if (number < 10) {
      number = "0" + number.toString();
    }
    return number;
  };

  let renderItems = ({ item }) => {
    return (
      <Swipeable
        friction={3}
        renderRightActions={(progress, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: "clamp",
          });
          return (
            <TouchableOpacity
              onPress={() => {
                removeTime(times.findIndex((obj) => obj.key === item.key));
              }}
              style={styles.timeContainer}
            >
              <MaterialCommunityIcons
                name="close"
                size={30}
                color={"#F45B69"}
              />
            </TouchableOpacity>
          );
        }}
      >
        <View style={styles.Container}>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(true);
              setClickedTime(times.findIndex((obj) => obj.key === item.key));
              showTimepicker();
            }}
            style={styles.timeListContainer}
          >
            {typeof item != "undefined" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: colors.darkmodeHighWhite,
                    paddingRight: 8,
                  }}
                >
                  {checkNumber(item.hours) + ":" + checkNumber(item.minutes)}
                </Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={14}
                  color={colors.darkmodeHighWhite}
                />
              </View>
            ) : null}
            {/* <FontAwesome5
              name="tune"
              size={30}
              color={colors.darkmodeHighWhite}
            /> */}
            <EvilIcons
              name="navicon"
              size={33}
              color={colors.darkmodeHighWhite}
            />
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.name}>Create a custom routine</Text>
      <View style={styles.inputContainer}>
        <View
          style={[
            isNameFocused
              ? {
                  backgroundColor: "rgba(255,255,255,0.07)",
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.samRed,
                  marginBottom: 12,
                }
              : {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.darkmodeDisabledBlack,
                  marginBottom: 12,
                },
          ]}
        >
          <FloatingLabelInput
            isFocused={isNameFocused}
            hint="eg. Morning workout"
            hintTextColor={colors.darkmodeMediumWhite}
            inputStyles={styles.inputStyles}
            customLabelStyles={{
              colorFocused: colors.darkmodeHighWhite,
              colorBlurred: colors.darkmodeMediumWhite,
              fontSizeBlurred: 16,
            }}
            containerStyles={styles.containerStyles}
            onFocus={() => {
              setIsNameFocused(true);
            }}
            onBlur={() => {
              setIsNameFocused(false);
            }}
            label="Routine name"
            leftComponent={
              <View style={{ padding: 12 }}>
                <FontAwesome
                  name="diamond"
                  size={22}
                  color={
                    isNameFocused ? colors.samRed : colors.darkmodeDisabledBlack
                  }
                />
              </View>
            }
            rightComponent={
              name != "" ? (
                <View style={{ padding: 12 }}>
                  <TouchableOpacity
                    style={{ justifyContent: "center" }}
                    onPress={() => {
                      setName("");
                      setIsNameFocused(false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={colors.darkmodeMediumWhite}
                    />
                  </TouchableOpacity>
                </View>
              ) : null
            }
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
            // style={{ color: colors.darkmodeHighWhite, height: 40 }}
          />
        </View>
        <View
          style={[
            isNotesFocused
              ? {
                  backgroundColor: "rgba(255,255,255,0.07)",
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.samRed,
                  marginBottom: 40,
                }
              : {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.darkmodeDisabledBlack,
                  marginBottom: 40,
                },
          ]}
        >
          <FloatingLabelInput
            isFocused={isNotesFocused}
            hint="eg. 10 push-ups"
            hintTextColor={colors.darkmodeMediumWhite}
            inputStyles={styles.inputStyles}
            customLabelStyles={{
              colorFocused: colors.darkmodeHighWhite,
              colorBlurred: colors.darkmodeMediumWhite,
              fontSizeBlurred: 16,
            }}
            containerStyles={styles.containerStyles}
            onFocus={() => {
              setIsNotesFocused(true);
            }}
            onBlur={() => {
              setIsNotesFocused(false);
            }}
            label="Notes (Optional)"
            leftComponent={
              <View style={{ padding: 12 }}>
                <FontAwesome
                  name="diamond"
                  size={22}
                  color={
                    isNotesFocused
                      ? colors.samRed
                      : colors.darkmodeDisabledBlack
                  }
                />
              </View>
            }
            rightComponent={
              note != "" ? (
                <View style={{ padding: 12 }}>
                  <TouchableOpacity
                    style={{ justifyContent: "center" }}
                    onPress={() => {
                      setNote("");
                      setIsNotesFocused(false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={colors.darkmodeMediumWhite}
                    />
                  </TouchableOpacity>
                </View>
              ) : null
            }
            type="text"
            value={note}
            onChangeText={(text) => setNote(text)}
            // style={{ color: colors.darkmodeHighWhite, height: 40 }}
          />
        </View>

        <Text style={styles.text}>Select days:</Text>
        {pressed ? (
          <WeekdayPicker
            days={days}
            onChange={() => {
              handleChange(days);
              setPressed(false);
            }}
            style={styles.picker}
            dayStyle={styles.day}
          />
        ) : (
          <WeekdayPicker
            days={days}
            onChange={() => {
              handleChange(days);
              setPressed(true);
            }}
            style={styles.picker}
            dayStyle={styles.day}
          />
        )}

        <Text style={styles.text}>Times a day:</Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              showTimepicker();
            }}
            style={styles.timeListContainerAddButton}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: -8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: colors.darkmodeHighWhite,
                  paddingRight: 6,
                }}
              >
                Add
              </Text>
              <MaterialCommunityIcons
                name="plus"
                size={22}
                color={colors.darkmodeHighWhite}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 200 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.timeTitleContainer}>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChange}
                />
              )}
            </View>

            <View styles={styles.flatlist}>
              {typeof times != "undefined" ? (
                <FlatList
                  initialNumToRender={times.length}
                  data={times}
                  renderItem={renderItems}
                  updateCellsBatchingPeriod={0}
                  windowSize={5}
                  extraData={refresh}
                />
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
      {/* <AppButton
        style={styles.button}
        title="Add routine"
        onPress={createRoutine}
      /> */}
      {name != "" && typeof days != "undefined" ? (
        <TouchableOpacity style={styles.button} onPress={createRoutine}>
          <Text style={styles.buttonText}>Add Routine</Text>
        </TouchableOpacity>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: {
    width: width,
    backgroundColor: "#F45B69",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: -100,
  },
  buttonText: {
    color: colors.floralWhite,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  container: {
    paddingTop: 25,
    width: width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkmodeLightBlack,
  },
  inputStyles: {
    color: colors.darkmodeHighWhite,
    fontSize: 17,
    paddingTop: 6,
    paddingLeft: 5,
  },
  containerStyles: { height: 55 },
  flatlist: {
    height: 200,
  },
  text: {
    color: colors.darkmodeMediumWhite,
    marginBottom: 8,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  picker: {
    marginBottom: 40,
  },

  inputContainer: {
    width: 300,
    marginTop: 20,
  },

  name: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 22,
    color: colors.darkmodeHighWhite,
    fontWeight: "600",
    alignItems: "center",
  },
  timeTitleContainer: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "center",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeListContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkmodeDisabledBlack,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  timeListContainerAddButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkmodeDisabledBlack,
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 50,
    width: "105%",
  },
});

AddRoutineScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddRoutineScreen;

// TODO:
//  manage custom routines?
//  if routine name already exists?
//  auto increment times a day by an hour
//
//  keyboard:
//    smoother keyboard
//    input keeps being focused after hiding keyboard
//
//  scrollview only on flatlist?
//  default no days selected
//  color picker
//  add some vector background for color
//  three lines on press = open swipeable?
