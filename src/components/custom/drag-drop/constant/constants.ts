/**
 * Constants for DragDrop component
 * @param MAX_FILES: number
 * @param MAX_FILE_SIZE: number
 * @param ACCEPTED_TYPES: string[]
 */

const MAX_FILES = 4;
const FILES_INIT_SIZE = 2;
const MAX_FILE_SIZE = FILES_INIT_SIZE * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);
const ACCEPTED_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

export { MAX_FILES, MAX_FILE_SIZE, ACCEPTED_TYPES, MAX_FILE_SIZE_MB };
