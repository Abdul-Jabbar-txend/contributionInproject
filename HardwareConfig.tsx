import { useState, useEffect } from "react";
import { Button } from "@rythmz/components/button";
import { Input } from "@rythmz/components/input";
import { Switch } from "@rythmz/components/switch";
import { HelpCircle } from "lucide-react";
import Modal from "@rythmz/components/modal";
import { useApplyMethodsMutation } from "@/redux/rktQueries/devices";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { hardwareConfigSchema } from "@/lib/validation-schemas/general";

interface HardwareConfigurationProps {
  deviceId: string;
  cpuInfo: {
    hwCores: number;
    vppCores: number;
    configuredVppCores: number;
    powerSaving: boolean;
  };
}

export const HardwareConfiguration: React.FC<HardwareConfigurationProps> = ({
  deviceId,
  cpuInfo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [powerSaving, setPowerSaving] = useState(false);
  const [vRouterCores, setVRouterCores] = useState(
    cpuInfo.configuredVppCores || 1
  );
  const [initialPowerSaving, setInitialPowerSaving] = useState(
    cpuInfo.powerSaving
  );
  const [initialVRouterCores, setInitialVRouterCores] = useState(
    cpuInfo.configuredVppCores || 1
  );

  const [applyMethod] = useApplyMethodsMutation();

  useEffect(() => {
    setPowerSaving(cpuInfo.powerSaving);
    setInitialPowerSaving(cpuInfo.powerSaving);
    setVRouterCores(cpuInfo.configuredVppCores || 1);
    setInitialVRouterCores(cpuInfo.configuredVppCores || 1);
  }, [cpuInfo]);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const hardwareConfig = async () => {
    try {
      const maxCores = cpuInfo.hwCores || 1;
      await hardwareConfigSchema.validate(
        { vRouterCores, maxCores },
        { abortEarly: false }
      );

      const updatedCpuInfo = {
        ...cpuInfo,
        vppCores: vRouterCores,
        configuredVppCores: vRouterCores,
        powerSaving: powerSaving,
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
        if (
          powerSaving !== initialPowerSaving ||
          vRouterCores !== initialVRouterCores
        ) {
          toast.success("Modify device hardware job added successfully");
        } else {
          toast.error("No changes detected. Nothing to apply");
        }
        setIsOpen(false);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        toast.error(error.errors[0]);
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
        isOpen={isOpen}
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
                {cpuInfo.hwCores}
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
                {cpuInfo.vppCores}
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
                  value={vRouterCores}
                  onChange={(e) => setVRouterCores(Number(e.target.value))}
                  min={1}
                  max={cpuInfo.hwCores - 1}
                  className="w-[200px] bg-background/50"
                />
                {vRouterCores > cpuInfo.hwCores - 1 ? (
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
                checked={powerSaving}
                onCheckedChange={(e) => setPowerSaving(e)}
                disabled={vRouterCores > 1}
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
