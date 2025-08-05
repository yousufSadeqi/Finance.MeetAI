import { AlertCircleIcon } from "lucide-react";

interface Props {
    title: string;
    description?: string;
};

export const ErrorState = ({ title, description }: Props) => {
    return (
        <div className="py-4 px-6 flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-y-6 bg-background roounded-lg shadow-md p-10 ">
                <AlertCircleIcon className="size-6 text-red-500"/>
                <div className="flex flex-col text-center gap-y-2">
                    <h6 className="text-lg font-medium">{title}</h6>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
}