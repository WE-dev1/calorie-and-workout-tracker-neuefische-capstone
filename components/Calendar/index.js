import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import { unixDate } from "../../utils/useCalorieStore";
import useCalorieStore from "../../utils/useCalorieStore";
import CalendarWrapper, {
  StyledMoodle,
  StyledListItem,
  StyledListHeadline,
  StyledListSpan,
  StrokeWrapper,
} from "./styles";
import { NameSpan, ShiftedSpan } from "../ConsumedList/styles";
import Lottie from "react-lottie";
import animationData from "../../public/lottie/circle.json";

export default function HomeCalendar({
  getCaloriesConsumed,
  isVisible,
  setCalorieButton,
  calorieButtonVisibility,
}) {
  const { history, calorieGoals, routine } = useCalorieStore();
  const [date, setDate] = useState(new Date());
  const [showHistoryEntry, setShowHistoryEntry] = useState(false);
  const [historyEntryData, setHistoryEntryData] = useState([
    { date: null, meal: null, calories: null, time_stamp: null },
  ]);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  function getTileClassName(date, view) {
    const unixTileDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();

    if (history.some((entry) => entry.date === unixTileDate)) {
      if (date <= unixDate) {
        if (
          getCaloriesConsumed(unixTileDate) <=
          calorieGoals.find((goalEntry) => goalEntry.date === unixTileDate).goal
        ) {
          if (view === "month" && unixDate === unixTileDate) {
            return (
              "react-calendar__tile--wasNotExceeded" &&
              "react-calendar__tile--now--wasNotExceeded"
            );
          } else {
            return "react-calendar__tile--wasNotExceeded";
          }
        } else {
          if (view === "month" && unixDate === unixTileDate) {
            return (
              "react-calendar__tile--wasExceeded" &&
              "react-calendar__tile--now--wasExceeded"
            );
          }
          return "react-calendar__tile--wasExceeded";
        }
      }
    }
    if (
      routine
        .slice()
        .filter((entry) => entry.id !== "free")
        .some((entry) => entry.date === unixTileDate)
    ) {
      return "react-calendar__tile--workout";
    }
  }

  function tileContent({ date, view }) {
    const unixTileDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    if (
      routine
        .slice()
        .filter((entry) => entry.id !== "free")
        .some((entry) => entry.date === unixTileDate) &&
      unixTileDate === unixDate
    ) {
      return (
        <Lottie
          options={defaultOptions}
          style={{
            position: "absolute",
            transform: "scale(0.2) translate(-612px, -698px)",
          }}
        />
      );
    }
  }

  function handleClickDay(date, event) {
    const unixTileDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();

    if (history.some((entry) => entry.date === unixTileDate)) {
      if (date < unixDate) {
        {
          setCalorieButton(!calorieButtonVisibility);
          setHistoryEntryData(
            history.slice().filter((entry) => entry.date === unixTileDate)
          );
          setShowHistoryEntry(!showHistoryEntry);
        }
      }
    }
  }

  function getFormattedDate(unixTime) {
    const dateObj = new Date(unixTime);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const day = dateObj.getDate();
    const formattedDate = `${day} ${months[monthIndex]} ${year}`.replace(
      /,/g,
      ""
    );
    return formattedDate;
  }

  const earliestDate =
    history.length >= 1 ? new Date(history[0].date) : new Date();
  const invisible =
    history.slice().filter((entry) => entry.date === unixDate).length > 4 &&
    isVisible;
  return (
    <CalendarWrapper isVisible={invisible}>
      <StrokeWrapper isVisible={invisible}>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </StrokeWrapper>
      <Calendar
        aria-label="Calendar with tracked data"
        value={date}
        selectRange={false}
        maxDate={lastDate}
        minDate={earliestDate}
        minDetail="month"
        formatShortWeekday={formatShortWeekday}
        formatMonthYear={formatMonthYear}
        onChange={(date) => {
          setDate(date);
        }}
        onClick={(event) => {
          event.target.stopPropagation();
        }}
        onClickDay={handleClickDay}
        tileClassName={({ date, view }) => getTileClassName(date, view)}
        tileContent={({ date, view }) => tileContent({ date, view })}
      />
      {showHistoryEntry && (
        <StyledMoodle>
          {historyEntryData.map((entry, index) => (
            <>
              {index === 0 && (
                <>
                  <StyledListHeadline
                    style={{
                      color:
                        calorieGoals.find((goal) => goal.date === entry.date)
                          .goal > getCaloriesConsumed(entry.date)
                          ? "var(--9)"
                          : "var(--10)",
                    }}
                  >
                    {getFormattedDate(entry.date)}
                  </StyledListHeadline>
                  <StyledListSpan>{`${getCaloriesConsumed(entry.date)} / ${
                    calorieGoals.find((goal) => goal.date === entry.date).goal
                  }`}</StyledListSpan>
                </>
              )}

              <StyledListItem key={index}>
                <NameSpan>{`${entry.meal}`}</NameSpan>
                <ShiftedSpan>{`${entry.calories} kcal`}</ShiftedSpan>
                <span>{`${entry.time_stamp}`}</span>
              </StyledListItem>
            </>
          ))}
        </StyledMoodle>
      )}
    </CalendarWrapper>
  );
}

// calendar styling:

const lastDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 3,
  new Date().getDate()
);

const formatShortWeekday = (locale, date) => {
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return weekdays[date.getDay()];
};

const formatMonthYear = (locale, date) => {
  return new Intl.DateTimeFormat(locale, {
    year: "2-digit",
    month: "long",
  }).format(date);
};
