import { greetings } from "./nu-modules.nu";

export const greet = async () => {
  await greetings.hello("phanect");
  await greetings.hi("phanect");
}
