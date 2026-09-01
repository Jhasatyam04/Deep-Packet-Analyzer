import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/status/widget-states";
import { Table, TableWrap, Td, Th, THead } from "@/components/tables/simple-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateRule, useDeleteRule, useRules, useUpdateRule } from "@/hooks/use-dpi";
import { RULE_TYPE_LABEL } from "@/lib/app-meta";
import { formatDateTime, formatInteger } from "@/lib/format";
import { DpiApiError } from "@/services/dpi/client";
import type { BlockingRule, RuleInput, RuleType } from "@/types/dpi";

export const Route = createFileRoute("/_dash/rules")({
  component: RulesPage,
});

function RulesPage() {
  const [tab, setTab] = useState<RuleType | "all">("all");
  const rules = useRules(tab);
  const createRule = useCreateRule();
  const updateRule = useUpdateRule();
  const deleteRule = useDeleteRule();
  const [editor, setEditor] = useState<{ mode: "create" } | { mode: "edit"; rule: BlockingRule } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BlockingRule | null>(null);

  return (
    <div>
      <PageHeader
        title="Blocking rules"
        description="IP, application, and domain rules evaluated by the engine. The dashboard only submits changes — the engine remains the source of truth."
        actions={
          <Button size="sm" onClick={() => setEditor({ mode: "create" })}>
            <Plus className="size-4" />
            Add rule
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-4">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as RuleType | "all")}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ip">IP</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="domain">Domain</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4">
            {rules.isLoading && !rules.data ? (
              <PanelSkeleton rows={6} />
            ) : rules.isError ? (
              <ErrorState error={rules.error} onRetry={() => rules.refetch()} />
            ) : !rules.data?.length ? (
              <EmptyState title="No rules" description="There are no blocking rules in this filter. Add an IP, application, or domain rule to drop matching traffic." />
            ) : (
              <TableWrap>
                <Table>
                  <THead>
                    <Th>Type</Th>
                    <Th>Value</Th>
                    <Th>Status</Th>
                    <Th>Traffic affected</Th>
                    <Th>Updated</Th>
                    <Th />
                  </THead>
                  <tbody>
                    {rules.data.map((rule) => (
                      <tr key={rule.id} className="hover:bg-elevated/60">
                        <Td>
                          <Badge variant="outline">{RULE_TYPE_LABEL[rule.type]}</Badge>
                        </Td>
                        <Td mono>{rule.value}</Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              disabled={updateRule.isPending}
                              onCheckedChange={(enabled) => {
                                updateRule.mutate(
                                  { id: rule.id, patch: { enabled } },
                                  {
                                    onSuccess: () => toast(enabled ? "Rule enabled" : "Rule disabled"),
                                    onError: (err) => toast.error(err instanceof Error ? err.message : "Update failed"),
                                  },
                                );
                              }}
                              aria-label={`Toggle ${rule.value}`}
                            />
                            <span className="text-xs text-muted-foreground">{rule.enabled ? "Enabled" : "Disabled"}</span>
                          </div>
                        </Td>
                        <Td mono>{formatInteger(rule.packetsAffected)}</Td>
                        <Td className="text-xs text-muted-foreground">{formatDateTime(rule.updatedAt)}</Td>
                        <Td>
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditor({ mode: "edit", rule })} aria-label="Edit rule">
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => setPendingDelete(rule)} aria-label="Delete rule">
                              <Trash2 className="size-3.5 text-danger" />
                            </Button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            )}
          </div>
        </CardContent>
      </Card>

      <RuleEditor
        key={editor ? (editor.mode === "edit" ? editor.rule.id : "create") : "closed"}
        open={Boolean(editor)}
        initial={editor?.mode === "edit" ? editor.rule : null}
        pending={createRule.isPending || updateRule.isPending}
        onOpenChange={(open) => !open && setEditor(null)}
        onSubmit={(input) => {
          if (editor?.mode === "edit") {
            updateRule.mutate(
              { id: editor.rule.id, patch: input },
              {
                onSuccess: () => {
                  toast("Rule updated");
                  setEditor(null);
                },
                onError: (err) => toast.error(messageOf(err)),
              },
            );
          } else {
            createRule.mutate(input, {
              onSuccess: () => {
                toast("Rule created");
                setEditor(null);
              },
              onError: (err) => toast.error(messageOf(err)),
            });
          }
        }}
      />

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete rule</DialogTitle>
            <DialogDescription>
              Remove {pendingDelete ? `${RULE_TYPE_LABEL[pendingDelete.type]} ${pendingDelete.value}` : "this rule"}? The engine will stop matching it on the next evaluation.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteRule.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                deleteRule.mutate(pendingDelete.id, {
                  onSuccess: () => {
                    toast("Rule deleted");
                    setPendingDelete(null);
                  },
                  onError: (err) => toast.error(messageOf(err)),
                });
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function messageOf(err: unknown): string {
  if (err instanceof DpiApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Request failed";
}

function RuleEditor({
  open,
  initial,
  pending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  initial: BlockingRule | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: RuleInput) => void;
}) {
  const [type, setType] = useState<RuleType>(initial?.type ?? "domain");
  const [value, setValue] = useState(initial?.value ?? "");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);

  const placeholders: Record<RuleType, string> = {
    ip: "203.0.113.77",
    application: "YouTube",
    domain: "tiktok",
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) {
          setType(initial?.type ?? "domain");
          setValue(initial?.value ?? "");
          setEnabled(initial?.enabled ?? true);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit rule" : "Add rule"}</DialogTitle>
          <DialogDescription>Rules are stored and enforced by the DPI engine, not the dashboard.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ type, value: value.trim(), enabled });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="rule-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as RuleType)}>
              <SelectTrigger id="rule-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ip">IP</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="domain">Domain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rule-value">Value</Label>
            <Input
              id="rule-value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholders[type]}
              required
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <Label htmlFor="rule-enabled">Enabled</Label>
            <Switch id="rule-enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !value.trim()}>
              {initial ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
