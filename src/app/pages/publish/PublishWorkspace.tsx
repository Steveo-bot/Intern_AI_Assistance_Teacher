import {useMemo, useState} from 'react';
import {
  Check,
  Download,
  FileText,
  LoaderCircle,
  Printer,
  Send,
  Sparkles,
  Upload,
} from 'lucide-react';

interface AssignmentQuestion {
  readonly id: number;
  readonly content: string;
  readonly maxScore: number;
}

interface PublishWorkspaceProps {
  readonly onBackToAssignments: () => void;
  readonly questionScores: Readonly<Record<number, number>>;
  readonly questions: readonly AssignmentQuestion[];
}

const CLASSES = ['六(1)班', '六(2)班', '六(3)班', '六(4)班'];
const DEFAULT_ASSIGNMENT_NAME = '第六单元 解决问题专项练习';

export function PublishWorkspace({
  onBackToAssignments,
  questionScores,
  questions,
}: PublishWorkspaceProps) {
  const [assignmentName, setAssignmentName] = useState(DEFAULT_ASSIGNMENT_NAME);
  const [selectedClasses, setSelectedClasses] = useState<readonly string[]>(['六(3)班']);
  const [templateFileName, setTemplateFileName] = useState('学校统一作业模板.docx');
  const [layoutStatus, setLayoutStatus] = useState<'idle' | 'running' | 'ready'>('ready');
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const totalScore = useMemo(
    () => questions.reduce(
      (sum, question) => sum + (questionScores[question.id] ?? question.maxScore),
      0,
    ),
    [questionScores, questions],
  );

  function toggleClass(className: string) {
    setSelectedClasses((classes) =>
      classes.includes(className)
        ? classes.filter((item) => item !== className)
        : [...classes, className],
    );
  }

  function handleTemplateUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setTemplateFileName(file.name);
    setLayoutStatus('running');
    window.setTimeout(() => setLayoutStatus('ready'), 900);
  }

  function runAiLayout() {
    setLayoutStatus('running');
    window.setTimeout(() => setLayoutStatus('ready'), 900);
  }

  function publishAssignment() {
    setPublishing(true);
    window.setTimeout(() => {
      setPublished(true);
      setPublishing(false);
    }, 450);
  }

  const selectedStudentCount = selectedClasses.length * 42;
  const layoutReady = layoutStatus === 'ready';

  return (
    <div className="publish-workspace publish-workspace--ai-layout">
      <aside className="publish-settings">
        <section className="settings-section">
          <div className="settings-section__heading">
            <span>作业信息</span>
            <FileText size={15} />
          </div>
          <label className="field-label" htmlFor="assignment-name">作业名称</label>
          <input
            id="assignment-name"
            onChange={(event) => setAssignmentName(event.target.value)}
            value={assignmentName}
          />
          <div className="assignment-facts">
            <span><small>年级学科</small><strong>六年级 · 数学</strong></span>
            <span><small>题目</small><strong>{questions.length} 题</strong></span>
            <span><small>总分</small><strong>{totalScore} 分</strong></span>
          </div>
        </section>

        <section className="settings-section settings-section--template">
          <div className="settings-section__heading"><span>学校模板</span></div>
          <label className="template-upload" htmlFor="school-template">
            <Upload size={16} />
            <span>
              <strong>{templateFileName}</strong>
              <small>支持上传学校常用 Word / PDF 模板</small>
            </span>
            <input
              accept=".doc,.docx,.pdf"
              id="school-template"
              onChange={handleTemplateUpload}
              type="file"
            />
          </label>
          <button
            className="button button--secondary ai-layout-button"
            disabled={layoutStatus === 'running'}
            onClick={runAiLayout}
            type="button"
          >
            {layoutStatus === 'running'
              ? <LoaderCircle className="animate-spin" size={15} />
              : <Sparkles size={15} />}
            AI 按模板排版
          </button>
          <p className="publish-hint">
            AI 将识别页眉、标题、学生信息栏、题目区和答题区，并把当前题目填入对应版式。
          </p>
        </section>

        <section className="settings-section settings-section--classes">
          <div className="settings-section__heading">
            <span>发布班级</span><small>{selectedClasses.length} 个</small>
          </div>
          <div className="class-list">
            {CLASSES.map((className) => (
              <label key={className}>
                <input
                  checked={selectedClasses.includes(className)}
                  onChange={() => toggleClass(className)}
                  type="checkbox"
                />
                <span>{className}</span>
                {selectedClasses.includes(className) && <Check size={14} />}
              </label>
            ))}
          </div>
          {selectedClasses.length > 0 && (
            <p className="publish-hint">
              将同步到 {selectedClasses.join('、')}，预计 {selectedStudentCount} 名学生可见。
            </p>
          )}
        </section>

        <div className="publish-settings__footer">
          <button className="button button--secondary" onClick={onBackToAssignments} type="button">
            返回作业
          </button>
          <button
            className="button button--primary"
            disabled={!layoutReady || selectedClasses.length === 0 || publishing}
            onClick={publishAssignment}
            type="button"
          >
            {publishing ? <LoaderCircle className="animate-spin" size={15} /> : <Send size={15} />}
            {published ? '已发布' : '确认发布'}
          </button>
        </div>
      </aside>

      <section className="ai-template-preview">
        <div className="ai-template-preview__bar">
          <div>
            <strong>AI 排版预览</strong>
            <span>{layoutReady ? `已套用：${templateFileName}` : '等待 AI 分析模板结构'}</span>
          </div>
          <div className="ai-template-preview__actions">
            <button disabled={!layoutReady} type="button"><Printer size={14} />打印预览</button>
            <button disabled={!layoutReady} type="button"><Download size={14} />导出 PDF</button>
          </div>
        </div>

        <div className="ai-template-preview__canvas">
          <article className="template-paper">
            <header className="template-paper__school">
              <span>XX 学校六年级数学作业单</span>
              <small>{templateFileName}</small>
            </header>
            <h2>{assignmentName}</h2>
            <div className="template-paper__meta">
              <span>班级：________</span>
              <span>姓名：________</span>
              <span>得分：________</span>
            </div>
            <div className="template-paper__summary">
              <span>题目数量：{questions.length} 题</span>
              <span>总分：{totalScore} 分</span>
              <span>AI 已保留学校模板页眉、留白和答题线规则</span>
            </div>

            {layoutStatus === 'running' ? (
              <div className="template-paper__loading">
                <LoaderCircle className="animate-spin" size={22} />
                <span>AI 正在识别模板并自动排版...</span>
              </div>
            ) : (
              <div className="template-paper__questions">
                {questions.map((question) => {
                  const score = questionScores[question.id] ?? question.maxScore;
                  return (
                    <section className="template-question" key={question.id}>
                      <p>{question.id}.（{score}分）{question.content}</p>
                      <div className="template-question__answer-lines">
                        <span />
                        <span />
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
