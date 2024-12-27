import NetworkFlow from "@/components/NetworkFlow/NetworkFlow";
import { network } from "@/constants/breadCrumbs";
import TableHeader from "@rythmz/components/TableHeader";

const Network = () => {
  return (
    <>
      <div>
        <TableHeader text="Network" breadcrumb={network} />
      </div>

      <NetworkFlow />
    </>
  );
};

export default Network;
