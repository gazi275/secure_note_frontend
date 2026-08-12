export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  interests: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  user: string | { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface GroupedInterest {
  interest: string;
  userCount: number;
  users: Array<{ _id: string; name: string; email: string; role: string }>;
}

export interface UserPostsAggregation {
  _id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  totalPosts: number;
  posts: Post[];
}
