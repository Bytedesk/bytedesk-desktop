import { app } from 'electron';

export function getSystemLocale(): string {
  // 优先使用应用设置的语言
  const locale = app.getLocale();
  
  // 如果没有设置，则使用系统语言
  if (!locale) {
    return process.env.LANG || 
           process.env.LC_ALL || 
           process.env.LC_MESSAGES || 
           'en-US';
  }
  
  return locale;
} 