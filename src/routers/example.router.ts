import {Router} from 'express';

const router: Router = Router();


router.get('/hello', (req, res) => {
  res.send('test from node-vcms-testapp');
});


export default router;