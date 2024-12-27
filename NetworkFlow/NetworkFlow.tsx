import { useGetDevicesQuery } from "@/redux/rktQueries/devices";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

const Network: React.FC = () => {
  const {
    data: devices,
    isLoading,
    isError,
    error,
  } = useGetDevicesQuery({ response: "summary" });
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const updateNodesAndEdges = useCallback(() => {
    if (devices && devices.length > 0) {
      const newNodes: Node[] = devices.map(
        (
          device: {
            name: string;
            _id: { toString: () => any };
            hostname: any;
            imageUrl: any;
          },
          index: number
        ) => {
          return {
            id: device._id?.toString(),
            type: "custom",
            data: {
              name: device.name,
              imgSrc: device?.imageUrl || "/network.png",
            },
            position: {
              x: (index % 5) * 200 + 50,
              y: Math.floor(index / 5) * 200 + 50,
            },
          };
        }
      );
      setNodes(newNodes);
      // console.log("....>>>", devices);

      const newEdges: Edge[] = [];
      for (let i = 0; i < devices.length; i++) {
        for (let j = i + 1; j < devices.length; j++) {
          newEdges.push({
            id: `e${devices[i]._id}-${devices[j]._id}`,
            source: devices[i]._id.toString(),
            target: devices[j]._id.toString(),
            type: "smoothstep",
          });
        }
      }
      setEdges(newEdges);
    }
  }, [setNodes, setEdges, devices]);

  useEffect(() => {
    if (devices) {
      updateNodesAndEdges();
    }
  }, [devices, updateNodesAndEdges]);

  if (isLoading)
    <div className="flex justify-center items-center h-screen">
      Loading network data...
    </div>;

  if (isError)
    <div className="flex justify-center items-center h-screen">
      Error fetching network data: {error?.toString()}
    </div>;

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Network;
