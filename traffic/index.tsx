import { Device, TrafficData } from "@/@types/dashboard";
import DualMetricChart from "@/components/Chart/DualMetricChart";
import { traffic } from "@/constants/breadCrumbs";
import { useGetDevicesQuery } from "@/redux/rktQueries/devices";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "@rythmz/components/button";
import { DynamicSelect } from "@rythmz/components/DynamicSelect";
import TableHeader from "@rythmz/components/TableHeader";
import { useEffect, useState } from "react";

const Traffic = () => {
  const { data: devices, isLoading } = useGetDevicesQuery({});
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedInterface, setSelectedInterface] = useState<string>("");
  const [selectedDirection, setSelectedDirection] = useState<string>("RX + TX");
  const [deviceOptions, setDeviceOptions] = useState<
    { title: string; value: string }[]
  >([]);
  const [interfaceOptions, setInterfaceOptions] = useState<
    { title: string; value: string }[]
  >([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);

  useEffect(() => {
    if (selectedDevice && selectedInterface) {
      const fetchTrafficData = () => {
        const now = Date.now();
        const twoHoursAgo = now - 2 * 60 * 60 * 1000;
        const dataPoints: TrafficData[] = [];

        // Generate random traffic data over the last 2 hours
        for (let time = twoHoursAgo; time <= now; time += 5 * 60 * 1000) {
          dataPoints.push({
            time: time,
            bps: {
              rx: Math.random() * 150000000 + 50000000, // Random values for rx, tx
              tx: Math.random() * 150000000 + 50000000,
            },
            pps: {
              rx: Math.random() * 140 + 20, // Random values for rx, tx
              tx: Math.random() * 140 + 20,
            },
          });
        }
        setTrafficData(dataPoints);
      };

      fetchTrafficData();
      const interval = setInterval(fetchTrafficData, 5 * 60 * 1000); // Refresh data every 5 minutes
      return () => clearInterval(interval);
    } else {
      // If no device or interface is selected, set default data (0 values)
      const now = Date.now();
      const twoHoursAgo = now - 2 * 60 * 60 * 1000;
      const defaultDataPoints: TrafficData[] = [];

      for (let time = twoHoursAgo; time <= now; time += 5 * 60 * 1000) {
        defaultDataPoints.push({
          time: time,
          bps: {
            rx: 0,
            tx: 0,
          },
          pps: {
            rx: 0,
            tx: 0,
          },
        });
      }

      setTrafficData(defaultDataPoints); // Set default 0 traffic data
    }
  }, [selectedDevice, selectedInterface]); // This will trigger the effect when selectedDevice or selectedInterface changes

  useEffect(() => {
    // Check if devices are available
    if (devices) {
      const options = devices.map((device: Device) => ({
        title: device.name,
        value: device._id,
      }));
      setDeviceOptions(options);
    }

    // Check if selectedDevice is available
    if (selectedDevice) {
      const interfaceOptions = selectedDevice.interfaces.map((iface) => ({
        name: iface.name,
        title: iface.IPv4,
        value: iface._id,
      }));
      setInterfaceOptions(interfaceOptions);

      setSelectedInterface(""); // Reset interface
    }
  }, [devices, selectedDevice]);

  const handleDeviceChange = (deviceId: string) => {
    const device = devices?.find((device: Device) => device._id === deviceId);
    if (device) {
      setSelectedDevice(device);
    }
  };

  return (
    <div>
      <TableHeader text="Network Traffic" breadcrumb={traffic} />
      <div className="flex flex-wrap items-center justify-start gap-4 ">
        <Button
          className="rounded-full text-black hover:text-white bg-white"
          size="sm"
        >
          <UpdateIcon />
        </Button>
        <label className="text-sm font-medium">Device</label>
        <div className="flex flex-col w-full sm:w-1/3 md:w-1/4 ">
          <DynamicSelect
            value={selectedDevice ? selectedDevice._id : ""}
            options={deviceOptions}
            onChange={handleDeviceChange}
          />
        </div>

        <label className="col-form-label mb-2 text-sm">Interface</label>
        <div className="flex flex-col w-full sm:w-1/3 md:w-1/4">
          <DynamicSelect
            value={selectedInterface}
            options={interfaceOptions}
            onChange={setSelectedInterface}
          />
        </div>

        <label className="text-sm font-medium">Direction</label>

        <div className="flex flex-col w-full sm:w-1/4 md:w-1/5 lg:w-1/6">
          <DynamicSelect
            value={selectedDirection}
            options={[
              { title: "RX + TX", value: "RX + TX" },
              { title: "RX", value: "RX" },
              { title: "TX", value: "TX" },
            ]}
            onChange={setSelectedDirection}
          />
        </div>
      </div>
      <br />
      <hr />

      <DualMetricChart
        data={trafficData}
        selectedDirection={selectedDirection}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Traffic;
