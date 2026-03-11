import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const contentPath = path.join(repoRoot, "content", "resume.json");
const templatePath = path.join(repoRoot, "src", "index.template.html");
const outputPath = path.join(repoRoot, "index.html");

const VALID_TONES = new Set(["default", "inverse"]);
const VALID_CARD_TYPES = new Set(["richText", "detailList"]);
const VALID_SECTION_TYPES = new Set(["paragraph", "list"]);

function invariant(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function ensurePlainObject(value, fieldPath) {
    invariant(isPlainObject(value), `${fieldPath} must be an object`);
}

function ensureString(value, fieldPath) {
    invariant(typeof value === "string" && value.trim() !== "", `${fieldPath} must be a non-empty string`);
}

function ensureArray(value, fieldPath) {
    invariant(Array.isArray(value), `${fieldPath} must be an array`);
}

function ensureTone(value, fieldPath) {
    invariant(VALID_TONES.has(value), `${fieldPath} must be one of: ${Array.from(VALID_TONES).join(", ")}`);
}

function ensureInlineContent(value, fieldPath) {
    if (typeof value === "string") {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((part, index) => ensureInlinePart(part, `${fieldPath}[${index}]`));
        return;
    }

    ensureInlinePart(value, fieldPath);
}

function ensureInlinePart(value, fieldPath) {
    if (typeof value === "string") {
        return;
    }

    ensurePlainObject(value, fieldPath);
    ensureString(value.text, `${fieldPath}.text`);
    if (value.href !== undefined) {
        ensureString(value.href, `${fieldPath}.href`);
    }
}

function ensureMarker(value, fieldPath) {
    ensurePlainObject(value, fieldPath);
    ensureString(value.caption, `${fieldPath}.caption`);
    ensureString(value.value, `${fieldPath}.value`);
}

function validateContent(content) {
    ensurePlainObject(content, "content");

    ensurePlainObject(content.page, "page");
    ensureString(content.page.lang, "page.lang");
    ensureString(content.page.title, "page.title");

    ensurePlainObject(content.page.themeSwitch, "page.themeSwitch");
    ensureString(content.page.themeSwitch.label, "page.themeSwitch.label");
    ensureString(content.page.themeSwitch.ariaLabel, "page.themeSwitch.ariaLabel");
    ensurePlainObject(content.page.themeSwitch.options, "page.themeSwitch.options");
    ["light", "dark", "system"].forEach((mode) => {
        ensureString(content.page.themeSwitch.options[mode], `page.themeSwitch.options.${mode}`);
    });

    ensurePlainObject(content.page.exportPdf, "page.exportPdf");
    ensureString(content.page.exportPdf.label, "page.exportPdf.label");
    ensureString(content.page.exportPdf.ariaLabel, "page.exportPdf.ariaLabel");

    ensurePlainObject(content.page.sections, "page.sections");
    ["intro", "skills", "experiences", "articles", "openSources", "thanks"].forEach((key) => {
        ensurePlainObject(content.page.sections[key], `page.sections.${key}`);
        ensureString(content.page.sections[key].label, `page.sections.${key}.label`);
        ensureString(content.page.sections[key].title, `page.sections.${key}.title`);
    });

    ensurePlainObject(content.hero, "hero");
    ensureString(content.hero.eyebrow, "hero.eyebrow");
    ensureString(content.hero.name, "hero.name");
    ensureString(content.hero.role, "hero.role");
    ensureString(content.hero.tagline, "hero.tagline");
    ensureString(content.hero.summary, "hero.summary");
    ensurePlainObject(content.hero.portrait, "hero.portrait");
    ensureString(content.hero.portrait.src, "hero.portrait.src");
    ensureString(content.hero.portrait.alt, "hero.portrait.alt");
    ensureString(content.hero.portrait.badge, "hero.portrait.badge");
    ensureString(content.hero.portrait.caption, "hero.portrait.caption");
    ensureArray(content.hero.metrics, "hero.metrics");
    content.hero.metrics.forEach((metric, index) => {
        ensurePlainObject(metric, `hero.metrics[${index}]`);
        ensureTone(metric.tone, `hero.metrics[${index}].tone`);
        ensureString(metric.label, `hero.metrics[${index}].label`);
        ensureString(metric.value, `hero.metrics[${index}].value`);
    });

    ensureArray(content.introCards, "introCards");
    content.introCards.forEach((card, index) => {
        ensurePlainObject(card, `introCards[${index}]`);
        ensureTone(card.tone, `introCards[${index}].tone`);
        ensureString(card.label, `introCards[${index}].label`);
        ensureString(card.title, `introCards[${index}].title`);
        invariant(VALID_CARD_TYPES.has(card.type), `introCards[${index}].type must be one of: ${Array.from(VALID_CARD_TYPES).join(", ")}`);

        if (card.type === "richText") {
            ensureInlineContent(card.content, `introCards[${index}].content`);
            return;
        }

        ensureArray(card.items, `introCards[${index}].items`);
        card.items.forEach((item, itemIndex) => {
            ensurePlainObject(item, `introCards[${index}].items[${itemIndex}]`);
            ensureString(item.term, `introCards[${index}].items[${itemIndex}].term`);
            ensureString(item.value, `introCards[${index}].items[${itemIndex}].value`);
            if (item.href !== undefined) {
                ensureString(item.href, `introCards[${index}].items[${itemIndex}].href`);
            }
        });
    });

    ensureArray(content.skills, "skills");
    content.skills.forEach((skill, index) => ensureString(skill, `skills[${index}]`));

    ensureArray(content.experiences, "experiences");
    content.experiences.forEach((experience, index) => {
        ensurePlainObject(experience, `experiences[${index}]`);
        ensureTone(experience.tone, `experiences[${index}].tone`);
        ensureString(experience.company, `experiences[${index}].company`);
        ensureString(experience.role, `experiences[${index}].role`);
        if (experience.marker !== undefined) {
            ensureMarker(experience.marker, `experiences[${index}].marker`);
        }

        ensureArray(experience.sections, `experiences[${index}].sections`);
        experience.sections.forEach((section, sectionIndex) => {
            ensurePlainObject(section, `experiences[${index}].sections[${sectionIndex}]`);
            ensureString(section.label, `experiences[${index}].sections[${sectionIndex}].label`);
            invariant(
                VALID_SECTION_TYPES.has(section.type),
                `experiences[${index}].sections[${sectionIndex}].type must be one of: ${Array.from(VALID_SECTION_TYPES).join(", ")}`
            );

            if (section.type === "paragraph") {
                ensureInlineContent(section.content, `experiences[${index}].sections[${sectionIndex}].content`);
                return;
            }

            ensureArray(section.content, `experiences[${index}].sections[${sectionIndex}].content`);
            section.content.forEach((item, itemIndex) => {
                ensureInlineContent(item, `experiences[${index}].sections[${sectionIndex}].content[${itemIndex}]`);
            });
        });
    });

    ensureMarker(content.experienceEndMarker, "experienceEndMarker");

    ensureArray(content.articles, "articles");
    content.articles.forEach((article, index) => validateEditorialItem(article, `articles[${index}]`, false));

    ensureArray(content.openSources, "openSources");
    content.openSources.forEach((item, index) => validateEditorialItem(item, `openSources[${index}]`, true));

    ensurePlainObject(content.thanks, "thanks");
    ensureTone(content.thanks.tone, "thanks.tone");
    ensureString(content.thanks.kicker, "thanks.kicker");
    ensureString(content.thanks.message, "thanks.message");
}

function validateEditorialItem(item, fieldPath, badgeAllowed) {
    ensurePlainObject(item, fieldPath);
    if (item.tone !== undefined) {
        ensureTone(item.tone, `${fieldPath}.tone`);
    }
    ensureString(item.kicker, `${fieldPath}.kicker`);
    ensureString(item.title, `${fieldPath}.title`);
    ensureString(item.href, `${fieldPath}.href`);
    ensureString(item.meta, `${fieldPath}.meta`);
    if (badgeAllowed && item.badgeSrc !== undefined) {
        ensureString(item.badgeSrc, `${fieldPath}.badgeSrc`);
        ensureString(item.badgeAlt, `${fieldPath}.badgeAlt`);
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
    return escapeHtml(value);
}

function isExternalHref(href) {
    return /^https?:\/\//.test(href);
}

function linkAttrs(href) {
    return isExternalHref(href) ? ' target="_blank" rel="noreferrer"' : "";
}

function toneClass(tone) {
    return tone === "inverse" ? " tone-inverse" : "";
}

function delayAttr(delay) {
    return delay > 0 ? ` data-aos-delay="${delay}"` : "";
}

function renderInlinePart(part) {
    if (typeof part === "string") {
        return escapeHtml(part);
    }

    const text = escapeHtml(part.text);
    if (!part.href) {
        return text;
    }

    return `<a href="${escapeAttr(part.href)}"${linkAttrs(part.href)}>${text}</a>`;
}

function renderInlineContent(content) {
    if (Array.isArray(content)) {
        return content.map(renderInlinePart).join("");
    }

    return renderInlinePart(content);
}

function renderLinkOrText(text, href) {
    if (!href) {
        return escapeHtml(text);
    }

    return `<a href="${escapeAttr(href)}"${linkAttrs(href)}>${escapeHtml(text)}</a>`;
}

function renderSectionHeader(section) {
    return [
        '<header class="section-header" data-aos="section-rise">',
        `    <p class="section-label">${escapeHtml(section.label)}</p>`,
        `    <h2 class="section-title">${escapeHtml(section.title)}</h2>`,
        "</header>"
    ].join("\n");
}

function renderThemeSwitch(themeSwitch) {
    return [
        '<div class="theme-switch">',
        `    <p class="theme-switch-label">${escapeHtml(themeSwitch.label)}</p>`,
        `    <div class="theme-switch-options" role="group" aria-label="${escapeAttr(themeSwitch.ariaLabel)}">`,
        `        <button type="button" data-theme-option="light" aria-pressed="false">${escapeHtml(themeSwitch.options.light)}</button>`,
        `        <button type="button" data-theme-option="dark" aria-pressed="false">${escapeHtml(themeSwitch.options.dark)}</button>`,
        `        <button type="button" data-theme-option="system" aria-pressed="false">${escapeHtml(themeSwitch.options.system)}</button>`,
        "    </div>",
        "</div>"
    ].join("\n");
}

function renderExportButton(exportPdf) {
    return `<button class="export-button" type="button" data-export-pdf aria-label="${escapeAttr(exportPdf.ariaLabel)}">${escapeHtml(exportPdf.label)}</button>`;
}

function renderHero(hero, themeSwitch, exportPdf) {
    const metrics = hero.metrics.map((metric, index) => {
        return [
            `<div class="metric${toneClass(metric.tone)}" data-aos="card-rise"${delayAttr(index * 50)}>`,
            `    <p class="metric-label">${escapeHtml(metric.label)}</p>`,
            `    <p class="metric-value">${escapeHtml(metric.value)}</p>`,
            "</div>"
        ].join("\n");
    }).join("\n");

    return [
        '<section class="hero">',
        '    <div class="hero-grid">',
        '        <div class="hero-copy" data-aos="hero-rise">',
        '            <div class="hero-topbar">',
        `                <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>`,
        '                <div class="hero-actions">',
        indent(renderThemeSwitch(themeSwitch), 20),
        `                    ${renderExportButton(exportPdf)}`,
        "                </div>",
        "            </div>",
        `            <h1 class="hero-name">${escapeHtml(hero.name)}</h1>`,
        `            <p class="hero-kicker">${escapeHtml(hero.role)}</p>`,
        `            <p class="hero-tagline">${escapeHtml(hero.tagline)}</p>`,
        `            <p class="hero-summary">${escapeHtml(hero.summary)}</p>`,
        "        </div>",
        '        <aside class="portrait-shell" data-aos="card-rise" data-aos-delay="80">',
        '            <div class="portrait-frame">',
        `                <img src="${escapeAttr(hero.portrait.src)}" alt="${escapeAttr(hero.portrait.alt)}">`,
        `                <p class="portrait-badge">${escapeHtml(hero.portrait.badge)}</p>`,
        "            </div>",
        `            <p class="portrait-caption">${escapeHtml(hero.portrait.caption)}</p>`,
        "        </aside>",
        "    </div>",
        '    <div class="hero-metrics">',
        indent(metrics, 8),
        "    </div>",
        "</section>"
    ].join("\n");
}

function renderIntroCard(card, index) {
    const content = card.type === "richText"
        ? `<p class="lead-text">${renderInlineContent(card.content)}</p>`
        : [
            '<div class="detail-list">',
            card.items.map((item) => [
                '    <div class="detail-row">',
                `        <p class="detail-term">${escapeHtml(item.term)}</p>`,
                `        <p class="detail-desc">${renderLinkOrText(item.value, item.href)}</p>`,
                "    </div>"
            ].join("\n")).join("\n"),
            "</div>"
        ].join("\n");

    return [
        `<article class="info-card${toneClass(card.tone)}" data-aos="card-rise"${delayAttr(index * 40)}>`,
        `    <p class="card-label">${escapeHtml(card.label)}</p>`,
        `    <h3 class="card-title">${escapeHtml(card.title)}</h3>`,
        indent(content, 4),
        "</article>"
    ].join("\n");
}

function renderIntro(section, introCards) {
    return [
        '<section class="section">',
        indent(renderSectionHeader(section), 4),
        '    <div class="intro-grid">',
        indent(introCards.map((card, index) => renderIntroCard(card, index)).join("\n"), 8),
        "    </div>",
        "</section>"
    ].join("\n");
}

function renderSkills(section, skills) {
    return [
        '<section class="section">',
        indent(renderSectionHeader(section), 4),
        '    <div class="skill-wall motion-sequence" data-aos="card-rise" data-aos-delay="40">',
        indent(skills.map((skill) => `<span class="skill-tag motion-child">${escapeHtml(skill)}</span>`).join("\n"), 8),
        "    </div>",
        "</section>"
    ].join("\n");
}

function renderMarker(marker) {
    return [
        '<div class="period-marker" data-aos="marker-slide">',
        `    <p class="period-caption">${escapeHtml(marker.caption)}</p>`,
        `    <p class="period-value">${escapeHtml(marker.value)}</p>`,
        "</div>"
    ].join("\n");
}

function renderExperienceSectionBlock(section) {
    const body = section.type === "paragraph"
        ? `<p>${renderInlineContent(section.content)}</p>`
        : [
            "<ul>",
            indent(section.content.map((item) => `<li>${renderInlineContent(item)}</li>`).join("\n"), 4),
            "</ul>"
        ].join("\n");

    return [
        '<section class="block motion-child">',
        `    <p class="block-label">${escapeHtml(section.label)}</p>`,
        indent(body, 4),
        "</section>"
    ].join("\n");
}

function renderExperienceCard(experience) {
    return [
        `<article class="experience-card${toneClass(experience.tone)} motion-sequence" data-aos="card-rise">`,
        '    <div class="experience-head motion-child">',
        `        <p class="experience-company">${escapeHtml(experience.company)}</p>`,
        `        <h3 class="experience-role">${escapeHtml(experience.role)}</h3>`,
        "    </div>",
        '    <div class="experience-body">',
        indent(experience.sections.map(renderExperienceSectionBlock).join("\n"), 8),
        "    </div>",
        "</article>"
    ].join("\n");
}

function renderExperiences(section, experiences, endMarker) {
    const content = experiences.map((experience) => {
        const parts = [];
        if (experience.marker) {
            parts.push(renderMarker(experience.marker));
        }
        parts.push(renderExperienceCard(experience));
        return parts.join("\n");
    }).join("\n\n");

    return [
        '<section class="section">',
        indent(renderSectionHeader(section), 4),
        '    <div class="experience-stack">',
        indent(content, 8),
        "",
        indent(renderMarker(endMarker), 8),
        "    </div>",
        "</section>"
    ].join("\n");
}

function renderEditorialItem(item, index) {
    const badge = item.badgeSrc
        ? `\n    <img src="${escapeAttr(item.badgeSrc)}" alt="${escapeAttr(item.badgeAlt)}">`
        : "";

    return [
        `<article class="editorial-item${toneClass(item.tone || "default")}" data-aos="card-rise"${delayAttr(index * 40)}>`,
        `    <p class="list-kicker">${escapeHtml(item.kicker)}</p>`,
        "    <h3 class=\"list-title\">",
        `        <a href="${escapeAttr(item.href)}"${linkAttrs(item.href)}>${escapeHtml(item.title)}</a>`,
        "    </h3>",
        `    <p class="list-meta">${escapeHtml(item.meta)}</p>${badge}`,
        "</article>"
    ].join("\n");
}

function renderEditorialSection(section, items) {
    return [
        '<section class="section">',
        indent(renderSectionHeader(section), 4),
        '    <div class="editorial-list">',
        indent(items.map((item, index) => renderEditorialItem(item, index)).join("\n"), 8),
        "    </div>",
        "</section>"
    ].join("\n");
}

function renderThanks(section, thanks) {
    return [
        '<section class="section">',
        indent(renderSectionHeader(section), 4),
        `    <div class="thanks-card${toneClass(thanks.tone)}" data-aos="card-rise">`,
        `        <p class="list-kicker">${escapeHtml(thanks.kicker)}</p>`,
        `        <p class="thanks-message">${escapeHtml(thanks.message)}</p>`,
        "    </div>",
        "</section>"
    ].join("\n");
}

function renderPage(content) {
    return [
        '<main class="page">',
        indent(renderHero(content.hero, content.page.themeSwitch, content.page.exportPdf), 4),
        "",
        indent(renderIntro(content.page.sections.intro, content.introCards), 4),
        "",
        indent(renderSkills(content.page.sections.skills, content.skills), 4),
        "",
        indent(renderExperiences(content.page.sections.experiences, content.experiences, content.experienceEndMarker), 4),
        "",
        indent(renderEditorialSection(content.page.sections.articles, content.articles), 4),
        "",
        indent(renderEditorialSection(content.page.sections.openSources, content.openSources), 4),
        "",
        indent(renderThanks(content.page.sections.thanks, content.thanks), 4),
        "</main>"
    ].join("\n");
}

function indent(value, spaces) {
    const prefix = " ".repeat(spaces);
    return value
        .split("\n")
        .map((line) => line ? `${prefix}${line}` : line)
        .join("\n");
}

function replaceRequired(source, searchValue, replacement, label) {
    invariant(source.includes(searchValue), `Template is missing ${label}`);
    return source.replace(searchValue, replacement);
}

function main() {
    const content = JSON.parse(readFileSync(contentPath, "utf8"));
    const template = readFileSync(templatePath, "utf8");

    validateContent(content);

    let output = template;
    output = replaceRequired(output, "{{PAGE_LANG}}", escapeAttr(content.page.lang), "PAGE_LANG placeholder");
    output = replaceRequired(output, "{{PAGE_TITLE}}", escapeHtml(content.page.title), "PAGE_TITLE placeholder");
    output = replaceRequired(output, "<!-- RESUME_CONTENT -->", renderPage(content), "RESUME_CONTENT placeholder");

    writeFileSync(outputPath, `${output.trimEnd()}\n`);
    console.log(`Built ${path.relative(repoRoot, outputPath)} from ${path.relative(repoRoot, contentPath)} and ${path.relative(repoRoot, templatePath)}`);
}

main();
