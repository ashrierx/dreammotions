import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import type { FormData } from '../../App';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onSave: (data: FormData) => void;
}

export function EditModal({ isOpen, onClose, formData, onSave }: EditModalProps) {
  const [editData, setEditData] = useState<FormData>(formData);

  useEffect(() => {
    setEditData(formData);
  }, [formData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData.dream && editData.emotion && editData.recurring) {
      onSave(editData);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-purple-800">Edit Dream Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-purple-600" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-purple-800 mb-2">
                    Describe your dream
                  </label>
                  <textarea
                    value={editData.dream}
                    onChange={(e) => setEditData({ ...editData, dream: e.target.value })}
                    placeholder="I was floating through a garden filled with glowing butterflies..."
                    className="w-full h-32 px-4 py-3 bg-white/70 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none placeholder:text-purple-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-800 mb-2">
                    What emotion does it invoke?
                  </label>
                  <input
                    type="text"
                    value={editData.emotion}
                    onChange={(e) => setEditData({ ...editData, emotion: e.target.value })}
                    placeholder="Peace, anxiety, joy, confusion..."
                    className="w-full px-4 py-3 bg-white/70 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-800 mb-2">
                    Is this a recurring theme?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit-recurring"
                        value="yes"
                        checked={editData.recurring === 'yes'}
                        onChange={(e) => setEditData({ ...editData, recurring: e.target.value })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-400"
                        required
                      />
                      <span className="text-purple-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit-recurring"
                        value="no"
                        checked={editData.recurring === 'no'}
                        onChange={(e) => setEditData({ ...editData, recurring: e.target.value })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-400"
                      />
                      <span className="text-purple-700">No</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Re-analyze
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
