import { devices } from "@/constants/breadCrumbs";
import { Badge } from "@rythmz/components/badge";
import { Button } from "@rythmz/components/button";
import TableHeader from "@rythmz/components/TableHeader";
import { Tabs, TabsList, TabsTrigger } from "@rythmz/components/tabs";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Dropdown } from "@rythmz/components/Dropdown";
import {
  configurationsTabs,
  statusTabs,
  troubleshootingTabs,
} from "./constant";

type TabName = "General" | "Configurations" | "Status" | "Troubleshooting";

interface Props {
  onValueChange: (value: string) => void;
  children: ReactNode;
  dropdownValue: string;
  handleDropdownSelect: (selectedValue: string, tab: TabName) => void;
  onOpenChange?: (open: boolean) => void;
}

const InfoLayout = ({
  onValueChange,
  children,
  dropdownValue,
  handleDropdownSelect,
  onOpenChange,
}: Props) => {
  const { deviceId } = useParams();
  const updatedBreadCrumbs = [
    ...devices,
    {
      name: "Device Info",
      href: `/devices/deviceinfo/${deviceId}`,
      current: true,
    },
  ];

  const getDropdownItems = (tab: TabName) => {
    switch (tab) {
      case "Troubleshooting":
        return troubleshootingTabs;
      case "Configurations":
        return configurationsTabs;
      case "Status":
        return statusTabs;
      default:
        return [];
    }
  };

  return (
    <div>
      <TableHeader text="Device Info" breadcrumb={updatedBreadCrumbs} />
      <div className="flex justify-between items-center">
        <Button size="sm">Update Device</Button>
        <div className="flex">
          <Badge className="mr-2 bg-[#28a745] text-white">Approved</Badge>
          <Badge variant="destructive">Not Connected</Badge>
        </div>
      </div>

      <Tabs
        className="w-full text-white my-4"
        value={dropdownValue}
        onValueChange={onValueChange}
      >
        <TabsList>
          {["General", "Configurations", "Status", "Troubleshooting"].map(
            (tab, index) => (
              <TabsTrigger key={index} value={tab} className="border-black">
                {tab === "General" ? (
                  <h3>General</h3>
                ) : (
                  <Dropdown
                    onOpenChange={onOpenChange}
                    onSelect={(value) =>
                      handleDropdownSelect(value, tab as TabName)
                    }
                    selectedValue=""
                    items={getDropdownItems(tab as TabName)}
                    label={tab}
                    className="border-neutral-700 focus:border-b-4"
                  />
                )}
              </TabsTrigger>
            )
          )}
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
};

export default InfoLayout;
