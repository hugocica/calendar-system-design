import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Calendar from "./pages/calendar.tsx";
import Providers from "./providers/index.tsx";
import { makeServer } from "./server/index.ts";

makeServer();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Calendar />
    </Providers>
  </StrictMode>
);
