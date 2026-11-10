import { IconSortAscendingLetters, IconSortDescendingLetters } from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { safeParse } from "valibot";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { Separator } from "@/components/separator";
import { ITEMS_PER_PAGE } from "@/features/tcgdex/lib/constants";
import { LimitSchema, OrderSchema, SortSchema } from "@/features/tcgdex/schemas/search";
import { toastManager } from "@/components/toast";

export function SelectItemsPerPage() {
  const params = useSearch({ strict: false });
  const navigate = useNavigate();

  const onValueChange = (limit: string | null) => {
    const result = safeParse(LimitSchema, { limit });

    if (result.success) {
      navigate({
        to: ".",
        search: (params) => ({
          ...params,
          limit: result.output.limit,
        }),
      });
      return;
    }

    toastManager.add({
      description: "Invalid limit value",
      type: "error",
    });
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Label className="font-bold font-display text-muted-foreground text-xs uppercase tracking-wide">
        Items per page
      </Label>
      <Select defaultValue={`${params.limit}`} onValueChange={onValueChange}>
        <SelectTrigger className="w-full border-t-4 transition-[border] data-[state=open]:border-t">
          <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent>
          {ITEMS_PER_PAGE.map((limit) => {
            const str = `${limit.value}`;

            return (
              <SelectItem value={str} key={str}>
                {str}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SelectSort() {
  const params = useSearch({ strict: false });
  const navigate = useNavigate();

  const onValueChange = (value: string | null) => {
    const [sort, order] = !value ? [] : value.split("-");
    const sortResult = safeParse(SortSchema, { sort });
    const orderResult = safeParse(OrderSchema, { order });

    if (sortResult.success && orderResult.success) {
      navigate({
        to: ".",
        search: (params) => ({
          ...params,
          sort: sortResult.output.sort,
          order: orderResult.output.order,
        }),
      });
      return;
    }

    toastManager.add({
      description: "Invalid sort or order value",
      type: "error",
    });
  };

  const defaultValue = `name-${params.order === "asc" ? "asc" : "desc"}`;

  return (
    <div className="flex flex-col gap-0.5">
      <Label className="font-bold font-display text-muted-foreground text-xs uppercase tracking-wide">
        Sort & Order
      </Label>
      <Select defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger className="w-full border-t-4 transition-[border] data-[state=open]:border-t">
          <SelectValue placeholder="Sort & Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">
            <IconSortAscendingLetters className="size-5 shrink-0" />
            <Separator orientation="vertical" />

            <span>Name</span>
          </SelectItem>
          <SelectItem value="name-desc">
            <IconSortDescendingLetters className="size-5 shrink-0" />
            <Separator orientation="vertical" />

            <span>Name</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
