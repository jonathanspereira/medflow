export type ExamRequestRow = {
  id: string;
  patientName: string;
  convenio: string;
  requestingPhysician: string;
  examName: string;
  requestType: "procedimento" | "exame";
  requestDate: string;
  patientPhone: string;
  createdByName: string;
  protocol: string;
  status: "PENDING" | "ANALYZING" | "AUTHORIZED" | "REJECTED" | "CANCELLED";
  deliveryStatus: "SENT" | "DELIVERED" | "READ" | "-";
};
