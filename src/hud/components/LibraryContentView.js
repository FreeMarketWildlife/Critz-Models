const DESCRIPTION_BREAK_PATTERN = /<br\s*\/?>\s*<br\s*\/?>/i;

const splitDescriptionIntoParagraphs = (description = '') =>
  String(description || '')
    .split(DESCRIPTION_BREAK_PATTERN)
    .map((entry) => entry.trim())
    .filter(Boolean);

export class LibraryContentView {
  constructor({ element, onSelect = null }) {
    this.element = element;
    this.onSelect = onSelect;
    this.item = null;
    this.activeTimelineMilestoneId = null;
    this.timelineButtons = new Map();
  }

  render(item) {
    if (!this.element) {
      return;
    }

    const previousItemId = this.item?.id || null;
    this.item = item || null;
    this.timelineButtons.clear();
    if ((item?.id || null) !== previousItemId) {
      this.activeTimelineMilestoneId = null;
    }
    this.element.innerHTML = '';

    if (!item) {
      return;
    }

    const article = document.createElement('article');
    article.className = 'library-note';

    const header = document.createElement('header');
    header.className = 'library-note__header';

    if (item.footer) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'library-note__eyebrow';
      eyebrow.textContent = item.footer;
      header.appendChild(eyebrow);
    }

    const heading = document.createElement('h3');
    heading.className = 'library-note__title';
    heading.textContent = item.title || item.label || 'Library';
    header.appendChild(heading);

    if (item.label && item.label !== item.title) {
      const label = document.createElement('span');
      label.className = 'library-note__tag';
      label.textContent = item.label;
      header.appendChild(label);
    }

    const body = document.createElement('div');
    body.className = 'library-note__body';

    if (item.viewType === 'timeline' && item.timeline) {
      this.renderTimelineBody(body, item);
    } else {
      this.renderProseBody(body, item);
    }

    article.append(header, body);
    this.element.appendChild(article);
  }

  renderProseBody(body, item) {
    const prose = document.createElement('div');
    prose.className = 'library-note__prose';

    const paragraphs = splitDescriptionIntoParagraphs(item.description);

    if (!paragraphs.length) {
      const empty = document.createElement('p');
      empty.className = 'library-note__paragraph';
      empty.textContent = 'No notes have been added yet.';
      prose.appendChild(empty);
    } else {
      paragraphs.forEach((paragraphHtml) => {
        const paragraph = document.createElement('p');
        paragraph.className = 'library-note__paragraph';
        // Brainstorming and other library notes are authored in-repo and may contain links.
        paragraph.innerHTML = paragraphHtml;
        prose.appendChild(paragraph);
      });
    }

    body.appendChild(prose);
  }

  renderTimelineBody(body, item) {
    const prose = document.createElement('div');
    prose.className = 'library-note__prose';

    const paragraphs = splitDescriptionIntoParagraphs(item.description);
    paragraphs.forEach((paragraphHtml) => {
      const paragraph = document.createElement('p');
      paragraph.className = 'library-note__paragraph';
      paragraph.innerHTML = paragraphHtml;
      prose.appendChild(paragraph);
    });

    if (paragraphs.length) {
      body.appendChild(prose);
    }

    const timeline = document.createElement('section');
    timeline.className = 'library-timeline';
    timeline.setAttribute('aria-label', item.title || item.label || 'Timeline');

    const track = document.createElement('div');
    track.className = 'library-timeline__track';

    const content = document.createElement('div');
    content.className = 'library-timeline__content';

    const rail = document.createElement('div');
    rail.className = 'library-timeline__rail';
    content.appendChild(rail);

    const sections = Array.isArray(item.timeline?.sections) ? item.timeline.sections : [];
    sections.forEach((section, sectionIndex) => {
      content.appendChild(this.buildTimelinePhase(item, section, sectionIndex));
    });

    track.appendChild(content);
    timeline.appendChild(track);
    body.appendChild(timeline);
    this.syncActiveTimelineMilestone();
  }

  buildTimelinePhase(item, section, sectionIndex) {
    const phase = document.createElement('section');
    phase.className = 'timeline-phase';
    phase.dataset.timelinePhase = section.id || `phase-${sectionIndex}`;

    const header = document.createElement('header');
    header.className = 'timeline-phase__header';

    const title = document.createElement('h4');
    title.className = 'timeline-phase__title';
    title.textContent = section.label || 'Timeline Section';
    header.appendChild(title);

    if (section.description) {
      const description = document.createElement('p');
      description.className = 'timeline-phase__description';
      description.textContent = section.description;
      header.appendChild(description);
    }

    phase.appendChild(header);

    const events = document.createElement('div');
    events.className = 'timeline-phase__events';

    const groups = Array.isArray(section.groups) ? section.groups : [];
    let milestoneIndex = 0;
    groups.forEach((group) => {
      const milestones = Array.isArray(group.milestones) ? group.milestones : [];
      milestones.forEach((milestone) => {
        const placement = (milestoneIndex + sectionIndex) % 2 === 0 ? 'above' : 'below';
        events.appendChild(
          this.buildTimelineEvent(item, section, group, milestone, {
            placement,
          })
        );
        milestoneIndex += 1;
      });
    });

    phase.appendChild(events);
    return phase;
  }

  buildTimelineEvent(item, section, group, milestone, { placement = 'above' } = {}) {
    const event = document.createElement('article');
    event.className = `timeline-event timeline-event--${placement}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `timeline-milestone timeline-milestone--${milestone.state || 'planned'}`;
    button.dataset.timelineMilestoneId = milestone.id;

    const label = document.createElement('span');
    label.className = 'timeline-milestone__label';
    label.textContent = milestone.label || milestone.title || milestone.id || 'Milestone';
    button.appendChild(label);

    button.addEventListener('click', () => {
      this.activeTimelineMilestoneId = milestone.id;
      this.syncActiveTimelineMilestone();
      this.onSelect?.({
        type: 'timeline-milestone',
        item,
        section,
        group,
        milestone,
        info: {
          title: milestone.title || milestone.label || 'Milestone',
          description: milestone.detail || 'No milestone notes have been added yet.',
          footer:
            milestone.detailFooter ||
            item.footer ||
            section.label ||
            'Timeline',
        },
      });
    });

    const stem = document.createElement('span');
    stem.className = 'timeline-event__stem';
    stem.setAttribute('aria-hidden', 'true');

    const dot = document.createElement('span');
    dot.className = `timeline-event__dot timeline-event__dot--${milestone.state || 'planned'}`;
    dot.setAttribute('aria-hidden', 'true');

    if (placement === 'above') {
      event.append(button, stem, dot);
    } else {
      event.append(dot, stem, button);
    }

    this.timelineButtons.set(milestone.id, button);
    return event;
  }

  syncActiveTimelineMilestone() {
    this.timelineButtons.forEach((button, milestoneId) => {
      const isActive = milestoneId === this.activeTimelineMilestoneId;
      button.classList.toggle('is-active', isActive);
      button.closest('.timeline-event')?.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }
}
