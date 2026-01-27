import { EventEmitter } from "events";

const emitter = new EventEmitter();

export const onGlobalError = (callback: (code: number) => void) => {
  emitter.on("error", callback);
  return () => emitter.removeListener("error", callback);
};

export const emitError = (code: number) => {
  console.warn("🌐 Emitting global error with code:", code);
  emitter.emit("error", code);
};
