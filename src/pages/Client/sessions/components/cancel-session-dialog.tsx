import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { motion } from "framer-motion";

interface CancelSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
  clearError?: () => void;
}

export const CancelSessionDialog: React.FC<CancelSessionDialogProps> = ({
  open,
  onOpenChange,
  onCancel,
  loading = false,
  error,
  clearError,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <motion.button
        onClick={e => { e.stopPropagation(); onOpenChange(true); if (clearError) clearError(); }}
        title="Cancel session"
        className="p-2 rounded-full hover:bg-orange-100 transition-colors duration-200"
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <Ban className="h-5 w-5 text-orange-500" />
      </motion.button>
    </DialogTrigger>
    <DialogContent onClick={e => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gray-800">
          Cancel Session
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Are you sure you want to cancel this session? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
      <DialogFooter className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Back
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          onClick={onCancel}
        >
          {loading ? "Cancelling..." : "Confirm Cancel"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default CancelSessionDialog; 