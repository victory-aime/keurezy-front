import React, { useEffect, useState, useMemo } from "react";
import { Box, Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import { GenderDonutByLevelChart } from "_modules/dashboard/components/GenderDonutByLevelChart";
import { CommonModule } from "_store/state-management";
import { PaymentStatusSummaryChart } from "_modules/dashboard/components/PaymentStatusSummaryChart";
import { Formik } from "formik";
import { FormSelect } from "_components/custom";
import { getMonthConfig } from "_constants/month-list";
import { useTranslation } from "react-i18next";
import { usePermissions } from "_hooks/usePermissions";
import { AppPermissions } from "_constants/AppPermissions";

export const RightMenu = ({ sideToggled = true }: { sideToggled: boolean }) => {
  const { t } = useTranslation();
  const variant = useBreakpointValue({ xl: "500px" });
  const [selectMonth, setSelectMonth] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string | null>(null);
  const { hasFeatureAccess } = usePermissions();
  const { data: genderByLevel, isLoading } =
    CommonModule.KpiModule.genderByLevelQueries({});

  const {
    data: allConfig,
    isSuccess,
    isLoading: getConfigLoading,
  } = CommonModule.SchoolConfigModule.getOnlyActiveConfigQueries({
    params: { isActive: true },
    queryOptions: {
      enabled: hasFeatureAccess(
        AppPermissions.CONFIG.name,
        AppPermissions.CONFIG.all_school_config,
      ),
    },
  });

  const defaultMonth = useMemo(() => {
    const months = allConfig?.content?.flatMap((config) => config.months ?? []);
    return months?.[0] ?? null;
  }, [allConfig]);

  const {
    data: paymentStatusSummary,
    isLoading: paymentStatusLoading,
    refetch: refetchPaymentStatus,
  } = CommonModule.KpiModule.paymentStatusSummaryQueries({
    params: { month: selectMonth ?? currentMonth },
    queryOptions: {
      enabled:
        isSuccess &&
        hasFeatureAccess(
          AppPermissions.KPI.name,
          AppPermissions.KPI.view_payment_status_summary,
        ) &&
        (!!currentMonth || !!selectMonth),
    },
  });

  useEffect(() => {
    if (selectMonth !== null) {
      refetchPaymentStatus().then((r) => r);
    }
  }, [selectMonth, refetchPaymentStatus]);

  useEffect(() => {
    if (isSuccess && !currentMonth && defaultMonth) {
      setCurrentMonth(defaultMonth);
    }
  }, [isSuccess, defaultMonth, currentMonth]);

  return (
    <Box
      w={sideToggled ? variant : "0"}
      overflow={"hidden"}
      transition={"all 400ms cubic-bezier(0.25, 0.1, 0.25, 1)"}
      px={{ base: sideToggled ? "5" : 0, sm: "0" }}
      mt={"70px"}
    >
      <Box height={"auto"}>
        <Grid
          templateColumns={{ base: "4fr", sm: "repeat(4, 1fr)", xl: "4fr" }}
          gridColumnGap="10px"
          gridRowGap="0"
        >
          <GridItem rowSpan={1} colSpan={{ base: 4, sm: 2, xl: 4 }} order={1}>
            <GenderDonutByLevelChart data={genderByLevel} loading={isLoading} />
          </GridItem>
          <GridItem rowSpan={1} colSpan={{ base: 4, sm: 2, xl: 4 }} order={2}>
            <PaymentStatusSummaryChart
              data={paymentStatusSummary}
              isLoading={paymentStatusLoading || getConfigLoading}
              isForm
              formComponent={
                <Formik
                  enableReinitialize
                  initialValues={{
                    month: paymentStatusSummary?.month
                      ? [paymentStatusSummary?.month]
                      : [currentMonth],
                  }}
                  onSubmit={() => {}}
                >
                  {({ setFieldValue }) => (
                    <FormSelect
                      name={"month"}
                      width={"100px"}
                      listItems={getMonthConfig(allConfig, t)}
                      setFieldValue={setFieldValue}
                      isClearable={false}
                      showDropdownIcon={false}
                      onChangeFunc={(month) => setSelectMonth(month?.[0])}
                    />
                  )}
                </Formik>
              }
            />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};
