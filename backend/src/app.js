import fs from 'node:fs';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

const openapi = YAML.parse(fs.readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
