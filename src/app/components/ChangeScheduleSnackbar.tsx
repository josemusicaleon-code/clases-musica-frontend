import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Estudiante } from '@/types'; // Cambiar de Student a Estudiante
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface ChangeScheduleSnackbarProps {
  isOpen: boolean;
  onClose: () => void;
  estudiante: Estudiante; // Cambiar de student
}

export function ChangeScheduleSnackbar({ isOpen, onClose, estudiante }: ChangeScheduleSnackbarProps) {
  const { estudiantes, actualizarHorarioEstudiante } = useApp(); // Cambiar nombres
  const [formData, setFormData] = useState({
    diaSemana: estudiante.diaSemana, // Cambiar de dayOfWeek
    horaClase: estudiante.horaClase, // Cambiar de classTime
  });

  if (!isOpen) return null;

  const verificarConflictoHorario = (
    diaObjetivo: Estudiante['diaSemana'], // Cambiar tipos
    horaObjetivo: string
  ): boolean => {
    return estudiantes.some(e => { // Cambiar students
      if (e.id === estudiante.id) return false;
      if (e.diaSemana !== diaObjetivo) return false; // Cambiar dayOfWeek

      const horaEstudiante = parseInt(e.horaClase.replace(':', '')); // Cambiar classTime
      const horaObjetivoNum = parseInt(horaObjetivo.replace(':', ''));
      const diferenciaTiempo = Math.abs(horaEstudiante - horaObjetivoNum);

      return diferenciaTiempo < 100;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tieneConflicto = verificarConflictoHorario(formData.diaSemana, formData.horaClase); // Cambiar nombres
    if (tieneConflicto) {
      toast.error('¡Conflicto de horario! Ya hay una clase a esa hora.');
      return;
    }

    actualizarHorarioEstudiante(estudiante.id, formData.diaSemana, formData.horaClase); // Cambiar función
    toast.success('Horario actualizado correctamente');
    onClose();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-br from-black/95 to-black/80 backdrop-blur-xl rounded-lg shadow-2xl border border-[#F16001]/30 shadow-[#F16001]/20 p-6 max-w-md w-full z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#D9C3AB]">Cambiar Horario</h3>
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
            Día de la semana
          </label>
          <select
            value={formData.diaSemana} // Cambiar
            onChange={(e) =>
              setFormData({ ...formData, diaSemana: e.target.value as Estudiante['diaSemana'] }) // Cambiar
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
            value={formData.horaClase} // Cambiar
            onChange={(e) => setFormData({ ...formData, horaClase: e.target.value })} // Cambiar
            className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB]"
          />
        </div>

        <div className="flex gap-3 pt-2">
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
  );
}