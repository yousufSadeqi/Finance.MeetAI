import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { initials } from '@dicebear/collection';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: 'botttsNeutral' | 'initials';
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant
}: GeneratedAvatarProps) => {
  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }
  console.log('Generated avatar URI:', avatar.toDataUri());

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
