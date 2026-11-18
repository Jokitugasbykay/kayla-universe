import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PROFILE_DATA, PROJECTS_DATA, EDUCATION_DATA, RESEARCH_DATA, SKILLS_DATA, INITIAL_GUESTBOOK } from '../../src/data/portfolio';
import { drawFrontBadgeCanvas, drawBackBadgeCanvas } from '../../src/components/Lanyard/LanyardBadge';
describe('Public content safety', () => {
    it('keeps approved identity, neutral education and no endorsements', () => {
        expect(PROFILE_DATA.name).toBe('Kayla Gabrielle');
        expect(PROFILE_DATA.university).toBe('Universitas Airlangga');
        expect(INITIAL_GUESTBOOK).toEqual([]);
        expect(EDUCATION_DATA.map(item => item.institution)).toEqual(['Universitas Airlangga', 'SMAK PENABUR Pondok Indah']);
        expect(EDUCATION_DATA[0].qualification).toContain('student');
        expect(PROJECTS_DATA.every(p => !p.github || new URL(p.github).pathname.split('/').filter(Boolean).length === 2)).toBe(true);
    });
    it('does not expose identifiers, private biography or unsupported titles', () => {
        const publicData = JSON.stringify({ PROFILE_DATA, PROJECTS_DATA, EDUCATION_DATA, RESEARCH_DATA, SKILLS_DATA });
        expect(publicData).not.toMatch(/citizen|researcher|Bachelor of Science|[\u2013\u2014]/i);
        const labels: string[] = [];
        const ctx = new Proxy({ fillText: (text: string) => labels.push(text) }, { get: (target, key) => key in target ? target[key as keyof typeof target] : () => { } });
        const canvas = { width: 520, height: 760, getContext: () => ctx } as unknown as HTMLCanvasElement;
        drawFrontBadgeCanvas(canvas, null);
        drawBackBadgeCanvas(canvas);
        expect(labels.join(' ')).toContain('Personal portfolio pass');
        expect(labels.join(' ')).not.toMatch(/\d{8,}|NIM|SECURE ID|STUDENT ID|citizen/i);
    });
    it('does not seed old guestbook entries when loading local notes', () => {
        const source = readFileSync('src/components/Contact/Guestbook.tsx', 'utf8');
        expect(source).toContain('kayla_portfolio_local_notes_v2');
        expect(source).not.toContain("getItem('kayla_portfolio_guestbook')");
    });
});
