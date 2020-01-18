import * as Express from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { System, VarName } from './config/enviornment-vars';
import * as OktaJwtVerifier from '@okta/jwt-verifier';

const app = Express();

const jwtVerifier = new OktaJwtVerifier({
  clientId: System.getProperty(VarName.AppClientId),
  issuer: System.getProperty(VarName.Issuer),
  assertClaims: {
    aud: System.getProperty(VarName.Audience),
    cid: System.getProperty(VarName.ClientId),
  }
});

const authRequired = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split('Bearer ')[1];

  if (!token) {
    res.status(401);
    return next('Unauthorized');
  }

  const audience = System.getProperty(VarName.Audience);
  return jwtVerifier.verifyAccessToken(token, audience)
    .then(jwt => {
      req['jwt'] = jwt;
      next();
    })
    .catch(err => res.status(401).send(err.message));
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'resources/views'));

const router = Express.Router();

router.get('', (req, res) => {
  res.render('index', { baseHref: System.getProperty(VarName.BaseHref) });
});

router.get('/secure', authRequired, (req, res) => {
  res.json({
    date: new Date(),
    message: 'Authenticated',
  });
});

router.use('/static', Express.static(join(__dirname, 'resources/static')));

app.use('/home', router);

app.listen(8081, () => console.log('Server running on port 8081'));