import mongoose from 'mongoose';

const TicketVariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Variant name is required (e.g. VIP, General, Early Bird)'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Variant price is required'],
      min: [0, 'Price must be 0 or positive'],
      default: 0,
    },
    currency: {
      type: String,
      default: 'GBP',
      uppercase: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity/Stock is required'],
      min: [1, 'Capacity must be at least 1'],
      default: 100,
    },
    available: {
      type: Number,
      default: function () {
        return this.capacity;
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: true }
);

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['MUSIC', 'FESTIVAL', 'CULTURE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BUSINESS', 'COMMUNITY', 'OTHER'],
      default: 'MUSIC',
    },
    date: {
      type: String,
      required: [true, 'Event date string is required (e.g. 2026-08-23 or 23rd August)'],
    },
    time: {
      type: String,
      default: '19:00',
    },
    displayMonth: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'AUG',
      maxlength: 4,
    },
    displayDay: {
      type: String,
      trim: true,
      default: '23',
      maxlength: 3,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      default: 'London Arena',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      default: 'London',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Event poster image is required'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
    variants: {
      type: [TicketVariantSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one ticket variant is required (e.g. Standard, VIP, etc.)',
      },
      default: () => [
        {
          name: 'General Admission',
          price: 25,
          currency: 'GBP',
          capacity: 200,
          available: 200,
          description: 'Standard access to the event',
        },
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto generate slug if not provided
EventSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.random().toString(36).substring(2, 6);
  }
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
