// components/Dialog.js
"use client";

export default function Dialog({
  title,
  inputValue,
  inputPlaceholder,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-yellow-950 p-6 rounded-lg shadow-lg w-1/3">
          <form onSubmit={onSubmit}>
            <h2 className="text-xl text-white font-semibold mb-4">{title}</h2>
            <p className="mb-4 text-white">
              <input
                className="shadow appearance-none border rounded-2xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="name"
                onChange={onChange}
                value={inputValue}
                placeholder={inputPlaceholder}
                required
              ></input>
            </p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-3"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
              <button
                className="bg-yellow-700 text-white px-4 py-2 rounded-md"
                type="submit"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
