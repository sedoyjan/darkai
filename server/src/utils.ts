import axios from "axios";
import { v4 } from "uuid";
import { Reminder, Task } from "./db";

export const uuid = () => {
  return v4();
};

export const getApplePublicKeys = async () => {
  const response = await axios.get("https://appleid.apple.com/auth/keys");
  return response.data.keys;
};

type TaskWithReminders = Task & {
  reminders: Reminder[];
};

export const mapTasksToDTOs = (tasks: TaskWithReminders[]) => {
  return tasks.map((task) => {
    return {
      ...task,
      createdAt: task.createdAt.getTime(),
      color: task.color || undefined,
      dueDate: task.dueDate?.getTime() || undefined,
      threadId: task.threadId || undefined,
      reminders: task.reminders.map((reminder) => {
        return {
          reminderTime: reminder.reminderTime.getTime(),
          slug: reminder.slug,
        };
      }),
      parentId: task.parentId || undefined,
    };
  });
};
