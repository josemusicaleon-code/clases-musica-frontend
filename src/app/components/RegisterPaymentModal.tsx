import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Pago } from '@/types';  // Cambiar de Payment a Pago
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudianteId: string;  // Cambiar de studentId
  montoMensual: number;  // Cambiar de monthlyAmount
}

export function RegisterPaymentModal({
  isOpen,
  onClose,
  estudianteId,  // Cambiar
  montoMensual,  // Cambiar
}: RegisterPaymentModalProps) {
  const { agregarPago } = useApp();  // Cambiar de addPayment
  const [formData, setFormData] = useState({
    monto: montoMensual.toString(),  // Cambiar de amount
    montoPagado: '',  // Cambiar de amountPaid
    fecha: new Date().toISOString().split('T')[0],  // Cambiar de date
    metodo: 'efectivo' as Pago['metodo'],  // Cambiar de method
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.montoPagado || !formData.fecha) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const monto = parseFloat(formData.monto);
    const montoPagado = parseFloat(formData.montoPagado);

    if (montoPagado <= 0) {
      toast.error('El monto pagado debe ser mayor a 0');
      return;
    }

    setIsSubmitting(true);
    try {
      // Usar agregarPago en lugar de addPayment
      await agregarPago({
        estudianteId,  // Cambiar
        monto: monto,  // Cambiar
        montoPagado: montoPagado,  // Cambiar
        fecha: formData.fecha,  // Cambiar
        metodo: formData.metodo,  // Cambiar
      });

      // Resetear el formulario
      setFormData({
        monto: montoMensual.toString(),
        montoPagado: '',
        fecha: new Date().toISOString().split('T')[0],
        metodo: 'efectivo',
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error en el modal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-lg max-w-md w-full p-6 border border-[#F16001]/30 shadow-2xl shadow-[#F16001]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#D9C3AB]">Registrar Pago</h3>
          <button
            onClick={onClose}
            className="text-[#D9C3AB]/60 hover:text-[#F16001] transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Monto a pagar
            </label>
            <input
              type="number"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB]"
              disabled={isSubmitting}
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Monto pagado *
            </label>
            <input
              type="number"
              value={formData.montoPagado}
              onChange={(e) => setFormData({ ...formData, montoPagado: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB] placeholder-[#D9C3AB]/30"
              placeholder="50000"
              disabled={isSubmitting}
              required
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Fecha *
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
              Método de pago
            </label>
            <select
              value={formData.metodo}
              onChange={(e) =>
                setFormData({ ...formData, metodo: e.target.value as Pago['metodo'] })
              }
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB]"
              disabled={isSubmitting}
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
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