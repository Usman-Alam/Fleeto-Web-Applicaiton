import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Add index for automatic cleanup
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
export default Session;