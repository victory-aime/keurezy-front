'use client';

import { Box, Center, Field, Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '_components/ui/checkbox';
import { mergePermissionGroups } from '_utils/permissions';
import { NoDataAnimation } from '_components/custom/data-table/NoDataAnimation';
import {
  BaseContainer,
  BaseText,
  ICheckboxElement,
  ICollapseCheckBoxGroup,
  ISelectedCheckboxElement,
  TextVariant,
} from '_components/custom';

/** Un module : case parente (tout, une partie : indéterminé, rien) et ses permissions. */
const PermissionModule = ({
  group,
  selected,
  onToggle,
}: {
  group: ICheckboxElement;
  selected: Set<string>;
  onToggle: (ids: string[], checked: boolean) => void;
}) => {
  const { t } = useTranslation();
  const ids = group.permissions.map((p) => p.id);
  const count = ids.filter((id) => selected.has(id)).length;
  const all = count === ids.length;
  const label = t('PERMISSIONS.MODULES.' + group.category);

  return (
    <Stack
      as="fieldset"
      gap={0}
      rounded="7px"
      borderWidth="1px"
      borderColor={count ? 'primary.500/40' : 'border'}
      bg="bg"
      transition="border-color 150ms ease"
    >
      <Flex
        as="legend"
        width="full"
        px={3}
        py={2.5}
        alignItems="center"
        justifyContent="space-between"
        gap={3}
        bg="bg.muted"
        roundedTop="7px"
      >
        <Checkbox
          checked={all ? true : count ? 'indeterminate' : false}
          onCheckedChange={() => onToggle(ids, !all)}
          colorPalette="primary"
        >
          <BaseText fontWeight="semibold">{label}</BaseText>
        </Checkbox>
        <BaseText variant={TextVariant.XS} color="fg.muted" flexShrink={0}>
          {count}/{ids.length}
        </BaseText>
      </Flex>
      <Stack as="ul" listStyleType="none" gap={2} px={3} py={3} pl={9}>
        {group.permissions.map((permission) => (
          <Box as="li" key={permission.id}>
            <Checkbox
              checked={selected.has(permission.id)}
              onCheckedChange={(e) => onToggle([permission.id], e.checked === true)}
              colorPalette="primary"
              alignItems="flex-start"
            >
              <BaseText variant={TextVariant.S}>
                {permission.description || permission.name}
              </BaseText>
            </Checkbox>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

/**
 * Sélection des permissions d'un collaborateur, en arbre : cocher un module coche toutes ses
 * permissions ; cocher une partie seulement rend le module indéterminé. Même contrat que
 * l'ancien sélecteur : `onChange` reçoit les permissions cochées, groupées par module.
 */
export const PermissionListGroup: FC<ICollapseCheckBoxGroup> = memo(
  ({ groupList, onChange, defaultValues = [], title, description, errorMessage, isTouched }) => {
    const groups = useMemo(() => mergePermissionGroups(groupList ?? []), [groupList]);
    const [selected, setSelected] = useState<Set<string>>(
      () =>
        new Set(
          defaultValues.flatMap((g) => g.permissions.filter((p) => p.granted).map((p) => p.id)),
        ),
    );

    const toggle = useCallback(
      (ids: string[], checked: boolean) => {
        const next = new Set(selected);
        ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
        setSelected(next);
        onChange(
          groups
            .map((g) => ({
              category: g.category,
              permissions: g.permissions
                .filter((p) => next.has(p.id))
                .map((p) => ({ id: p.id, granted: true })),
            }))
            .filter((g): g is ISelectedCheckboxElement => g.permissions.length > 0),
        );
      },
      [groups, onChange, selected],
    );

    return (
      <BaseContainer title={title} description={description} border="none" p={0}>
        {groups.length ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} width="full" mt={3} alignItems="start">
            {groups.map((group) => (
              <PermissionModule
                key={group.category}
                group={group}
                selected={selected}
                onToggle={toggle}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center width="full">
            <NoDataAnimation animationType="folder" />
          </Center>
        )}
        <Field.Root id="permissions" invalid={!!errorMessage && !!isTouched}>
          {errorMessage && isTouched && (
            <Flex gap={1} mt={1} alignItems="center">
              <Field.ErrorIcon width={2.5} height={2.5} color="red.500" />
              <Field.ErrorText>{errorMessage}</Field.ErrorText>
            </Flex>
          )}
        </Field.Root>
      </BaseContainer>
    );
  },
);
