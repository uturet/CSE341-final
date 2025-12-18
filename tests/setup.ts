// Mock the transcript service to avoid youtube-transcript-plus issues
jest.mock('../src/services/transcriptService.ts', () => ({
  fetchOfficialTranscript: jest.fn(),
  fetchUnofficialTranscript: jest.fn(),
  fetchTranscript: jest.fn(),
}));

// Mock the video service as well
jest.mock('../src/services/videoService.ts', () => ({
  getVideoTranscript: jest.fn().mockResolvedValue(null),
  // Add any other exports from videoService here
}));

jest.mock('../src/models/user.js', () => ({
  UserModel: require('./__mocks__/models').UserModel,
}));

jest.mock('../src/models/project.js', () => ({
  ProjectModel: require('./__mocks__/models').ProjectModel,
}));

jest.mock('../src/models/chat.js', () => ({
  ChatModel: require('./__mocks__/models').ChatModel,
}));

jest.mock('../src/models/video.js', () => ({
  VideoModel: require('./__mocks__/models').VideoModel,
}));

jest.mock('../src/models/channel.js', () => ({
  ChannelModel: require('./__mocks__/models').ChannelModel,
}));