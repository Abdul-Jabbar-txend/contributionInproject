import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@rythmz/components/button";
import { Input } from "@rythmz/components/input";
import { Switch } from "@rythmz/components/switch";
import { HelpCircle } from "lucide-react";
import Modal from "@rythmz/components/modal";
import { useApplyMethodsMutation } from "@/redux/rktQueries/devices";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { hardwareConfigSchema } from "@/lib/validation-schemas/general";
import {
  updateVrouterCores,
  updatePowerSaving,
} from "@/redux/slices/deviceSlice";
import { RootState } from "@/redux/slices";

export const HardwareConfiguration: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const dispatch = useDispatch();

  const { device } = useSelector((state: RootState) => state.device);
  const [applyMethod] = useApplyMethodsMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleVRouterCoresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVppCores = e.target.value;
    dispatch(
      updateVrouterCores({
        device: {
          cpuInfo: {
            vppCores: newVppCores,
          },
        },
      })
    );
  };

  const handlePowerSavingChange = (checked: boolean) => {
    dispatch(
      updatePowerSaving({
        device: {
          cpuInfo: {
            powerSaving: checked,
          },
        },
      })
    );
  };

  const hardwareConfig = async () => {
    try {
      const maxCores = device.cpuInfo.hwCores || 1;
      await hardwareConfigSchema.validate(
        { vRouterCores: device.cpuInfo.vppCores, maxCores },
        { abortEarly: false }
      );

      const updatedCpuInfo = {
        ...device.cpuInfo,
        vppCores: device.cpuInfo.vppCores,
        configuredVppCores: device.cpuInfo.configuredVppCores,
        powerSaving: device.cpuInfo.powerSaving,
      };

      const payload = {
        method: "modifyHardware",
        meta: {
          cpuInfo: updatedCpuInfo,
        },
      };

      const response = await applyMethod({
        deviceId,
        body: payload,
      }).unwrap();

      if (response) {
        toast.success("Modify device hardware job added successfully");
        handleCloseModal();
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach((err) => toast.error(err));
      } else {
        toast.error("Error applying configuration");
      }
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOpenModal}>
        Hardware Configuration
      </Button>

      <Modal
        isOpen={isModalOpen}
        title="Hardware Configuration"
        setOpenModal={handleCloseModal}
        className="sm:max-w-[600px] bg-[#1F2634]"
      >
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label htmlFor="hw-cpu" className="text-sm font-medium">
                  HW CPU cores
                </label>
              </div>
              <div className="w-[200px] bg-background/50 bg-gray-700 rounded p-2">
                {device.cpuInfo.hwCores}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="current-vrouter"
                  className="text-sm font-medium"
                >
                  Current vRouter cores
                </label>
              </div>
              <div className="w-[200px] bg-background/50 bg-gray-700 rounded p-2">
                {device.cpuInfo.configuredVppCores}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label htmlFor="vrouter" className="text-sm font-medium">
                  vRouter cores
                </label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <Input
                  type="number"
                  value={device.cpuInfo.vppCores}
                  onChange={(e) => handleVRouterCoresChange(e)}
                  min={1}
                  max={device.cpuInfo.hwCores - 1}
                  className="w-[200px] bg-background/50"
                />
                {device.cpuInfo.configuredVppCores >
                device.cpuInfo.hwCores - 1 ? (
                  <span className="text-xs text-red-500 mt-1">
                    Invalid number of vRouter cores
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label htmlFor="power-saving" className="text-sm font-medium">
                  Power Saving
                </label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Switch
                checked={device.cpuInfo.powerSaving}
                onCheckedChange={handlePowerSavingChange}
                disabled={device.cpuInfo.vppCores > 1}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={hardwareConfig}>Apply Configuration</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
