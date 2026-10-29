import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Festivals', 'Restaurants', 'Travel', 'Education', 'Community', 'Radio', 'Shopping'],
      default: 'Restaurants',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    city: {
      type: String,
      default: 'UK Wide',
    },
    website: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
