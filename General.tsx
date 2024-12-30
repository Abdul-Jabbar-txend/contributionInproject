import { Button } from "@rythmz/components/button";
import { Card, CardContent } from "@rythmz/components/card";
import { Switch } from "@rythmz/components/switch";
import Maps from "../../Dashboard/Maps";
import { useGetDeviceInfoQuery } from "@/redux/rktQueries/DeviceTroubleshoot/device";
import { useParams } from "react-router-dom";
import { Input } from "@rythmz/components/input";
import { useEffect, useState, useCallback } from "react";
import AlertPopup from "@rythmz/components/Popup";
import { HardwareConfiguration } from "./HardwareConfig";
import { useDispatch } from "react-redux";
import { updateDeviceGeneralProps } from "@/redux/slices/deviceSlice";
import { debounce } from "./General/utils";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

const General = () => {
  const { deviceId } = useParams();
  const dispatch = useDispatch();

  const { data } = useGetDeviceInfoQuery({
    id: deviceId!,
  });
  const {
    name,
    description,
    isApproved,
    machineId,
    serial,
    versions,
    hostname,
    hwCores,
    vppCores,
    configuredVppCores,
  } = data?.[0] || {};

  const [deviceName, setDeviceName] = useState(name);
  const [deviceDescription, setDeviceDescription] = useState(description);
  const [approved, setApproved] = useState(isApproved);
  const [isOpenModal, setOpenModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isNameModified, setIsNameModified] = useState(false);
  const [isDescriptionModified, setIsDescriptionModified] = useState(false);
  const [nameTypingTimeout, setNameTypingTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [descriptionTypingTimeout, setDescriptionTypingTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const debouncedUpdateName = useCallback(
    debounce((value: string) => {
      dispatch(updateDeviceGeneralProps({ id: deviceId, name: value }));
    }, 2000),
    [deviceId, dispatch]
  );

  const debouncedUpdateDescription = useCallback(
    debounce((value: string) => {
      dispatch(updateDeviceGeneralProps({ id: deviceId, description: value }));
    }, 2000),
    [deviceId, dispatch]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(e.target.value);
    setIsNameModified(false);

    if (nameTypingTimeout) {
      clearTimeout(nameTypingTimeout);
    }

    const newTimeout = setTimeout(() => {
      setIsNameModified(true);
      debouncedUpdateName(e.target.value);
    }, 1000);

    setNameTypingTimeout(newTimeout);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceDescription(e.target.value);
    setIsDescriptionModified(false);

    if (descriptionTypingTimeout) {
      clearTimeout(descriptionTypingTimeout);
    }

    const newTimeout = setTimeout(() => {
      setIsDescriptionModified(true);
      debouncedUpdateDescription(e.target.value);
    }, 2000);

    setDescriptionTypingTimeout(newTimeout);
  };

  const generateKeyMethod = async (selectedMethod: string) => {
    try {
      const response = await applyMethod({
        deviceId,
        body: { method: "ikev2" },
      }).unwrap();

      if (response) {
        toast.success(`Generate IKEv2 device job added`);
        setOpenModal(false);
      }
    } catch (error) {
      toast.error("Error generating IKEv2 key/certificate");
      console.error("Error generating IKEv2 key/certificate:", error);
    }
  };

  useEffect(() => {
    if (data) {
      setDeviceName(data[0]?.name);
      setDeviceDescription(data[0].description);
      setIsNameModified(false);
      setIsDescriptionModified(false);
      setApproved(data[0]?.isApproved);
    }
  }, [data]);

  const handlePopUP = (method: string) => {
    setSelectedMethod(method);
    setOpenModal(true);
  };

  const handleClosePopUP = () => {
    setOpenModal(false);
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
                      value={deviceName}
                      onChange={handleNameChange}
                    />
                    {isNameModified && (
                      <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
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
                      value={deviceDescription}
                      onChange={handleDescriptionChange}
                    />
                    {isDescriptionModified && (
                      <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Approved
                  </label>
                  <div className="sm:col-span-2">
                    <Switch
                      checked={approved}
                      onCheckedChange={(e) => setApproved(e)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Host Name
                  </label>
                  <div className="rounded bg-gray-700 p-2 sm:col-span-2">
                    {hostname || "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Machine ID
                  </label>
                  <div className="rounded bg-gray-700 p-2 sm:col-span-2">
                    {machineId || "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    S/N
                  </label>
                  <div className="rounded bg-gray-700 p-2 break-all sm:col-span-2">
                    {serial || "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                  <label className="text-sm font-medium sm:self-center">
                    Device Version
                  </label>
                  <div className="rounded bg-gray-700 p-2 sm:col-span-2">
                    {versions?.device || "N/A"}
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
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  title="Generate a new IKEv2 Private Key & Certificate"
                  onClick={() => handlePopUP("IKEv2")}
                >
                  Generate IKEv2
                </Button>

                <AlertPopup
                  isOpen={isOpenModal}
                  onClose={handleClosePopUP}
                  onContinue={() =>
                    selectedMethod && generateKeyMethod(selectedMethod)
                  }
                  title="Generate IKEv2 Key/Certificate"
                  description="Are you sure you want to generate a new IKEv2 Private Key and Certificate?"
                />
                <HardwareConfiguration
                  deviceId={deviceId!}
                  cpuInfo={
                    data?.[0]?.cpuInfo || {
                      hwCores: 1,
                      vppCores: 1,
                      configuredVppCores: 1,
                      powerSaving: false,
                    }
                  }
                />
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
function applyMethod(arg0: {
  deviceId: string | undefined;
  body: { method: string };
}) {
  throw new Error("Function not implemented.");
}
