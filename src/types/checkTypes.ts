interface VersionCheckResult {
  [key: string]: boolean;
}

interface EnvCheckResult {
  Android_SDK: {
    ANDROID_HOME: boolean;
    ANDROID_SDK_ROOT: boolean;
  };
  Java_JDK: {
    JAVA_HOME: boolean;
  };
}

interface VirtualDevicesResult {
  androidDevices: string[];
  iosDevices: string[];
}

interface CheckResults {
  versions?: VersionCheckResult;
  env?: EnvCheckResult;
  devices?: VirtualDevicesResult;
  brew?: boolean;
}

export type { CheckResults, VersionCheckResult, EnvCheckResult, VirtualDevicesResult }; 