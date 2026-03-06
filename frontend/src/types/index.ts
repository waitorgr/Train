export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin";
  phone?: string | null;
}

export interface CourseItem {
  id: number;
  course: number;
  title: string;
  item_type: "video" | "text" | "test";
  order: number;
  text_lesson?: {
    id: number;
    content: string;
  };
  video_lesson?: {
    id: number;
    video_url: string;
    description: string;
  };
}

export interface Course {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  duration_hours: number;
  teacher: number;
  teacher_username: string;
  created_by: number | null;
  items: CourseItem[];
}

export interface Certificate {
  id: number;
  student: number;
  course: number;
  course_title: string;
  certificate_number: string;
  issued_at: string;
}

export interface AnswerOption {
  id: number;
  question: number;
  text: string;
  is_correct?: boolean;
}

export interface Question {
  id: number;
  test: number;
  text: string;
  options: AnswerOption[];
}

export interface TestData {
  id: number;
  course: number;
  course_item: number | null;
  title: string;
  description: string;
  passing_score: number;
  created_by: number;
  questions: Question[];
}