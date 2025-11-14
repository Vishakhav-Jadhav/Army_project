export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
}

export interface Batch {
  id: string;
  name: string;
  description: string;
  students: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  batch: string;
  createdAt: string;
  status: 'draft' | 'published' | 'completed';
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalScore: number;
  completedAt: string;
  duration: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTests: number;
  activeBatches: number;
  averageScore: number;
}