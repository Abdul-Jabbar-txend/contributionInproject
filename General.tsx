import { RootState } from "@/redux/slices";
import {
  updateDeviceDescription,
  updateDeviceIsApproved,
  updateDeviceName,
} from "@/redux/slices/deviceSlice";
import { Card, CardContent } from "@rythmz/components/card";
import { Input } from "@rythmz/components/input";
import { Switch } from "@rythmz/components/switch";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Maps from "../../Dashboard/Maps";
import { HardwareConfiguration } from "./HardwareConfig";
import GenerateCertificate from "./GenerateCertificate";
import useDebounce from "../../../hooks/useDebounce";

const General = () => {
  const { device } = useSelector((state: RootState) => state.device);
  const [name, setName] = useState(device?.name);
  const [description, setDescription] = useState(device?.description);
  const [isApproved, setIsApproved] = useState(device?.isApproved);

  const dispatch = useDispatch();

  const debouncedName = useDebounce(name, 2000);
  const debouncedDescription = useDebounce(description, 2000);

  useEffect(() => {
    if (debouncedName !== device?.name) {
      dispatch(updateDeviceName({ name: debouncedName }));
      console.log("updating name after 2 seconds");
    }
    if (debouncedDescription !== device?.description) {
      dispatch(updateDeviceDescription({ description: debouncedDescription }));
      console.log("updating description after 2 seconds");
    }
  }, [debouncedName, debouncedDescription, dispatch]);

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const updateDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const updateApproved = (checked: boolean) => {
    console.log(checked);
    dispatch(updateDeviceIsApproved({ isApproved: checked }));
  };
  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl">
        <Card className="bg-gray-800 text-gray-100">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Device Name
                  </label>
                  <div className="relative sm:col-span-2">
                    <Input
                      className="rounded p-2 pr-8"
                      value={name}
                      onChange={updateName}
                    />
                    {/* {isNameEdited && (
                      <Check
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600"
                        size={20}
                      />
                    )} */}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Description
                  </label>
                  <div className="relative sm:col-span-2">
                    <Input
                      className="rounded p-2 pr-8"
                      value={description}
                      onChange={updateDescription}
                    />
                    {/* {isDescriptionEdited && (
                      <Check
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600"
                        size={20}
                      />
                    )} */}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Approved
                  </label>
                  <div className="sm:col-span-2">
                    <Switch
                      checked={device?.isApproved}
                      onCheckedChange={updateApproved}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Host Name
                  </label>
                  <div className="rounded bg-gray-700 p-2 sm:col-span-2">
                    {device.hostname}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Machine ID
                  </label>
                  <div className="rounded bg-gray-700 p-2 sm:col-span-2">
                    {device.machineId}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    S/N
                  </label>
                  <div className="rounded bg-gray-700 p-2 break-all sm:col-span-2">
                    {device.serial}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Device Version
                  </label>
                  <div className="rounded bg-gray-700 p-2 sm:col-span-2">
                    {device.versions?.device}
                  </div>
                </div>
              </div>
              <hr />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                <label className="text-sm font-medium sm:self-center">
                  Router Status
                </label>
                <div className="rounded bg-gray-700 p-1 sm:col-span-2 w-1/2">
                  Pending
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                <GenerateCertificate />

                <HardwareConfiguration />
              </div>

              <hr />
              <div className="mt-6">
                <Maps />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default General;
