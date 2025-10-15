import clsx from "clsx";
import React from "react";

// const { projectId } = useParams();

// const pathname = useLocation().pathname;
// const isCurrentPath = pathname === `${AppRoutes.getPublishWidgetRoute(projectId)}/new`;

const formClasses = `block w-full appearance-none rounded-md bg-Gray-95 border border-[#FAFAFA]  py-[calc(theme(spacing.2))] focus:py-[calc(theme(spacing.2)-0px)] px-[calc(theme(spacing.2)-1px)] text-black placeholder:text-gray-400 sm:text-[14px]`;
const selectStyle =
  "border-gray-300  w-full py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.2)-1px)]  appearance-none cursor-pointer text-black placeholder:text-black focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm bg-neutral-50";

interface LabelProps {
  id: string;
  children: React.ReactNode;
}

export function Label({ id, children }: LabelProps) {
  return (
    <label
      htmlFor={id}
      className="mb-1 block text-sm font-medium  text-gray-900">
      {children}
    </label>
  );
}

interface DescriptionProps {
  id?: string;
  children: React.ReactNode;
  error?: boolean;
}

function Description({ id, children, error }: DescriptionProps) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "mt-1.5 block text-xs font-medium",
        error ? "text-red-500" : "text-gray-400"
      )}>
      {children}
    </label>
  );
}
//
interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  label?: string;
  description?: string;
  error?: string;
  customStyle?: string;
  customBorder?: string;
  icon?: React.ReactNode;
  element?: "input" | "textarea";
}

function TextField({
  id,
  label,
  description = "",
  error = "",
  type = "text",
  className,
  customStyle,
  element = "input",
  customBorder,
  ...props
}: TextFieldProps) {
  if (props?.hidden) return null;
  return (
    <>
      <div className={className}>
        {label && (
          <div className="flex gap-1">
            <Label id={id}>
              {typeof label === "string"
                ? label?.split("*").map((part, index, array) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <span className="text-red-500 mx-2">*</span>
                    )}
                  </React.Fragment>
                ))
                : label}
            </Label>

            {!!error && (
              <span className="text-red-500 text-sm mb-1">{error}</span>
            )}
          </div>
        )}
        {element === "input" ? (
          <input
            id={id}
            type={type}
            {...props}
            className={`${customStyle ? customStyle : formClasses} ${customBorder
                ? "focus:border-0 focus:outline-none focus:ring-black "
                : "focus:border-zinc-400 focus:outline-none focus:ring-zinc-400  "
              }`}
            hidden={props?.hidden || false}
          />
        ) : (
          <textarea
            id={id}
            {...props}
            className={`${customStyle ? customStyle : formClasses} ${customBorder
                ? "focus:border-0 focus:outline-none focus:ring-black "
                : "focus:border-zinc-400 focus:outline-none focus:ring-zinc-400  "
              }`}
          />
        )}
      </div>
      {description || error ? (
        <Description id={id} error={!!error}>
          {description}
        </Description>
      ) : null}
    </>
  );
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  className?: string;
  customStyle?: string;
  customBorder?: string;
}

function SelectField({
  id,
  label,
  className,
  customStyle,
  customBorder,
  ...props
}: SelectFieldProps) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select
        id={id}
        {...props}
        className={clsx(
          customStyle ? selectStyle + " " + customStyle : formClasses,
          "pr-8",
          customBorder
            ? "focus:border-0 focus:outline-none focus:ring-black "
            : "focus:border-zinc-400 focus:outline-none focus:ring-zinc-400  "
        )}
      />
    </div>
  );
}

export { TextField, SelectField };
