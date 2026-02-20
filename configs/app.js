import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const BASE_PATH = '/api';

const middlewares = (app) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
      service: 'BloodLink',
    });
  });
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3006;

  try {
    middlewares(app);
    routes(app);

    app.use((err, req, res, next) => {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    app.listen(PORT, () => {
      console.log(`BloodLink running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
};
