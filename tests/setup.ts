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
