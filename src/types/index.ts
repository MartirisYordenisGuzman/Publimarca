export type Locale = "en" | "es";

export type ProjectCategory = "all" | "motion" | "identity" | "spatial";

export interface LocalizedProjectCopy {
  badge: string;
  client: string;
  meta: string;
  title: string;
  desc: string;
  specs: string;
}

export interface ProjectCaseStudy {
  id: "p1" | "p2" | "p3";
  categories: ProjectCategory[];
  capability:
    | "Audiovisual Production"
    | "Brand Identity & Type"
    | "Social Narrative"
    | "Spatial Scenography";
  en: LocalizedProjectCopy;
  es: LocalizedProjectCopy;
}

export interface CommissionPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  capabilities: string[];
  scope: string;
  locale: Locale;
  submittedAt: string;
}

export interface PublimarcaConfig {
  formEndpoint?: string;
}

declare global {
  interface Window {
    PUBLIMARCA_CONFIG?: PublimarcaConfig;
    PUBLIMARCA_I18N?: {
      translations: Record<Locale, Record<string, string>>;
      projectDetails: Record<string, ProjectCaseStudy>;
    };
  }
}
