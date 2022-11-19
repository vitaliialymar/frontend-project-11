import * as yup from 'yup';

export default (fields, urls, i18next) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18next.t('alreadyAdded'),
      required: i18next.t('notToBeEmpty'),
    },
    string: {
      url: i18next.t('toBeURL'),
    },
  });

  const schema = yup.object({
    url: yup.string().url().required()
      .notOneOf(urls.map((item) => item.url)),
  });
  return schema.validate(fields);
};
