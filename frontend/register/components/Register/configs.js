export const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export const key = 'updatable';
