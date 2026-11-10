import type { ReactNode } from "react";

type OptionalProps<T, K extends keyof NonNullable<T>> = {
  data: T;
  name: K;
  fallback?: (key: K) => ReactNode;
  render: (key: K, value: NonNullable<NonNullable<T>[K]>) => ReactNode;
};

export function Optional<T, K extends keyof NonNullable<T>>(
  props: OptionalProps<T, K>,
) {
  const name = props.name;
  const value = props.data?.[name];

  if (value === null || value === undefined) {
    return props.fallback ? props.fallback(name) : null;
  }

  return props.render(name, value);
}
