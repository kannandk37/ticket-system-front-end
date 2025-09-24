import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./Welcome";
import Tickets from "./Tickets";
import TicketDetail from "./Ticket";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/ticket" element={<TicketDetail />} />
      <Route path="/ticket/:id" element={<TicketDetail />} />
    </Routes>
  );
}
export default App;
