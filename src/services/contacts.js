import { Contact } from '../db/Contact.js';
import cloudinary from '../utils/cloudinary.js';

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

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'contacts',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const createContact = async (payload, file) => {
  let photo;

  if (file) {
    photo = await uploadToCloudinary(file.buffer);
  }

  return Contact.create({
    ...payload,
    ...(photo && { photo }),
  });
};

export const updateContact = async (contactId, userId, payload, file) => {
  let photo;

  if (file) {
    photo = await uploadToCloudinary(file.buffer);
  }

  return Contact.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    {
      ...payload,
      ...(photo && { photo }),
    },
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
