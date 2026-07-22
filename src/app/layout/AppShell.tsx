import {useEffect, useState} from 'react';
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Search,
  Settings,
} from 'lucide-react';

import {
  NAVIGATION_SECTIONS,
  PAGE_METADATA,
  type PageId,
} from '../config/navigation';

interface AppShellProps {
  readonly children: React.ReactNode;
  readonly currentPage: PageId;
  readonly onNavigate: (page: PageId) => void;
}

export function AppShell({children, currentPage, onNavigate}: AppShellProps) {
  const currentSection = NAVIGATION_SECTIONS.find((section) =>
    section.items.some((item) => item.id === currentPage),
  );
  const currentSectionId = currentSection?.id;
  const [expandedSections, setExpandedSections] = useState<readonly string[]>([
    currentSectionId ?? NAVIGATION_SECTIONS[0].id,
  ]);
  const metadata = PAGE_METADATA[currentPage];

  useEffect(() => {
    if (!currentSectionId) return;
    setExpandedSections((sections) =>
      sections.includes(currentSectionId) ? sections : [...sections, currentSectionId],
    );
  }, [currentSectionId]);

  function toggleSection(sectionId: string) {
    setExpandedSections((sections) =>
      sections.includes(sectionId)
        ? sections.filter((id) => id !== sectionId)
        : [...sections, sectionId],
    );
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <span className="app-brand__mark"><BookOpen size={17} /></span>
          <span>
            <strong>AI 教师助手</strong>
            <small>教学工作台</small>
          </span>
        </div>

        <nav className="app-navigation" aria-label="全局导航">
          <p className="app-navigation__label">工作空间</p>
          {NAVIGATION_SECTIONS.map((section) => {
            const expanded = expandedSections.includes(section.id);
            const sectionActive = section.items.some((item) => item.id === currentPage);
            const SectionIcon = section.icon;
            return (
              <div className="app-navigation__section" key={section.id}>
                <button
                  aria-expanded={expanded}
                  className={`app-navigation__parent ${sectionActive ? 'is-active' : ''}`}
                  onClick={() => toggleSection(section.id)}
                  type="button"
                >
                  <SectionIcon size={17} />
                  <span>{section.label}</span>
                  <ChevronDown className={expanded ? 'is-expanded' : ''} size={15} />
                </button>
                {expanded && (
                  <div className="app-navigation__children">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = item.id === currentPage;
                      return (
                        <button
                          aria-current={active ? 'page' : undefined}
                          className={active ? 'is-active' : ''}
                          key={item.id}
                          onClick={() => onNavigate(item.id)}
                          type="button"
                        >
                          <ItemIcon size={15} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="app-profile">
          <span className="app-profile__avatar">王</span>
          <span><strong>王老师</strong><small>六年级数学</small></span>
          <Settings size={15} />
        </div>
      </aside>

      <section className="app-stage">
        <header className="app-header">
          <div className="app-header__title">
            <div className="app-breadcrumbs">
              {metadata.breadcrumbs.map((breadcrumb, index) => (
                <span key={breadcrumb}>
                  {index > 0 && <ChevronRight size={11} />}
                  {breadcrumb}
                </span>
              ))}
            </div>
            <h1>{metadata.title}</h1>
          </div>
          <div className="app-header__actions">
            <button aria-label="搜索" title="搜索" type="button"><Search size={17} /></button>
            <button aria-label="通知" className="has-notification" title="通知" type="button"><Bell size={17} /></button>
          </div>
        </header>
        <main className={`app-content ${currentPage === 4 ? 'app-content--workspace' : ''}`}>
          {children}
        </main>
      </section>
    </div>
  );
}
