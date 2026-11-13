import { describe, it, expect } from 'vitest';
import {
  PROFILE_DATA,
  PROJECTS_DATA,
  EDUCATION_DATA,
  RESEARCH_DATA,
  SKILLS_DATA,
  INITIAL_GUESTBOOK
} from '../../src/data/portfolio';

describe('Kayla Universe Portfolio Data Integrity', () => {
  it('contains authentic profile information for Kayla Gabrielle', () => {
    expect(PROFILE_DATA.name).toBe('Kayla Gabrielle');
    expect(PROFILE_DATA.university).toBe('Universitas Airlangga');
    expect(PROFILE_DATA.semester).toBe('Semester 5');
    expect(PROFILE_DATA.email).toBe('kaylagabrielle.work@gmail.com');
    expect(PROFILE_DATA.github).toContain('github.com');
  });

  it('contains verified project records for JOKI.IN and Kayla Finance', () => {
    const ids = PROJECTS_DATA.map((p) => p.id);
    expect(ids).toContain('jokiin');
    expect(ids).toContain('kayla-finance');

    const jokiin = PROJECTS_DATA.find((p) => p.id === 'jokiin');
    expect(jokiin?.link).toBe('https://jokiin.my.id');
    expect(jokiin?.previewImage).toBe('/assets/jokiin-preview.png');

    const finance = PROJECTS_DATA.find((p) => p.id === 'kayla-finance');
    expect(finance?.previewImage).toBe('/assets/kayla-finance.svg');
  });

  it('records education at Universitas Airlangga in Semester 5', () => {
    const unair = EDUCATION_DATA.find((e) => e.institution.includes('Airlangga'));
    expect(unair).toBeDefined();
    expect(unair?.qualification).toContain('Physics');
    expect(unair?.coursework.length).toBeGreaterThan(3);
  });

  it('contains structured research interests', () => {
    expect(RESEARCH_DATA.length).toBeGreaterThanOrEqual(3);
    const codes = RESEARCH_DATA.map((r) => r.code);
    expect(codes).toContain('RES-01');
    expect(codes).toContain('RES-02');
    expect(codes).toContain('RES-03');
  });

  it('contains curated skill categories without fake percentage scores', () => {
    expect(SKILLS_DATA.length).toBe(4);
    SKILLS_DATA.forEach((cat) => {
      expect(cat.items.length).toBeGreaterThanOrEqual(4);
      expect(cat.domain).toBeDefined();
    });
  });

  it('STRICT RULE: verifies that NO string contains an em dash or en dash', () => {
    const hasDash = (str: string) => str.includes('\u2014') || str.includes('\u2013');

    // Profile check
    Object.values(PROFILE_DATA).forEach((val) => {
      if (typeof val === 'string') {
        expect(hasDash(val), `Found em dash or en dash in profile: ${val}`).toBe(false);
      }
    });

    // Projects check
    PROJECTS_DATA.forEach((p) => {
      expect(hasDash(p.title)).toBe(false);
      expect(hasDash(p.summary)).toBe(false);
      expect(hasDash(p.description)).toBe(false);
      p.highlights.forEach((h) => expect(hasDash(h)).toBe(false));
    });

    // Education check
    EDUCATION_DATA.forEach((e) => {
      expect(hasDash(e.institution)).toBe(false);
      expect(hasDash(e.description)).toBe(false);
      e.coursework.forEach((c) => expect(hasDash(c)).toBe(false));
    });

    // Research check
    RESEARCH_DATA.forEach((r) => {
      expect(hasDash(r.title)).toBe(false);
      expect(hasDash(r.abstract)).toBe(false);
    });

    // Guestbook check
    INITIAL_GUESTBOOK.forEach((g) => {
      expect(hasDash(g.comment)).toBe(false);
    });
  });
});
