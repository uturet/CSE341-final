// routes.ts
import express from 'express';

import swaggerUi from 'swagger-ui-express';
// Load swagger JSON dynamically (top-level await, Node 22+)
let swaggerDocument: any;
swaggerDocument = (await import('../swagger-output.json', { assert: { type: 'json' } })).default;

import * as userController from './controllers/userController.js';
import * as projectController from './controllers/projectController.js';
import * as chatController from './controllers/chatController.js';
import * as videoController from './controllers/videoController.js';
import * as channelController from './controllers/channelController.js';

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.put('/user', userController.updateUser);
router.delete('/user', userController.deleteUser);

router.get('/project', projectController.getProjects);
router.get('/project/:id', projectController.getProjectById);
router.post('/project', projectController.createProject);
router.put('/project/:id', projectController.updateProjectById);
router.delete('/project/:id', projectController.deleteProjectById);
router.get('/project/:id/status', projectController.getStatus);

router.get('/chat', chatController.getChats);
router.get('/chat/:id', chatController.getChatById);
router.post('/chat', chatController.createChat);
router.put('/chat/:id', chatController.updateChatById);
router.delete('/chat/:id', chatController.deleteChatById);


router.get('/video', videoController.getVideos);
router.post('/video', videoController.createVideo);
router.delete('/video/:id', videoController.deleteVideoById);

router.get('/channel', channelController.getChannels);
router.post('/channel', channelController.createChannel);
router.delete('/channel/:id', channelController.deleteChannelById);

export default router;
