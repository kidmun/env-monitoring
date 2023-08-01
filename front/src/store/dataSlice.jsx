import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    events: [],
    curUser: null,
    accountStatus: false,
    cur_data: {},
    threshold: [],
    prevData: [],
    days: [ {
        id: 'temperature',
        data: [
         
        ]
      }, {
        id: 'humidity',
        data: [
         
        ]
      }],
    hours: [ {
        id: 'temperature',
        data: [
         
        ]
      }, {
        id: 'humidity',
        data: [
         
        ]
      }],
      users: [
       
      
      ]
  },
  reducers: {
    replaceDays(state, action) {
      state.days = action.payload;
    },
    replaceHours(state, action) {
        state.hours = action.payload;
      },
      replaceUsers(state, action) {
        state.users = action.payload;
      },
      replaceCurData(state, action) {
        state.cur_data = action.payload;
      },
      replaceThreshold(state, action) {
        state.threshold = action.payload;
      },
      replacePrevData(state, action){
        state.prevData = action.payload;
      },
      turnOnAccountStatus(state, action){
        state.accountStatus = true;
      },
      turnOffAccountStatus(state, action){
        state.accountStatus = false;
      },
      setUser(state, action) {
        state.curUser = action.payload;
      },
      replaceEvents(state, action) {
        state.events = action.payload;
      }
  },
});

export const dataActions = dataSlice.actions;
export default dataSlice;