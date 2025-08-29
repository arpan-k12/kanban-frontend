export function multiOptions(Position: number) {
  switch (Position) {
    case 1:
      return [
        { label: "Commodity", value: "commodity" },
        { label: "Budget", value: "budget" },
        { label: "Customer", value: "customer" },
      ];
    case 2:
      return [
        { label: "Summary Text", value: "summary" },
        { label: "Assigned To", value: "assigned_to" },
      ];
    case 3:
      return [
        { label: "Quote Amount", value: "amount" },
        { label: "Valid Until", value: "valid_until" },
      ];
    case 4:
      return [
        { label: "Decision", value: "decision" },
        { label: "Reason", value: "reason" },
      ];
    default:
      return [{ label: "Default Option", value: "default" }];
  }
}
