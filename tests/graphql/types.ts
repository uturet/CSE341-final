// GraphQL Response Types for Tests

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

// Auth Types
export interface VerifyTokenResponse {
  verifyToken: {
    success: boolean;
    message: string;
    user?: {
      id: string;
      email: string;
    };
  };
}

export interface MeResponse {
  me: {
    success: boolean;
    message: string;
    user?: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface GoogleAuthResponse {
  googleAuth: {
    success: boolean;
    token?: string;
    message: string;
    user?: {
      id: string;
      email: string;
    };
  };
}

export interface RefreshTokenResponse {
  refreshToken: {
    success: boolean;
    token?: string;
    message: string;
  };
}

// User Types
export interface UserResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface CreateUserResponse {
  createUser: {
    id: string;
    email: string;
  };
}

export interface UpdateUserResponse {
  updateUser: {
    email: string;
  };
}

export interface DeleteUserResponse {
  deleteUser: string;
}

// Project Types
export interface ProjectResponse {
  project: {
    id: string;
    title: string;
    description?: string;
  };
}

export interface ProjectsResponse {
  projects: Array<{
    id: string;
    title: string;
  }>;
}

export interface CreateProjectResponse {
  createProject: {
    id: string;
    title: string;
    description?: string;
  };
}

export interface UpdateProjectResponse {
  updateProject: {
    title: string;
  };
}

export interface DeleteProjectResponse {
  deleteProject: string;
}

// Chat Types
export interface ChatResponse {
  chat: {
    id: string;
    title: string;
  };
}

export interface CreateChatResponse {
  createChat: {
    id: string;
    title: string;
  };
}

export interface UpdateChatResponse {
  updateChat: {
    title: string;
  };
}

export interface DeleteChatResponse {
  deleteChat: string;
}

// Channel Types
export interface ChannelResponse {
  channel: {
    id: string;
    ytChannelId: string;
  };
}

export interface CreateChannelResponse {
  createChannel: {
    name: string;
    ytChannelId: string;
  };
}

export interface UpdateChannelResponse {
  updateChannel: {
    name: string;
  };
}

export interface DeleteChannelResponse {
  deleteChannel: string;
}

// Video Types
export interface VideoResponse {
  video: {
    id: string;
    ytVideoId: string;
  };
}

export interface CreateVideoResponse {
  createVideo: {
    ytVideoId: string;
    title: string;
  };
}

export interface UpdateVideoResponse {
  updateVideo: {
    title: string;
  };
}

export interface DeleteVideoResponse {
  deleteVideo: string;
}