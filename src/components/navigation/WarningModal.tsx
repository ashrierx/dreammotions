import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, AlertCircle } from "lucide-react";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "warning" | "error" | "info";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export function WarningModal({
  isOpen,
  onClose,
  title,
  message,
  type = "warning",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  showCancel = false,
}: WarningModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "info":
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case "error":
        return {
          iconBg: "bg-red-100",
          button: "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
        };
      case "info":
        return {
          iconBg: "bg-blue-100",
          button: "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
        };
      default:
        return {
          iconBg: "bg-orange-100",
          button: "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={showCancel ? onClose : undefined}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/60 w-full max-w-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${colors.iconBg} rounded-full`}>
                    {getIcon()}
                  </div>
                  <h2 className="text-2xl text-purple-800">{title}</h2>
                </div>
                {!showCancel && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-purple-100 bg-purple-100! rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-purple-600" />
                  </button>
                )}
              </div>

              {/* Message */}
              <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>

              {/* Actions */}
              <div className={`flex gap-3 ${showCancel ? "justify-end" : "justify-end"}`}>
                {showCancel && (
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-medium"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`px-6 py-3 ${colors.button} text-white rounded-xl transition-all shadow-lg font-medium`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
