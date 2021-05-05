//https://simonplend.com/how-to-handle-request-validation-in-your-express-api/
const express = require("express");

const {Validator, ValidationError,} = require("express-json-validator-middleware");

const { validate } = new Validator();

//funcion que permite la validacion
function validationErrorMiddleware(error, request, response, next) {
	if (response.headersSent) {
		return next(error);
	}

	const isValidationError = error instanceof ValidationError;
	if (!isValidationError) {
		return next(error);
	}

	response.status(400).json({
		errors: error.validationErrors,
	});
  console.log("Error en la validación del esquema");
	next();
}

const userSchema = {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "idUser": {
        "type": "integer"
      },
      "email": {
        "type": "string"
      },
      "phone": {
        "type": "integer"
      },
      "password": {
        "type": "string"
      }
    },
    "required": [
      "name",
      "idUser",
      "email",
      "phone",
      "password"
    ]
};

const app = express();
app.use(express.json());

//metodo post
app.post(
	"/user",
	validate({ body: userSchema }),
	function createUserRouteHandler(request, response, next) {
		response.json(request.body);
		next();
        console.log("Validacion del esquema: ", request.body);
	}
);

app.use(validationErrorMiddleware);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
	console.log(`Example app listening at http://localhost:${PORT}`)
);