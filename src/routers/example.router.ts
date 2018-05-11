import {Router} from 'vcms';

const router: Router = Router();


router.get('/hello', async (req, res) => {
  res.send('hello world');
});


export {router as exampleRouter};
