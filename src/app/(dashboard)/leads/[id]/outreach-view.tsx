"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MESSAGE_SLOTS } from "@/types/message";
import type { Message } from "@/generated/prisma/client";

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function OutreachView({ messages }: { messages: Message[] }) {
  const byKey = new Map(
    messages.map((m) => [`${m.channel}:${m.sequenceStep}`, m])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outreach Messages</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {MESSAGE_SLOTS.map((slot) => {
          const message = byKey.get(`${slot.channel}:${slot.sequenceStep}`);
          if (!message) return null;
          return (
            <div key={slot.key} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{slot.label}</h3>
                <CopyButton content={message.content} />
              </div>
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
