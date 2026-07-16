import { useState, useEffect } from "react";
import {
  BookOpen, Zap, Edit3, Send, Upload, Cpu, CheckSquare, ClipboardList,
  TrendingUp, ChevronRight, Plus, Printer, BarChart2, Clock,
  AlertCircle, X, FileText, Users, Download, RefreshCw, Search, Bell,
  Settings, Check, XCircle, AlertTriangle, Filter,
  Award, MoreHorizontal, Star, User, ArrowLeft, Info, Bookmark, ChevronDown,
  LayoutTemplate, Eye, PenLine, Save
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── 基础配置 ───────────────────────────────────────────────────────────────

const SB_BG = "#061d34";
const SB_ACTIVE = "#0f3460";
const SB_HOVER = "#0d2a4a";
const PRIMARY = "#2f7df6";

const NAV_GROUPS = [
  {
    label: "作业流程",
    items: [
      { id: 1, label: "作业管理", icon: BookOpen },
      { id: 2, label: "AI 生成作业", icon: Zap },
      { id: 3, label: "审阅 / 修改", icon: Edit3 },
      { id: 4, label: "发布 / 打印", icon: Send },
    ],
  },
  {
    label: "批改流程",
    items: [
      { id: 5, label: "PDF 上传确认", icon: Upload },
      { id: 6, label: "AI 批改进度", icon: Cpu },
      { id: 7, label: "教师审核", icon: CheckSquare },
      { id: 8, label: "批改结果确认", icon: ClipboardList },
    ],
  },
  {
    label: "统计报表",
    items: [{ id: 9, label: "学情分析", icon: TrendingUp }],
  },
];

const PAGE_META: Record<number, { title: string; crumbs: string[] }> = {
  1: { title: "作业管理", crumbs: ["首页", "作业管理"] },
  2: { title: "AI 生成作业", crumbs: ["首页", "作业管理", "AI 生成"] },
  3: { title: "审阅 / 修改", crumbs: ["首页", "作业管理", "审阅修改"] },
  4: { title: "发布 / 打印", crumbs: ["首页", "作业管理", "发布打印"] },
  5: { title: "PDF 上传确认", crumbs: ["首页", "批改流程", "PDF 上传"] },
  6: { title: "AI 批改进度", crumbs: ["首页", "批改流程", "AI 批改中"] },
  7: { title: "教师审核", crumbs: ["首页", "批改流程", "教师审核"] },
  8: { title: "批改结果确认", crumbs: ["首页", "批改流程", "结果确认"] },
  9: { title: "学情分析", crumbs: ["首页", "统计报表", "学情分析"] },
};

// ─── 原型演示数据 ─────────────────────────────────────────────────────────────

const ASSIGNMENTS = [
  { id: 1, name: "第六单元 解决问题专项练习", grade: "六年级", subject: "数学", cls: "六(3)班", createDate: "2025-01-08", publishStatus: "已发布", pdfStatus: "已上传", gradeStatus: "已批改", actionHint: "已发布且已批改：可查看批改与学情。" },
  { id: 2, name: "Unit 4 Reading Comprehension", grade: "六年级", subject: "英语", cls: "六(1)班", createDate: "2025-01-09", publishStatus: "未发布", pdfStatus: "未上传", gradeStatus: "未批改", actionHint: "未发布：继续创建；未上传：发布后上传 PDF。" },
  { id: 3, name: "古诗词赏析与默写", grade: "五年级", subject: "语文", cls: "五(2)班", createDate: "2025-01-07", publishStatus: "已发布", pdfStatus: "已上传", gradeStatus: "批改中", actionHint: "批改中：等待 AI 批改完成后审核。" },
  { id: 4, name: "光合作用与植物生长探究", grade: "五年级", subject: "科学", cls: "五(1)班", createDate: "2025-01-10", publishStatus: "未发布", pdfStatus: "未上传", gradeStatus: "未批改", actionHint: "草稿作业：先继续创建并确认发布。" },
  { id: 5, name: "第二章 速度与加速度计算", grade: "八年级", subject: "物理", cls: "八(2)班", createDate: "2025-01-06", publishStatus: "已发布", pdfStatus: "已上传", gradeStatus: "已批改", actionHint: "已完成：支持查看批改结果和学情分析。" },
];

const STUDENTS = [
  { id: 1, name: "张小明", totalScore: 15, status: "待审核" },
  { id: 2, name: "李梅梅", totalScore: 14, status: "待审核" },
  { id: 3, name: "王大力", totalScore: 10, status: "待审核" },
  { id: 4, name: "陈思思", totalScore: 18, status: "已审核" },
  { id: 5, name: "刘小红", totalScore: 13, status: "待审核" },
  { id: 6, name: "赵磊", totalScore: 16, status: "待审核" },
  { id: 7, name: "孙晓东", totalScore: 19, status: "待审核" },
  { id: 8, name: "周薇", totalScore: 8, status: "待审核" },
  { id: 9, name: "黄建国", totalScore: 16, status: "待审核" },
  { id: 10, name: "吴静静", totalScore: 15, status: "待审核" },
];

const STUDENT_QUESTION_SCORES: Record<number, Record<number, number>> = {
  1: { 1: 5, 2: 2, 3: 5, 4: 3 },
  2: { 1: 4, 2: 3, 3: 4, 4: 3 },
  3: { 1: 3, 2: 2, 3: 3, 4: 2 },
  4: { 1: 5, 2: 4, 3: 5, 4: 4 },
  5: { 1: 4, 2: 2, 3: 4, 4: 3 },
  6: { 1: 5, 2: 3, 3: 5, 4: 3 },
  7: { 1: 5, 2: 5, 3: 5, 4: 4 },
  8: { 1: 2, 2: 1, 3: 3, 4: 2 },
  9: { 1: 5, 2: 3, 3: 4, 4: 4 },
  10: { 1: 4, 2: 3, 3: 5, 4: 3 },
};

const QUESTIONS = [
  {
    id: 1, title: "第1题（解决问题）", maxScore: 5, aiScore: 5, aiCorrect: true,
    content: "李老师为元旦联欢会准备奖品，买了玩具魔方和玩具熊各 30 个。李老师买玩具熊比买玩具魔方多花了多少钱？",
    answer: "21×30=630（元），18×30=540（元），630-540=90（元）。",
    aiReason: "列式和计算正确，能够根据原卷中的单价求出两类奖品总价差，得 5 分。",
    studentAnswer: "21×30=630元，18×30=540元，630-540=90元。",
  },
  {
    id: 2, title: "第2题（解决问题）", maxScore: 5, aiScore: 2, aiCorrect: false,
    content: "王老师领到 250 本练习本，平均分发给班上 40 名同学，还剩 10 本。每名同学分得几本练习本？",
    answer: "250-10=240（本），240÷40=6（本）。",
    aiReason: "先减去剩余练习本的步骤正确，但原卷中将 240÷40 计算为 8，结果错误，得 2 分。",
    studentAnswer: "250-10=240本，240÷40=8本。",
  },
  {
    id: 3, title: "第3题（解决问题）", maxScore: 5, aiScore: 5, aiCorrect: true,
    content: "王帆一家周末去科技馆参观，他们 15 分钟走了 1020 米。照这样的速度，他们还要走 5 分钟才能到达科技馆，王帆家离科技馆有多远？",
    answer: "1020÷15=68（米），68×5=340（米），1020+340=1360（米）。",
    aiReason: "速度、剩余路程和总路程三个步骤均正确，原卷答案为 1360 米，得 5 分。",
    studentAnswer: "1020÷15=68米，68×5=340米，1020+340=1360米。",
  },
  {
    id: 4, title: "第4题（解决问题）", maxScore: 5, aiScore: 3, aiCorrect: false,
    content: "早晨去学校上学，乐乐每分钟走 60 米，平平为了跟乐乐同时到达学校，比乐乐早 4 分钟出发。平平每分钟必须比乐乐多走多少米，才能同时到达学校？",
    answer: "720÷60=12（分），12+4=16（分），1440÷16=90（米），90-60=30（米）。",
    aiReason: "原卷前面求时间和速度的思路基本正确，但最后写成 90×4=360，未求出每分钟速度差 30 米，得 3 分。",
    studentAnswer: "720÷60=12分，12+4=16分，1440÷16=90米，90×4=360米。",
  },
];

const SCORE_DIST_DATA = [
  { range: "18-20", count: 2 },
  { range: "16-17", count: 3 },
  { range: "14-15", count: 2 },
  { range: "12-13", count: 2 },
  { range: "12以下", count: 1 },
];

const KNOWLEDGE_DATA = [
  { name: "整数乘除法应用", score: 85 },
  { name: "多步骤应用题", score: 52 },
  { name: "速度时间路程", score: 78 },
  { name: "数量关系", score: 48 },
  { name: "读图分析", score: 90 },
  { name: "计算准确性", score: 88 },
];

const ERROR_PIE_DATA = [
  { name: "计算错误", value: 35 },
  { name: "概念混淆", value: 28 },
  { name: "步骤遗漏", value: 22 },
  { name: "审题不清", value: 15 },
];

const PIE_COLORS = ["#2f7df6", "#f59e0b", "#10b981", "#ef4444"];

const PDF_STATUS_SUMMARY = [
  { label: "待上传 PDF", value: 2, icon: Upload, colorClass: "text-amber-500 bg-amber-50" },
  { label: "已上传 PDF", value: 3, icon: FileText, colorClass: "text-green-500 bg-green-50" },
  { label: "上传异常", value: 1, icon: AlertTriangle, colorClass: "text-red-500 bg-red-50" },
  { label: "待批改", value: 2, icon: Cpu, colorClass: "text-blue-500 bg-blue-50" },
];

const ASSIGNMENT_SUMMARY = {
  total: 24,
  published: 18,
  unpublished: 6,
  graded: 15,
};

const TEXTBOOK_OPTIONS = ["人教版上册", "人教版下册", "北师大版上册", "苏教版上册", "官方练习册"];
const HOMEWORK_TYPES = ["平时作业", "假期作业", "分层作业", "练习册页码任务"];
const DIFFICULTY_OPTIONS = ["基础巩固", "中等综合", "拔高拓展", "分层混合"];

// ─── 通用组件 ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  "已批改": "bg-green-100 text-green-700 border-green-200",
  "已发布": "bg-blue-100 text-blue-700 border-blue-200",
  "批改中": "bg-amber-100 text-amber-700 border-amber-200",
  "待审核": "bg-violet-100 text-violet-700 border-violet-200",
  "草稿": "bg-gray-100 text-gray-500 border-gray-200",
  "已上传": "bg-green-100 text-green-700 border-green-200",
  "未上传": "bg-gray-100 text-gray-400 border-gray-200",
  "未发布": "bg-gray-100 text-gray-400 border-gray-200",
  "未批改": "bg-gray-100 text-gray-400 border-gray-200",
  "已审核": "bg-green-100 text-green-700 border-green-200",
};

function Badge({ text }: { text: string }) {
  const cls = STATUS_STYLES[text] || "bg-gray-100 text-gray-500 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {text}
    </span>
  );
}

