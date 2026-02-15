import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '@/context/AppContext';
import { RegisterPaymentModal } from '@/app/components/RegisterPaymentModal';
import { RegisterClassModal } from '@/app/components/RegisterClassModal';
import { ChangeScheduleSnackbar } from '@/app/components/ChangeScheduleSnackbar';
import { ArrowLeft, DollarSign, Calendar, Clock, Edit, Trash2, Pencil, X, Check, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export function DetalleEstudiante() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { estudiantes, pagos, clases, eliminarEstudiante, editarClase, eliminarClase } = useApp();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isScheduleSnackbarOpen, setIsScheduleSnackbarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingClase, setEditingClase] = useState<string | null>(null);
  const [editObservacion, setEditObservacion] = useState('');

  const estudiante = estudiantes.find(e => e.id === id);

  if (!estudiante) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Estudiante no encontrado</p>
      </div>
    );
  }

  const pagosEstudiante = pagos.filter(p => p.estudianteId === id);
  const clasesEstudiante = clases.filter(c => c.estudianteId === id);

  const totalPagado = pagosEstudiante.reduce((sum, p) => sum + p.montoPagado, 0);
  const totalAdeudado = pagosEstudiante.reduce((sum, p) => sum + p.monto, 0);
  const balance = totalAdeudado - totalPagado;

  const statusColors = {
    pagado: 'bg-green-500/10 border border-green-500/30 text-green-400',
    pendiente: 'bg-[#C10801]/20 border border-[#C10801]/40 text-[#C10801]',
    parcial: 'bg-[#F16001]/20 border border-[#F16001]/40 text-[#F16001]',
  };

  const statusLabels = {
    pagado: 'Pagado',
    pendiente: 'Pendiente',
    parcial: 'Parcial',
  };

  const nombresDias: Record<typeof estudiante.diaSemana, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miércoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sábado: 'Sábado',
  };

  const handleDeleteEstudiante = async () => {
    try {
      await eliminarEstudiante(estudiante.id);
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleStartEditClase = (clase: typeof clasesEstudiante[0]) => {
    setEditingClase(clase.id);
    setEditObservacion(clase.observaciones || '');
  };

  const handleSaveObservacion = async (claseId: string) => {
    try {
      await editarClase(claseId, { observaciones: editObservacion });
      setEditingClase(null);
      setEditObservacion('');
    } catch (error) {
      console.error('Error al guardar observación:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingClase(null);
    setEditObservacion('');
  };

  const handleDeleteClase = async (claseId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      try {
        await eliminarClase(claseId);
      } catch (error) {
        console.error('Error al eliminar clase:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#D9C3AB]/80 hover:text-[#F16001] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Agenda
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#D9C3AB]">{estudiante.nombre}</h2>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[estudiante.estadoPago]}`}>
              {statusLabels[estudiante.estadoPago]}
            </span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 bg-[#C10801]/20 text-[#C10801] rounded-lg hover:bg-[#C10801]/30 transition-colors"
              title="Eliminar estudiante"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-lg max-w-md w-full p-6 border border-[#C10801]/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#C10801]/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#C10801]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#D9C3AB]">Eliminar Estudiante</h3>
                <p className="text-sm text-[#D9C3AB]/70">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-[#D9C3AB]/80 mb-6">
              ¿Estás seguro de que deseas eliminar a <strong>{estudiante.nombre}</strong>? 
              Se eliminarán también todos sus pagos y clases registradas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-[#F16001]/30 text-[#D9C3AB] rounded-lg hover:bg-[#F16001]/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteEstudiante}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#C10801] to-[#F16001] text-white rounded-lg hover:shadow-lg hover:shadow-[#C10801]/30 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F16001]/20 to-[#C10801]/20 rounded-lg flex items-center justify-center border border-[#F16001]/30">
              <Clock className="w-5 h-5 text-[#F16001]" />
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Horario</p>
              <p className="font-semibold text-[#D9C3AB]">
                {nombresDias[estudiante.diaSemana]} {estudiante.horaClase}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center border border-green-500/30">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Monto mensual</p>
              <p className="font-semibold text-[#D9C3AB]">
                ${estudiante.montoMensual.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D9C3AB]/20 to-[#D9C3AB]/10 rounded-lg flex items-center justify-center border border-[#D9C3AB]/30">
              <Calendar className="w-5 h-5 text-[#D9C3AB]" />
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Clases dadas</p>
              <p className="font-semibold text-[#D9C3AB]">{clasesEstudiante.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Financiero */}
      {pagosEstudiante.length > 0 && (
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20 mb-8">
          <h3 className="text-lg font-semibold text-[#D9C3AB] mb-4">Resumen Financiero</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Total a pagar</p>
              <p className="text-xl font-semibold text-[#D9C3AB]">${totalAdeudado.toLocaleString('es-CL')}</p>
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Total pagado</p>
              <p className="text-xl font-semibold text-green-400">${totalPagado.toLocaleString('es-CL')}</p>
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Balance</p>
              <p className={`text-xl font-semibold ${balance > 0 ? 'text-[#C10801]' : 'text-green-400'}`}>
                ${balance.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setIsScheduleSnackbarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D9C3AB]/20 to-transparent border border-[#D9C3AB]/30 text-[#D9C3AB] rounded-lg hover:bg-[#D9C3AB]/10 hover:shadow-lg hover:shadow-[#D9C3AB]/10 transition-all"
        >
          <Edit className="w-5 h-5" />
          Modificar Horario
        </button>
        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/80 to-green-700/80 text-white rounded-lg hover:shadow-lg hover:shadow-green-600/30 transition-all"
        >
          <DollarSign className="w-5 h-5" />
          Registrar Pago
        </button>
        <button
          onClick={() => setIsClassModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F16001] to-[#C10801] text-white rounded-lg hover:shadow-lg hover:shadow-[#F16001]/30 transition-all"
        >
          <Calendar className="w-5 h-5" />
          Registrar Clase
        </button>
      </div>

      {/* Historial de Clases */} 
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20 mb-8">
        <h3 className="text-lg font-semibold text-[#D9C3AB] mb-4">Historial de Clases</h3>
        {clasesEstudiante.length > 0 ? (
          <div className="space-y-3">
            {clasesEstudiante.map(clase => (
              <div key={clase.id} className="p-4 bg-black/30 rounded-lg border border-[#F16001]/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-[#D9C3AB]">
                    {format(new Date(clase.fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditClase(clase)}
                      className="p-1.5 text-[#D9C3AB]/60 hover:text-[#F16001] transition-colors"
                      title="Editar observación"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClase(clase.id)}
                      className="p-1.5 text-[#D9C3AB]/60 hover:text-[#C10801] transition-colors"
                      title="Eliminar clase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {editingClase === clase.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editObservacion}
                      onChange={(e) => setEditObservacion(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-[#F16001]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16001] text-[#D9C3AB] placeholder-[#D9C3AB]/30 min-h-[80px] resize-none"
                      placeholder="Agregar observaciones..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-sm text-[#D9C3AB]/70 hover:text-[#D9C3AB] transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveObservacion(clase.id)}
                        className="px-3 py-1.5 text-sm bg-green-600/80 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  clase.observaciones && (
                    <p className="text-sm text-[#D9C3AB]/70">{clase.observaciones}</p>
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#D9C3AB]/50 text-center py-4">No hay clases registradas</p>
        )}
      </div>

      {/* Historial de Pagos */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
        <h3 className="text-lg font-semibold text-[#D9C3AB] mb-4">Historial de Pagos</h3>
        {pagosEstudiante.length > 0 ? (
          <div className="space-y-3">
            {pagosEstudiante.map(pago => (
              <div key={pago.id} className="p-4 bg-black/30 rounded-lg border border-[#F16001]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#D9C3AB]">
                      ${pago.montoPagado.toLocaleString('es-CL')}
                      {pago.monto !== pago.montoPagado && (
                      <span className="text-sm text-[#D9C3AB]/60"> de ${pago.monto.toLocaleString('es-CL')}</span>
                    )}
                    </p>
                    <p className="text-sm text-[#D9C3AB]/60">
                      {format(new Date(pago.fecha), "d 'de' MMMM 'de' yyyy", { locale: es })} · {pago.metodo}
                    </p>
                  </div>
                  {pago.monto === pago.montoPagado ? (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/30">Completo</span>
                  ) : (
                    <span className="px-2 py-1 bg-[#F16001]/10 text-[#F16001] text-xs rounded border border-[#F16001]/30">Parcial</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#D9C3AB]/50 text-center py-4">No hay pagos registrados</p>
        )}
      </div>

      {/* Modals */}
      <RegisterPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        estudianteId={estudiante.id}
        montoMensual={estudiante.montoMensual}
      />

      <RegisterClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        estudianteId={estudiante.id}
      />

      <ChangeScheduleSnackbar
        isOpen={isScheduleSnackbarOpen}
        onClose={() => setIsScheduleSnackbarOpen(false)}
        estudiante={estudiante}
      />
    </div>
  );
}
