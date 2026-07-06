import { execSync } from "child_process";

export function isPythonInstalled() {
  try {
    execSync("python --version", { stdio: "ignore" });
    return true;
  } catch {
    try {
      execSync("python3 --version", { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }
}

export function isYtDlpInstalled() {
  try {
    execSync("yt-dlp --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
