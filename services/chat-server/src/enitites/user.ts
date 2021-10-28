import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
	_id: Schema.Types.ObjectId;
	name: string;
	room: string;
	socketId: string;
	createdAt: Date | string;
	updatedAt: Date | string;
}
const UserSchema = new Schema<UserDocument>(
	{
		name: { type: Schema.Types.String, required: true },
		room: { type: Schema.Types.String, required: true },
		socketId: { type: Schema.Types.String, required: true },
	},
	{ _id: true, versionKey: false, timestamps: true }
);

export const User = mongoose.model<UserDocument>('User', UserSchema);
