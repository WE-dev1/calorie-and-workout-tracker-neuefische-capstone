import {
  Wrapper,
  List,
  ListItem,
  ListAddButton,
  AddWorkoutForm,
  Input,
  Label,
  SubmitButton,
  CloseFormButton,
  ButtonWrapper,
  Interval,
  IntervalHeadline,
  SetIntervalSection,
  ListItemEditMode,
  IntervalItem,
  IntervalButton,
  StyledPageHeadline,
  AddRoutineButton,
} from "../../components/WorkoutsPage/styles.js";
import BackButton from "../../components/BackButton/index.js";
import { LoadingDisplay } from "../../components/IndexPage/styles.js";
import useCalorieStore from "../../utils/useCalorieStore.js";
import Link from "next/link.js";
import headingBack from "../../assets/headingBack.svg";
import styled from "styled-components";
import { useState, useEffect } from "react";

export default function WorkoutsPage() {
  const {
    addWorkout,
    setRoutine,
    routineDisplay,
    setRoutineDisplay,
    exercises,
  } = useCalorieStore();

  const workouts = exercises
    .slice()
    .filter(
      (exercise, index, self) =>
        index === self.findIndex((e) => e.workout === exercise.workout)
    );
  const [formVisibility, toggleFormVisibility] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(routineDisplay);

  function handleSubmit(event) {
    event.preventDefault();
    const formdata = new FormData(event.target);
    const data = Object.fromEntries(formdata);
    addWorkout(data.title);
    toggleFormVisibility(false);
    event.target.reset();
  }

  function renderUniqueWorkouts() {
    if (!isEditMode) {
      return workouts.map((workout, index) => (
        <ListItem href={`/workouts/${index}`} key={index}>
          {workout.workout}
        </ListItem>
      ));
    } else {
      return workouts.map((workout, index) => (
        <ListItemEditMode
          key={index}
          onClick={() => {
            setCurrentInterval((draft) => [
              ...draft,
              { id: workout.id, workout: workout.workout },
            ]);
          }}
          style={{
            background: currentInterval.includes(workout)
              ? "var(--9)"
              : "var(--6)",
          }}
        >
          {workout.workout}
        </ListItemEditMode>
      ));
    }
  }

  // hydration error handling
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingDisplay>█████████████████████████████▒▒▒▒▒</LoadingDisplay>;
  }
  // --------------------------------

  return (
    <Wrapper>
      <StyledBackground />
      <StyledPageHeadline>Workouts</StyledPageHeadline>
      <Link href="/">
        <BackButton />
      </Link>
      <List
        invisible={formVisibility}
        style={{
          height: "58%",
          transform: isEditMode ? "translateY(54px)" : "translateY(2px)",
        }}
      >
        {renderUniqueWorkouts()}
        {!isEditMode ? (
          <ListAddButton
            onClick={() => {
              toggleFormVisibility(!formVisibility);
            }}
          >
            ADD WORKOUT
          </ListAddButton>
        ) : (
          <ListAddButton
            style={{ marginBottom: "40px" }}
            onClick={() => {
              setCurrentInterval((draft) => [
                ...draft,
                { id: "free", workout: "REST" },
              ]);
            }}
          >
            + 1 REST DAY
          </ListAddButton>
        )}
      </List>
      <AddWorkoutForm
        visible={formVisibility}
        style={{ height: "386px", transform: "translateY(-18.5px)" }}
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <Label htmlFor="title">Title:</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          maxLength={20}
        ></Input>
        <ButtonWrapper>
          <CloseFormButton
            type="button"
            onClick={() => {
              toggleFormVisibility(false);
            }}
          >
            CLOSE
          </CloseFormButton>
          <SubmitButton>ADD WORKOUT</SubmitButton>
        </ButtonWrapper>
      </AddWorkoutForm>
      {!formVisibility && !isEditMode && (
        <AddRoutineButton
          onClick={() => {
            setIsEditMode(!isEditMode);
          }}
        >
          ▲ ADD ROUTINE TO CALENDAR ▲
        </AddRoutineButton>
      )}
      {isEditMode && (
        <SetIntervalSection>
          <IntervalHeadline>YOUR ROUTINE:</IntervalHeadline>
          <Interval>
            {currentInterval.map((workout, index) => (
              <IntervalItem
                key={index}
                style={{
                  backgroundColor: workout.id === "free" ? "var(--2)" : null,
                  color: workout.id === "free" ? "lightsteelblue" : null,
                }}
              >
                {currentInterval.length - 1 === index ? "↻ " : "⇣ "}
                {workout.workout}
              </IntervalItem>
            ))}
          </Interval>
          <ButtonWrapper style={{ marginTop: "15px", marginBottom: "5px" }}>
            <IntervalButton
              onClick={() => {
                setIsEditMode(!isEditMode);
              }}
            >
              CLOSE
            </IntervalButton>
            <IntervalButton
              style={{ backgroundColor: "var(--7)", color: "var(--5)" }}
              onClick={() => {
                setCurrentInterval([]);
              }}
            >
              CLEAR
            </IntervalButton>
            <IntervalButton
              style={{ backgroundColor: "var(--6)", color: "var(--2)" }}
              onClick={() => {
                setRoutine(currentInterval);
                setRoutineDisplay(currentInterval);
                setIsEditMode(false);
              }}
            >
              SAVE
            </IntervalButton>
          </ButtonWrapper>
        </SetIntervalSection>
      )}
    </Wrapper>
  );
}

const StyledBackground = styled(headingBack)`
  fill: var(--1);
  position: absolute;
  top: 0;
  filter: drop-shadow(0.5px 3px 3px black);
`;
