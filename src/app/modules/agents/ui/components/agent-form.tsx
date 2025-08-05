import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentsInsertSchema } from "../../schema";
import { GeneratedAvatar } from "@/components/avatar-generator";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AgentFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instruction ?? "",
    },
  });

  const isEdit = !!initialValues?.id;

  const createAgentMethod = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create agent");
      },
    })
  );

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      console.log("Edit agent not implemented yet");
    } else {
      createAgentMethod.mutate(values);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        <div className="flex flex-col items-center gap-2">
          <GeneratedAvatar
            seed={form.watch("name")}
            variant="botttsNeutral"
            className="size-20 border rounded-full"
          />
          <p className="text-lg font-medium text-gray-700">
            {isEdit ? "Edit Agent" : "Create Agent"}
          </p>
        </div>

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter agent name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter instructions" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              disabled={createAgentMethod.isPending}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              "bg-blue-600 text-white hover:bg-blue-700",
              createAgentMethod.isPending && "opacity-50 cursor-not-allowed"
            )}
            disabled={createAgentMethod.isPending}
          >
            {isEdit ? "Update" : "Create"} Agent
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
