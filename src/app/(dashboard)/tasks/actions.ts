"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as tasksService from "@/services/tasks";

export async function generateRemindersAction() {
  const { userId } = await auth();
  if (!userId) return;

  await tasksService.generateFollowUpReminders();
  revalidatePath("/tasks");
}

export async function completeTaskAction(taskId: string) {
  const { userId } = await auth();
  if (!userId) return;

  await tasksService.completeTask(taskId);
  revalidatePath("/tasks");
}
