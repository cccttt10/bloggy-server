import { ProjectState } from 'global';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

export type TimelineDocument = mongoose.Document & {
    title: string;
    content: string;
    state: ProjectState;
    startDate: Date;
    endDate: Date;
    updatedOn: Date;
};

const timelineSchema = new instance.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    state: { type: Number, default: 1 }, // 1: finished, 2: in progress, 3: aborted
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

/*
configure auto-incrementing id
*/
timelineSchema.plugin(autoIncrement.plugin, {
    model: 'Timeline',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const Timeline = instance.model<TimelineDocument>('Timeline', timelineSchema);
