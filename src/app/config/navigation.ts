import {
  BookOpen,
  CheckSquare,
  ClipboardList,
  Cpu,
  Edit3,
  Send,
  TrendingUp,
  Upload,
  Zap,
} from 'lucide-react';

import type {LucideIcon} from 'lucide-react';

export type PageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface NavigationItem {
  readonly id: PageId;
  readonly label: string;
  readonly icon: LucideIcon;
}

export interface NavigationSection {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly items: readonly NavigationItem[];
}

export interface PageMetadata {
  readonly title: string;
  readonly breadcrumbs: readonly string[];
}

export const NAVIGATION_SECTIONS: readonly NavigationSection[] = [
  {
    id: 'assignment',
    label: '作业设计与管理',
    icon: BookOpen,
    items: [
      {id: 1, label: '作业管理', icon: BookOpen},
      {id: 2, label: 'AI 生成作业', icon: Zap},
      {id: 3, label: '审阅与修改', icon: Edit3},
      {id: 4, label: '发布与打印', icon: Send},
    ],
  },
  {
    id: 'grading',
    label: '智能批改',
    icon: CheckSquare,
    items: [
      {id: 5, label: '上传学生作业', icon: Upload},
      {id: 6, label: 'AI 批改进度', icon: Cpu},
      {id: 7, label: '教师审核', icon: CheckSquare},
      {id: 8, label: '批改结果', icon: ClipboardList},
    ],
  },
  {
    id: 'analytics',
    label: '学情分析',
    icon: TrendingUp,
    items: [{id: 9, label: '学情分析', icon: TrendingUp}],
  },
];

export const PAGE_METADATA: Readonly<Record<PageId, PageMetadata>> = {
  1: {title: '作业管理', breadcrumbs: ['AI 教师助手', '作业管理']},
  2: {title: 'AI 生成作业', breadcrumbs: ['AI 教师助手', 'AI 生成作业']},
  3: {title: '审阅与修改', breadcrumbs: ['AI 教师助手', '审阅与修改']},
  4: {title: '发布与打印', breadcrumbs: ['AI 教师助手', '发布与打印']},
  5: {title: '上传学生作业', breadcrumbs: ['AI 教师助手', '智能批改', '上传学生作业']},
  6: {title: 'AI 批改进度', breadcrumbs: ['AI 教师助手', '智能批改', 'AI 批改进度']},
  7: {title: '教师审核', breadcrumbs: ['AI 教师助手', '智能批改', '教师审核']},
  8: {title: '批改结果', breadcrumbs: ['AI 教师助手', '智能批改', '批改结果']},
  9: {title: '学情分析', breadcrumbs: ['AI 教师助手', '学情分析']},
};
