import { Contact } from '../db/Contact.js';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder = 'asc',
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;

  const filter = {
    userId,
  };

  if (type) {
    filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite;
  }

  const sort = sortBy ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 } : {};

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).skip(skip).limit(perPage).sort(sort),
    Contact.countDocuments(filter),
  ]);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
  };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({
    _id: contactId,
    userId,
  });
};

export const createContact = async (payload) => {
  return Contact.create(payload);
};

export const updateContact = async (contactId, userId, payload) => {
  return Contact.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    payload,
    {
      new: true,
    },
  );
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
};
