import * as yup from 'yup';

export default (fields, urls, i18next) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18next.t('alreadyAdded'),
    },
    string: {
      url: i18next.t('danger'),
    },
  });

  const schema = yup.object({
    url: yup.string().url()
      .notOneOf(urls.map((item) => item.url)),
  });
  return schema.validate(fields);
};
