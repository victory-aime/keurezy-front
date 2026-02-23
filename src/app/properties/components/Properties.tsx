"use client";
import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import {
  BaseButton,
  BaseText,
  CustomSkeletonLoader,
  FormSelect,
  FormSlider,
  FormTextInput,
  Icons,
  NoDataFound,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { motion } from "framer-motion";
import {
  Box,
  Center,
  Container,
  createListCollection,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { ASSETS } from "_assets/images";
import { Formik } from "formik";
import { PropertyModule } from "_store/state-management";
import { UserLayout } from "../../layout/Layout";
import { CONSTANTS } from "_types/";

export const properties = [
  {
    id: "1",
    title: "Luxury Modern Apartment",
    description:
      "Spacious luxury apartment with floor-to-ceiling windows, premium finishes, and an open-concept living area. Located in the heart of the city with easy access to public transport, restaurants, and shopping. The apartment features a gourmet kitchen with top-of-the-line appliances, hardwood floors throughout, and a private balcony with stunning city views.",
    price: 2500,
    location: "Downtown, Paris",
    type: "apartment",
    beds: 3,
    baths: 2,
    surface: 120,
    available: true,
    images: [ASSETS.PROPERTY_1, ASSETS.PROPERTY_3, ASSETS.PROPERTY_5],
    amenities: [
      "Parking",
      "Gym",
      "Pool",
      "Concierge",
      "Rooftop Terrace",
      "Smart Home",
    ],
    features: [
      "Floor-to-ceiling windows",
      "Hardwood floors",
      "Gourmet kitchen",
      "Walk-in closet",
    ],
  },
  {
    id: "2",
    title: "Cozy Scandinavian Studio",
    description:
      "A beautifully designed studio apartment featuring Scandinavian-inspired interiors with natural materials and warm tones. Perfect for young professionals seeking a comfortable and stylish living space in a vibrant neighborhood.",
    price: 950,
    location: "Le Marais, Paris",
    type: "studio",
    beds: 1,
    baths: 1,
    surface: 35,
    available: true,
    images: [ASSETS.PROPERTY_2, ASSETS.PROPERTY_1],
    amenities: ["Laundry", "Bike Storage", "Garden Access"],
    features: ["Built-in storage", "Modern kitchen", "Natural light"],
  },
  {
    id: "3",
    title: "Panoramic Penthouse Suite",
    description:
      "Exclusive penthouse with breathtaking panoramic city views. This premium residence features an expansive living area, designer finishes, and a private terrace perfect for entertaining. Two parking spaces and 24/7 concierge service included.",
    price: 5800,
    location: "La Défense, Paris",
    type: "penthouse",
    beds: 4,
    baths: 3,
    surface: 220,
    available: true,
    images: [ASSETS.PROPERTY_3, ASSETS.PROPERTY_1, ASSETS.PROPERTY_5],
    amenities: [
      "Parking x2",
      "Gym",
      "Pool",
      "Spa",
      "Concierge 24/7",
      "Private Terrace",
    ],
    features: [
      "Panoramic views",
      "Smart home system",
      "Wine cellar",
      "Home theater",
    ],
  },
  {
    id: "4",
    title: "Modern Townhouse with Garden",
    description:
      "Contemporary townhouse in a quiet residential area. Features a private garden, modern open-plan living, and high-quality finishes throughout. Perfect for families looking for space and tranquility while remaining close to the city center.",
    price: 3200,
    location: "Neuilly-sur-Seine",
    type: "house",
    beds: 4,
    baths: 2,
    surface: 180,
    available: true,
    images: [ASSETS.PROPERTY_4, ASSETS.PROPERTY_5, ASSETS.PROPERTY_2],
    amenities: ["Private Garden", "Garage", "Storage", "Fireplace"],
    features: [
      "Private garden",
      "Two-car garage",
      "Energy efficient",
      "Quiet neighborhood",
    ],
  },
  {
    id: "5",
    title: "Elegant Master Suite",
    description:
      "A refined apartment with an elegant master suite featuring an en-suite bathroom with premium fixtures. Located in a prestigious building with excellent amenities and a prime location.",
    price: 1800,
    location: "Saint-Germain, Paris",
    type: "apartment",
    beds: 2,
    baths: 2,
    surface: 85,
    available: false,
    images: [ASSETS.PROPERTY_5, ASSETS.PROPERTY_3, ASSETS.PROPERTY_1],
    amenities: ["Elevator", "Cellar", "Courtyard"],
    features: ["Period moldings", "Marble bathroom", "Herringbone parquet"],
  },
  {
    id: "6",
    title: "Industrial Chic Loft",
    description:
      "Stunning loft conversion with exposed brick walls, soaring ceilings, and oversized industrial windows flooding the space with natural light. A unique living experience combining historic charm with contemporary comfort.",
    price: 2100,
    location: "Bastille, Paris",
    type: "loft",
    beds: 2,
    baths: 1,
    surface: 95,
    available: true,
    images: [ASSETS.PROPERTY_6, ASSETS.PROPERTY_3, ASSETS.PROPERTY_1],
    amenities: ["Freight Elevator", "Rooftop Access", "Co-working Space"],
    features: [
      "Exposed brick",
      "12ft ceilings",
      "Industrial windows",
      "Open plan",
    ],
  },
];
const MotionBox = motion.create(Box);

export const Properties = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState();
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: allPublicProperties, isLoading } =
    PropertyModule.getAllPublicProperties({});

  // const filtered = useMemo(() => {
  //   return allPublicProperties?.filter((property) => {
  //     const title = property?.title?.toLowerCase() ?? "";
  //     const address = property?.address?.toLowerCase() ?? "";
  //     const matchSearch =
  //       title.includes(search.toLowerCase()) ||
  //       address.includes(search.toLowerCase());

  //     // const propertyType = Array.isArray(property?.type)
  //     //   ? property.type[0]
  //     //   : property?.type;

  //     //const matchType = type === "all" || propertyType === type;

  //     //const price = property?.price ?? 0;

  //     //const matchPrice = price >= priceRange[0] && price <= priceRange[1];

  //     return matchSearch;
  //   });
  // }, [search, type, priceRange, allPublicProperties]);

  const propertyList = createListCollection({
    items: [
      { label: "Tous les types", value: "all" },
      ...CONSTANTS.propertyTypes,
    ],
  });

  return (
    <UserLayout>
      <Formik initialValues={{ slide: priceRange }} onSubmit={() => {}}>
        {({ setFieldValue }) => (
          <Box width={"full"} py={24} pb={10}>
            <Container mx={"auto"} px={{ base: 6, sm: 8 }} py={2}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                mb={10}
              >
                <BaseText
                  weight={TextWeight.Bold}
                  fontSize={{ base: "3xl", sm: "4xl" }}
                >
                  Nos propriétés
                </BaseText>
                <BaseText variant={TextVariant.S}>
                  Trouvez le bien idéal parmi notre sélection
                </BaseText>
              </MotionBox>

              {/* Search & Filters */}
              <MotionBox
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                mb={8}
                spaceY={4}
              >
                <Flex gap={3}>
                  <FormTextInput
                    name={"search"}
                    placeholder="Rechercher par nom ou localisation..."
                    value={search}
                    onChangeFunction={(e: any) => setSearch(e.target.value)}
                    leftAccessory={<Icons.Search />}
                  />
                  <BaseButton
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    leftIcon={<Icons.Slider />}
                  >
                    Filtres
                  </BaseButton>
                </Flex>

                {showFilters && (
                  <Flex
                    border={"1px solid"}
                    p={6}
                    position={"relative"}
                    rounded={"xl"}
                    borderColor={"bg.muted"}
                    shadow={"2xl"}
                    width={"full"}
                    gap={4}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    flexDirection={{ base: "column", sm: "row" }}
                  >
                    <FormSelect
                      name={"test"}
                      label="Type de bien"
                      listItems={propertyList}
                      setFieldValue={setFieldValue}
                      onChangeFunc={(value) => setType(value?.[0])}
                    />
                    <FormSlider
                      label={"Prix:"}
                      min={0}
                      max={6000}
                      name={"slide"}
                      isNumber
                      onChangeFunction={(value: any) => {
                        setFieldValue("slide", value);
                        setPriceRange(value);
                      }}
                    />
                  </Flex>
                )}
              </MotionBox>
              {isLoading ? (
                <>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <CustomSkeletonLoader
                      key={i}
                      type={"DATA_GRID"}
                      width={"full"}
                    />
                  ))}
                </>
              ) : allPublicProperties && allPublicProperties.length > 0 ? (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, lg: 3 }}
                  gap={6}
                  width={"full"}
                >
                  {allPublicProperties?.map((property, i) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={i}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Center>
                  <NoDataFound
                    title={"Aucune propriété ne correspond à vos critères."}
                    imageType={"v2"}
                    containerStyle={{ width: "1/2" }}
                  />
                </Center>
              )}
            </Container>
          </Box>
        )}
      </Formik>
    </UserLayout>
  );
};
