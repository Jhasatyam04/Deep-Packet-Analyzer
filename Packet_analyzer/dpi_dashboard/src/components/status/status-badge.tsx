import { AlertTriangle, Ban, CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AppDisposition, EngineLifecycle, FlowDisposition, SessionStatus, ThreadHealth } from "@/types/dpi";

const engineMap: Record<EngineLifecycle, { label: string; variant: "success" | "info" | "warning" | "danger"; Icon: typeof CheckCircle2; pulse?: boolean }> = {
  online: { label: "Online", variant: "success", Icon: CheckCircle2 },
  processing: { label: "Processing", variant: "info", Icon: LoaderCircle, pulse: true },
  idle: { label: "Idle", variant: "warning", Icon: AlertTriangle },
  error: { label: "Error", variant: "danger", Icon: XCircle },
};

export function EngineStatusBadge({ status }: { status: EngineLifecycle }) {
  const { label, variant, Icon, pulse } = engineMap[status];
  return (
    <Badge variant={variant} className="normal-case tracking-normal">
      <Icon className={cn("size-3", pulse && "animate-spin")} aria-hidden />
      {label}
    </Badge>
  );
}

export function TrafficStatusBadge({
  status,
}: {
  status: FlowDisposition | AppDisposition | "normal" | "processing" | "blocked" | "warning" | "error";
}) {
  if (status === "forwarded" || status === "allowed" || status === "normal") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="size-3" aria-hidden />
        {status === "forwarded" ? "Fwd" : status === "allowed" ? "Allow" : "OK"}
      </Badge>
    );
  }
  if (status === "dropped" || status === "blocked") {
    return (
      <Badge variant="danger">
        <Ban className="size-3" aria-hidden />
        Blocked
      </Badge>
    );
  }
  if (status === "processing") {
    return (
      <Badge variant="info">
        <LoaderCircle className="size-3 animate-spin" aria-hidden />
        Processing
      </Badge>
    );
  }
  if (status === "warning") {
    return (
      <Badge variant="warning">
        <AlertTriangle className="size-3" aria-hidden />
        Warning
      </Badge>
    );
  }
  return (
    <Badge variant="danger">
      <XCircle className="size-3" aria-hidden />
      Error
    </Badge>
  );
}

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const map: Record<SessionStatus, { label: string; variant: "success" | "info" | "warning" | "danger" | "default" }> = {
    idle: { label: "Idle", variant: "warning" },
    queued: { label: "Queued", variant: "default" },
    processing: { label: "Processing", variant: "info" },
    completed: { label: "Completed", variant: "success" },
    failed: { label: "Failed", variant: "danger" },
  };
  const item = map[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function ThreadHealthBadge({ status }: { status: ThreadHealth }) {
  if (status === "ok") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="size-3" aria-hidden />
        OK
      </Badge>
    );
  }
  if (status === "warning") {
    return (
      <Badge variant="warning">
        <AlertTriangle className="size-3" aria-hidden />
        Queue high
      </Badge>
    );
  }
  return (
    <Badge variant="danger">
      <XCircle className="size-3" aria-hidden />
      Error
    </Badge>
  );
}

export function LiveDot({ active }: { active: boolean }) {
  return (
    <span className="relative inline-flex size-2" aria-hidden>
      <span
        className={cn(
          "absolute inline-flex size-full rounded-full",
          active ? "bg-success/40 pulse-dot" : "bg-muted-foreground/40",
        )}
      />
      <span className={cn("relative inline-flex size-2 rounded-full", active ? "bg-success" : "bg-muted-foreground")} />
    </span>
  );
}