interface BtnProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "xs" | "sm" | "md";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}
function Btn({ children, variant = "primary", size = "sm", onClick, className = "", disabled = false, icon }: BtnProps) {
  const sizes = { xs: "px-2 py-1 text-xs gap-1", sm: "px-3 py-1.5 text-sm gap-1.5", md: "px-4 py-2 text-sm gap-2" };
  const baseStyle = `inline-flex items-center rounded-md font-medium transition-all ${sizes[size]} ${className}`;

  const variantClass =
    variant === "secondary" ? "bg-white border border-[rgba(0,0,0,0.1)] text-[#0f1629] hover:bg-gray-50" :
    variant === "ghost" ? "text-[#0f1629] hover:bg-gray-100" :
    variant === "danger" ? "bg-red-500 text-white hover:bg-red-600" : "";

  if (variant === "primary") {
    return (
      <button
        className={`${baseStyle} text-white disabled:opacity-40`}
        style={{ background: disabled ? "#93bbf8" : PRIMARY }}
        onClick={onClick}
        disabled={disabled}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </button>
    );
  }
  return (
    <button className={`${baseStyle} ${variantClass}`} onClick={onClick} disabled={disabled}>
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}

interface SCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  noPad?: boolean;
}
function SCard({ children, className = "", title, extra, noPad = false }: SCardProps) {
  return (
    <div className={`bg-white border border-[rgba(0,0,0,0.08)] rounded-lg overflow-hidden ${className}`}>
      {(title || extra) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.07)]">
          {title && <div className="text-sm font-semibold text-[#0f1629]">{title}</div>}
          {extra && <div className="text-sm">{extra}</div>}
        </div>
      )}
      <div className={noPad ? "" : "p-4"}>{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorClass?: string;
  delta?: string;
}
function StatCard({ label, value, icon: Icon, colorClass = "text-blue-500 bg-blue-50", delta }: StatCardProps) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon size={17} />
        </div>
        {delta && <span className="text-xs text-green-600 font-medium">{delta}</span>}
      </div>
      <div className="text-2xl font-bold text-[#0f1629] mb-0.5 font-mono">{value}</div>
      <div className="text-xs text-[#6b7a99]">{label}</div>
    </div>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-semibold text-[#6b7a99] uppercase tracking-widest mb-2">{children}</div>;
}

function TInput({ placeholder = "", className = "", defaultValue = "", value, onChange, type = "text" }: {
  placeholder?: string; className?: string; defaultValue?: string; value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
}) {
  const props = value !== undefined ? { value, onChange } : { defaultValue };
  return (
    <input
      type={type}
      className={`border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] placeholder:text-[#6b7a99]/60 focus:outline-none focus:ring-1 focus:ring-[#2f7df6] ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
}

function TSelect({ options, className = "" }: { options: string[]; className?: string }) {
  return (
    <select className={`border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6] ${className}`}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function ProgBar({ value, max, color = PRIMARY }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// ─── 侧边导航 ────────────────────────────────────────────────────────────────

function Sidebar({ current, onNav }: { current: number; onNav: (p: number) => void }) {
  return (
    <aside className="w-48 flex-shrink-0 flex flex-col overflow-hidden" style={{ background: SB_BG }}>
      <div className="flex items-center gap-2.5 h-14 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: PRIMARY }}>
          <BookOpen size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold text-white tracking-tight">AI 教师助手</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <div
              className="px-4 text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all text-left relative"
                  style={{
                    background: active ? SB_ACTIVE : undefined,
                    color: active ? "#ffffff" : "rgba(255,255,255,0.55)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = SB_HOVER;
                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "";
                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                  }}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: PRIMARY }} />
                  )}
                  <item.icon size={14} style={{ color: active ? PRIMARY : undefined }} />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: PRIMARY }}
          >
            王
          </div>
          <div>
            <div className="text-xs font-semibold text-white">王老师</div>
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>六年级数学</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AppHeader({ page }: { page: number }) {
  const meta = PAGE_META[page] || { title: "", crumbs: [] };
  return (
    <header className="h-14 bg-white border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <div className="flex items-center gap-1 text-xs text-[#6b7a99] mb-0.5">
          {meta.crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={10} />}
              <span>{c}</span>
            </span>
          ))}
        </div>
        <h2 className="text-sm font-bold text-[#0f1629]">{meta.title}</h2>
      </div>
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7a99] hover:bg-gray-100 transition-colors">
          <Search size={15} />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7a99] hover:bg-gray-100 transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7a99] hover:bg-gray-100 transition-colors">
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}

// ─── 页面 1：作业管理 ─────────────────────────────────────────────────────────

function Page1({ onNav }: { onNav: (p: number) => void }) {
  return (
    <div className="space-y-5">
      

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="作业总数" value={ASSIGNMENT_SUMMARY.total} icon={FileText} colorClass="text-blue-500 bg-blue-50" delta="+3 本月" />
        <StatCard label="已发布" value={ASSIGNMENT_SUMMARY.published} icon={Send} colorClass="text-green-500 bg-green-50" />
        <StatCard label="未发布" value={ASSIGNMENT_SUMMARY.unpublished} icon={Edit3} colorClass="text-amber-500 bg-amber-50" />
        <StatCard label="已批改" value={ASSIGNMENT_SUMMARY.graded} icon={CheckSquare} colorClass="text-violet-500 bg-violet-50" />
      </div>

      <SCard
        title="PDF 状态"
        extra={<span className="text-xs text-[#6b7a99]">上传后进入 AI 批改流程</span>}
      >
        <div className="grid grid-cols-4 gap-3">
          {PDF_STATUS_SUMMARY.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              icon={item.icon}
              colorClass={item.colorClass}
            />
          ))}
        </div>
      </SCard>
      

      <SCard
        title="作业列表"
        extra={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 border border-[rgba(0,0,0,0.1)] rounded-md px-2.5 py-1.5 text-sm text-[#6b7a99] bg-white">
              <Search size={13} />
              <input
                className="outline-none text-sm w-32 bg-transparent placeholder:text-[#6b7a99]/60 text-[#0f1629]"
                placeholder="搜索作业名称…"
              />
            </div>
            <Btn variant="secondary" size="sm" icon={<Filter size={12} />}>筛选</Btn>
            <Btn variant="primary" size="sm" onClick={() => onNav(2)} icon={<Plus size={13} />}>新建作业</Btn>
          </div>
        }
        noPad
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.07)] bg-gray-50/80">
                {["作业名称", "年级 / 学科", "班级", "创建时间", "发布状态", "PDF状态", "批改状态", "操作 / 显示条件"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
              {ASSIGNMENTS.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#0f1629] group-hover:text-[#2f7df6] transition-colors">{a.name}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#6b7a99]">
                    {a.grade} · {a.subject}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#6b7a99]">{a.cls}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#6b7a99] font-mono text-xs">{a.createDate}</td>
                  <td className="px-4 py-3"><Badge text={a.publishStatus} /></td>
                  <td className="px-4 py-3"><Badge text={a.pdfStatus} /></td>
                  <td className="px-4 py-3"><Badge text={a.gradeStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-0.5 flex-wrap">
                      {a.publishStatus === "未发布" && (
                        <button onClick={() => onNav(2)} className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50 font-medium transition-colors">
                          继续创建
                        </button>
                      )}
                      {a.publishStatus === "未发布" && (
                        <button onClick={() => onNav(3)} className="text-xs px-2 py-1 rounded text-violet-600 hover:bg-violet-50 font-medium transition-colors">审阅</button>
                      )}
                      {a.publishStatus === "已发布" && (
                        <button onClick={() => onNav(4)} className="text-xs px-2 py-1 rounded text-green-600 hover:bg-green-50 font-medium transition-colors">查看发布</button>
                      )}
                      {a.publishStatus === "已发布" && a.pdfStatus === "未上传" && (
                        <button onClick={() => onNav(5)} className="text-xs px-2 py-1 rounded text-amber-600 hover:bg-amber-50 font-medium transition-colors">上传PDF</button>
                      )}
                      {a.gradeStatus === "批改中" && (
                        <button onClick={() => onNav(6)} className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50 font-medium transition-colors">查看进度</button>
                      )}
                      {a.gradeStatus === "已批改" && (
                        <>
                          <button onClick={() => onNav(7)} className="text-xs px-2 py-1 rounded text-indigo-600 hover:bg-indigo-50 font-medium transition-colors">查看批改</button>
                          <button onClick={() => onNav(9)} className="text-xs px-2 py-1 rounded text-teal-600 hover:bg-teal-50 font-medium transition-colors">学情</button>
                        </>
                      )}
                      </div>
                      <span className="text-[10px] text-[#6b7a99] leading-snug">{a.actionHint}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between text-xs text-[#6b7a99]">
          <span>共 {ASSIGNMENTS.length} 条</span>
          <div className="flex items-center gap-1.5">
            <button className="px-2.5 py-1 rounded border border-[rgba(0,0,0,0.1)] hover:bg-gray-50 text-xs transition-colors">上一页</button>
            <span className="px-2.5 py-1 rounded text-white text-xs font-medium" style={{ background: PRIMARY }}>1</span>
            <button className="px-2.5 py-1 rounded border border-[rgba(0,0,0,0.1)] hover:bg-gray-50 text-xs transition-colors">下一页</button>
          </div>
        </div>
      </SCard>
    </div>
  );
}

// ─── 页面 2：AI 生成作业数据 ──────────────────────────────────────────────────

const LEVELS = ["小学", "初中", "高中"];
const LEVEL_GRADES: Record<string, string[]> = {
  "小学": ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"],
  "初中": ["初一", "初二", "初三"],
  "高中": ["高一", "高二", "高三"],
};
const SUBJECTS = ["数学", "物理", "化学", "生物"];

const SUBJECT_UNITS: Record<string, Record<string, string[]>> = {
  "数学": {
    "第六单元 解决问题": ["整数乘除法应用", "速度、时间与路程", "多步骤应用题", "综合解决问题"],
    "第一章 有理数":    ["正负数", "绝对值", "数轴", "有理数加减", "有理数乘除"],
    "第二章 整式":      ["单项式", "多项式", "合并同类项", "去括号", "整式加减"],
    "第三章 一元一次方程": ["方程的概念", "等式性质", "解方程步骤", "列方程解应用题"],
    "第四章 几何图形":  ["点线面体", "角的概念", "平行与垂直", "三角形基础"],
    "第五章 一次函数":  ["函数概念", "坐标系", "一次函数图像", "正比例函数"],
  },
  "物理": {
    "第一章 机械运动":  ["参照物", "速度与匀速运动", "时间与路程", "运动图像"],
    "第二章 声现象":    ["声音产生与传播", "音调音量音色", "噪声控制", "回声"],
    "第三章 光现象":    ["光的直线传播", "反射定律", "折射现象", "平面镜成像"],
    "第四章 力与运动":  ["力的概念", "弹力与摩擦力", "牛顿第一定律", "二力平衡"],
    "第五章 电路基础":  ["电荷与电流", "电路连接", "欧姆定律", "电功率"],
  },
  "化学": {
    "第一章 物质与变化": ["物理变化与化学变化", "混合物与纯净物", "元素符号"],
    "第二章 化学反应":   ["质量守恒定律", "化学方程式配平", "反应类型"],
    "第三章 酸碱盐":     ["酸的性质", "碱的性质", "中和反应", "盐的溶解性"],
    "第四章 氧化还原":   ["氧化还原概念", "化合价变化", "常见氧化剂还原剂"],
    "第五章 金属与非金属": ["金属活动性顺序", "金属与酸反应", "非金属氧化物"],
  },
  "生物": {
    "第一章 细胞":      ["细胞结构", "细胞膜功能", "细胞分裂", "细胞分化"],
    "第二章 生物体结构": ["组织类型", "器官与系统", "植物体结构", "动物体结构"],
    "第三章 遗传与进化": ["DNA与基因", "遗传规律", "变异类型", "生物进化"],
    "第四章 生态系统":  ["食物链与食物网", "能量流动", "物质循环", "生态平衡"],
    "第五章 生理调节":  ["神经调节", "激素调节", "免疫系统", "稳态与调节"],
  },
};

const SUBJECT_TYPES: Record<string, string[]> = {
  "数学": ["解决问题", "计算题", "填空题", "选择题"],
  "物理": ["选择题", "填空题", "计算题", "实验题"],
  "化学": ["选择题", "填空题", "推断题", "实验题", "计算题"],
  "生物": ["选择题", "填空题", "简答题", "实验分析题"],
};

// ─── 页面 2 共用：作业素材来源 ───────────────────────────────────────────────
function SourcePanel({ activeSource, setActiveSource }: { activeSource: number; setActiveSource: (i: number) => void }) {
  const sources = ["教学目标", "历史课件", "知识点清单", "往期教案", "教材内容"];
  return (
    <>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {sources.map((s, i) => (
          <button
            key={s}
            onClick={() => setActiveSource(i)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeSource === i ? "text-white shadow-sm" : "bg-[#f0f2f6] text-[#6b7a99] hover:bg-gray-200"
            }`}
            style={activeSource === i ? { background: PRIMARY } : undefined}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-xl p-4 bg-gray-50/60 min-h-[100px]">
        {activeSource === 0 && (
          <textarea
            className="w-full h-24 resize-none border border-[rgba(0,0,0,0.1)] rounded-md p-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
            placeholder="输入教学目标，例如：能够提取数量关系，并用整数乘除法解决生活中的多步骤问题…"
          />
        )}
        {activeSource === 1 && (
          <div className="text-[#6b7a99] text-sm text-center space-y-2 py-3">
            <Upload size={24} className="mx-auto opacity-40" />
            <p>拖拽课件文件到此处，或<span className="cursor-pointer" style={{ color: PRIMARY }}>点击上传</span></p>
            <p className="text-xs opacity-70">支持 .pptx .pdf .docx，最大 50MB</p>
          </div>
        )}
        {activeSource === 2 && (
          <textarea
            className="w-full h-24 resize-none border border-[rgba(0,0,0,0.1)] rounded-md p-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
            defaultValue={"1. 整数乘除法应用\n2. 速度、时间与路程\n3. 多步骤数量关系"}
          />
        )}
        {activeSource === 3 && (
          <div className="text-[#6b7a99] text-sm text-center py-4 space-y-2">
            <FileText size={22} className="mx-auto opacity-40" />
            <p>上传往期教案，或<span className="cursor-pointer" style={{ color: PRIMARY }}>从资源库选择</span></p>
          </div>
        )}
        {activeSource === 4 && (
          <div className="flex gap-3">
            <TSelect options={["人教版", "北师大版", "苏教版"]} className="flex-1" />
            <TInput placeholder="搜索章节…" className="flex-1" />
          </div>
        )}
      </div>
    </>
  );
}

