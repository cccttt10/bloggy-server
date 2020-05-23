// import { ProjectState } from 'global';
// import mongoose from 'mongoose';
// import autoIncrement from 'mongoose-auto-increment';

// import db from '../mongodb.config';
// const instance = db.instance;

// export type ProjectDocument = mongoose.Document & {
//     title: string;
//     content: string;
//     img: string;
//     url: string;
//     state: ProjectState;
//     startDate: Date;
//     endDate: Date;
//     updatedOn: Date;
// };

// const projectSchema = new instance.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     img: { type: String, required: true },
//     url: { type: String, required: true },
//     state: { type: Number, default: 1 }, // 1: finished, 2: in progress, 3: aborted
//     startDate: { type: Date, default: Date.now },
//     endDate: { type: Date, default: Date.now },
//     updatedOn: { type: Date, default: Date.now },
// });

// /*
// configure auto-incrementing id
// */
// projectSchema.plugin(autoIncrement.plugin, {
//     model: 'Project',
//     field: 'id',
//     startAt: 1,
//     incrementBy: 1,
// });

// export const Project = instance.model<ProjectDocument>('Project', projectSchema);
