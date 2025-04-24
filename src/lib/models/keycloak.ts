export type Token = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  allowed_origins: string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type RefreshToken = {
  aud: string;
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  scope: string;
  sid: string;
  sub: string;
  typ: string;
};

export type Role = 'MdeDataOwner' | 'MdeEditor' | 'MdeQualityAssurance' | 'MdeAdministrator';
