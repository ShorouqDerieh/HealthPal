
const Validator = require("fastest-validator");


const v = new Validator({
  useNewCustomChecks: true,
  messages: {
    required: "The '{field}' field is required",
    string: "The '{field}' field must be a string",
    number: "The '{field}' field must be a number",
    boolean: "The '{field}' field must be true or false",
    enumValue: "The '{field}' field must be one of: {expected}",
    min: "The '{field}' field must not be less than {expected}",
    max: "The '{field}' field must not be greater than {expected}",
    stringEmpty: "The '{field}' field cannot be empty",
  },
});


function validate({ schema, source = "body" }) {
  const check = v.compile(schema);
  return (req, res, next) => {
    const data =
      source === "query"
        ? req.query
        : source === "params"
        ? req.params
        : req.body;

    const result = check(data);
    if (result === true) return next();

    return res.status(400).json({
      message: "Invalid input data",
      errors: result.map((e) => ({
        field: e.field,
        message: e.message,
        expected: e.expected,
        actual: e.actual,
      })),
    });
  };
}

module.exports = { v, validate };
