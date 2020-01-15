const Express = require('express');
const bodyParser = require('body-parser');

const app = Express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = Express.Router();

router.get('', (req, res) => {
  res.send('Connected');
});

app.use('/home', router);

app.listen(8081, () => console.log('Server running on port 8081'));