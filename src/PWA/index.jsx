import { useEffect, useMemo, useState } from "react";
import { usePWAInstall } from "react-use-pwa-install";

const PWAInitailizer = () => {
  const installAndroid = usePWAInstall();
  const getPWAInstallPrompt = () => {
    return window.localStorage.getItem("pwaInstallPrompt");
  };

  const setPWAInstallPrompt = (value) => {
    return window.localStorage.setItem("pwaInstallPrompt", value);
  };

  const [isInstalledPWA, setIsInstalledPWA] = useState(false);

  const [bipEvent, setBipEvent] = useState(null);
  const [iosSetup, setIOSetup] = useState(false);

  const isPWAInstalledOnIOS = useMemo(() => {
    //! Check if running in standalone mode on iOS
    if (
      navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setBipEvent(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    if (!getPWAInstallPrompt() && !isInstalledPWA && !isPWAInstalledOnIOS) {
      setIsInstalledPWA(true);
    }
  }, [isPWAInstalledOnIOS, isInstalledPWA]);

  useEffect(() => {
    if (!navigator.onLine && isPWAInstalledOnIOS) {
      setIsInstalledPWA(false);
      setPWAInstallPrompt("true");
    }
  }, [isPWAInstalledOnIOS]);

  useEffect(() => {
    if (isPWAInstalledOnIOS) {
      setPWAInstallPrompt("true");
    }
  }, [isPWAInstalledOnIOS]);

  return (
    <div>
      <div className="flex flex-col items-center justify-between w-3/5 px-4 py-5 bg-white rounded-md t">
        <div className="flex items-center justify-between w-full px-2">
          {iosSetup ? null : (
            <>
              <button
                onClick={() => {
                  const isIOS =
                    /iPad|iPhone|iPod/.test(navigator?.platform) ||
                    (navigator.platform === "MacIntel" &&
                      navigator?.maxTouchPoints > 1);
                  if (isIOS) {
                    setIOSetup(true);
                    setPWAInstallPrompt("true");
                  } else {
                    installAndroid();
                  }
                }}
              >
                install app
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInitailizer;
