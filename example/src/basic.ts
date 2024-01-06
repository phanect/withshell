import { showGitUserInfo, assertGitUserInfo } from "./basic.nu";

export const gitUserInfo = async () => {
  await showGitUserInfo();
  await assertGitUserInfo("Jane Doe", "janedoe@example.com");
}
