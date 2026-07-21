import Link from "next/link";
import { RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getIncompleteTasks } from "@/services/tasks";
import { TASK_TYPE_LABELS } from "@/types/task";
import { generateRemindersAction, completeTaskAction } from "./actions";

export default async function TasksPage() {
  const tasks = await getIncompleteTasks();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} open reminder{tasks.length === 1 ? "" : "s"}. These are reminders
            only — nothing here is ever sent to a lead automatically.
          </p>
        </div>
        <form action={generateRemindersAction}>
          <Button type="submit" variant="outline">
            <RefreshCw className="size-4" />
            Check for New Reminders
          </Button>
        </form>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reminder</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No open reminders.
                </TableCell>
              </TableRow>
            )}
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Link href={`/leads/${task.leadId}`} className="hover:underline">
                    {task.lead.businessName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{TASK_TYPE_LABELS[task.type]}</Badge>
                </TableCell>
                <TableCell>{task.dueDate.toLocaleString()}</TableCell>
                <TableCell>
                  <form action={completeTaskAction.bind(null, task.id)}>
                    <Button type="submit" variant="ghost" size="icon" aria-label="Mark done">
                      <Check className="size-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
