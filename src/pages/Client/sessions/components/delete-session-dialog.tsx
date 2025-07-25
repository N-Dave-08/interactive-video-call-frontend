import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
interface DeleteSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  loading?: boolean;
}

export const DeleteSessionDialog: React.FC<DeleteSessionDialogProps> = ({
  open,
  onOpenChange,
  onDelete,
  loading = false,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <motion.button
        onClick={e => e.stopPropagation()}
        title="Delete session"
        className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash2 className="h-5 w-5 text-red-500" />
      </motion.button>
    </DialogTrigger>
    <DialogContent onClick={e => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gray-800">
          Delete Session
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Are you sure you want to delete this session? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button
            variant={"secondary"}
            className="rounded-full px-4 py-2"
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={onDelete}
          variant={"destructive"}
          className="rounded-full px-4 py-2"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteSessionDialog; 