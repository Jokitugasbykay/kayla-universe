export interface ProjectItem {
    id: string;
    title: string;
    category: string;
    year: string;
    summary: string;
    description: string;
    highlights: string[];
    technologies: string[];
    link?: string;
    linkLabel?: string;
    github?: string;
    previewImage?: string;
    accentColor?: string;
}
export interface EducationItem {
    period: string;
    institution: string;
    qualification: string;
    location: string;
    description: string;
    coursework: string[];
    badge: string;
    logo?: string;
}
export interface SkillCategory {
    categoryNumber: string;
    domain: string;
    summary: string;
    items: string[];
    focusPill: string;
}
export interface ResearchInterest {
    code: string;
    title: string;
    subtitle: string;
    abstract: string;
    tags: string[];
    status: string;
}
export interface GuestbookEntry {
    id: string;
    name: string;
    role: string;
    comment: string;
    timestamp: string;
}
export interface PortfolioProfile {
    name: string;
    tagline: string;
    shortBio: string;
    currentRole: string;
    university: string;
    semester: string;
    github: string;
    githubUsername: string;
}
