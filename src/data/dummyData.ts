import { Batch, Test, TestResult, DashboardStats } from '../types';

export const dashboardStats: DashboardStats = {
  totalStudents: 1247,
  totalTests: 89,
  activeBatches: 12,
  averageScore: 78.5
};

export const batches: Batch[] = [
  {
    id: '1',
    name: 'React Fundamentals',
    description: 'Learn the basics of React development',
    students: 45,
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Advanced JavaScript',
    description: 'Deep dive into JavaScript concepts',
    students: 32,
    createdAt: '2024-01-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'TypeScript Mastery',
    description: 'Master TypeScript for better development',
    students: 28,
    createdAt: '2024-01-25',
    status: 'inactive'
  }
];

export const tests: Test[] = [
  {
    id: '1',
    title: 'React Hooks Quiz',
    description: 'Test your knowledge of React hooks',
    duration: 60,
    totalQuestions: 25,
    batch: 'React Fundamentals',
    createdAt: '2024-01-16',
    status: 'published'
  },
  {
    id: '2',
    title: 'JavaScript ES6+ Features',
    description: 'Modern JavaScript features assessment',
    duration: 45,
    totalQuestions: 20,
    batch: 'Advanced JavaScript',
    createdAt: '2024-01-22',
    status: 'published'
  },
  {
    id: '3',
    title: 'TypeScript Basics',
    description: 'Fundamental TypeScript concepts',
    duration: 30,
    totalQuestions: 15,
    batch: 'TypeScript Mastery',
    createdAt: '2024-01-26',
    status: 'draft'
  }
];

export const testResults: TestResult[] = [
  {
    id: '1',
    testId: '1',
    studentId: 's1',
    studentName: 'Alice Johnson',
    score: 85,
    totalScore: 100,
    completedAt: '2024-01-17T10:30:00Z',
    duration: 45
  },
  {
    id: '2',
    testId: '1',
    studentId: 's2',
    studentName: 'Bob Smith',
    score: 92,
    totalScore: 100,
    completedAt: '2024-01-17T11:15:00Z',
    duration: 52
  },
  {
    id: '3',
    testId: '2',
    studentId: 's3',
    studentName: 'Carol Davis',
    score: 78,
    totalScore: 100,
    completedAt: '2024-01-23T14:20:00Z',
    duration: 38
  }
];

export const chartData = [
  { month: 'Jan', tests: 12, students: 180 },
  { month: 'Feb', tests: 15, students: 220 },
  { month: 'Mar', tests: 18, students: 280 },
  { month: 'Apr', tests: 22, students: 320 },
  { month: 'May', tests: 28, students: 380 },
  { month: 'Jun', tests: 32, students: 420 }
];

export const scoreDistribution = [
  { range: '0-20', count: 5 },
  { range: '21-40', count: 12 },
  { range: '41-60', count: 28 },
  { range: '61-80', count: 45 },
  { range: '81-100', count: 67 }
];