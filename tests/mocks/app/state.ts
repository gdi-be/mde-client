const t = (key: string) => key;

export const page = {
  url: new URL('http://localhost'),
  params: {
    metadataid: 'test-metadata-id'
  },
  route: null,
  status: 200,
  error: null,
  form: null,
  state: {},
  data: {
    locale: 'en',
    t
  }
};
