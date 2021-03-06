const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcrypt");

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const userSchema = new Schema(
  {
    dni: Number,
    dniType: String,
    name: {
      type: String,
      required: [true, "El campo nombre es requerido"],
    },
    lastname: {
      type: String,
      required: [true, "El campo apellido es requerido"],
    },
    birthday: Date,
    email: {
      type: String,
      required: [true, "El campo email es requerido"],
      match: [emailRegex, "Email invalido"],
      validate: [
        {
          validator(email) {
            return models.User.findOne({ email })
              .then((user) => {
                return !user;
              })
              .catch(() => false);
          },
          message: "El correo está en uso",
        },
      ],
    },
    address: {
      type: String,
      required: [true, "El campo dirección es requerido"],
    },
    neighborhood: String,
    phone: {
      type: String,
      required: [true, "El campo teléfono es requerido"],
    },
    height: Number,
    weight: Number,
    active: Boolean,
    password: {
      type: String,
      required: [true, "El campo contraseña es requerido"],
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/mashcol/image/upload/v1626054119/crossfitapp-profileImages/john-doe_lny628.png",
    },
    wods: {
      type: [{ type: Schema.Types.ObjectId, ref: "Wod" }],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

const User = model("User", userSchema);

module.exports = User;
