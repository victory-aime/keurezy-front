import { Flex, Group, Separator, Stack, Text } from '@chakra-ui/react';
import { Menu, Portal } from '@chakra-ui/react';
import {
  BaseText,
  CustomSkeletonLoader,
  FormTextInput,
  Icons,
  TextVariant,
  TextWeight,
} from '_components/custom';
import { SideBarProps } from '../sidebar/types';
import { NotificationsModule } from '_store/state-management';
import { Avatar } from '_components/ui/avatar';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { useAuth } from '_hooks/useAuth';
import { VariablesColors } from '_theme/variables';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '_context/user-context';
import { NotificationHeaderMenu } from '../../notifications/components/NotificationHeaderMenu';

export const Header = ({ onShowSidebar, sideToggled }: SideBarProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();
  const { user, isLoading } = useUserContext();

  const { data: unreadNotificationsList, isLoading: unreadListLoad } =
    NotificationsModule.getAllUnreadNotificationsQueries({
      params: {
        userId: user?.id,
      },
      queryOptions: { enabled: !!user?.id },
    });

  const links = [
    {
      label: 'Profile',
      path: DASHBOARD_ROUTES.PROFILE,
      icon: Icons.User,
    },
    {
      label: 'Paramètres',
      path: DASHBOARD_ROUTES.PROFILE,
      icon: Icons.Setting,
    },
  ];

  return (
    <Formik initialValues={{ search: '' }} onSubmit={() => {}}>
      {({}) => (
        <Flex as={'header'} alignItems={'center'} gap={3} px={4} pt={3} data-tour="header">
          {sideToggled && !isLoading ? (
            <Icons.SideOpen
              size={18}
              color={VariablesColors.grayScale}
              onClick={onShowSidebar}
              cursor={'pointer'}
            />
          ) : (
            <Icons.SideClose
              size={18}
              color={VariablesColors.grayScale}
              onClick={onShowSidebar}
              cursor={'pointer'}
            />
          )}
          {/*
          <Separator orientation="vertical" height={6} />
                 <Flex flex={1} maxW={'md'}>
            <FormTextInput
              leftAccessory={<Icons.Search />}
              name="search"
              placeholder="Rechercher propriétés, locataires, paiements..."
              isLoading={isLoading}
            />
          </Flex>*/}

          <Flex ml={'auto'} alignItems={'center'} gap={3} position={'relative'}>
            {isLoading ? (
              <>
                <CustomSkeletonLoader
                  type="BUTTON"
                  direction={'row'}
                  width={'20px'}
                  colorButton="neutral"
                  raduis={'full'}
                />
                <CustomSkeletonLoader
                  type="BUTTON"
                  direction={'row'}
                  width={'20px'}
                  colorButton="neutral"
                  raduis={'full'}
                />
                <Separator orientation="vertical" height={6} mx={1} />
                <CustomSkeletonLoader
                  type="CIRCLE"
                  direction={'row'}
                  width={'150px'}
                  numberOfLines={1}
                />
              </>
            ) : (
              <>
                <NotificationHeaderMenu
                  notifications={unreadNotificationsList ?? []}
                  isLoading={unreadListLoad}
                />

                <Separator orientation="vertical" height={6} mx={1} />

                {/* User dropdown */}

                <Menu.Root size={'md'} positioning={{ placement: 'bottom' }}>
                  <Menu.Trigger rounded="full" focusRing="none" width={'full'} cursor={'pointer'}>
                    <Flex gap={2} alignItems={'center'} width={'full'}>
                      <Avatar
                        size={'md'}
                        name={user?.name}
                        src={user?.image ?? 'https://avatar.iran.liara.run/public'}
                      />
                      <Text
                        truncate
                        lineBreak={'auto'}
                        lineClamp={1}
                        maxW={'120px'}
                        textTransform={'capitalize'}
                      >
                        {user?.name}
                      </Text>
                    </Flex>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content width={'full'}>
                        <Group
                          grow
                          gap={'0'}
                          flexDirection={'column'}
                          alignItems={'flex-start'}
                          borderBottom={'1px solid'}
                          borderColor="gray.200"
                          px={{ base: 4, md: 2 }}
                          py={2}
                        >
                          <BaseText variant={TextVariant.XS} weight={TextWeight.Bold}>
                            {user?.name}
                          </BaseText>
                          <BaseText variant={TextVariant.XXS} color={'gray.400'}>
                            {user?.email}
                          </BaseText>
                        </Group>
                        {links?.map((link, i) => (
                          <Menu.Item
                            key={i}
                            value={link?.label}
                            onClick={() => router.push(link?.path)}
                            cursor={'pointer'}
                          >
                            <link.icon />
                            {link.label}
                          </Menu.Item>
                        ))}

                        <Menu.Item
                          value="delete"
                          color="fg.error"
                          _hover={{ bg: 'bg.error', color: 'fg.error' }}
                          cursor={'pointer'}
                          onClick={() => logout()}
                        >
                          <Icons.Logout />
                          {t('COMMON.LOGOUT')}
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </>
            )}
          </Flex>
        </Flex>
      )}
    </Formik>
  );
};
