import React, { useState } from "react";
import AlertPopup from "@rythmz/components/Popup";
import { Button } from "@rythmz/components/button";
import { useParams } from "react-router-dom";
import { useApplyMethodsMutation } from "@/redux/rktQueries/devices";
import { toast } from "react-hot-toast";

const GenerateCertificate: React.FC = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const { deviceId } = useParams();
  const [applyMethod] = useApplyMethodsMutation();

  const handlePopupClose = () => setIsOpenPopup(false);

  const handleContinue = async () => {
    try {
      const response = await applyMethod({
        deviceId,
        body: { method: "ikev2" },
      }).unwrap();

      if (response) {
        toast.success(`Generate IKEv2 device job added`);
        setIsOpenPopup(false);
      }
    } catch (error) {
      toast.error("Error generating IKEv2 key/certificate");
      console.error("Error generating IKEv2 key/certificate:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpenPopup(true)}
        variant="secondary"
        className="w-full sm:w-auto"
        title="Generate a new IKEv2 Private Key & Certificate"
      >
        Generate IKEv2
      </Button>

      <AlertPopup
        isOpen={isOpenPopup}
        onContinue={handleContinue}
        onClose={handlePopupClose}
        title="Generate IKEv2 Key/Certificate"
        description="Are you sure you want to generate a new IKEv2 Private Key and Certificate?"
      />
    </div>
  );
};

export default GenerateCertificate;
