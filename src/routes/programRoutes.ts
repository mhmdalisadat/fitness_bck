import { Router } from 'express';
import { createProgram, getProgramByUserId } from '../controllers/programController';

const router = Router();

router.post('/program', createProgram);
router.get('/program/user/:userId', getProgramByUserId);

export default router;