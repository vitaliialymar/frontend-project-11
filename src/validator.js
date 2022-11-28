import * as yup from 'yup';

export default (fields, urls) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'alreadyAdded',
      required: 'notToBeEmpty',
    },
    string: {
      url: 'toBeURL',
    },
  });

  const schema = yup.object({
    url: yup.string().url().required()
      .notOneOf(urls.map((item) => item.url)),
  });
  return schema.validate(fields);
};
