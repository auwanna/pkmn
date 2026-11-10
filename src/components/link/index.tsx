import type { ComponentProps } from "react";

import { createLink, type LinkComponent } from "@tanstack/react-router";

type ExternalLinkProps = React.ComponentProps<"a"> & { href: `https://${string}`; label?: string };

function ExternalLink({ label = "", children, ...props }: ExternalLinkProps) {
  return (
    <a rel="noopener noreferrer" target="_blank" {...props}>
      {children}
      <span className="sr-only" data-nosnippet>
        {label ? `${label} ` : " "}
        (opens in a new tab)
      </span>
    </a>
  );
}

type BaseLinkComponentProps = ComponentProps<"a">;

function BaseLinkComponent({ ref, ...props }: BaseLinkComponentProps) {
  return <a ref={ref} {...props} />;
}

const Comp = createLink(BaseLinkComponent);

const Link: LinkComponent<typeof BaseLinkComponent> = (props) => {
  return <Comp {...props} />;
};

export { ExternalLink, Link, type ExternalLinkProps };
