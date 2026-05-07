import { Textarea, Switch, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Label } from 'recharts';
import { Appointment, AppointmentStatus, AppointmentPriority } from './CalendarGrid';
import { BaseSwitch, FormTextInput, Icons } from '_components/custom';
import { ENUM } from '_types/*';

const AGENTS = ['Karim B.', 'Léa M.', 'Yacine R.', 'Sophie T.'];

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

export type AppointmentFormValue = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;

interface Props {
  initial?: Appointment;
  defaultStart?: Date;
  onSubmit: (v: AppointmentFormValue) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const AppointmentForm = ({
  initial,
  defaultStart,
  onSubmit,
  onDelete,
  onDuplicate,
}: Props) => {
  const start0 = initial?.start ?? (defaultStart ?? new Date()).toISOString();
  const end0 = initial?.end ?? new Date(new Date(start0).getTime() + 60 * 60 * 1000).toISOString();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [propertyId, setPropertyId] = useState(initial?.propertyId ?? '');
  const [clientName, setClientName] = useState(initial?.clientName ?? '');
  const [agentName, setAgentName] = useState(initial?.agentName ?? AGENTS[0]);
  const [start, setStart] = useState(toLocalInput(start0));
  const [end, setEnd] = useState(toLocalInput(end0));
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [status, setStatus] = useState<AppointmentStatus>(
    initial?.status ?? ENUM.COMMON.Status.PLANNED,
  );
  const [priority, setPriority] = useState<AppointmentPriority>(initial?.priority ?? 'normal');
  const [reminder, setReminder] = useState(initial?.reminder ?? true);
  const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {
  //     if (!title && propertyId) {
  //       const p = properties.find((x) => x.id === propertyId);
  //       if (p) setTitle(`Visite — ${p.title}`);
  //     }
  //   }, [propertyId]);

  const submit = () => {
    setError(null);
    if (!title.trim()) return setError('Le titre est requis');
    if (!clientName.trim()) return setError('Le nom du client est requis');
    const s = new Date(start);
    const e = new Date(end);
    if (e <= s) return setError("L'heure de fin doit être après le début");
    onSubmit({
      title: title.trim(),
      propertyId: propertyId || undefined,
      clientName: clientName.trim(),
      agentName,
      start: s.toISOString(),
      end: e.toISOString(),
      notes: notes.trim(),
      status,
      priority,
      reminder,
    });
  };

  return (
    <div className="space-y-4">
      <FormTextInput
        name="title"
        label="Titre"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Visite — Studio Marais"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Bien immobilier</Label>
          {/* <Select
            value={propertyId || 'none'}
            onValueChange={(v) => setPropertyId(v === 'none' ? '' : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Aucun —</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
        <div className="space-y-1.5">
          <Label>Agent assigné</Label>
          {/* <Select value={agentName} onValueChange={setAgentName}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGENTS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>

      {/* <div className="space-y-1.5">
        <Label>Client / Lead</Label>
        <Input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nom du contact"
        />
      </div> */}

      {/* <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Début</Label>
          <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Fin</Label>
          <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div> */}

      <div className="grid grid-cols-2 gap-3">
        {/* <div className="space-y-1.5">
          <Label>Statut</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as AppointmentStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_META) as AppointmentStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
                    {STATUS_META[s].label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        {/* <div className="space-y-1.5">
          <Label>Priorité</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as AppointmentPriority)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="normal">Normale</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Détails supplémentaires…"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Rappel automatique</p>
          <p className="text-xs text-muted-foreground">Notifier 1h avant la visite</p>
        </div>
        <BaseSwitch isChecked={reminder} onSwitchChange={setReminder} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex gap-2">
          {initial && onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Icons.Trash className="h-4 w-4" /> Supprimer
            </Button>
          )}
          {initial && onDuplicate && (
            <Button type="button" variant="outline" size="sm" onClick={onDuplicate}>
              <Icons.DoubleCheck className="h-4 w-4" /> Dupliquer
            </Button>
          )}
        </div>
        <div className="flex gap-2 ml-auto">
          <Button type="button" onClick={submit}>
            {initial ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
};
