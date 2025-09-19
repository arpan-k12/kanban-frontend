import React from "react";
import type { DecisionType } from "../../../types/decision.type";

interface Props {
  decision: DecisionType | undefined;
}

const DecisionUI: React.FC<Props> = ({ decision }) => {
  return (
    <>
      <div className="mt-1 text-sm">
        <div className="flex items-center">
          <div className="text- text-[#262b35] ">Decision:</div>
          {decision?.decision === "pass" ? (
            <span className="inline-block ml-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              ✅ Passed
            </span>
          ) : (
            <span className="inline-block ml-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
              ❌ Failed
            </span>
          )}
        </div>

        {decision?.reason && (
          <div className="mt-2 text-xs text-[#262b35]">
            <span className="font-medium">Reason:</span>
            <span className="font-medium ml-2 text-[#868685]">
              {decision?.reason}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default DecisionUI;
