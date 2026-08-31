//This app is used in dev and prod, because it will be used in the compositionRoot intended to
//use the PrismaUnitOfWork, with the objective of persisting the changes being made by the API

import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

export default app;