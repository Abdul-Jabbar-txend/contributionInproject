import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindow,
  GoogleMapProps,
} from "@react-google-maps/api";
import { useGetDevicesQuery } from "@/redux/rktQueries/devices";
import Heading from "@rythmz/components/Heading";
import { Device } from "@/@types/dashboard";

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
};

const darkModeStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#484848",
      },
    ],
  },
];

const Maps: React.FC = () => {
  const {
    data: devices,
    isLoading,
    error,
  } = useGetDevicesQuery<{
    data: Device[];
    isLoading: boolean;
    error: unknown;
  }>({ response: "summary" });

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState<boolean>(false);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setGoogleLoaded(true);
      }
    };
    checkGoogleMaps();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading devices.</div>;
  }

  // Calculate the center based on the first device or use a default
  const center: google.maps.LatLngLiteral =
    devices && devices.length > 0
      ? { lat: devices[0].coords[0], lng: devices[0].coords[1] }
      : { lat: 31.414348602294922, lng: 74.26167297363281 };

  const mapOptions: GoogleMapProps["options"] = {
    styles: darkModeStyles,
    mapTypeId: "roadmap",
  };

  return (
    <div>
      <Heading text="" />
      <div className="bg-[#141C2C] py-6 px-4 mt-2 rounded-2xl w-full text-white">
        <LoadScript googleMapsApiKey="AIzaSyCojGoCfYbJi2e5tpNN4Nji02RtDXHhgOI">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
            options={mapOptions}
          >
            {devices &&
              devices.map((device: Device) => (
                <MarkerF
                  key={device._id}
                  position={{
                    lat: device.coords[0],
                    lng: device.coords[1],
                  }}
                  icon={{
                    url: "/network.png", // Default image URL
                    scaledSize: googleLoaded
                      ? new window.google.maps.Size(30, 30) // Only scale if google maps is loaded
                      : undefined,
                  }}
                  label={{
                    text: device.name,
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bolder",
                  }}
                  onClick={() => setSelectedDevice(device)}
                />
              ))}

            {selectedDevice && (
              <InfoWindow
                position={{
                  lat: selectedDevice.coords[0],
                  lng: selectedDevice.coords[1],
                }}
                onCloseClick={() => setSelectedDevice(null)}
              >
                <div className="text-black">
                  <h3>{selectedDevice.name}</h3>
                  <p>ID: {selectedDevice._id}</p>
                  <p>Location: {selectedDevice.coords.join(", ")}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Maps;
