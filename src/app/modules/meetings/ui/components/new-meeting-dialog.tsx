import { ResponseDialog } from "@/components/response-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;   

}


export const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {

    const router = useRouter()

    return (
        <ResponseDialog
        title='New Agent'
        description='Create a new agent to assist you with tasks.'
        open={open}
        onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={(id) => {
                    onOpenChange(false);
                    router.push(`/meetings/${id}`);
                }
                }
                onCancel={() => onOpenChange(false)}
            />
        </ResponseDialog>
    )
}       