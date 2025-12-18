const chain = {
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn(),
};

export const UserModel = {
  findById: jest.fn(),
  findOne: jest.fn(), // Added for auth checks
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const ProjectModel = {
  findById: jest.fn(),
  findOne: jest.fn(), // Added for consistency
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const ChatModel = {
  findById: jest.fn(),
  findOne: jest.fn(), // Added for consistency
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const VideoModel = {
  findById: jest.fn(),
  findOne: jest.fn(), // Added for consistency
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const ChannelModel = {
  findById: jest.fn(),
  findOne: jest.fn(), // Added for consistency
  find: jest.fn(() => chain),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};