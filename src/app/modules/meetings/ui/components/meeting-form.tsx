import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeneratedAvatar } from "@/components/avatar-generator";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { meetingsInsertSchema } from "../../schema";
import { MeetingGetOne } from "../../types";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { Loader2 } from "lucide-react";

interface MeetingFormProps {
  onSuccess: (id: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [agentSearch, setAgentSearch] = useState("");
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  type MeetingUpdateInput = z.infer<typeof meetingsInsertSchema> & { id: string };

  const createMeeting = useMutation(trpc.meetings.create.mutationOptions({
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
      toast.success("Meeting created successfully");
      onSuccess?.(data.id);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create meeting");
    },
  }));

  const updateMeeting = useMutation(trpc.meetings.update.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
      toast.success("Meeting updated successfully");
      onSuccess?.(initialValues.id);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update meeting");
    },
  }));

  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id } as MeetingUpdateInput);
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEdit ? "Edit Meeting" : "Create Meeting"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            {isEdit ? "Update the meeting details below." : "Fill out the form to create a new meeting."}
          </p>
        </div>

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter meeting name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <CommandSelect
                  options={(agents.data?.data ?? []).map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: (
                      <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                          seed={agent.name}
                          variant="botttsNeutral"
                          className="size-6"
                        />
                        <span>{agent.name}</span>
                      </div>
                    ),
                  }))}
                  onSelect={field.onChange}
                  onSearch={setAgentSearch}
                  value={field.value}
                  placeholder="Select an agent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                "bg-muted text-foreground hover:bg-muted/80 transition"
              )}
              disabled={isPending}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-700 transition-colors",
              isPending && "opacity-70 cursor-not-allowed"
            )}
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Update" : "Create"} Meeting
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
