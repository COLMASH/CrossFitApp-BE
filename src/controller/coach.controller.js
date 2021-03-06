const Coach = require("../models/coach.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  async create(req, res) {
    try {
      const { body } = req;
      const coach = await Coach.create(body);
      res.status(201).json(coach);
    } catch (error) {
      res.status(400).json("Error registrando un coach");
    }
  },
  async list(req, res) {
    try {
      const coaches = await Coach.find({}).select({ password: 0 });
      res.status(200).json(coaches);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async show(req, res) {
    try {
      const { coachId } = req;

      const coach = await Coach.findById(coachId);
      res.status(200).json(coach);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { coachId, body } = req;
      const coach = await Coach.findByIdAndUpdate(coachId, body, {
        new: true,
      });
      res.status(200).json({
        name: coach.name,
        lastname: coach.lastname,
        dni: coach.dni,
        dniType: coach.dniType,
        birthday: coach.birthday,
        email: coach.email,
        phone: coach.phone,
        profilePicture: coach.profilePicture,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const { coachId } = req.body;
      const coach = await Coach.findByIdAndDelete(coachId);
      res.status(200).json(coach);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const coach = await Coach.findOne({ email });

      if (!coach) {
        throw new Error("Contraseña o correo invalido");
      }

      const isValid = await bcrypt.compare(password, coach.password);

      if (!isValid) {
        throw new Error("Contraseña o correo invalido");
      }

      const token = jwt.sign({ coachId: coach._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24 * 365,
      });

      res.status(201).json({
        token,
        coach: {
          name: coach.name,
          lastname: coach.lastname,
          dni: coach.dni,
          dniType: coach.dniType,
          birthday: coach.birthday,
          email: coach.email,
          phone: coach.phone,
          active: coach.active,
          profilePicture: coach.profilePicture,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
