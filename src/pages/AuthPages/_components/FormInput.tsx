import clsx from "clsx";

interface FormInputProps {
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  label: string;
  inputClassName?: string;
  labelClassName?: string;
}

const FormInput = ({
  name,
  type,
  placeholder,
  required,
  label,
  inputClassName,
  labelClassName,
}: FormInputProps) => {
  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={name}
        className={clsx("text-base font-medium text-black-950", labelClassName)}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "w-full outline-none focus:outline-none bg-white rounded-lg py-2.5 px-2",
          inputClassName
        )}
      />
    </div>
  );
};

export default FormInput;
