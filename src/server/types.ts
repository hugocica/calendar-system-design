import { Registry, Server } from "miragejs";

import type { AnyFactories, AnyModels } from "miragejs/-types";

export type TMakeServerProps = {
  environment?: string;
};

export type TServerContext = Server<Registry<AnyModels, AnyFactories>>;

export type TServerMirage = (context: TServerContext) => void;
