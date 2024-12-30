import { Device } from "@/@types/device";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";

interface InitialState {
  device: Device;
}

const deviceSlice = createSlice({
  name: "device",
  initialState: {
    device: {},
  } as InitialState,
  reducers: {
    addDevice: (state, action: PayloadAction<Device>) => {
      state.device = action.payload;
    },
    updateDeviceSpecificRules: (state, action) => {
      state.device.deviceSpecificRulesEnabled =
        action?.payload?.deviceSpecificRulesEnabled;
      state.device.firewall.rules = action.payload.rules;
    },

    updateDeviceName: (state, action) => {
      state.device.name = action.payload.name;
    },
    updateDeviceDescription: (state, action) => {
      state.device.description = action.payload.description;
    },
    updateDeviceIsApproved: (state, action) => {
      state.device.isApproved = action.payload.isApproved;
    },
    updateVrouterCores: (state, action) => {
      state.device.cpuInfo.vppCores = action.payload.device.cpuInfo.vppCores;
    },
    updatePowerSaving: (state, action) => {
      state.device.cpuInfo.powerSaving =
        action.payload.device.cpuInfo.powerSaving;
    },
  },
});

export const {
  addDevice,
  updateDeviceSpecificRules,
  updateDeviceName,
  updateDeviceDescription,
  updateDeviceIsApproved,
  updateVrouterCores,
  updatePowerSaving,
} = deviceSlice.actions;

export default deviceSlice.reducer;
