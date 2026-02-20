import { createSlice, nanoid } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const generateRecurringInstances = (task, count = 30) => {
  const instances = [];
  const startDate = dayjs(task.date);
  for (let i = 1; i <= count; i++) {
    let nextDate;
    switch (task.recurrence) {
      case "daily":
        nextDate = startDate.add(i, "day");
        break;
      case "weekly":
        nextDate = startDate.add(i, "week");
        break;
      case "monthly":
        nextDate = startDate.add(i, "month");
        break;
      default:
        continue;
    }
    instances.push({
      ...task,
      id: nanoid(),
      date: nextDate.format("YYYY-MM-DD"),
      recurringParentId: task.id,
    });
  }
  return instances;
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasks: (state, action) => action.payload,

    addTask: {
      reducer: (state, action) => {
        state.push(action.payload);
        if (action.payload.recurrence && action.payload.recurrence !== "none") {
          const instances = generateRecurringInstances(action.payload);
          state.push(...instances);
        }
      },
      prepare: (task) => ({
        payload: { id: nanoid(), ...task },
      }),
    },

    editTask: (state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },

    deleteTask: (state, action) => {
      const idToDelete = String(action.payload);
      return state.filter((t) => String(t.id) !== idToDelete);
    },

    deleteRecurringSeries: (state, action) => {
      const parentId = String(action.payload);
      return state.filter(
        (t) =>
          String(t.id) !== parentId &&
          String(t.recurringParentId) !== parentId
      );
    },
  },
});

export const { setTasks, addTask, editTask, deleteTask, deleteRecurringSeries } =
  tasksSlice.actions;
export default tasksSlice.reducer;





