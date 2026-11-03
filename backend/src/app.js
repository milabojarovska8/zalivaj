import fs from 'node:fs';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import plantRoutes from './routes/plants.routes.js';
import requestRoutes from './routes/requests.routes.js';
import { UPLOAD_DIR } from './middleware/upload.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

const openapi = YAML.parse(fs.readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/requests', requestRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
