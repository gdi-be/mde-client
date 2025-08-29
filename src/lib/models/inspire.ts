export type InspireThemeConfig = {
  key: string;
  label: string;
  schemaNames: string[];
};

export type InspireRegister = {
  register: {
    registry: {
      label: {
        text: string;
        lang: string;
      };
      id: string;
    };
    containeditems: InspireThemeItem[];
  };
};

export type InspireThemeItem = {
  theme: {
    'governance level': {
      label: {
        text: string;
        lang: string;
      };
      id: string;
    };
    created: string;
    'governance-level': {
      label: {
        text: string;
        lang: string;
      };
      uri: string;
    };
    description: {
      text: string;
      lang: string;
    };
    language: string;
    label: {
      text: string;
      lang: string;
    };
    itemclass: {
      label: {
        text: string;
        lang: string;
      };
      id: string;
    };
    themenumber: string;
    definition: {
      text: string;
      lang: string;
    };
    id: string;
    latestversion: string;
    thisversion: string;
    historyversion: { version: string }[];
    annex: string;
    status: {
      label: {
        text: string;
        lang: string;
      };
      id: string;
    };
    register: {
      registry: {
        label: {
          text: string;
          lang: string;
        };
        id: string;
      };
      label: {
        text: string;
        lang: string;
      };
      id: string;
    };
  };
};
