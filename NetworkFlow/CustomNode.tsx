import { CustomNodeData } from "@/@types/customnode";
import React from "react";

const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  console.log(">>>>>", data);

  return (
    <div className="relative text-white">
      <div className="device-name">
        {data.name}
        <img
          src={data.imgSrc}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "network.png";
          }}
        />
      </div>
    </div>
  );
};

export default CustomNode;
