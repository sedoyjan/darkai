import { t } from "elysia";

export const ReminderDTO = t.Object({
  reminderTime: t.Number(),
  slug: t.String(),
});

export const TaskDTO = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.String(),
  priority: t.Number(),
  tasks: t.Array(t.String()),
  threadId: t.Optional(t.String()),
  createdAt: t.Number(),
  dueDate: t.Optional(t.Number()),
  isCompleted: t.Boolean(),
  color: t.Optional(t.String()),
  parentId: t.Optional(t.String()),
  reminders: t.Array(ReminderDTO),
});

export const UpdateTaskDTO = t.Composite([
  t.Partial(t.Omit(TaskDTO, ["id"])),
  t.Object({ id: t.String() }),
]);
