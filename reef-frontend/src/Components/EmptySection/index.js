import { PlusCircleIcon } from '@heroicons/react/solid'

export default function EmptySection({ item = "Collection", onClick = () => { } }) {
    return (
        <button
            type="button"
            className="relative block w-3/5 mx-auto border-2  border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClick}
        >
            {/* <div className={"text-lg text-gray-900 font-medium uppercase mb-16"}>You have no {item}s</div> */}
            <svg
                className="mx-auto h-12 w-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
            >
                <PlusCircleIcon className="m-4" />
            </svg>
            <span className="mt-2 block text-sm font-medium uppercase text-gray-900">Create a new {item}</span>
        </button>
    )
}
