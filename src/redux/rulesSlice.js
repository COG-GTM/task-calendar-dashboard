import { createSlice, nanoid } from "@reduxjs/toolkit";

const rulesSlice = createSlice({
  name: "rules",
  initialState: [],
  reducers: {
    setRules: (state, action) => action.payload,

    addRule: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (rule) => ({
        payload: { 
          id: nanoid(), 
          ...rule,
          currentScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
          status: "active",
          author: "Current User",
          createdAt: new Date().toISOString().split('T')[0],
          lastRun: new Date().toISOString().split('T')[0],
          enforcement: true,
        },
      }),
    },

    editRule: (state, action) => {
      const index = state.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },

    deleteRule: (state, action) => {
      const idToDelete = String(action.payload);
      return state.filter((r) => String(r.id) !== idToDelete);
    },

    toggleRuleEnforcement: (state, action) => {
      const rule = state.find((r) => r.id === action.payload);
      if (rule) {
        rule.enforcement = !rule.enforcement;
        rule.status = rule.enforcement ? "active" : "inactive";
      }
    },
  },
});

export const { setRules, addRule, editRule, deleteRule, toggleRuleEnforcement } = rulesSlice.actions;
export default rulesSlice.reducer;
