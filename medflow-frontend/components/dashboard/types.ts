export type ExamRequestRow = {
  id: string;
  patientName: string;
  patientPhone: string;
  requestingPhysician: string;
  protocol: string;
  status: "PENDING" | "ANALYZING" | "AUTHORIZED" | "REJECTED";
  deliveryStatus: "SENT" | "DELIVERED" | "READ" | "-";
  createdAt: string;
};
