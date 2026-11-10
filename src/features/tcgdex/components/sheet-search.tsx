import { IconArrowNarrowDown, IconCancel, IconSearch } from "@tabler/icons-react";
import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/collapsible";
import { Input, type InputProps } from "@/components/input";
import { Label } from "@/components/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import { SearchFormSchema, type SearchRouteSchemaInput } from "@/features/tcgdex/schemas/search";

const useSearchForm = () => {
  const { page, limit, order, sort, ...values } = useSearch({
    from: "/search",
  });
  const navigate = useNavigate();

  return useForm({
    defaultValues: values,
    onSubmit: ({ value }) => {
      let params: Partial<SearchRouteSchemaInput> = { page: 1 };

      for (const [key, v] of Object.entries(value)) {
        if (!v || key === "select") continue;

        switch (key) {
          case "hp": {
            if (Array.isArray(v)) {
              params = {
                ...params,
                // hp: v.join('-')
              };
            }
            break;
          }
          default: {
            params = {
              ...params,
              [key]: v.toString(),
            };
            break;
          }
        }
      }

      navigate({
        search: { ...params, limit, order, sort, page },
        to: "/search",
      });
    },
    validators: {
      onBlur: SearchFormSchema,
      onSubmit: SearchFormSchema,
    },
  });
};

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

type FieldProps<T> = T & { field: AnyFieldApi };

function TextField({ field, ...props }: FieldProps<InputProps>) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring">
        <Label className="border-b-0 py-2 font-bold font-display uppercase">{field.name}</Label>
        <IconArrowNarrowDown />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex w-full items-center bg-input/30">
        <Input
          autoComplete="off"
          className="grid h-full flex-1 truncate rounded-none border-none p-4 text-sm sm:text-base"
          id={field.name}
          name={field.name}
          onChange={(e) => field.handleChange(e.target.value)}
          type="text"
          value={field.state.value ?? ""}
          {...props}
        />
        <FieldInfo field={field} />
      </CollapsibleContent>
    </Collapsible>
  );
}

const SheetSearch = () => {
  const [open, setOpen] = useState(false);
  const form = useSearchForm();

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button
            size="icon"
            className="border-t-4 transition-[border,color] data-[state=open]:border"
            variant="outline"
          />
        }
      >
        <IconSearch aria-label="open search dialog" />
      </SheetTrigger>
      <SheetContent className="xs:max-w-xs bg-card text-card-foreground" side="right">
        <form
          className="flex flex-col gap-0"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
            setOpen(false);
          }}
        >
          <SheetHeader className="sticky top-0 flex-row flex-wrap items-center justify-between gap-2 border-b bg-inherit p-4">
            <SheetTitle className="font-bold font-display text-xl tracking-wider">
              Search All
            </SheetTitle>
            <SheetClose className="hover:text-destructive focus-visible:text-destructive">
              <IconCancel className="shrink-0" />
            </SheetClose>
            <SheetDescription className="w-full text-start">Find pokemon cards</SheetDescription>
          </SheetHeader>
          <div className="grow divide-y divide-border overflow-auto">
            <form.Field name="name">
              {(field) => <TextField field={field} placeholder="cynthia, vikavolt, team rocket" />}
            </form.Field>
            <form.Field name="illustrators">
              {(field) => <TextField field={field} placeholder="5ban graphics, ken sugimori" />}
            </form.Field>
          </div>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <SheetFooter className="my-auto grid grid-cols-2 gap-2 border-t">
                <Button
                  className="justify-center rounded-xs font-bold font-display text-lg uppercase tracking-wide active:border"
                  color="destructive"
                  disabled={!canSubmit}
                  onClick={() => {
                    form.setFieldValue("categories", "");
                    form.setFieldValue("energies", "");
                    form.setFieldValue("expansions", "");
                    form.setFieldValue("illustrators", "");
                    form.setFieldValue("marks", "");
                    form.setFieldValue("name", "");
                    form.setFieldValue("rarities", "");
                    form.setFieldValue("stages", "");
                    form.setFieldValue("suffixes", "");
                  }}
                  type="button"
                  variant="outline"
                >
                  Reset
                </Button>
                <Button
                  className="justify-center rounded-xs font-bold font-display text-lg uppercase tracking-wide"
                  disabled={!canSubmit}
                  type="submit"
                >
                  {isSubmitting ? "..." : "Search"}
                </Button>
              </SheetFooter>
            )}
          </form.Subscribe>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export { SheetSearch };