// 页面 2：AI 作业生成
type QuestionItem = { id: number; unit: string; kp: string; type: string; scope: string };
function Page2({ onNav }: { onNav: (p: number) => void }) {
  const [mode, setMode] = useState<"batch" | "perq">("batch");

  // 学段、年级、学科会影响章节、知识点和题型列表。
  const [selectedLevel, setSelectedLevel] = useState("小学");
  const [selectedGrade, setSelectedGrade] = useState("六年级");
  const [selectedSubject, setSelectedSubject] = useState("数学");

  const grades = LEVEL_GRADES[selectedLevel] || [];
  const subjectUnits = SUBJECT_UNITS[selectedSubject] || {};
  const unitList = Object.keys(subjectUnits);
  const subjectTypes = SUBJECT_TYPES[selectedSubject] || ["选择题", "填空题", "解答题"];

  // 批量生成模式状态。
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSource, setActiveSource] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(unitList[0] || "");
  const [selectedKPs, setSelectedKPs] = useState<string[]>([]);
  const [typeQty, setTypeQty] = useState<Record<string, number>>({ 解决问题: 4, 计算题: 0, 填空题: 0, 选择题: 0 });
  const [selectedTextbook, setSelectedTextbook] = useState(TEXTBOOK_OPTIONS[0]);
  const [homeworkType, setHomeworkType] = useState(HOMEWORK_TYPES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_OPTIONS[1]);
  const unitKPs = subjectUnits[selectedUnit] || [];

  // 切换学科后，重置依赖当前学科的章节、知识点和题型数量。
  function handleSubjectChange(s: string) {
    setSelectedSubject(s);
    const newUnits = Object.keys(SUBJECT_UNITS[s] || {});
    const defaultUnit = newUnits[0] || "";
    setSelectedUnit(defaultUnit);
    setSelectedKPs([]);
    const newTypes = SUBJECT_TYPES[s] || [];
    const defaultQty: Record<string, number> = {};
    newTypes.forEach((t, i) => { defaultQty[t] = i < 2 ? 4 : 2; });
    setTypeQty(defaultQty);
  }

  // 逐题添加模式状态。
  const [pqExpandedIds, setPqExpandedIds] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { id: 1, unit: unitList[0] || "", kp: "", type: subjectTypes[0] || "解决问题", scope: "" },
  ]);
  const [pqGenerating, setPqGenerating] = useState(false);
  const [pqProgress, setPqProgress] = useState(0);
  const [pqDone, setPqDone] = useState(false);

  function toggleKP(kp: string) {
    setSelectedKPs((prev) => prev.includes(kp) ? prev.filter((x) => x !== kp) : [...prev, kp]);
  }
  function handleGenerate() {
    setGenerating(true);
    setProgress(0);
    setDone(false);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setGenerating(false);
        setDone(true);
      }
      setProgress(Math.min(100, Math.round(p)));
    }, 200);
  }

  function addQuestion() {
    const id = questions.length + 1;
    setQuestions([...questions, { id, unit: unitList[0] || "", kp: "", type: subjectTypes[0] || "解答题", scope: "" }]);
  }

  function updateQuestion(id: number, field: keyof QuestionItem, value: string) {
    setQuestions(questions.map((q) => q.id === id ? { ...q, [field]: value } : q));
  }

  function removeQuestion(id: number) {
    if (questions.length === 1) return;
    setQuestions(questions.filter((q) => q.id !== id).map((q, i) => ({ ...q, id: i + 1 })));
  }

  function handlePqGenerate() {
    setPqGenerating(true);
    setPqProgress(0);
    setPqDone(false);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setPqGenerating(false);
        setPqDone(true);
      }
      setPqProgress(Math.min(100, Math.round(p)));
    }, 200);
  }

  return (
    <div className="space-y-4">
      {/* 生成模式切换。 */}
      <div className="flex items-center gap-3">
        <div className="flex bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-0.5 gap-0.5">
          {([["batch", "批量生成"], ["perq", "逐题添加"]] as const).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all"
              style={mode === m ? { background: PRIMARY, color: "#fff" } : { color: "#6b7a99" }}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#6b7a99]">
          {mode === "batch" ? "一次性配置参数，AI批量出题" : "逐题配置范围与题型，精准控制每一道题"}
        </span>
      </div>

      {mode === "batch" ? (
        <div className="grid grid-cols-[1fr_340px] gap-5">
          <div className="space-y-4">
            <SCard title="输入来源" extra={<span className="text-xs text-[#6b7a99]">选择参考材料</span>}>
              <SourcePanel activeSource={activeSource} setActiveSource={setActiveSource} />
            </SCard>

            {done && (
              <SCard
                title="AI 生成预览"
                extra={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><Check size={12} />已生成 4 题</span>
                    <Btn variant="primary" size="xs" onClick={() => onNav(3)}>进入审阅 →</Btn>
                  </div>
                }
              >
                <div className="space-y-2.5">
                  {QUESTIONS.map((q) => (
                    <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg border border-[rgba(0,0,0,0.08)] hover:bg-gray-50/60 transition-colors">
                      <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 text-white" style={{ background: PRIMARY }}>{q.id}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">{q.title.match(/（(.+)）/)?.[1] || "题"}</span>
                          <span className="text-xs text-[#6b7a99]">{q.maxScore} 分</span>
                        </div>
                        <p className="text-sm text-[#0f1629] leading-relaxed line-clamp-2">{q.content}</p>
                      </div>
                      <button className="text-[#6b7a99] hover:text-[#0f1629] flex-shrink-0"><MoreHorizontal size={14} /></button>
                    </div>
                  ))}
                </div>
              </SCard>
            )}
          </div>

          <div className="space-y-4">
            <SCard title="配置参数">
              <div className="space-y-4">
                <div>
                  <SLabel>学段 / 年级 / 学科</SLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={selectedLevel}
                      onChange={(e) => { setSelectedLevel(e.target.value); setSelectedGrade(LEVEL_GRADES[e.target.value][0]); }}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {grades.map((g) => <option key={g}>{g}</option>)}
                    </select>
                    <select
                      value={selectedSubject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <SLabel>教材 / 作业类型 / 难度</SLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={selectedTextbook}
                      onChange={(e) => setSelectedTextbook(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {TEXTBOOK_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select
                      value={homeworkType}
                      onChange={(e) => setHomeworkType(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {HOMEWORK_TYPES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {DIFFICULTY_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                  <p className="mt-1.5 text-xs text-[#6b7a99] leading-relaxed">
                    平时作业默认生成完整题目；练习册页码任务可生成“完成第几页第几题”这类文字型作业。
                  </p>
                </div>
                <div>
                  <SLabel>单元 / 章节</SLabel>
                  <select
                    value={selectedUnit}
                    onChange={(e) => { setSelectedUnit(e.target.value); setSelectedKPs([]); }}
                    className="w-full border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                  >
                    {unitList.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <SLabel>知识点（选好单元后自动列出）</SLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {unitKPs.map((kp) => (
                      <button
                        key={kp}
                        onClick={() => toggleKP(kp)}
                        className="px-2 py-1 rounded border text-xs font-medium transition-all"
                        style={selectedKPs.includes(kp) ? { background: PRIMARY, color: "#fff", borderColor: PRIMARY } : { background: "#fff", color: "#6b7a99", borderColor: "rgba(0,0,0,0.1)" }}
                      >
                        {kp}
                      </button>
                    ))}
                  </div>
                  {selectedKPs.length > 0 && <div className="mt-1.5 text-xs text-[#6b7a99]">已选 {selectedKPs.length} 个知识点</div>}
                </div>
                <div>
                  <SLabel>题型及数量</SLabel>
                  <div className="space-y-2">
                    {subjectTypes.map((t) => {
                      const qty = typeQty[t] ?? 0;
                      const active = qty > 0;
                      return (
                        <div
                          key={t}
                          className="flex items-center gap-2 p-2 rounded-lg border transition-all"
                          style={{ borderColor: active ? PRIMARY : "rgba(0,0,0,0.1)", background: active ? "#f0f7ff" : "#fff" }}
                        >
                          <span
                            className="flex-1 text-xs font-semibold"
                            style={{ color: active ? PRIMARY : "#6b7a99" }}
                          >
                            {t}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setTypeQty({ ...typeQty, [t]: Math.max(0, qty - 1) })}
                              className="w-6 h-6 rounded flex items-center justify-center border text-sm font-bold transition-colors hover:bg-gray-100"
                              style={{ borderColor: "rgba(0,0,0,0.12)", color: "#6b7a99" }}
                            >−</button>
                            <span
                              className="w-8 text-center text-sm font-mono font-semibold"
                              style={{ color: active ? PRIMARY : "#6b7a99" }}
                            >{qty}</span>
                            <button
                              onClick={() => setTypeQty({ ...typeQty, [t]: qty + 1 })}
                              className="w-6 h-6 rounded flex items-center justify-center border text-sm font-bold transition-colors hover:bg-gray-100"
                              style={{ borderColor: "rgba(0,0,0,0.12)", color: "#6b7a99" }}
                            >+</button>
                            <span className="text-xs text-[#6b7a99] ml-1 w-4">题</span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="text-xs text-[#6b7a99] pt-0.5">
                      共 {Object.values(typeQty).reduce((a, b) => a + b, 0)} 题
                    </div>
                  </div>
                </div>
              </div>
            </SCard>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md"
              style={{ background: generating ? "#93bbf8" : PRIMARY }}
            >
              {generating ? <><RefreshCw size={15} className="animate-spin" />AI 生成中…</> : <><Zap size={15} />AI 一键生成</>}
            </button>

            {generating && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#6b7a99]">
                  <span>分析知识点并生成题目…</span>
                  <span className="font-mono font-semibold">{progress}%</span>
                </div>
                <ProgBar value={progress} max={100} />
              </div>
            )}

            {done && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
                <Check size={15} className="flex-shrink-0" />
                已生成 4 道解决问题，总分 20 分，请前往审阅确认。
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── 逐题添加模式 ── */
        <div className="grid grid-cols-[1fr_360px] gap-5">
          {/* 左侧：逐题配置列表。 */}
          <div className="space-y-3">
            {questions.map((q) => {
              const kps = subjectUnits[q.unit] || [];
              const expanded = pqExpandedIds.has(q.id);
              function toggleExpand() {
                setPqExpandedIds((prev) => {
                  const next = new Set(prev);
                  next.has(q.id) ? next.delete(q.id) : next.add(q.id);
                  return next;
                });
              }
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white flex-shrink-0"
                          style={{ background: PRIMARY }}
                        >
                          {q.id}
                        </span>
                        <span className="text-sm font-semibold text-[#0f1629]">第 {q.id} 题</span>
                      </div>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#6b7a99] hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <SLabel>单元 / 章节</SLabel>
                        <select
                          value={q.unit}
                          onChange={(e) => updateQuestion(q.id, "unit", e.target.value)}
                          className="w-full border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                        >
                          {unitList.map((u) => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <SLabel>知识点</SLabel>
                        <select
                          value={q.kp}
                          onChange={(e) => updateQuestion(q.id, "kp", e.target.value)}
                          className="w-full border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                        >
                          <option value="">— 选择知识点 —</option>
                          {kps.map((k) => <option key={k}>{k}</option>)}
                        </select>
                      </div>
                      <div>
                        <SLabel>题型</SLabel>
                        <select
                          value={q.type}
                          onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                          className="w-full border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                        >
                          {subjectTypes.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* 单题更多参数开关。 */}
                    <button
                      onClick={toggleExpand}
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color: expanded ? PRIMARY : "#6b7a99" }}
                    >
                      <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                      更多参数
                    </button>
                  </div>

                  {expanded && (
                    <div className="border-t border-[rgba(0,0,0,0.06)] px-4 pb-4 pt-3 space-y-3 bg-gray-50/50">
                      <div>
                        <SLabel>参考题目（PDF）</SLabel>
                        <div
                          className="flex items-center gap-3 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-lg px-4 py-3 cursor-pointer hover:border-[#2f7df6] hover:bg-blue-50/30 transition-all"
                        >
                          <Upload size={16} className="text-[#6b7a99] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#6b7a99]">
                              上传参考题目，<span style={{ color: PRIMARY }}>点击选择 PDF</span>
                            </p>
                            <p className="text-xs text-[#6b7a99] opacity-60 mt-0.5">AI 会参考此题的风格与难度出题</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <SLabel>出题指令</SLabel>
                        <textarea
                          className="w-full h-20 resize-none border border-[rgba(0,0,0,0.1)] rounded-lg p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#2f7df6] leading-relaxed"
                          placeholder="告诉 AI 你希望这道题如何出…&#10;例如：难度中等，需要学生列方程求解，避免纯计算题，结合实际生活场景"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={addQuestion}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[rgba(0,0,0,0.12)] text-[#6b7a99] text-sm font-medium flex items-center justify-center gap-2 hover:border-[#2f7df6] hover:text-[#2f7df6] hover:bg-blue-50/40 transition-all"
            >
              <Plus size={16} />
              添加题目
            </button>

            {pqDone && (
              <SCard
                title="AI 生成预览"
                extra={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><Check size={12} />已生成 {questions.length} 题</span>
                    <Btn variant="primary" size="xs" onClick={() => onNav(3)}>进入审阅 →</Btn>
                  </div>
                }
              >
                <div className="space-y-2.5">
                  {QUESTIONS.slice(0, questions.length).map((q) => (
                    <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg border border-[rgba(0,0,0,0.08)] hover:bg-gray-50/60 transition-colors">
                      <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 text-white" style={{ background: PRIMARY }}>{q.id}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">{q.title.match(/（(.+)）/)?.[1] || "题"}</span>
                        </div>
                        <p className="text-sm text-[#0f1629] leading-relaxed line-clamp-2">{q.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SCard>
            )}
          </div>

          {/* 右侧：全局配置。 */}
          <div className="space-y-4">
            <SCard title="全局配置">
              <div className="space-y-3">
                <div>
                  <SLabel>教材 / 作业类型 / 难度</SLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={selectedTextbook}
                      onChange={(e) => setSelectedTextbook(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {TEXTBOOK_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select
                      value={homeworkType}
                      onChange={(e) => setHomeworkType(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {HOMEWORK_TYPES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {DIFFICULTY_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <SLabel>学段 / 年级 / 学科</SLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={selectedLevel}
                      onChange={(e) => { setSelectedLevel(e.target.value); setSelectedGrade(LEVEL_GRADES[e.target.value][0]); }}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {grades.map((g) => <option key={g}>{g}</option>)}
                    </select>
                    <select
                      value={selectedSubject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-1.5 text-xs bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                    >
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </SCard>

            <button
              onClick={handlePqGenerate}
              disabled={pqGenerating}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md"
              style={{ background: pqGenerating ? "#93bbf8" : PRIMARY }}
            >
              {pqGenerating
                ? <><RefreshCw size={15} className="animate-spin" />AI 生成中…</>
                : <><Zap size={15} />AI 生成全部 {questions.length} 题</>
              }
            </button>

            {pqGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#6b7a99]">
                  <span>逐题分析并生成…</span>
                  <span className="font-mono font-semibold">{pqProgress}%</span>
                </div>
                <ProgBar value={pqProgress} max={100} />
              </div>
            )}

            {pqDone && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
                <Check size={15} className="flex-shrink-0" />
                已生成 {questions.length} 道题，请前往审阅确认。
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 页面 3：审阅与修改 ───────────────────────────────────────────────────────

const DEFAULT_STEPS = [
  { text: "第一步：正确理解题意并提取条件", score: 1 },
  { text: "第二步：列出正确的计算式", score: 2 },
  { text: "第三步：计算正确并完整作答", score: 2 },
];

function Page3({
  onNav,
  questionScores,
  setQuestionScores,
}: {
  onNav: (p: number) => void;
  questionScores: Record<number, number>;
  setQuestionScores: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) {
  const [selected, setSelected] = useState(0);
  const [editContents, setEditContents] = useState<Record<number, string>>({});
  const [steps, setSteps] = useState<Record<number, { text: string; score: number }[]>>({});
  const [confirmedQuestionIds, setConfirmedQuestionIds] = useState<number[]>([]);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [keepCurrentQuestion, setKeepCurrentQuestion] = useState(true);
  const [regenerateReason, setRegenerateReason] = useState("难度不合适，需要更贴近课堂练习");
  const q = QUESTIONS[selected];
  const currentScore = questionScores[q.id] ?? q.maxScore;
  const currentSteps = steps[q.id] ?? DEFAULT_STEPS.map((s) => ({ ...s }));
  const stepTotalScore = currentSteps.reduce((sum, step) => sum + step.score, 0);
  const isStepScoreOverLimit = stepTotalScore > currentScore;
  const isStepScoreIncomplete = stepTotalScore < currentScore;
  const isQuestionContentEmpty = !(editContents[`content-${q.id}`] ?? q.content).trim();
  const isAnswerEmpty = !(editContents[`answer-${q.id}`] ?? q.answer).trim();
  const isStepEmpty = currentSteps.length === 0;
  const hasUnnamedStep = currentSteps.some((step) => !step.text.trim());
  const isQuestionScoreInvalid = currentScore <= 0;
  const currentQuestionWarnings = [
    isQuestionScoreInvalid && "题目满分必须大于 0 分。",
    isStepEmpty && "请至少保留一个评分步骤。",
    hasUnnamedStep && "存在未填写名称的评分步骤。",
    isQuestionContentEmpty && "题目内容不能为空。",
    isAnswerEmpty && "标准答案与解析不能为空。",
    isStepScoreOverLimit && "步骤总分超过题目满分。",
    isStepScoreIncomplete && "步骤分数未给完整，尚差 " + (currentScore - stepTotalScore) + " 分。",
  ].filter(Boolean) as string[];
  const canConfirmCurrentQuestion = currentQuestionWarnings.length === 0;
  const isCurrentQuestionConfirmed = confirmedQuestionIds.includes(q.id);
  const areAllQuestionsConfirmed = QUESTIONS.every((item) => confirmedQuestionIds.includes(item.id));
  const totalScore = QUESTIONS.reduce((sum, item) => sum + (questionScores[item.id] ?? item.maxScore), 0);

  function updateStep(idx: number, field: "text" | "score", val: string | number) {
    const otherStepTotal = currentSteps.reduce((sum, step, i) => i === idx ? sum : sum + step.score, 0);
    const next = currentSteps.map((s, i) => {
      if (i !== idx) return s;
      if (field === "score") {
        const nextScore = Math.min(Number(val), Math.max(0, currentScore - otherStepTotal));
        return { ...s, score: nextScore };
      }
      return { ...s, text: String(val) };
    });
    setSteps({ ...steps, [q.id]: next });
    setConfirmedQuestionIds((ids) => ids.filter((id) => id !== q.id));
  }

  function updateQuestionScore(nextScore: number) {
    setQuestionScores((prev) => ({ ...prev, [q.id]: Math.max(0, nextScore) }));
    setConfirmedQuestionIds((ids) => ids.filter((id) => id !== q.id));
  }

  function updateQuestionContent(key: string, value: string) {
    setEditContents({ ...editContents, [key]: value });
    setConfirmedQuestionIds((ids) => ids.filter((id) => id !== q.id));
  }

  function confirmCurrentQuestion() {
    if (!canConfirmCurrentQuestion) return;
    const nextConfirmedIds = Array.from(new Set([...confirmedQuestionIds, q.id]));
    setConfirmedQuestionIds(nextConfirmedIds);
    const nextQuestionIndex = QUESTIONS.findIndex((item) => !nextConfirmedIds.includes(item.id));
    if (nextQuestionIndex >= 0) setSelected(nextQuestionIndex);
  }

  return (
    <div className="grid grid-cols-[280px_1fr] gap-5" style={{ height: "calc(100vh - 130px)" }}>
      <div className="flex flex-col gap-3 overflow-hidden">
        <SCard
          title="题目列表"
          extra={
            <div className="flex items-baseline gap-1 rounded-md bg-blue-50 px-2 py-1 border border-blue-100">
              <span className="text-[10px] font-medium text-[#4e6fa8]">整卷总分</span>
              <span className="text-lg leading-none font-bold font-mono text-[#1e66d0]">{totalScore}</span>
              <span className="text-xs font-medium text-[#4e6fa8]">分</span>
            </div>
          }
          noPad
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto">
            {QUESTIONS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(0,0,0,0.06)] last:border-0 text-left transition-colors ${
                  selected === i ? "bg-blue-50" : "hover:bg-gray-50/80"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 transition-all ${
                    selected === i ? "text-white" : "bg-gray-100 text-[#6b7a99]"
                  }`}
                  style={selected === i ? { background: PRIMARY } : undefined}
                >
                  {item.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0f1629] truncate">{item.title}</div>
                  <div className="text-xs text-[#6b7a99] flex items-center gap-1.5">
                    <span>{questionScores[item.id] ?? item.maxScore} 分</span>
                    {confirmedQuestionIds.includes(item.id) && <span className="text-green-600">已确认</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </SCard>

        <div className="flex gap-2 flex-shrink-0">
          <Btn variant="secondary" className="flex-1 justify-center text-xs" onClick={() => onNav(2)} icon={<ArrowLeft size={12} />}>返回</Btn>
          <Btn
            variant="primary"
            className="flex-1 justify-center text-xs"
            onClick={() => onNav(4)}
            disabled={!areAllQuestionsConfirmed}
          >
            发布设置 →
          </Btn>
        </div>
      </div>

      <div className="overflow-y-auto space-y-4">
        <SCard
          title={q.title}
          extra={
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQuestionScore(currentScore - 1)}
                className="w-7 h-7 rounded border border-[rgba(0,0,0,0.1)] text-[#6b7a99] hover:bg-gray-100 flex items-center justify-center text-base font-bold transition-colors"
              >−</button>
              <span className="w-10 text-center text-sm font-bold font-mono text-[#0f1629]">{currentScore}</span>
              <button
                onClick={() => updateQuestionScore(currentScore + 1)}
                className="w-7 h-7 rounded border border-[rgba(0,0,0,0.1)] text-[#6b7a99] hover:bg-gray-100 flex items-center justify-center text-base font-bold transition-colors"
              >+</button>
              <span className="text-sm text-[#6b7a99]">分 · 整卷 {totalScore} 分</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <SLabel>题目内容</SLabel>
              <textarea
                className="w-full resize-none border border-[rgba(0,0,0,0.1)] rounded-lg p-3 text-sm bg-[#f8f9fc] text-[#0f1629] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#2f7df6] focus:bg-white transition-colors"
                rows={3}
                value={editContents[`content-${q.id}`] ?? q.content}
                onChange={(e) => updateQuestionContent(`content-${q.id}`, e.target.value)}
              />
            </div>
            <div>
              <SLabel>标准答案与解析</SLabel>
              <textarea
                className="w-full resize-none border border-green-200 rounded-lg p-3 text-sm bg-green-50 text-green-800 font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-green-400 focus:bg-white focus:text-[#0f1629] transition-colors"
                rows={3}
                value={editContents[`answer-${q.id}`] ?? q.answer}
                onChange={(e) => updateQuestionContent(`answer-${q.id}`, e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <SLabel>评分步骤模板（可直接修改）</SLabel>
                <button
                  onClick={() => {
                    const next = [...currentSteps, { text: "新增步骤", score: 0 }];
                    setSteps({ ...steps, [q.id]: next });
                    setConfirmedQuestionIds((ids) => ids.filter((id) => id !== q.id));
                  }}
                  className="text-xs px-2 py-1 rounded border border-dashed border-[rgba(0,0,0,0.15)] text-[#6b7a99] hover:border-[#2f7df6]/40 transition-colors"
                >
                  + 添加步骤
                </button>
              </div>
              <div className="space-y-2">
                {currentSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-[rgba(0,0,0,0.07)] bg-[#f8f9fc]">
                    <span
                      className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 text-white"
                      style={{ background: PRIMARY }}
                    >
                      {i + 1}
                    </span>
                    <input
                      className="flex-1 text-sm text-[#0f1629] bg-transparent border-b border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[#2f7df6] py-0.5"
                      value={step.text}
                      onChange={(e) => updateStep(i, "text", e.target.value)}
                    />
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => updateStep(i, "score", Math.max(0, step.score - 1))}
                        className="w-5 h-5 rounded border border-[rgba(0,0,0,0.1)] text-[#6b7a99] hover:bg-gray-200 flex items-center justify-center text-xs font-bold transition-colors"
                      >−</button>
                      <span className="w-6 text-center text-xs font-bold font-mono text-[#0f1629]">{step.score}</span>
                      <button
                        onClick={() => updateStep(i, "score", step.score + 1)}
                        disabled={stepTotalScore >= currentScore}
                        className="w-5 h-5 rounded border border-[rgba(0,0,0,0.1)] text-[#6b7a99] hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center text-xs font-bold transition-colors"
                      >+</button>
                      <span className="text-xs text-[#6b7a99]">分</span>
                    </div>
                    <button
                      onClick={() => {
                        const next = currentSteps.filter((_, idx) => idx !== i);
                        setSteps({ ...steps, [q.id]: next });
                        setConfirmedQuestionIds((ids) => ids.filter((id) => id !== q.id));
                      }}
                      className="w-5 h-5 rounded flex items-center justify-center text-[#6b7a99] hover:bg-red-100 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
              <div className={`mt-2 text-xs text-right ${isStepScoreOverLimit ? "text-red-600 font-semibold" : "text-[#6b7a99]"}`}>
                步骤总分：{stepTotalScore} 分；题目满分：{currentScore} 分；整卷总分：{totalScore} 分
              </div>
              {currentQuestionWarnings.length > 0 && (
                <div className={`mt-2 p-2.5 rounded-lg border text-xs flex items-start gap-2 ${isStepScoreOverLimit ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                  <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">这道题暂不能确认</div>
                    <div className="mt-0.5">{currentQuestionWarnings.join(" ")}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SCard>

        <div className="flex gap-2 pb-2">
          <Btn variant="secondary" size="sm" icon={<RefreshCw size={13} />} onClick={() => setShowRegenerateModal(true)}>
            重新生成此题
          </Btn>
          <div className="flex-1" />
          <Btn
            variant="primary"
            size="sm"
            onClick={confirmCurrentQuestion}
            icon={<Check size={13} />}
            disabled={!canConfirmCurrentQuestion || isCurrentQuestionConfirmed}
          >
            {isCurrentQuestionConfirmed ? "已确认这道题" : "确认这道题"}
          </Btn>
        </div>
      </div>

      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
          <div className="w-[460px] rounded-xl bg-white shadow-2xl border border-[rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(0,0,0,0.07)] flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-[#0f1629]">重新生成此题</div>
                <div className="text-xs text-[#6b7a99] mt-0.5">{q.title} · 请先确认修改方向</div>
              </div>
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7a99] hover:bg-gray-100"
              >
                <X size={15} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f1629]">
                <input
                  type="checkbox"
                  checked={keepCurrentQuestion}
                  onChange={(e) => setKeepCurrentQuestion(e.target.checked)}
                  className="accent-[#2f7df6]"
                />
                保留现有题目内容，仅调整表达、难度或数据
              </label>
              <div>
                <SLabel>不满意的地方</SLabel>
                <textarea
                  className="w-full h-24 resize-none border border-[rgba(0,0,0,0.1)] rounded-lg p-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                  value={regenerateReason}
                  onChange={(e) => setRegenerateReason(e.target.value)}
                />
              </div>
              <div>
                <SLabel>个性化方向</SLabel>
                <div className="grid grid-cols-3 gap-2">
                  {["更贴近生活", "降低难度", "增加步骤"].map((item) => (
                    <button key={item} className="px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] text-xs font-semibold text-[#0f1629] hover:border-[#2f7df6]/40 hover:bg-blue-50">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex justify-end gap-2">
              <Btn variant="secondary" onClick={() => setShowRegenerateModal(false)}>取消</Btn>
              <Btn
                variant="primary"
                icon={<RefreshCw size={13} />}
                onClick={() => {
                  setEditContents({
                    ...editContents,
                    [`content-${q.id}`]: `${q.content}\n\n已按要求重新生成：${regenerateReason}`,
                  });
                  setShowRegenerateModal(false);
                }}
              >
                确认重新生成
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 页面 4：发布与打印 ───────────────────────────────────────────────────────

function Page4({
  onNav,
  questionScores,
}: {
  onNav: (p: number) => void;
  questionScores: Record<number, number>;
}) {
  const [published, setPublished] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState(["六(3)班"]);
  const [layoutMode, setLayoutMode] = useState("标准排版");
  const [fontScale, setFontScale] = useState(14);
  const classes = ["六(1)班", "六(2)班", "六(3)班", "六(4)班"];
  const totalScore = QUESTIONS.reduce((sum, item) => sum + (questionScores[item.id] ?? item.maxScore), 0);

  function toggleClass(c: string) {
    setSelectedClasses((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-5">
      <div className="space-y-4">
        <SCard title="作业基本信息">
          <div className="grid grid-cols-3 gap-4">
            {[
              ["作业名称", "第六单元 解决问题专项练习"],
              ["年级 / 学科", "六年级 · 数学"],
              ["班级", "六(3)班"],
              ["题目数量", "4 题"],
              ["总分", `${totalScore} 分`],
            ].map(([label, value]) => (
              <div key={label as string} className="p-3 bg-[#f8f9fc] rounded-lg">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7a99] mb-1">{label}</div>
                <div className="text-sm font-semibold text-[#0f1629]">{value}</div>
              </div>
            ))}
          </div>
        </SCard>

        <SCard title="排版设计">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <SLabel>版式</SLabel>
              <TSelect options={["标准排版", "紧凑排版", "答题空间加大"]} className="w-full" />
            </div>
            <div>
              <SLabel>纸张</SLabel>
              <TSelect options={["A4 纵向", "A4 横向", "B5 纵向"]} className="w-full" />
            </div>
            <div>
              <SLabel>字号</SLabel>
              <input
                type="number"
                min={12}
                max={18}
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="w-full border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white text-[#0f1629] focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
              />
            </div>
            <div>
              <SLabel>编辑状态</SLabel>
              <div className="px-3 py-2 rounded-md bg-blue-50 text-blue-700 text-sm font-semibold flex items-center gap-1.5">
                <PenLine size={13} /> 可编辑窗口
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {["标准排版", "紧凑排版", "答题空间加大"].map((item) => (
              <button
                key={item}
                onClick={() => setLayoutMode(item)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  layoutMode === item ? "text-white border-[#2f7df6]" : "text-[#6b7a99] border-[rgba(0,0,0,0.1)] hover:bg-gray-50"
                }`}
                style={layoutMode === item ? { background: PRIMARY } : undefined}
              >
                {item}
              </button>
            ))}
          </div>
        </SCard>

        <SCard title="发布班级">
          <div className="flex gap-2 flex-wrap mb-3">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => toggleClass(c)}
                className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                  selectedClasses.includes(c)
                    ? "text-white border-[#2f7df6] shadow-sm"
                    : "border-[rgba(0,0,0,0.1)] text-[#0f1629] hover:border-[#2f7df6]/40"
                }`}
                style={selectedClasses.includes(c) ? { background: PRIMARY } : undefined}
              >
                {c}
                {selectedClasses.includes(c) && <Check size={12} className="inline ml-1.5" />}
              </button>
            ))}
          </div>
          {selectedClasses.length > 0 && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium">
              已选 {selectedClasses.length} 个班级，预计推送约 {selectedClasses.length * 42} 名学生
            </div>
          )}
        </SCard>



        <div className="flex items-center gap-3">
          <Btn variant="secondary" size="md" icon={<Printer size={14} />}>打印预览</Btn>
          <Btn variant="secondary" size="md" icon={<Download size={14} />}>导出 PDF</Btn>
          <div className="flex-1" />
          {published ? (
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <Check size={16} />发布成功，已同步至作业管理
            </div>
          ) : (
            <Btn
              variant="primary"
              size="md"
              icon={<Send size={14} />}
              onClick={() => { setPublished(true); setTimeout(() => onNav(1), 2500); }}
            >
              确认发布
            </Btn>
          )}
        </div>
      </div>

      <SCard
        title="作业预览"
        extra={<span className="text-xs text-[#6b7a99]">{layoutMode} · 第 1 / 2 页</span>}
        noPad
      >
        <div className="p-5 bg-white min-h-[500px]" style={{ fontSize: fontScale }}>
          <div className="text-center mb-5 pb-4 border-b border-[rgba(0,0,0,0.07)]">
            <h3 className="font-bold text-base mb-1 text-[#0f1629]" contentEditable suppressContentEditableWarning>六年级数学作业</h3>
            <p className="text-sm text-[#6b7a99]" contentEditable suppressContentEditableWarning>第六单元 解决问题专项练习</p>
            <div className="flex justify-between text-xs text-[#6b7a99] mt-3">
              <span>班级：______</span>
              <span>姓名：______</span>
              <span>得分：______</span>
            </div>
          </div>
          {QUESTIONS.slice(0, 2).map((q) => (
            <div key={q.id} className="mb-6">
              <p className="text-sm font-semibold text-[#0f1629] mb-2">
                {q.id}. （{questionScores[q.id] ?? q.maxScore}分）{q.content}
              </p>
              <div
                className={`ml-4 space-y-2 ${layoutMode === "答题空间加大" ? "py-3" : ""}`}
                contentEditable
                suppressContentEditableWarning
              >
                <div className="h-8 border-b border-dashed border-gray-200" />
                <div className="h-8 border-b border-dashed border-gray-200" />
              </div>
            </div>
          ))}
          <div className="text-center text-xs text-[#6b7a99] pt-4 border-t border-[rgba(0,0,0,0.06)]">
            第 1 页，共 2 页
          </div>
        </div>
      </SCard>
    </div>
  );
}

// ─── 页面 5：PDF 上传确认 ─────────────────────────────────────────────────────

function Page5({ onNav }: { onNav: (p: number) => void }) {
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const matchData = [
    { name: "张小明", pages: "1-2", count: 2, status: "正常" },
    { name: "李梅梅", pages: "3-4", count: 2, status: "正常" },
    { name: "王大力", pages: "5-7", count: 3, status: "页数异常" },
    { name: "陈思思", pages: "8-9", count: 2, status: "正常" },
    { name: "刘小红", pages: "—", count: 0, status: "作业缺失" },
    { name: "赵磊", pages: "10-11", count: 2, status: "正常" },
  ];

  return (
    <div className="grid grid-cols-[1fr_340px] gap-5">
      <div className="space-y-4">
        <SCard title="选择作业批次与班级">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <SLabel>作业批次</SLabel>
              <TSelect options={["第六单元 解决问题专项练习 (2025-01-08)", "第二单元 整数运算 (2024-12-15)"]} className="w-full" />
            </div>
            <div>
              <SLabel>班级</SLabel>
              <TSelect options={["六(3)班", "六(1)班", "六(2)班"]} className="w-full" />
            </div>
          </div>
        </SCard>

        <SCard title="上传 PDF 文件">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragging ? "border-[#2f7df6] bg-blue-50" : "border-[rgba(0,0,0,0.1)] bg-[#f8f9fc] hover:bg-gray-50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); setUploaded(true); }}
            onClick={() => setUploaded(true)}
          >
            <Upload size={32} className="mx-auto mb-3 text-[#6b7a99]" />
            <p className="text-sm font-semibold text-[#0f1629] mb-1">拖拽 PDF 到此处，或点击选择文件</p>
            <p className="text-xs text-[#6b7a99] mb-4">支持多页 PDF，最大 100MB；每页对应一名学生作业</p>
            <span className="px-4 py-2 rounded-md text-sm font-semibold text-white" style={{ background: PRIMARY }}>
              选择文件
            </span>
          </div>
        </SCard>

        {uploaded && (
          <SCard title="文件识别结果">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                ["PDF 文件名", "六(3)班_解决问题专项练习_01.pdf"],
                ["识别总页数", "84 页"],
                ["预计学生数", "42 人"],
              ].map(([label, value]) => (
                <div key={label as string} className="p-3 bg-[#f8f9fc] rounded-lg text-center">
                  <div className="text-xs text-[#6b7a99] mb-1 font-medium">{label}</div>
                  <div className="text-sm font-bold text-[#0f1629]">{value}</div>
                </div>
              ))}
            </div>
            <div className="border border-[rgba(0,0,0,0.08)] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-[rgba(0,0,0,0.07)]">
                    {["学生", "匹配页码", "页数", "状态"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
                  {matchData.map((s) => (
                    <tr key={s.name} className="hover:bg-gray-50/60">
                      <td className="px-3 py-2.5 font-medium text-[#0f1629]">{s.name}</td>
                      <td className="px-3 py-2.5 text-[#6b7a99] font-mono text-xs">{s.pages}</td>
                      <td className="px-3 py-2.5 text-[#6b7a99]">{s.count}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          s.status === "正常" ? "bg-green-100 text-green-700" :
                          s.status === "页数异常" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-600"
                        }`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SCard>
        )}
      </div>

      <div className="space-y-4">
        {uploaded && (
          <>
            <SCard title="异常提示">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex gap-2.5">
                  <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-800 mb-0.5">页数不一致</div>
                    <div className="text-xs text-amber-700">王大力检测到 3 页，标准为 2 页，请确认是否包含草稿页。</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex gap-2.5">
                  <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-red-800 mb-0.5">作业缺失</div>
                    <div className="text-xs text-red-700">未检测到刘小红的作业，请确认是否漏扫。</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex gap-2.5">
                  <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-blue-800 mb-0.5">页序提示</div>
                    <div className="text-xs text-blue-700">第 23-24 页可能顺序颠倒，AI 将自动纠正。</div>
                  </div>
                </div>
              </div>
            </SCard>

            <SCard title="处理选项">
              <div className="space-y-3">
                {[
                  ["自动跳过空白页", true],
                  ["自动修正页面顺序", true],
                  ["缺失学生标记为未交", false],
                ].map(([label, checked]) => (
                  <label key={label as string} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked={checked as boolean} className="accent-[#2f7df6]" />
                    <span className="text-[#0f1629] font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </SCard>
          </>
        )}

        <div className="space-y-2.5">
          {uploaded && (
            <Btn variant="primary" className="w-full justify-center" size="md" onClick={() => onNav(6)}>
              确认上传，开始 AI 批改
            </Btn>
          )}
          <Btn variant="secondary" className="w-full justify-center" size="md" onClick={() => onNav(1)}>
            返回作业管理
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── 页面 6：AI 批改进度 ─────────────────────────────────────────────────────

function Page6({ onNav }: { onNav: (p: number) => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const step = progress < 25 ? 1 : progress < 55 ? 2 : progress < 82 ? 3 : 4;

  useEffect(() => {
    if (done) return;
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 4 + 1;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setDone(true);
      }
      setProgress(Math.min(100, Math.round(p)));
    }, 180);
    return () => clearInterval(iv);
  }, [done]);

  const steps = [
    { label: "PDF 分割", desc: "将多页 PDF 按学生分割为独立图像" },
    { label: "OCR 识别 / 定位", desc: "文字识别与答题区域定位" },
    { label: "结构化分析", desc: "结构化结果传递给 LLM 评阅" },
    { label: "评分输出 JSON", desc: "输出结构化评分数据并入库" },
  ];

  const studentsDone = Math.ceil((progress / 100) * 42);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xl w-[500px] overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between" style={{ background: SB_BG }}>
          <div>
            <h3 className="text-white font-bold text-base">AI 批改进行中</h3>
            <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              第六单元 解决问题专项练习 · 六(3)班
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <Cpu size={19} className={`text-white ${!done ? "animate-pulse" : ""}`} />
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-4 mb-6">
            {steps.map((s, i) => {
              const n = i + 1;
              const completed = n < step || done;
              const current = n === step && !done;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                      completed ? "bg-green-500 text-white" :
                      current ? "text-white" :
                      "bg-gray-100 text-[#6b7a99]"
                    }`}
                    style={current ? { background: PRIMARY } : undefined}
                  >
                    {completed ? <Check size={13} /> : n}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${completed || current ? "text-[#0f1629]" : "text-[#6b7a99]"}`}>
                        {s.label}
                      </span>
                      {current && <span className="text-xs font-medium" style={{ color: PRIMARY }}>处理中…</span>}
                      {completed && <span className="text-xs text-green-600 font-medium">完成</span>}
                    </div>
                    <div className="text-xs text-[#6b7a99] mt-0.5">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7a99]">
                {done ? "批改完成" : `正在处理第 ${studentsDone} / 42 名学生…`}
              </span>
              <span className="font-bold text-[#0f1629] font-mono">{progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: done ? "#10b981" : PRIMARY }}
              />
            </div>
            {!done && (
              <div className="flex items-center gap-1.5 text-xs text-[#6b7a99]">
                <Clock size={11} />
                <span>预计剩余时间：约 {Math.max(0, Math.ceil((100 - progress) / 14))} 分钟</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "已识别", value: `${studentsDone} 人` },
              { label: "待处理", value: `${Math.max(0, 42 - studentsDone)} 人` },
              { label: "识别准确率", value: done ? "97.6%" : `${(progress * 0.976).toFixed(1)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 bg-[#f8f9fc] rounded-xl">
                <div className="text-sm font-bold text-[#0f1629] font-mono">{value}</div>
                <div className="text-xs text-[#6b7a99] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {!done ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-700">
              <AlertCircle size={13} className="flex-shrink-0" />
              批改过程中请勿关闭页面。如遇超时，系统将自动重试。
            </div>
          ) : (
            <button
              onClick={() => onNav(7)}
              className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:opacity-90"
              style={{ background: PRIMARY }}
            >
              <CheckSquare size={16} />
              批改完成，前往教师审核
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 页面 7：教师审核 ─────────────────────────────────────────────────────────

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const ORIGINAL_PAPER_REGIONS: Record<number, { src: string; label: string }> = {
  1: { src: publicAsset("assets/student-workbook-q1.png"), label: "原卷第 1 题作答区域" },
  2: { src: publicAsset("assets/student-workbook-q2.png"), label: "原卷第 2 题作答区域" },
  3: { src: publicAsset("assets/student-workbook-q3.png"), label: "原卷第 3 题作答区域" },
  4: { src: publicAsset("assets/student-workbook-q4.png"), label: "原卷第 4 题作答区域" },
};

function Page7({ onNav }: { onNav: (p: number) => void }) {
  const [selStudent, setSelStudent] = useState(0);
  const [selQ, setSelQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [showFullPaper, setShowFullPaper] = useState(false);

  const student = STUDENTS[selStudent];
  const q = QUESTIONS[selQ];
  const key = `${student.id}-${q.id}`;
  const score = scores[key] ?? STUDENT_QUESTION_SCORES[student.id]?.[q.id] ?? q.aiScore;
  const total = QUESTIONS.reduce(
    (sum, item) => sum + (scores[`${student.id}-${item.id}`] ?? STUDENT_QUESTION_SCORES[student.id]?.[item.id] ?? item.aiScore),
    0,
  );
  const maxTotal = QUESTIONS.reduce((s, item) => s + item.maxScore, 0);
  const paperRegion = ORIGINAL_PAPER_REGIONS[q.id];
  const isCurrentAnswerCorrect = score === q.maxScore;

  return (
    <div
      className="grid gap-3 overflow-hidden"
      style={{
        height: "calc(100vh - 130px)",
        gridTemplateColumns: "145px minmax(0, 1fr) clamp(300px, 28vw, 380px)",
      }}
    >
      {/* 学生列表：用于快速切换待审核学生。 */}
      <div className="min-w-0 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg overflow-hidden flex flex-col">
        <div className="px-3 py-2.5 border-b border-[rgba(0,0,0,0.07)] text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide">
          学生列表
        </div>
        <div className="flex-1 overflow-y-auto">
          {STUDENTS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelStudent(i)}
              className={`w-full text-left px-3 py-3 border-b border-[rgba(0,0,0,0.05)] last:border-0 transition-colors ${
                selStudent === i ? "bg-blue-50" : "hover:bg-gray-50/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-semibold ${selStudent === i ? "text-[#2f7df6]" : "text-[#0f1629]"}`}>{s.name}</span>
                <span className="text-xs font-mono font-bold text-[#6b7a99]">{s.totalScore}</span>
              </div>
              <ProgBar
                value={s.totalScore}
                max={maxTotal}
                color={s.totalScore >= 18 ? "#10b981" : s.totalScore < 12 ? "#ef4444" : PRIMARY}
              />
            </button>
          ))}
        </div>
        <div className="p-2.5 border-t border-[rgba(0,0,0,0.07)]">
          <Btn variant="primary" className="w-full justify-center text-xs" size="xs" onClick={() => onNav(8)}>
            完成审核 →
          </Btn>
        </div>
      </div>

      {/* 题目审核：集中处理分数、评语和确认状态。 */}
      <div className="min-w-0 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.07)] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-[#0f1629]">{student.name}</span>
            <span className="text-xs text-[#6b7a99]">总分：</span>
            <span className="text-sm font-bold font-mono" style={{ color: PRIMARY }}>{total} / {maxTotal}</span>
          </div>
          <div className="flex gap-1.5">
            {QUESTIONS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setSelQ(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  selQ === i ? "text-white shadow-sm" :
                  confirmed.has(`${student.id}-${item.id}`) ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-[#6b7a99] hover:bg-gray-200"
                }`}
                style={selQ === i ? { background: PRIMARY } : undefined}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.07)] bg-[#f8f9fc] px-3 py-2.5">
            <div>
              <div className="text-[10px] font-semibold text-[#6b7a99]">当前批改</div>
              <div className="text-sm font-bold text-[#0f1629] mt-0.5">{q.title}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${isCurrentAnswerCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              AI 初判：{isCurrentAnswerCorrect ? "正确" : "需复核"}
            </span>
          </div>

          {!isCurrentAnswerCorrect && (
            <div>
              <SLabel>标准答案</SLabel>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 font-medium">
                {q.answer}
              </div>
            </div>
          )}

          <div>
            <SLabel>AI 分析与扣分原因</SLabel>
            <div className="p-3 bg-[#f8f9fc] border border-[rgba(0,0,0,0.07)] rounded-xl text-sm text-[#6b7a99] leading-relaxed">
              {q.aiReason}
            </div>
          </div>

          <div>
            <SLabel>评分标准表</SLabel>
            <div className="border border-[rgba(0,0,0,0.08)] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-[rgba(0,0,0,0.07)]">
                    {["答案", "解释", "步骤分"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
                  {q.title.includes("判断") ? (
                    <tr>
                      <td className="px-3 py-2 font-medium text-[#0f1629]">{q.answer}</td>
                      <td className="px-3 py-2 text-[#6b7a99]">{q.aiReason}</td>
                      <td className="px-3 py-2 text-[#6b7a99]">一行展示</td>
                    </tr>
                  ) : (
                    DEFAULT_STEPS.map((step, index) => (
                      <tr key={step.text}>
                        <td className="px-3 py-2 font-medium text-[#0f1629]">{index === 0 ? q.answer : "按步骤检查"}</td>
                        <td className="px-3 py-2 text-[#6b7a99]">{step.text}</td>
                        <td className="px-3 py-2 text-[#6b7a99] font-mono">{step.score} 分</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-[130px_1fr] gap-3">
            <div>
              <SLabel>题目得分</SLabel>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={q.maxScore}
                  value={score}
                  onChange={(e) => setScores({ ...scores, [key]: Number(e.target.value) })}
                  className="w-16 border border-[rgba(0,0,0,0.1)] rounded-md px-2 py-2 text-sm text-center font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                />
                <span className="text-sm text-[#6b7a99] font-medium">/ {q.maxScore}</span>
              </div>
            </div>
            <div>
              <SLabel>教师评语</SLabel>
              <textarea
                rows={2}
                className="w-full resize-none border border-[rgba(0,0,0,0.1)] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2f7df6]"
                placeholder="添加评语（可选）"
                value={comments[key] || ""}
                onChange={(e) => setComments({ ...comments, [key]: e.target.value })}
              />
            </div>
          </div>

          <Btn
            variant={confirmed.has(key) ? "secondary" : "primary"}
            size="sm"
            icon={confirmed.has(key) ? <Check size={13} /> : undefined}
            onClick={() => setConfirmed((prev) => { const n = new Set(prev); n.add(key); return n; })}
          >
            {confirmed.has(key) ? "已确认此题" : "确认此题结果"}
          </Btn>
        </div>
      </div>

      {/* 原卷是学生作答的唯一展示依据，并随题号定位对应区域。 */}
      <div className="min-w-0 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg overflow-hidden flex flex-col">
        <div className="px-3 py-2.5 border-b border-[rgba(0,0,0,0.07)] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#0f1629]">学生原卷</div>
            <div className="text-[10px] text-[#6b7a99] mt-0.5">{student.name} · 扫描原始版本</div>
          </div>
          <span className="text-xs font-bold" style={{ color: PRIMARY }}>第 {selQ + 1} 题定位</span>
        </div>
        <div className="flex-1 min-h-0 p-3 flex flex-col gap-3">
          <div className="flex rounded-md bg-gray-100 p-1 flex-shrink-0">
            <button
              onClick={() => setShowFullPaper(false)}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${!showFullPaper ? "bg-white text-[#0f1629] shadow-sm" : "text-[#6b7a99]"}`}
            >
              定位切片
            </button>
            <button
              onClick={() => setShowFullPaper(true)}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${showFullPaper ? "bg-white text-[#0f1629] shadow-sm" : "text-[#6b7a99]"}`}
            >
              <Eye size={12} />查看整页
            </button>
          </div>

          <div className="flex-1 min-h-0 rounded-lg border-2 border-blue-300 bg-[#ecebe7] overflow-hidden relative">
            {showFullPaper ? (
              <img
                src={publicAsset("assets/student-workbook-page.png")}
                alt={`${student.name}的学生原卷整页`}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={paperRegion.src}
                alt={paperRegion.label}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <div className="flex items-center justify-between rounded-md bg-blue-50 border border-blue-100 px-3 py-2 flex-shrink-0">
            <span className="text-xs font-medium text-[#4e6fa8]">{paperRegion.label}</span>
            <span className="text-sm font-bold font-mono text-[#1e66d0]">{score}/{q.maxScore} 分</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 页面 8：批改结果确认 ─────────────────────────────────────────────────────

function Page8({ onNav }: { onNav: (p: number) => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const sorted = [...STUDENTS].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-5 max-w-5xl">
      <SCard title="异常提示">
        <div className="space-y-2">
          {[
            { type: "warning", text: `周薇得分 8/20 分，低于及格线，建议课后重点辅导。` },
            { type: "info", text: `孙晓东得分 19/20 分，全班第一，可作优秀案例展示。` },
            { type: "danger", text: `第2题错误率 65%，多数学生在 240÷40 的计算中出错。` },
          ].map(({ type, text }, i) => {
            const cfg = {
              warning: { bg: "bg-amber-50 border-amber-200", icon: AlertTriangle, ic: "text-amber-600", tc: "text-amber-800" },
              info: { bg: "bg-blue-50 border-blue-200", icon: Star, ic: "text-blue-600", tc: "text-blue-800" },
              danger: { bg: "bg-red-50 border-red-200", icon: XCircle, ic: "text-red-500", tc: "text-red-800" },
            }[type]!;
            const Ic = cfg.icon;
            return (
              <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border ${cfg.bg}`}>
                <Ic size={14} className={`flex-shrink-0 mt-0.5 ${cfg.ic}`} />
                <span className={`text-sm font-medium ${cfg.tc}`}>{text}</span>
              </div>
            );
          })}
        </div>
      </SCard>

      <SCard
        title="学生成绩列表"
        extra={
          <Btn variant="secondary" size="xs" onClick={() => onNav(7)} icon={<ArrowLeft size={12} />}>返回修改</Btn>
        }
        noPad
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 border-b border-[rgba(0,0,0,0.07)]">
              {["排名", "学生姓名", "得分", "满分", "得分率", "状态", "教师修改记录"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
            {sorted.map((s, i) => (
              <tr
                key={s.id}
                className={`hover:bg-gray-50/60 transition-colors ${s.totalScore < 60 ? "bg-red-50/20" : ""}`}
              >
                <td className="px-4 py-3">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    i === 0 ? "bg-amber-400 text-white" :
                    i === 1 ? "bg-gray-300 text-white" :
                    i === 2 ? "bg-amber-600 text-white" :
                    "text-[#6b7a99]"
                  }`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-[#0f1629]">{s.name}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold font-mono text-base ${
                    s.totalScore >= 90 ? "text-green-600" :
                    s.totalScore < 60 ? "text-red-600" :
                    "text-[#0f1629]"
                  }`}>
                    {s.totalScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#6b7a99] font-mono">100</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.totalScore}%`,
                          background: s.totalScore >= 90 ? "#10b981" : s.totalScore < 60 ? "#ef4444" : PRIMARY,
                        }}
                      />
                    </div>
                    <span className="text-xs text-[#6b7a99] font-mono">{s.totalScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge text={s.status} /></td>
                <td className="px-4 py-3 text-xs text-[#6b7a99]">
                  {s.id === 3 ? "Q2: 0→5分" : s.id === 8 ? "未修改" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SCard>

      {confirmed ? (
        <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <Check size={22} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-green-800 text-base">批改结果已确认并保存至数据库</div>
            <div className="text-sm text-green-700 mt-0.5">可在学情分析中查看完整数据报告。</div>
          </div>
          <button
            onClick={() => onNav(9)}
            className="ml-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:opacity-90"
            style={{ background: "#10b981" }}
          >
            查看学情分析 →
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-3">
          <Btn variant="secondary" size="md" onClick={() => onNav(7)}>返回审核页修改</Btn>
          <Btn variant="primary" size="md" onClick={() => setConfirmed(true)} icon={<Check size={14} />}>
            最终确认批改结果
          </Btn>
        </div>
      )}
    </div>
  );
}

// ─── 页面 9：学情分析 ─────────────────────────────────────────────────────────

function Page9() {
  return (
    <div className="space-y-5">
      <SCard title="学情分析文件夹">
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "班级总览", desc: "分数、正确率、知识点掌握", icon: BarChart2 },
            { name: "学生档案", desc: "每名学生错题与建议", icon: Users },
            { name: "错题归档", desc: "按题型和知识点聚合", icon: FileText },
            { name: "导出记录", desc: "PDF 报告与学生版错题集", icon: Download },
          ].map((folder) => {
            const Icon = folder.icon;
            return (
              <div key={folder.name} className="p-3 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#f8f9fc]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon size={15} />
                  </div>
                  <div className="text-sm font-bold text-[#0f1629]">{folder.name}</div>
                </div>
                <div className="text-xs text-[#6b7a99] leading-relaxed">{folder.desc}</div>
              </div>
            );
          })}
        </div>
      </SCard>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="班级平均分" value="75.8" icon={BarChart2} colorClass="text-blue-500 bg-blue-50" delta="↑ 3.2 分" />
        <StatCard label="及格率" value="87.5%" icon={CheckSquare} colorClass="text-green-500 bg-green-50" />
        <StatCard label="优秀率（90+）" value="20%" icon={Award} colorClass="text-amber-500 bg-amber-50" />
        <StatCard label="需重点关注" value="2 人" icon={AlertCircle} colorClass="text-red-500 bg-red-50" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <SCard title="成绩分布">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SCORE_DIST_DATA} margin={{ top: 4, right: 10, left: -25, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#6b7a99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7a99" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                labelStyle={{ fontWeight: 600, color: "#0f1629" }}
              />
              <Bar dataKey="count" name="人数" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </SCard>

        <SCard title="错误类型分析">
          <div className="flex items-center gap-2">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={ERROR_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {ERROR_PIE_DATA.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {ERROR_PIE_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-sm text-[#6b7a99] flex-1">{d.name}</span>
                  <span className="text-sm font-bold font-mono text-[#0f1629]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </SCard>
      </div>

      <SCard title="知识点掌握情况">
        <div className="space-y-3.5">
          {KNOWLEDGE_DATA.map((kp) => (
            <div key={kp.name} className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#0f1629] w-24 flex-shrink-0">{kp.name}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${kp.score}%`,
                    background: kp.score >= 80 ? "#10b981" : kp.score >= 60 ? PRIMARY : "#ef4444",
                  }}
                />
              </div>
              <span className={`text-sm font-bold font-mono w-12 text-right ${
                kp.score >= 80 ? "text-green-600" : kp.score >= 60 ? "text-[#2f7df6]" : "text-red-600"
              }`}>
                {kp.score}%
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-16 text-center ${
                kp.score >= 80 ? "bg-green-100 text-green-700" :
                kp.score >= 60 ? "bg-blue-100 text-blue-700" :
                "bg-red-100 text-red-600"
              }`}>
                {kp.score >= 80 ? "良好" : kp.score >= 60 ? "一般" : "薄弱"}
              </span>
            </div>
          ))}
        </div>
      </SCard>

      <div className="grid grid-cols-[1fr_300px] gap-5">
        <SCard title="高频错题分析" extra={<span className="text-xs text-[#6b7a99]">本次作业</span>}>
          <div className="space-y-2.5">
            {[
              { q: "Q2", name: "练习本分发（应用题）", errorRate: 72, topic: "应用题" },
              { q: "Q4", name: "速度差综合应用", errorRate: 65, topic: "解决问题" },
              { q: "Q3", name: "分数除法运算（计算）", errorRate: 38, topic: "计算题" },
              { q: "Q1", name: "玩具价差对比（应用）", errorRate: 18, topic: "应用题" },
            ].map((item) => (
              <div key={item.q} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(0,0,0,0.07)] hover:bg-gray-50/60 transition-colors">
                <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {item.q}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#0f1629] mb-1">{item.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.errorRate}%`, background: "#ef4444" }} />
                    </div>
                    <span className="text-xs font-bold font-mono text-red-600">{item.errorRate}%</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-[#6b7a99] font-medium flex-shrink-0">{item.topic}</span>
              </div>
            ))}
          </div>
        </SCard>

        <div className="space-y-4">
          <SCard title="复习建议">
            <div className="space-y-3">
              {[
                "重点讲解应用题中信息筛选与步骤分解",
                "补充速度 / 距离变式练习 3-5 道",
                "对周薇等 2 名学生安排课后辅导",
                "下次作业可适当降低应用题比重",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm">
                  <span
                    className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 text-white mt-0.5"
                    style={{ background: PRIMARY, opacity: 0.7 + i * 0.07 }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[#0f1629] leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </SCard>

          <SCard title="导出 / 归档">
            <div className="space-y-2">
              <Btn variant="secondary" className="w-full justify-start text-sm" size="sm" icon={<Download size={14} />}>
                导出 PDF 报告
              </Btn>
              <Btn variant="secondary" className="w-full justify-start text-sm" size="sm" icon={<FileText size={14} />}>
                导出错题集（学生版）
              </Btn>
              <Btn variant="secondary" className="w-full justify-start text-sm" size="sm" icon={<Bookmark size={14} />}>
                归档至数据库
              </Btn>
            </div>
          </SCard>
        </div>
      </div>

      <SCard title="学生错题汇总" extra={<span className="text-xs text-[#6b7a99]">六(3)班 · 第六单元 解决问题专项练习</span>} noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-[rgba(0,0,0,0.07)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide">学生</th>
                {QUESTIONS.map((q) => (
                  <th key={q.id} className="px-4 py-3 text-center text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide">
                    {q.title.split("（")[0]}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-[10px] font-bold text-[#6b7a99] uppercase tracking-wide">总分</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
              {STUDENTS.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#0f1629]">{s.name}</td>
                  {QUESTIONS.map((q) => {
                    const got = STUDENT_QUESTION_SCORES[s.id]?.[q.id] ?? q.aiScore;
                    const full = q.maxScore;
                    const ok = got === full;
                    return (
                      <td key={q.id} className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold font-mono ${ok ? "text-green-600" : "text-red-600"}`}>
                          {got}/{full}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-bold font-mono ${
                      s.totalScore >= 18 ? "text-green-600" :
                      s.totalScore < 12 ? "text-red-600" :
                      "text-[#0f1629]"
                    }`}>
                      {s.totalScore}/20
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SCard>
    </div>
  );
}

// ─── 应用入口 ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState(1);
  const [questionScores, setQuestionScores] = useState<Record<number, number>>(
    () => Object.fromEntries(QUESTIONS.map((question) => [question.id, question.maxScore]))
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', 'Noto Sans SC', sans-serif" }}>
      <Sidebar current={page} onNav={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#f0f2f6" }}>
        <AppHeader page={page} />
        <main className="flex-1 overflow-auto p-5">
          {page === 1 && <Page1 onNav={setPage} />}
          {page === 2 && <Page2 onNav={setPage} />}
          {page === 3 && (
            <Page3
              onNav={setPage}
              questionScores={questionScores}
              setQuestionScores={setQuestionScores}
            />
          )}
          {page === 4 && <Page4 onNav={setPage} questionScores={questionScores} />}
          {page === 5 && <Page5 onNav={setPage} />}
          {page === 6 && <Page6 onNav={setPage} />}
          {page === 7 && <Page7 onNav={setPage} />}
          {page === 8 && <Page8 onNav={setPage} />}
          {page === 9 && <Page9 />}
        </main>
      </div>
    </div>
  );
}
