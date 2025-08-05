import { ResponseDialog } from "@/components/response-dialog"
import { JSX, useState } from "react"

export const useConfirm = (
  title: string,
  description: string
): [() => JSX.Element | null, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve })
    })
  }

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(true)
      handleClose()
    }
  }

  const handleCancel = () => {
    if (promise) {
      promise.resolve(false)
      handleClose()
    }
  }

  const ConfirmDialog = () => {
    if (!promise) return null

    return (
      <ResponseDialog
        open={true}
        onOpenChange={(open) => {
          if (!open) handleCancel()
        }}
        title={title}
        description={description}
      >
        <div className="pt-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded-md shadow-sm transition"
          >
            Confirm
          </button>
        </div>
      </ResponseDialog>
    )
  }

  return [ConfirmDialog, confirm]
}
