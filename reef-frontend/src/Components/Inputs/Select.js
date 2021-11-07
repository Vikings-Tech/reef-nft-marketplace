import { useState } from "react";

export default function Select(props) {
    const { label, values = ["Select..."], value = "Select", setValue = () => { } } = props;
    return (
        <div className="m-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                id="location"
                name="location"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => { setValue(e.target.value) }}
                value={value}
            >
                {values.map((e) => {
                    return (<option>{e}</option>)
                })}
            </select>
        </div>
    )
}