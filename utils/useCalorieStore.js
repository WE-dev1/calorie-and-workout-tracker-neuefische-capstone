import { create } from "zustand";
import { persist } from "zustand/middleware";

export const unixDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
).getTime();

const useCalorieStore = create(
  persist(
    (set, get) => {
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();

      return {
        history: [],
        calorieGoals: [{ date: unixDate, goal: 1600 }],

        setCalorieGoal: (userInput) =>
          set((state) => {
            const newGoal =
              userInput !== undefined
                ? userInput
                : state.calorieGoals.at(-1).goal;

            return {
              calorieGoals: [
                ...state.calorieGoals
                  .slice()
                  .filter((goalEntry) => goalEntry.date !== unixDate),
                { date: unixDate, goal: newGoal },
              ],
            };
          }),

        addHistoryEntry: (caloriesInput, mealInput = "⚡️ ---") =>
          set((state) => ({
            history: [
              ...state.history,
              {
                date: unixDate,
                meal: `${mealInput}`,
                calories: `${caloriesInput}`,
                time_stamp: `${hour < 10 ? "0" + hour : hour}:${
                  minute < 10 ? "0" + minute : minute
                }`,
              },
            ],
          })),

        deleteHistoryEntry: (entryToDelete) =>
          set((state) => ({
            history: state.history
              .slice()
              .filter((entry) => entry !== entryToDelete),
          })),
      };
    },
    {
      name: "trackedDataStorage",
    }
  )
);

export default useCalorieStore;
