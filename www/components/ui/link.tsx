"use client";

import * as React from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Link: typeof NextLink = (({ children, ...props }) => {
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  let prefetchTimeout: NodeJS.Timeout | null = null; // Track the timeout ID

  React.useEffect(() => {
    if (props.prefetch === false) {
      return;
    }

    const linkElement = linkRef.current;
    if (!linkElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(0);
        if (entry?.isIntersecting) {
          // Set a timeout to trigger prefetch after 1 second
          // eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/no-misused-promises
          prefetchTimeout = setTimeout(async () => {
            router.prefetch(String(props.href));
            await sleep(0); // We want the doc prefetches to happen first.
            observer.unobserve(entry.target);
          }, 300); // 300ms delay
        } else if (prefetchTimeout) {
          // If the element leaves the viewport before 1 second, cancel the prefetch
          clearTimeout(prefetchTimeout);
          prefetchTimeout = null;
        }
      },
      { rootMargin: "0px", threshold: 0.1 }, // Trigger when at least 10% is visible
    );

    observer.observe(linkElement);

    return () => {
      observer.disconnect(); // Cleanup the observer when the component unmounts
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout); // Clear any pending timeouts when component unmounts
      }
    };
  }, [props.href, props.prefetch]);

  return (
    <NextLink
      ref={linkRef}
      prefetch={false}
      onMouseEnter={() => router.prefetch(String(props.href))}
      onMouseDown={(e) => {
        const url = new URL(String(props.href), window.location.href);
        if (
          url.origin === window.location.origin &&
          e.button === 0 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          router.push(String(props.href));
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}) as typeof NextLink;
