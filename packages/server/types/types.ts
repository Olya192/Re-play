// Типы для ответов от OAuth Яндекса
export interface YandexTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  id?: string;
}

export interface YandexUserResponse {
  id: string;
  login: string;
  display_name?: string;
  default_email?: string;
  default_avatar_id?: string;
  real_name?: string;
  first_name?: string;
  last_name?: string;
  sex?: string;
  birthday?: string;
  is_avatar_empty?: boolean;
}
