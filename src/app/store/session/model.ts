
export type Language = 'en' | 'de';

export interface ISession {
  config: {
    production: boolean;
    environment: string;
  };
  language: Language;
}
