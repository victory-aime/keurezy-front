import { Stack } from "@chakra-ui/react";
import { BaseDrawer } from "_components/custom";
import { RenderLinks } from "./RenderLinks";
import { MODELS } from "_types/";

export interface IMobileLayout {
  isOpen: boolean;
  onClose: (value?: any) => void;
  isLoading?: boolean;
  links: {
    id: number;
    icon: any;
    name: string;
    url: string;
  }[];
  user: MODELS.IUser | undefined;
}
export const MobileLayout = ({
  isOpen,
  onClose,
  links,
  user,
  isLoading,
}: IMobileLayout) => {
  return (
    <BaseDrawer
      title={"MyIMMO"}
      isOpen={isOpen}
      onChange={onClose}
      size={"xs"}
      placement={"end"}
      ignoreFooter
      drawerContentColor={"white"}
    >
      <Stack width={"full"}>
        <RenderLinks links={links} isMobile user={user} isLoading={isLoading} />
      </Stack>
    </BaseDrawer>
  );
};
