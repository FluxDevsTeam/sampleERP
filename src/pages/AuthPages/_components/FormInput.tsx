
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
    <div className="w-full space-y-2">
      <label
        htmlFor={name}
        className={clsx("text-sm sm:text-base font-medium text-black-950", labelClassName)}
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
          "w-full outline-none focus:outline-none bg-white rounded-lg py-2 sm:py-2.5 px-2 text-sm sm:text-base",
          inputClassName
        )}
      />
    </div>
  );
};

export default FormInput;