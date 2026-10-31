export interface Chapter {
  title: string;
  url?: string | null;
  notes_en?: string | null;
  notes_hi?: string | null;
  quiz?: string | null;
  handwritten?: string | null;
}

export interface WeeklyTest {
  title: string;
  quiz?: string | null;
  url?: string | null;
  notes_en?: string | null;
  notes_hi?: string | null;
  handwritten?: string | null;
}

export interface Subject {
  name: string;
  CHAPTERS: Chapter[];
  "WEEKLY TESTS": WeeklyTest[];
}

export interface Course {
  name: string;
  teacher: string;
  subjects: Subject[];
}

export interface NotificationItem {
  tag: string;
  message: string;
  date: string;
}

export interface AppData {
  courses: Course[];
  notifications: NotificationItem[];
}
