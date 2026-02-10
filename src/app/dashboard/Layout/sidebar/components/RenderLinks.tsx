import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsActive } from "../hooks/useIsActive";
import { IRenderLinks, ILink } from "../types";
import { ActiveSubMenuLink } from "./ActiveSubMenuLink";
import { Links } from "./Links";
import { SubMenu } from "./SubMenu";

export const RenderLinks: FC<IRenderLinks> = ({
  sideToggled,
  links,
  onShowSidebar,
}) => {
  const navigate = useRouter();
  const { isActiveLink } = useIsActive();
  const [openedMenu, setOpenedMenu] = useState<string | boolean>(false);
  const shouldApplySideToggled = useBreakpointValue({ base: false, md: true });
  const sidebarConditionInverse = useBreakpointValue({ base: false, lg: true });

  const conditionsSubMenu = (link: {
    subItems: { path: string; label: string }[];
    menuKey: string;
  }) => {
    const isOpen = openedMenu === link.menuKey;
    setOpenedMenu(isOpen ? false : link.menuKey);
    if (!sideToggled && !isOpen) {
      setTimeout(() => onShowSidebar(), 0);
    }
  };

  const redirectToPath = async (link: ILink): Promise<void> => {
    if (link?.path) {
      navigate.push(link.path);
    }
    if (!sidebarConditionInverse) {
      onShowSidebar();
    }
  };

  useEffect(() => {
    if (!sideToggled) {
      setOpenedMenu(false);
    }
  }, [sideToggled]);

  return (
    <>
      {links.map((link: ILink, index: number) => (
        <Flex
          direction="column"
          width={"full"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          key={index}
        >
          {!link.subItems && link?.path && (
            <Links
              isActiveLink={isActiveLink}
              redirectToPath={redirectToPath}
              sideToggled={sideToggled}
              link={link}
            />
          )}
          {link.menuKey && link.subItems && (
            <SubMenu
              redirectToPath={redirectToPath}
              sideToggled={sideToggled}
              openedMenu={openedMenu}
              link={link}
              conditionsSubMenu={conditionsSubMenu}
              totalLinks={link?.subItems?.length}
            />
          )}
          {link.subItems &&
            openedMenu === link.menuKey &&
            link?.subItems?.map((subLink) => {
              if (shouldApplySideToggled && !sideToggled) {
                return null;
              }
              return (
                <ActiveSubMenuLink
                  subLink={subLink}
                  key={subLink.path}
                  isActiveLink={isActiveLink}
                  sideToggled={sideToggled}
                  onShowSidebar={onShowSidebar}
                />
              );
            })}
        </Flex>
      ))}
    </>
  );
};
