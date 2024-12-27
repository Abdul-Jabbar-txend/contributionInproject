import Maps from "@/components/Dashboard/Maps";
import { worldmap } from "@/constants/breadCrumbs";
import TableHeader from "@rythmz/components/TableHeader";

const WorldMap = () => {
  return (
    <div>
      <TableHeader text="WorldMap" breadcrumb={worldmap} />
      <Maps />
    </div>
  );
};

export default WorldMap;
