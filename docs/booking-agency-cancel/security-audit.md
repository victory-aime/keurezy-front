# Audit de sécurité : `booking-agency-cancel`

Date : 2026-09-29. Méthode : skill `security-and-hardening`.

- **Autorisation.** Le bouton n'apparaît qu'avec `manage_bookings`, pour une réservation confirmée qui n'a pas commencé. Le backend revérifie les deux points : permission par le guard global, statut et date (`BOOKING_NOT_CANCELLABLE`). Il revérifie aussi l'agence propriétaire de la réservation (IDOR). ✅
- **Validation des entrées.** Le motif est obligatoire, nettoyé des espaces et limité à 500 caractères côté web (Yup). Le backend le valide aussi (`RejectBookingDto` : `IsNotEmpty`, `MaxLength(500)`), puisque c'est lui la frontière de confiance. ✅
- **XSS.** Le motif est transmis au client par notification et par e-mail. Côté web, il est rendu en texte par React. L'e-mail passe par un modèle Resend avec variables, sans concaténation HTML côté backend. ✅
- **Données.** L'impact n'utilise que des données déjà affichées (nom du client, dates, montant) : rien de nouveau n'est exposé. ✅
- **Diff.** Aucun secret, aucune dépendance. ✅

**Verdict** : rien à signaler.
