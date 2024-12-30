import { RootState } from "@/redux/slices";
import {
  updateDeviceDescription,
  updateDeviceIsApproved,
  updateDeviceName,
} from "@/redux/slices/deviceSlice";
import { Card, CardContent } from "@rythmz/components/card";
import { Input } from "@rythmz/components/input";
import { Switch } from "@rythmz/components/switch";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Maps from "../../Dashboard/Maps";
import { HardwareConfiguration } from "./HardwareConfig";
import { debounce } from "./utils";
import { Check } from "lucide-react";
import GenerateCertificate from "./GenerateCertificate";

const General = () => {
  const { device } = useSelector((rootState: RootState) => rootState?.device);
  const dispatch = useDispatch();

  const [isNameEdited, setIsNameEdited] = useState(false);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);

  const debouncedUpdateName = useCallback(
    debounce((value: string) => {
      if (value !== device?.name) {
        dispatch(updateDeviceName({ name: value }));
        setTimeout(() => {
          setIsNameEdited(true);
        }, 2000);
      }
    }, 0),
    [device?.name, dispatch]
  );

  const debouncedUpdateDescription = useCallback(
    debounce((value: string) => {
      if (value !== device?.description) {
        dispatch(updateDeviceDescription({ description: value }));
        setTimeout(() => {
          setIsDescriptionEdited(true);
        }, 2000);
      }
    }, 0),
    [device?.description, dispatch]
  );

  const debouncedUpdateIsApproved = useCallback(
    debounce((value: boolean) => {
      if (value !== device?.isApproved) {
        dispatch(updateDeviceIsApproved({ isApproved: value }));
      }
    }, 0),
    [device?.isApproved, dispatch]
  );
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
                      value={device?.name}
                      onChange={(e) => debouncedUpdateName(e.target.value)}
                    />
                    {isNameEdited && (
                      <Check
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600"
                        size={20}
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Description
                  </label>
                  <div className="relative sm:col-span-2">
                    <Input
                      className="rounded p-2 pr-8"
                      value={device?.description}
                      onChange={(e) =>
                        debouncedUpdateDescription(e.target.value)
                      }
                    />
                    {isDescriptionEdited && (
                      <Check
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600"
                        size={20}
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Approved
                  </label>
                  <div className="sm:col-span-2">
                    <Switch
                      checked={device?.isApproved}
                      onCheckedChange={(e) => debouncedUpdateIsApproved(e)}
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
