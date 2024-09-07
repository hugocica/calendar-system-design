/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer, Response } from "miragejs";

import * as t from "./types";
import { availableHoursByDateMock } from "./mocks";

type TScheduleBodyRequest = {
  date: string;
};

export function makeServer(
  params: t.TMakeServerProps = {
    environment: "test",
  }
): t.TServerContext {
  return createServer({
    environment: params.environment,
    routes() {
      this.namespace = "api";

      this.get("/available-hours", (_, request) => {
        const response =
          availableHoursByDateMock[request.queryParams.date as string];

        if (!response) {
          return new Response(204);
        }

        return response;
      });

      this.post("/schedule", (_, request) => {
        const date = new Date(
          (request.requestBody as unknown as TScheduleBodyRequest).date
        );

        if (date.getHours() === 10) {
          return new Response(400);
        }

        return new Response(200);
      });
    },
  });
}
