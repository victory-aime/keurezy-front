import { Box, Card, List, VStack } from "@chakra-ui/react";
import { BaseTag } from "_components/custom";
import { motion } from "framer-motion";

export const MotionBox = motion.create(Box);
export const MotionTag = motion.create(BaseTag);
export const MotionVStack = motion.create(VStack);
export const MotionListItem = motion.create(List.Item);
export const MotionCard = motion.create(Card.Root);
export const MotionHeader = motion.create(Card.Header);
export const MotionBody = motion.create(Card.Body);
