import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useApp } from '@/context/AppContext';
import { DayColumn } from '@/app/components/DayColumn';
import { StudentCard } from '@/app/components/StudentCard';
import { AddStudentModal } from '@/app/components/AddStudentModal';
import { Plus } from 'lucide-react';
import { Estudiante } from '@/types'; // Cambiar de Student a Estudiante
import { toast } from 'sonner';

const DIAS: Estudiante['diaSemana'][] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']; // Cambiar DAYS y dayOfWeek

export function AgendaSemanal() {
  const { estudiantes, actualizarHorarioEstudiante } = useApp(); // Cambiar nombres
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const verificarConflictoHorario = (
    diaObjetivo: Estudiante['diaSemana'], // Cambiar tipos
    horaObjetivo: string,
    excluirEstudianteId?: string
  ): boolean => {
    return estudiantes.some(estudiante => { // Cambiar students
      if (estudiante.id === excluirEstudianteId) return false;
      if (estudiante.diaSemana !== diaObjetivo) return false; // Cambiar dayOfWeek

      const horaEstudiante = parseInt(estudiante.horaClase.replace(':', '')); // Cambiar classTime
      const horaObjetivoNum = parseInt(horaObjetivo.replace(':', ''));
      const diferenciaTiempo = Math.abs(horaEstudiante - horaObjetivoNum);

      // Conflicto si la diferencia es menor a 100 (1 hora)
      return diferenciaTiempo < 100;
    });
  };

  const manejarDrop = (estudianteId: string, nuevoDia: Estudiante['diaSemana'], nuevaHora: string) => { // Cambiar handleDrop
    const tieneConflicto = verificarConflictoHorario(nuevoDia, nuevaHora, estudianteId);
    
    if (tieneConflicto) {
      toast.error('¡Conflicto de horario! Ya hay una clase a esa hora.');
      return;
    }

    // Verificar si existe actualizarHorarioEstudiante en tu AppContext
    // Si no existe, necesitarás crearla o usar otra función
    if (actualizarHorarioEstudiante) {
      actualizarHorarioEstudiante(estudianteId, nuevoDia, nuevaHora);
    } else {
      // Si no existe la función, puedes usar editarEstudiante
      // Esto depende de cómo tengas implementado tu AppContext
      console.warn('actualizarHorarioEstudiante no está implementado');
    }
    
    toast.success('Horario actualizado correctamente');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#D9C3AB]">Agenda Semanal</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F16001] to-[#C10801] text-white rounded-lg hover:shadow-lg hover:shadow-[#F16001]/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Agregar Estudiante
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DIAS.map(dia => { // Cambiar DAYS a DIAS
            const estudiantesDia = estudiantes // Cambiar students
              .filter(e => e.diaSemana === dia) // Cambiar dayOfWeek a diaSemana
              .sort((a, b) => {
                const horaA = parseInt(a.horaClase.replace(':', '')); // Cambiar classTime
                const horaB = parseInt(b.horaClase.replace(':', '')); // Cambiar classTime
                return horaA - horaB;
              });

            return (
              <DayColumn
                key={dia}
                day={dia}
                students={estudiantesDia} // Pasar como students (porque DayColumn aún usa inglés)
                onDrop={manejarDrop} // Cambiar handleDrop
              />
            );
          })}
        </div>

        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          checkTimeConflict={verificarConflictoHorario} // Cambiar nombre
        />
      </div>
    </DndProvider>
  );
}