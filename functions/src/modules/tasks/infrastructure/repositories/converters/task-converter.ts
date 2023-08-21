import {Timestamp} from "firebase-admin/firestore";


import {Task} from "../../../domain/entities/task.entity";

/**
 * Firestore converter for Task entity. It is used to convert Task entity to
 * Firestore document and vice versa via the methods `toFirestore` and
 * `fromFirestore`.
 *
 * @see https://firebase.google.com/docs/firestore/manage-data/add-data#custom_objects
 */
export const taskConverter = {
  toFirestore(task: Task) {
    const createAtTimestamp = this.getTimestamp(task.createdAt);
    const updatedAtTimestamp = this.getTimestamp(task.updatedAt);
    const startDateTimestamp = this.getTimestamp(task.startDate);
    const dueDateTimestamp = this.getTimestamp(task.dueDate);


    return {
      createdAt: createAtTimestamp,
      updatedAt: updatedAtTimestamp,
      id: task.id,
      project: {
        ...task.project,
        platformURL: task.project.platformURL.href,
      },
      taskURL: task.taskURL.href,
      title: task.title,
      description: task.description,
      startDate: startDateTimestamp,
      dueDate: dueDateTimestamp,
      estimatedTime: task.estimatedTime,
      loggedTime: task.loggedTime,
      assigned: task.assigned.map((user) => ({
        ...user,
        platformURL: user.platformURL.href,
      })),
      creator: {
        ...task.creator,
        platformURL: task.creator.platformURL.href,
      },
      isCompleted: task.isCompleted,
      labels: task.labels.map((label) => ({
        ...label,
      })),
      priority: task.priority,
    };
  },

  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot,
  ) {
    const data = snapshot.data();

    return {
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      id: data.id,
      project: {
        ...data.project,
        platformURL: new URL(data.project.platformURL),
      },
      taskURL: new URL(data.taskURL),
      title: data.title,
      description: data.description,
      startDate: data.startDate?.toDate(),
      dueDate: data.dueDate?.toDate(),
      estimatedTime: data.estimatedTime,
      loggedTime: data.loggedTime,
      assigned: data.assigned.map((user: any) => ({
        ...user,
        platformURL: new URL(user.platformURL),
      })),
      creator: {
        ...data.creator,
        platformURL: new URL(data.creator.platformURL),
      },
      isCompleted: data.isCompleted,
      labels: data.labels.map((label: any) => ({
        ...label,
      })),
      priority: {
        ...data.priority,
      },
    } as Task;
  },

  /**
   * Converts a date to a timestamp. If the date is invalid, it returns 0.
   * @param {Date} date the date to convert to timestamp
   * @return {Timestamp} timestamp from the date or 0 if the date is invalid
   */
  getTimestamp(date?: Date): Timestamp {
    if (!date) return Timestamp.fromMillis(0);
    try {
      const time = date.getTime();
      if (time == 0) {
        return Timestamp.fromMillis(0);
      }
      return Timestamp.fromMillis(time);
    } catch (error) {
      return Timestamp.fromMillis(0);
    }
  },
};


