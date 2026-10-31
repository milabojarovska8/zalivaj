import { app } from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`API teče na http://localhost:${config.port} (Swagger: /api-docs)`);
});
