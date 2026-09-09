import { Contact } from '../db/Contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder = 'asc',
  type,
  isFavourite,
} = {}) => {
  const skip = (page - 1) * perPage;

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite;
  }

  const query = Contact.find(filter);

  if (sortBy) {
    query.sort({
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    });
  }

  const [contacts, totalItems] = await Promise.all([
    query.skip(skip).limit(perPage),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
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
