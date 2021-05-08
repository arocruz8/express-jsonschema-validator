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
      "idProducto": {
          "$id": "#/properties/idProducto",
          "type": "integer"
      },
      "categoriaProducto": {
          "$id": "#/properties/categoriaProducto",
          "type": "string"
      },
      "nombreProducto": {
          "$id": "#/properties/nombreProducto",
          "type": "string"
      },
      "cantidad": {
          "$id": "#/properties/cantidad",
          "type": "integer"
      },
      "precio": {
          "$id": "#/properties/precio",
          "type": "integer"
      },
      "descripcion": {
          "$id": "#/properties/descripcion",
          "type": "string"
      },
      "foto": {
          "$id": "#/properties/foto",
          "type": "string"
      }
  },
  "required": [
      "idProducto",
      "categoriaProducto",
      "nombreProducto",
      "cantidad",
      "precio",
      "descripcion",
      "foto"
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