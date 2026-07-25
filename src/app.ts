import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./interfaces/http/routes";


const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(routes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Financial Wallet API' });
});

export default app;