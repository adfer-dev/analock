import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useEffect, useState } from "react";
import { MarkedDates } from "react-native-calendars/src/types";
import {
  ActivityRegistration,
  getUserRegistrations,
} from "../services/activityRegistrations.services";
import {
  areDatesEqual,
  timestampToDate,
  dateToDateData,
  getMarkedDateFormatFromDate,
} from "../utils/date.utils";
import { getBookMetadata } from "../services/books.services";

const MySpaceScreen = () => {
  const MySpaceStack = createNativeStackNavigator();
  return (
    <MySpaceStack.Navigator initialRouteName="MySpace">
      <MySpaceStack.Screen name="MySpace" component={MySpace} />
    </MySpaceStack.Navigator>
  );
};

interface Dot {
  key: string;
  color: string;
  selectedDotColor: string;
}

interface ShownObject {
  text: string;
  color: string;
}

function MySpace() {
  const books: Dot = { key: "book", color: "red", selectedDotColor: "blue" };
  const games: Dot = { key: "game", color: "blue", selectedDotColor: "blue" };
  const diaryEntries = {
    key: "diaryEntry",
    color: "green",
    selectedDotColor: "blue",
  };
  const currentDate = new Date();
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [currentDateData, setCurrentDateData] = useState<DateData>(
    dateToDateData(currentDate),
  );
  const [selectedRegistrations, setSelectedRegistrations] = useState<
    ShownObject[]
  >([]);

  /**
   * Aux function to get the dots object from a registration object
   *
   * @param registration the registration object
   * @returns the dots object
   */
  function getDotsFromRegistrationObject(
    registration: ActivityRegistration,
  ): Dot {
    let dot: Dot = diaryEntries;
    if ("internetArchiveId" in registration) {
      dot = books;
    } else if ("gameName" in registration) {
      dot = games;
    }

    return dot;
  }

  /**
   * Gets the shown text from registration object
   * @param registration the registration object
   * @returns the shown text
   */
  async function getTextFromRegistrationObject(
    registration: ActivityRegistration,
  ): Promise<string> {
    let text: string = "";
    if ("internetArchiveId" in registration) {
      //request to internet archive
      const metadata = await getBookMetadata({
        id: (registration as BookRegistration).internetArchiveId,
      });
      text = metadata!.metadata.title;
    } else if ("gameName" in registration) {
      text = (registration as GameRegistration).gameName;
    } else {
      text = "Diary";
    }

    return text;
  }

  // Hook to mark the registrations on calendar of the current month
  useEffect(() => {
    const startDate = new Date(
      currentDateData.year,
      currentDateData.month - 1,
      2,
      0,
      0,
      0,
    );

    let endDate: Date;
    if (
      areDatesEqual(currentDate, timestampToDate(currentDateData.timestamp))
    ) {
      endDate = currentDate;
    } else {
      endDate = new Date(currentDateData.year, currentDateData.month);
    }
    const updatedMarkedDates: MarkedDates = { ...markedDates };

    getUserRegistrations(1, startDate.valueOf(), endDate.valueOf())
      .then((userRegistrations) => {
        for (const userRegistration of userRegistrations) {
          const registrationDate = new Date(
            userRegistration.registration.registrationDate,
          );
          const dateToBeUpdated =
            updatedMarkedDates[getMarkedDateFormatFromDate(registrationDate)];
          const dot = getDotsFromRegistrationObject(userRegistration);

          if (dateToBeUpdated !== undefined) {
            dateToBeUpdated.dots = [...dateToBeUpdated.dots!, dot];
          } else {
            updatedMarkedDates[getMarkedDateFormatFromDate(registrationDate)] =
              {
                dots: [dot],
              };
          }
        }
        setMarkedDates(updatedMarkedDates);
      })
      .catch((err) => console.error(err));
  }, [currentDateData]);

  return (
    <View>
      <Text>Progress</Text>
      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        onMonthChange={(dateData) => {
          setCurrentDateData(dateData);
        }}
        onDayPress={(dateData) => {
          const selectedDate = timestampToDate(dateData.timestamp);
          const selectedMarkedDate =
            markedDates[getMarkedDateFormatFromDate(selectedDate)];

          if (selectedMarkedDate !== undefined) {
            getUserRegistrations(
              1,
              selectedDate.valueOf(),
              selectedDate.valueOf(),
            )
              .then(async (userRegistrations) => {
                const shownObjects: ShownObject[] = [];
                for (const userRegistration of userRegistrations) {
                  const dots = getDotsFromRegistrationObject(userRegistration);
                  const text =
                    await getTextFromRegistrationObject(userRegistration);
                  shownObjects.push({
                    text,
                    color: dots.color,
                  });
                }
                setSelectedRegistrations(shownObjects);
              })
              .catch((err) => console.error(err));
          }
        }}
      />
      {selectedRegistrations.length > 0 &&
        selectedRegistrations.map((registration) => (
          <Text key={registration.text} style={{ color: registration.color }}>
            {registration.text}
          </Text>
        ))}
    </View>
  );
}

export default MySpaceScreen;
