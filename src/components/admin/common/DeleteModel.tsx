import { Trash2 } from "lucide-react";

interface DeleteModelProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  selectedId,
}: DeleteModelProps) {
  return (
    <div>
      {isOpen && selectedId ? (
        <div className="fixed top-0 bottom-0 left-0 mt-0 bg-[#ffffffa6] bg-opacity-10  h-screen w-full flex flex-col justify-center items-center">
          <div className="p-8 border sm:max-w-md shadow-lg rounded-lg bg-white max-w-[90%]">
            <Trash2 className="h-16 w-16 mx-auto mb-4 text-red-600 hover:text-red-900" />
            <p className="text-center">Are you sure you want to remove this?</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                className="bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-700 transition-all"
                onClick={() => {
                  onDelete(selectedId);
                  onClose();
                }}
              >
                YES
              </button>
              <button
                className="bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md hover:bg-gray-400 transition-all"
                onClick={onClose}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
