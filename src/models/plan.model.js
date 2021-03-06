const { Schema, model, models } = require("mongoose");

const planSchema = new Schema(
  {
    plan: {
      type: String,
      required: [true, "El nombre del plan es requerido."],
    },
    validity: {
      type: String,
      required: [true, "La vigencia del plan es requerida."],
    },
    credits: {
      type: Number,
      required: [true, "El número de créditos es requerido"],
    },
    price: {
      type: Number,
      required: [true, "El precio del plan es requerido"],
    },
  },
  {
    timestamps: true,
  }
);

const Plan = model("Plan", planSchema);

module.exports = Plan;
