import { Logger, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import * as chalk from 'chalk';
// import { SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { INestApplication } from '@nestjs/common';
import { AppLoggerService } from '@xilo-mono/backend-core';
import { join } from 'path'
import * as cors from 'cors';
import { allowedOrigins } from './app/constants/appconstant';

const APP_NAME = 'XILO_BACKEND';

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: new AppLoggerService(),
    }
  );
  app.useGlobalPipes(new ValidationPipe());
  const _logger = await app.resolve(AppLoggerService);
  if (_logger) {
    app.useLogger(_logger);
  }

  const restPort = process.env.PORT || 3333;
  const globalPrefix = 'api';

  app.use(bodyParser.json());
  app.useStaticAssets(join(__dirname, '..', 'assets'));

  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.use(cors({
    origin: allowedOrigins,
    preflightContinue: true,
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'x-access-token', 'Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin'],
  }));
  // app.options('*', cors());
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      if (req.headers['x-forwarded-proto'] === 'https') {
        return next();
      }
      return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.info('-----error!');
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
  app.enableShutdownHooks();

  await app
    .listen(restPort)
    .then(() => {
      console.info(
        chalk.cyan(`App (pid: ${process.pid})`) +
          chalk.green(' [') +
          chalk.blue(`${APP_NAME}`) +
          chalk.green('] started on port'),
        chalk.green('[') +
          chalk.blue(restPort.toString()) +
          chalk.green('] ') +
          `http://localhost:${restPort}`
      );
    })
    .catch(console.error);
}

bootstrap().catch((err) =>
  console.error('Error: unable to bootstrap application: ', err)
);
