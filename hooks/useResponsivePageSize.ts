"use client";

import { useEffect, useState } from "react";

// Tailwind's `md` breakpoint (768px) is the cutoff — matches the grid's own
// mobile/desktop split in ProductCard/HomeShell.
export function useResponsivePageSize(mobileSize: number, desktopSize: number) {
  const [pageSize, setPageSize] = useState(desktopSize);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setPageSize(mql.matches ? mobileSize : desktopSize);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [mobileSize, desktopSize]);

  return pageSize;
}
