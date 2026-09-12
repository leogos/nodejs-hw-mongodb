import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    isFavourite: {
      type: Boolean,
      default: false,
    },

    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },

    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Contact = model('Contact', contactSchema);
