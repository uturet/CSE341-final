const chain = {
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn(),
};

export const UserModel = {
  findById: jest.fn(),
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const ProjectModel = {
  findById: jest.fn(),
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const ChatModel = {
  findById: jest.fn(),
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const VideoModel = {
  findById: jest.fn(),
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const ChannelModel = {
  findById: jest.fn(),
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};
