// routes.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import jwtAuthMiddleware from "./middleware/jwtAuth.js";

// Load swagger JSON dynamically
const swaggerFilePath = path.join(process.cwd(), 'swagger-output.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));

import * as userController from './controllers/userController.js';
import * as projectController from './controllers/projectController.js';
import * as chatController from './controllers/chatController.js';
import * as videoController from './controllers/videoController.js';
import * as channelController from './controllers/channelController.js';

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// ------------------- USER -------------------
router.put('/user', jwtAuthMiddleware, userController.updateUser);
router.delete('/user', jwtAuthMiddleware, userController.deleteUser);

// ------------------- PROJECT -------------------
router.get('/project', jwtAuthMiddleware, projectController.getProjects);
router.get('/project/:id', jwtAuthMiddleware, projectController.getProjectById);
router.post('/project', jwtAuthMiddleware, projectController.createProject);
router.put('/project/:id', jwtAuthMiddleware, projectController.updateProjectById);
router.delete('/project/:id', jwtAuthMiddleware, projectController.deleteProjectById);
router.get('/project/:id/status', jwtAuthMiddleware, projectController.getStatus);

// ------------------- CHAT -------------------
router.get('/chat', jwtAuthMiddleware, chatController.getChats);
router.get('/chat/:id', jwtAuthMiddleware, chatController.getChatById);
router.post('/chat', jwtAuthMiddleware, chatController.createChat);
router.put('/chat/:id', jwtAuthMiddleware, chatController.updateChatById);
router.delete('/chat/:id', jwtAuthMiddleware, chatController.deleteChatById);

// ------------------- VIDEO -------------------
router.get('/video', jwtAuthMiddleware, videoController.getVideos);
router.post('/video', jwtAuthMiddleware, videoController.createVideo);
router.delete('/video/:id', jwtAuthMiddleware, videoController.deleteVideoById);

// ------------------- CHANNEL -------------------
router.get('/channel', jwtAuthMiddleware, channelController.getChannels);
router.post('/channel', jwtAuthMiddleware, channelController.createChannel);
router.delete('/channel/:id', jwtAuthMiddleware, channelController.deleteChannelById);

export default router;