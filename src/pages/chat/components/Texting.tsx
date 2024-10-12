import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export interface TextingProp {
  conversationId: string;
}

const Texting: React.FC<TextingProp> = ({ conversationId }) => {
  return (
    <div className="texting-component">
      <p>Texting {conversationId}</p>
    </div>
  );
};

export default Texting;
