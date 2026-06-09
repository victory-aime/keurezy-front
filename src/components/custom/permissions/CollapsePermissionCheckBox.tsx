'use client';
import { Box, CheckboxGroup, Flex, Menu, Portal } from '@chakra-ui/react';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '_components/ui/checkbox';
import { BaseText, TextVariant, TextWeight } from '_components/custom';
import { hexToRGB } from '_theme/colors';
import { VariablesColors } from '_theme/variables';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { SideToolTip } from '../../../app/dashboard/Layout/sidebar/components/SideToolTip';
import { ICheckboxGroup, ISelectedPermission } from '_components/custom';

export const CollapsePermissionCheckBox: React.FC<ICheckboxGroup> = memo(
  ({ checkBoxGroup, onSelectGroupElement, defaultValue, checkBoxColor = 'purple' }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
      if (defaultValue?.permissions?.length) {
        const initial = defaultValue.permissions.reduce<Record<string, boolean>>((acc, p) => {
          acc[p.id] = p.granted;
          return acc;
        }, {});
        setSelectedMap(initial);
      }
    }, [defaultValue]);

    const selectedCount = Object.values(selectedMap).filter(Boolean).length;
    const totalCount = checkBoxGroup.permissions?.length ?? 0;
    const isAllSelected = selectedCount === totalCount && totalCount > 0;
    const isNoneSelected = selectedCount === 0;
    const isIndeterminate = !isAllSelected && !isNoneSelected;

    const emit = (map: Record<string, boolean>) => {
      const permissions: ISelectedPermission[] = Object.entries(map)
        .filter(([, granted]) => granted)
        .map(([id]) => ({ id, granted: true }));

      onSelectGroupElement({
        category: checkBoxGroup.category,
        permissions,
      });
    };

    const handleGroupCheck = (checked: boolean) => {
      const newMap: Record<string, boolean> = {};
      if (checked) {
        checkBoxGroup.permissions?.forEach((p) => {
          newMap[p.id] = true;
        });
      }
      setSelectedMap(newMap);
      emit(newMap);
    };

    const handleTogglePermission = (id: string) => {
      const newMap = { ...selectedMap, [id]: !selectedMap[id] };
      if (!newMap[id]) delete newMap[id];
      setSelectedMap(newMap);
      emit(newMap);
    };

    return (
      <Menu.Root
        positioning={{ strategy: 'fixed', hideWhenDetached: true }}
        size="md"
        closeOnSelect={false}
        open={open}
        onOpenChange={(e) => setOpen(e?.open)}
      >
        <Menu.Trigger asChild width="full" cursor="pointer">
          <Flex
            p="2"
            alignItems="center"
            justifyContent="space-between"
            bgColor={hexToRGB('purple', 0.1)}
            borderRadius="7px"
            width="full"
          >
            <Flex gap="3" width="full">
              <Checkbox
                checked={isIndeterminate ? 'indeterminate' : isAllSelected}
                onCheckedChange={(e) => handleGroupCheck(!!e.checked)}
                colorPalette={checkBoxColor}
                variant="subtle"
              />
              <BaseText weight={TextWeight.Bold}>
                {t('PERMISSIONS.MODULES.' + checkBoxGroup.category)}
              </BaseText>
            </Flex>

            <Flex alignItems="center" justifyContent="flex-end" gap="3" width="1/4">
              {selectedCount > 0 && (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  bgColor={checkBoxColor}
                  rounded="full"
                  boxSize="35px"
                  color="white"
                >
                  <BaseText variant={TextVariant.XS}>
                    {isAllSelected ? t('Tous') : selectedCount}
                  </BaseText>
                </Flex>
              )}
              <Box transition="all ease-in-out 200ms" transform={open ? 'rotate(180deg)' : ''}>
                <MdKeyboardArrowDown width="18px" height="18px" color={VariablesColors.grayScale} />
              </Box>
            </Flex>
          </Flex>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content width="full">
              <CheckboxGroup value={Object.keys(selectedMap).filter((id) => selectedMap[id])}>
                {checkBoxGroup.permissions?.map((perm) => (
                  <Menu.CheckboxItem
                    key={perm.id}
                    value={perm.id}
                    checked={!!selectedMap[perm.id]}
                    cursor="pointer"
                    onCheckedChange={() => handleTogglePermission(perm.id)}
                  >
                    <SideToolTip label={perm.description} placement="right">
                      <Flex alignItems="center" gap="2" width="full">
                        <Menu.ItemIndicator asChild>
                          <Checkbox
                            checked={!!selectedMap[perm.id]}
                            colorPalette={checkBoxColor}
                            variant="subtle"
                          />
                        </Menu.ItemIndicator>
                        <BaseText>
                          {t('PERMISSIONS.FEATURE_LIST.' + perm.name.toUpperCase())}
                        </BaseText>
                      </Flex>
                    </SideToolTip>
                  </Menu.CheckboxItem>
                ))}
              </CheckboxGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    );
  },
);
