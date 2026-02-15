import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Estudiante } from '@/types';  // Cambiar de Student a Estudiante
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkTimeConflict: (day: Estudiante['diaSemana'], time: string) => boolean;
}

export function AddStudentModal({ isOpen, onClose, checkTimeConflict }: AddStudentModalProps) {
  const { agregarEstudiante } = useApp();  // Cambiar de addStudent a agregarEstudiante
  const [formData, setFormData] = useState({
    nombre: '',  // Cambiar de name
    montoMensual: '',  // Cambiar de monthlyAmount
    diaSemana: 'lunes' as Estudiante['diaSemana'],  // Cambiar de dayOfWeek
    horaClase: '',  // Cambiar de classTime
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.montoMensual || !formData.horaClase) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const hasConflict = checkTimeConflict(formData.diaSemana, formData.horaClase);
    if (hasConflict) {
      toast.error('¡Conflicto de horario! Ya hay una clase a esa hora.');
      return;
    }

    try {
      await agregarEstudiante({
        nombre: formData.nombre,  // Cambiar
        montoMensual: parseFloat(formData.montoMensual),  // Cambiar
        diaSemana: formData.diaSemana,  // Cambiar
        horaClase: formData.horaClase,  // Cambiar
        estadoPago: 'pendiente',  // Cambiar de paymentStatus
      });

      toast.success('Estudiante agregado correctamente');
      setFormData({
        nombre: '',
        montoMensual: '',
        diaSemana: 'lunes',
        horaClase: '',
      });
      onClose();
      
    } catch (error) {
      toast.error('Error al crear estudiante. Intenta de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-lg max-w-md w-full p-6 border border-[#F16001]/30 shadow-2xl shadow-[#F16001]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#D9C3AB]">Agregar Estudiante</h3>
          <button
            onClick={onClose}
            className="text-[#D9C3AB]/60 hover:text-[#F16001] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.nombre}  // Cambiar
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}  // Cambiar
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB] placeholder-[#D9C3AB]/30"
              placeholder="María García"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Monto mensual
            </label>
            <input
              type="number"
              value={formData.montoMensual}  // Cambiar
              onChange={(e) => setFormData({ ...formData, montoMensual: e.target.value })}  // Cambiar
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB] placeholder-[#D9C3AB]/30"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Día de la semana
            </label>
            <select
              value={formData.diaSemana}  // Cambiar
              onChange={(e) =>
                setFormData({ ...formData, diaSemana: e.target.value as Estudiante['diaSemana'] })  // Cambiar
              }
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB]"
            >
              <option value="lunes">Lunes</option>
              <option value="martes">Martes</option>
              <option value="miércoles">Miércoles</option>
              <option value="jueves">Jueves</option>
              <option value="viernes">Viernes</option>
              <option value="sábado">Sábado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#D9C3AB]/80 mb-1">
              Hora de clase
            </label>
            <input
              type="time"
              value={formData.horaClase}  // Cambiar
              onChange={(e) => setFormData({ ...formData, horaClase: e.target.value })}  // Cambiar
              className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#F16001]/30 text-[#D9C3AB] rounded-lg hover:bg-[#F16001]/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F16001] to-[#C10801] text-white rounded-lg hover:shadow-lg hover:shadow-[#F16001]/30 transition-all"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}