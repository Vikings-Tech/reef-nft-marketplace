const Text = ({ title, value, onChange, ...props }) => {
    return (<div class="w-full  px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
            {title}
        </label>
        <input
            class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text"
            placeholder={"Enter " + title}
            value={value}
            onChange={onChange}
            {...props}
        />
    </div>)
}
export default Text;