import { hasHtmlCharacters } from '@/utils/validate/hasHtmlCharacters';

export const noHtmlRule = {
  validator: (_: unknown, value?: string) => {
    if (!value || !hasHtmlCharacters(value)) {
      return Promise.resolve();
    }

    return Promise.reject(new Error('HTML-разметка запрещена'));
  },
};
