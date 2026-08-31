//This app is intended to be used only in test, because it will work with the compositionRoot that
//uses the PrismaTestUnitOfWork, with the objective of not persisting the changes being made by the API

import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

export default app;