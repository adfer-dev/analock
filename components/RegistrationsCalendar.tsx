import { DateData, MarkedDates } from "react-native-calendars/src/types";
import { getSettings } from "../services/storage.services";
import { useContext, useEffect, useState } from "react";
import {
  areDatesEqual,
  dateToDateData,
  emptyDateTime,
  getMarkedDateFormatFromDate,
  timestampToDate,
} from "../utils/date.utils";
import { ActivityRegistration } from "../services/activityRegistrations.services";
import { getBookMetadata } from "../services/books.services";
import { BaseScreen } from "./BaseScreen";
import { Calendar } from "react-native-calendars";
import { Text } from "react-native";
import { OnlineFeaturesDisclaimer } from "./OnlineFeaturesDisclaimer";
import { GENERAL_STYLES } from "../constants/general.styles";
import { SettingsContext } from "../contexts/settingsContext";
import { View } from "react-native";
import { RegistrationCircle } from "./RegistrationCircle";

interface Dot {
  key: string;
  color: string;
  selectedDotColor: string;
}

interface ShownObject {
  text: string;
  color: string;
}

export const CalendarScreen: React.FC = ({ route }) => {
  const userSettings = getSettings();
  const { userRegistrations } = route.params;

  return userSettings && userSettings.general.enableOnlineFeatures ? (
    <RegistrationsCalendar userRegistrations={userRegistrations} />
  ) : (
    <OnlineFeaturesDisclaimer />
  );
};

interface RegistrationsCalendarProps {
  userRegistrations: ActivityRegistration[];
}
const RegistrationsCalendar: React.FC<RegistrationsCalendarProps> = ({
  userRegistrations,
}) => {
  const books: Dot = { key: "book", color: "red", selectedDotColor: "blue" };
  const games: Dot = { key: "game", color: "blue", selectedDotColor: "blue" };
  const diaryEntries: Dot = {
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
  const settings = useContext(SettingsContext)?.settings;

  /**
   * Aux function to get the dots object from a registration object
   *
   * @param registration the registration object
   * @returns the dots object
   */
  function getDotsFromRegistrationObject(
    registration: ActivityRegistration,
  ): Dot {
    let dot: Dot;
    if ("internetArchiveId" in registration) {
      dot = books;
      dot.key = registration.internetArchiveId;
    } else if ("gameName" in registration) {
      dot = games;
      dot.key = registration.gameName;
    } else {
      dot = diaryEntries;
      dot.key = registration.title;
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
      1,
      0,
      0,
      0,
    );
    let endDate: Date;
    if (
      areDatesEqual(currentDate, timestampToDate(currentDateData.timestamp))
    ) {
      emptyDateTime(currentDate);
      endDate = currentDate;
    } else {
      endDate = new Date(currentDateData.year, currentDateData.month);
    }
    const updatedMarkedDates: MarkedDates = {};
    const monthUserRegistrations = userRegistrations.filter(
      (userRegistration) =>
        userRegistration.registration.registrationDate >= startDate.valueOf() &&
        userRegistration.registration.registrationDate <= endDate.valueOf(),
    );

    for (const userRegistration of monthUserRegistrations) {
      const registrationDate = new Date(
        userRegistration.registration.registrationDate,
      );
      const dateToBeUpdated =
        updatedMarkedDates[getMarkedDateFormatFromDate(registrationDate)];
      const dot = getDotsFromRegistrationObject(userRegistration);
      console.log(dot);

      if (dateToBeUpdated !== undefined) {
        dateToBeUpdated.dots = [...dateToBeUpdated.dots!, dot];
      } else {
        updatedMarkedDates[getMarkedDateFormatFromDate(registrationDate)] = {
          dots: [dot],
        };
      }
    }
    setMarkedDates(updatedMarkedDates);
  }, [currentDateData]);

  console.log(
    `current date data: ${currentDateData.month}, current date: ${currentDate.getMonth()}`,
  );

  return (
    <BaseScreen>
      <View style={[GENERAL_STYLES.flexCol, GENERAL_STYLES.flexGap]}>
        <Calendar
          theme={{
            textDayHeaderFontFamily: "Inter",
            textDayHeaderFontWeight: "bold",
            textMonthFontFamily: "Inter",
            textMonthFontWeight: "bold",
            textDayFontFamily: "Inter",
            arrowColor: "black",
            selectedDayTextColor: "white",
            selectedDayBackgroundColor: "black",
            todayTextColor: "#AF47D2",
            backgroundColor: "#e9e9e9",
            calendarBackground: "#e9e9e9",
          }}
          firstDay={settings?.preferences.firstDayOfWeek}
          markingType="multi-dot"
          markedDates={markedDates}
          disableArrowLeft={isCalendarOnOldestRegistration(
            userRegistrations,
            currentDateData,
          )}
          disableArrowRight={
            currentDateData.month - 1 === currentDate.getMonth()
          }
          onMonthChange={(dateData) => {
            setCurrentDateData(dateData);
          }}
          onDayPress={async (dateData) => {
            const selectedDate = timestampToDate(dateData.timestamp);
            emptyDateTime(selectedDate);
            const selectedMarkedDate =
              markedDates[getMarkedDateFormatFromDate(selectedDate)];

            if (selectedMarkedDate !== undefined) {
              const shownObjects: ShownObject[] = [];
              const selectedDayUserRegistrations = userRegistrations.filter(
                (userRegistration) =>
                  userRegistration.registration.registrationDate ===
                  selectedDate.valueOf(),
              );

              for (const userRegistration of selectedDayUserRegistrations) {
                const dots = getDotsFromRegistrationObject(userRegistration);
                const text =
                  await getTextFromRegistrationObject(userRegistration);
                shownObjects.push({
                  text,
                  color: dots.color,
                });
              }
              setSelectedRegistrations(shownObjects);
            }
          }}
        />
        {selectedRegistrations.length > 0 && (
          <View style={[GENERAL_STYLES.flexCol, GENERAL_STYLES.flexGap]}>
            {selectedRegistrations.map((registration) => (
              <View
                key={registration.text}
                style={[
                  GENERAL_STYLES.flexRow,
                  GENERAL_STYLES.flexGap,
                  GENERAL_STYLES.alignCenter,
                ]}
              >
                <RegistrationCircle color={registration.color} />
                <Text style={[GENERAL_STYLES.uiText]}>{registration.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </BaseScreen>
  );
};

/**
 * Finds the oldest registration and checks if corresponds to calendar current month
 *
 * @param userRegistrations all user's registrations
 * @param currentDateData current calendar's date data
 * @returns a boolean indicating if current calendar's month corresponds to oldest user registration
 */
function isCalendarOnOldestRegistration(
  userRegistrations: ActivityRegistration[],
  currentDateData: DateData,
): boolean {
  if (userRegistrations.length === 0) {
    return false;
  }

  const oldestRegistration = userRegistrations.reduce(
    (prevRegistration, currentRegistration) => {
      const oldestRegistrationDate = Math.min(
        prevRegistration.registration.registrationDate,
        currentRegistration.registration.registrationDate,
      );

      return oldestRegistrationDate ===
        prevRegistration.registration.registrationDate
        ? prevRegistration
        : currentRegistration;
    },
  );
  return (
    currentDateData.month - 1 ===
    new Date(oldestRegistration.registration.registrationDate).getMonth()
  );
}
