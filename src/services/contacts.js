import { Contact } from '../db/Contact.js';

export const getAllContacts = async () => {
  return Contact.find();
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const createContact = async (payload) => {
  return Contact.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};

export const deleteContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
