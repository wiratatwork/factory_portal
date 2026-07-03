import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT || 5001);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/keycloak/config', (_req, res) => {
  res.json({
    realm: process.env.KEYCLOAK_REALM || 'toyota',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'factory-portal',
    authority: process.env.KEYCLOAK_BASE_URL || 'http://keycloak:8080',
  });
});

app.listen(port, () => {
  console.log(`factory-portal api listening on port ${port}`);
});
