import Joi from "@hapi/joi";

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().max(255).required(),
    password: Joi.string().max(255).min(6).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().max(255).required(),
    password: Joi.string().max(255).min(6).required(),
  });
  return schema.validate(data);
};

export { registerValidation, loginValidation };
