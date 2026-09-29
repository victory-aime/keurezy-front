import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormTextArea } from '_components/custom';
import { MODELS } from '_types/*';
import { formatBookingDate } from '_utils/bookings';
import { bookingCancelImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';

const cancelSchema = Yup.object({
  reason: Yup.string()
    .trim()
    .required("Indiquez le motif de l'annulation : il sera transmis au client.")
    .max(500, 'Le motif ne doit pas dépasser 500 caractères.'),
});

interface CancelBookingDialogProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  booking: MODELS.IAgencyBooking | null;
  isSubmitting?: boolean;
  onConfirm: (reason: string) => void;
}

/**
 * Annulation d'une réservation confirmée par l'agence : l'impact (client prévenu, dates
 * libérées, historique conservé) est montré avec le motif obligatoire transmis au client.
 */
export const CancelBookingDialog = ({
  isOpen,
  onChange,
  booking,
  isSubmitting,
  onConfirm,
}: CancelBookingDialogProps) => (
  <Formik
    // Nouveau formulaire à chaque ouverture : le motif d'une autre réservation ne reste pas
    key={isOpen ? booking?.id : 'closed'}
    initialValues={{ reason: '' }}
    validationSchema={cancelSchema}
    onSubmit={(values) => onConfirm(values.reason.trim())}
    enableReinitialize
  >
    {({ handleSubmit, values }) => (
      <ActionImpactDialog
        isOpen={isOpen}
        onChange={onChange}
        title="Annuler cette réservation"
        subject={booking?.property.title}
        summary={
          booking
            ? bookingCancelImpact({
                clientName: booking.client?.name,
                period: `du ${formatBookingDate(booking.startDate)} au ${formatBookingDate(booking.endDate)}`,
                totalAmount: Number(booking.totalAmount),
              })
            : undefined
        }
        isSubmitting={isSubmitting}
        confirmTitle="Annuler la réservation"
        confirmDisabled={!values.reason.trim()}
        onConfirm={() => handleSubmit()}
      >
        <FormTextArea
          required
          name="reason"
          label="Motif de l'annulation"
          placeholder="Ex : dégât des eaux, le bien n'est plus disponible à ces dates"
        />
      </ActionImpactDialog>
    )}
  </Formik>
);
