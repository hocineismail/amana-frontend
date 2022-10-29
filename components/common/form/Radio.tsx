import React from "react";

type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
};

export default function Radio({ id, label, checked, onChange }: Props) {
  return (
    <div className="form-check relative" onClick={() => onChange(id)}>
      <input
        className="radio-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        type="radio"
        name="flexRadioDefault"
        id={id}
        style={{ position: "relative" }}
        checked={checked}
        // onChange={() => console.log("hello")}
      />
      <label
        className="form-check-label inline-block text-gray-800 radio-label"
        htmlFor={id}
      >
        <div>{label}</div>
        <div style={{ fontSize: "12px" }}>Fees 0</div>
      </label>
    </div>
  );
}
