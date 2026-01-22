export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  joinedAt: string;
}

export interface Script {
  id: string;
  userId: string;
  title: string;
  genre: string;
  tone: string;
  language: string;
  scriptType: string;
  aiModelUsed: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
}

export interface Scene {
  id: string;
  scriptId: string;
  sceneNumber: number;
  title: string;
  location: string;
  timeOfDay: 'Day' | 'Night' | string;
  description: string;
  dialogue: string;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}
