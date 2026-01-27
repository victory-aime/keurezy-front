import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/core/index.js";

export interface BaseAgendaProps {
  /**
   * Liste des événements à afficher dans le calendrier.
   */
  events: EventInput[];

  /**
   * Vue initiale du calendrier ('dayGridMonth', 'timeGridWeek', 'timeGridDay', etc.)
   * Par défaut : 'dayGridMonth'
   */
  initialView?: string;

  /**
   * Callback déclenché lorsqu'un événement est cliqué.
   */
  onEventClick?: (info: EventClickArg) => void;

  /**
   * Callback déclenché lors de la sélection d'une date ou plage de dates.
   */
  onDateSelect?: (info: DateSelectArg) => void;

  /**
   * Détermine si la légende des statuts (réservations, maintenance, etc.) est affichée.
   * Par défaut : true
   */
  showLegend?: boolean;
}
