
import clsx from "clsx";

interface FormInputProps {
  name: string;
  value: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  label: string;
  inputClassName?: string;
  labelClassName?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  name,
  value,
  type,
  placeholder,
  required,
  label,
  inputClassName,
  labelClassName,
  onChange,
}: FormInputProps) => {
  return (
    <div className="w-full space-y-1.5 sm:space-y-2">
      <label
        htmlFor={name}
        className={clsx("text-xs sm:text-sm md:text-base font-medium text-black-950", labelClassName)}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "w-full outline-none focus:outline-none bg-white rounded-lg py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-3 text-xs sm:text-sm md:text-base",
          inputClassName
        )}
      />
    </div>
  );
};

export default FormInput;