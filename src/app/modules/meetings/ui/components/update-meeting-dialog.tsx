import { ResponseDialog } from "@/components/response-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
import { MeetingGetOne } from "../../types";
import { toast } from "sonner";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateMeetingDialogProps) => {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Meeting updated successfully");
    onOpenChange(false);
    router.refresh(); // Optional: refresh view if required
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <ResponseDialog
      title="Edit Meeting"
      description="Update your meeting details below"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="px-1 sm:px-2 py-2">
        <MeetingForm
          initialValues={initialValues}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </ResponseDialog>
  );
};
