import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { properties } from "_component/Properties";
import {
  BaseButton,
  BaseStats,
  FormSelect,
  FormTextInput,
  Icons,
} from "_components/custom";
import { Box, SimpleGrid, Flex } from "@chakra-ui/react";
import { Formik } from "formik";
import { AppartCard } from "./AppartCard";

const MotionBox = motion(Box);

export const DashboardProperties = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || p.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {({ setFieldValue }) => (
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          spaceY={6}
          mt={"10px"}
          width={"full"}
        >
          <Flex flexDir={{ base: "column", sm: "row" }} gap={3}>
            <FormTextInput
              name="rest"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              leftAccessory={<Icons.Search />}
            />
            <FormSelect
              name={"select"}
              listItems={[]}
              setFieldValue={setFieldValue}
              onChangeFunc={(value) => setTypeFilter(value?.[0])}
            />

            <Flex gap={2}>
              <BaseButton
                variant={view !== "grid" ? "subtle" : "solid"}
                onClick={() => setView("grid")}
              >
                Grille
              </BaseButton>
              <BaseButton
                variant={view !== "table" ? "subtle" : "solid"}
                colorType="secondary"
                onClick={() => setView("table")}
              >
                Liste
              </BaseButton>
            </Flex>
          </Flex>

          {view === "grid" ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
              {filtered.map((property, i) => (
                <AppartCard key={i} property={property} />
              ))}
            </SimpleGrid>
          ) : null}
        </MotionBox>
      )}
    </Formik>
  );
};
