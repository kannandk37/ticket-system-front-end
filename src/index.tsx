import ReactDOM from "react-dom/client";
import App from "../src/components/App";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl); // "https://api.example.com"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <App />
    </LocalizationProvider>
  </BrowserRouter>
);
