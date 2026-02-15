import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Clase } from '@/types';  // Cambiar de Class a Clase
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudianteId: string;  // Cambiar de studentId
}

export function RegisterClassModal({
  isOpen,
  onClose,
  estudianteId,  // Cambiar
}: RegisterClassModalProps) {
  const { agregarClase } = useApp();  // Cambiar de addClass
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    duracion: 60,  // Mantener igual
    observaciones: '',  // Cambiar de notes
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fecha) {
      toast.error('Por favor selecciona una fecha');
      return;
    }

    setIsSubmitting(true);
    try {
      // Usar agregarClase en lugar de addClass
      await agregarClase({
        estudianteId,  // Cambiar
        fecha: formData.fecha,
        duracion: formData.duracion,
        observaciones: formData.observaciones,  // Cambiar
      });

      // Resetear el formulario
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        duracion: 60,
        observaciones: '',
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error en el modal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (el resto del JSX se mantiene similar, solo cambiar etiquetas si es necesario)
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-lg max-w-md w-full p-6 border border-[#F16001]/30 shadow-2xl shadow-[#F16001]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#D9C3AB]">Registrar Clase</h3>
          {/* ... resto igual */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Fecha de la clase *
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB]"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Duración (minutos) *
            </label>
            <input
              type="number"
              value={formData.duracion}
              onChange={(e) => setFormData({ ...formData, duracion: parseInt(e.target.value) || 60 })}
              min="30"
              step="30"
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB]"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Observaciones (opcional)
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB] min-h-[100px] resize-none"
              placeholder="Observaciones de la clase..."
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-[#D9C3AB]/60 mt-1">
              {formData.observaciones.length}/500 caracteres
            </p>
          </div>

          <div className="pt-2">
            <p className="text-sm text-[#D9C3AB]/60">
              * Campos obligatorios
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#F16001]/30 text-[#D9C3AB] rounded-lg hover:bg-[#F16001]/10 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F16001] to-[#C10801] text-white rounded-lg hover:shadow-lg hover:shadow-[#F16001]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}