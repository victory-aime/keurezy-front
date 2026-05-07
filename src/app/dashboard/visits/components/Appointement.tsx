'use client';
import { useState } from 'react';
import { isSameDay } from 'date-fns';
import { Appointment, useAppointments } from './CalendarGrid';
import { BaseContainer, BaseDrawer, BaseText, Icons, BaseAgenda } from '_components/custom';
import { Formik } from 'formik';
import { ENUM } from '_types/*';

export const Appointments = () => {
  const {
    appointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    duplicateAppointment,
  } = useAppointments();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [defaultStart, setDefaultStart] = useState<Date | undefined>();

  const todayCount = appointments.filter((a) => isSameDay(new Date(a.start), new Date())).length;

  const openCreate = (start?: Date) => {
    setEditing(null);
    setDefaultStart(start);
    setOpen(true);
  };

  const openEdit = (a: {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    status: ENUM.COMMON.Status;
    description?: string;
    meta?: any;
  }) => {
    setEditing(a as any);
    setDefaultStart(undefined);
    setOpen(true);
  };

  //   const handleSubmit = (v: AppointmentFormValue) => {
  //     // conflict detection
  //     const conflict = appointments.some((a) => {
  //       if (editing && a.id === editing.id) return false;
  //       if (a.agentName !== v.agentName) return false;
  //       const aS = +new Date(a.start),
  //         aE = +new Date(a.end);
  //       const vS = +new Date(v.start),
  //         vE = +new Date(v.end);
  //       return vS < aE && vE > aS;
  //     });
  //     if (conflict) {
  //       toast.warning('Conflit horaire détecté pour cet agent — créneau enregistré quand même.');
  //     }
  //     if (editing) {
  //       updateAppointment(editing.id, v);
  //       toast.success('Visite modifiée');
  //     } else {
  //       createAppointment(v);
  //       toast.success('Visite créée');
  //     }
  //     setOpen(false);
  //   };

  const handleDelete = () => {
    if (!editing) return;
    deleteAppointment(editing.id);
    //toast.success('Visite supprimée');
    setOpen(false);
  };

  const handleDuplicate = () => {
    if (!editing) return;
    duplicateAppointment(editing.id);
    //toast.success('Visite dupliquée');
    setOpen(false);
  };

  const handleMove = (id: string, newStart: Date) => {
    const a = appointments.find((x) => x.id === id);
    if (!a) return;
    const dur = +new Date(a.end) - +new Date(a.start);
    const newEnd = new Date(+newStart + dur);
    updateAppointment(id, { start: newStart.toISOString(), end: newEnd.toISOString() });
    //toast.success('Visite déplacée');
  };

  const handleResize = (id: string, newEnd: Date) => {
    const a = appointments.find((x) => x.id === id);
    if (!a) return;
    if (newEnd <= new Date(a.start)) return;
    updateAppointment(id, { end: newEnd.toISOString() });
  };

  return (
    <BaseContainer
      title="Rendez-vous"
      border={'none'}
      p={0}
      icon={<Icons.Calendar />}
      description={` Planifiez et gérez les visites de vos biens — ${todayCount} visite
              ${todayCount > 1 ? 's' : ''} aujourd'hui.`}
      withActionButtons
      actionsButtonProps={{
        validateTitle: 'Nouvelle visite',
        onClick() {
          openCreate();
        },
      }}
    >
      <BaseAgenda
        events={appointments ?? []}
        onCreate={() => setOpen(true)}
        defaultDate={defaultStart}
        onMoveEvent={handleMove}
        onResizeEvent={handleResize}
        onSelectEvent={(event) => openEdit(event)}
        statuses={[
          ENUM.COMMON.Status.PLANNED,
          ENUM.COMMON.Status.DONE,
          ENUM.COMMON.Status.CONFIRMED,
          ENUM.COMMON.Status.CANCELLED,
        ]}
      />
      <Formik initialValues={{}} onSubmit={() => {}}>
        {({ setFieldValue }) => (
          <BaseDrawer
            title={'En cours'}
            description={'en cours de développement'}
            onChange={setOpen}
            isOpen={open}
            ignoreFooter
          >
            <BaseText fontSize={'xxx-large'}>COMING SOON ...</BaseText>
          </BaseDrawer>
        )}
      </Formik>
    </BaseContainer>
  );
};
