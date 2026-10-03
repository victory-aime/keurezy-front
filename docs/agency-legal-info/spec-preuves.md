# Spec : page Agence, corrections et pièces justificatives

> Demande du 2026-10-03.
> 1. La forme juridique n'est jamais enregistrée.
> 2. Le logo disparaît quand on modifie une autre information.
> 3. Revoir l'affichage du logo et la disposition des informations.
> 4. Le texte ne suffit pas : chaque information légale doit être accompagnée d'une preuve (PNG, JPEG, PDF).

## Causes des bugs
- **Forme juridique.** Le select du formulaire renvoie un tableau (`['SARL']`). `toPayload` ne garde que les chaînes : la valeur n'est jamais envoyée. En base, `legalForm` est `null` pour toutes les agences.
- **Logo.** Il reste bien en base (vérifié). En revanche, la page n'affiche jamais le logo enregistré (`avatarImage={undefined}`) : après un enregistrement ou un rechargement, l'emplacement est vide. De plus, le formulaire renvoie l'URL du logo comme champ texte à chaque enregistrement. Correction :
  - afficher le logo enregistré ;
  - n'envoyer `agencyLogo` que si un nouveau fichier a été choisi.

## Pièces justificatives
| Information | Pièce attendue | Clé |
|---|---|---|
| Raison sociale et forme juridique | Statuts de la société (ou registre pour une entreprise individuelle) | `LEGAL_FORM` |
| NINEA | Attestation NINEA | `NINEA` |
| RCCM | Extrait du registre du commerce (RCCM) | `RCCM` |

L'adresse et l'e-mail de facturation, ainsi que les coordonnées bancaires, ne demandent pas de preuve.

### Règles
1. **Formats** : PNG, JPEG ou PDF, 5 Mo au plus. Le contenu est contrôlé par sa signature binaire : le type annoncé par le navigateur ne prouve rien.
2. **Droits** : l'owner envoie, remplace ou retire une pièce ; le staff la consulte.
3. **Vérification** : une pièce manquante compte comme une information manquante (`legalMissing`).
   - Sans toutes ses pièces, l'agence ne peut pas être vérifiée.
   - La note de la page liste ce qui manque.
4. **Agence déjà vérifiée** : remplacer ou retirer une pièce retire la vérification, comme pour un changement de raison sociale, de NINEA ou de RCCM. L'owner est prévenu avant.
5. **Stockage** : Cloudinary, dossier de l'agence. L'ancienne pièce est supprimée après le remplacement.
6. **Visibilité** : owner, staff et SUPER_ADMIN (détail admin de l'agence) ; jamais dans les réponses publiques.

### Contrat
- `POST secured/agency/legal/proof?agencyId&kind=LEGAL_FORM|NINEA|RCCM`, multipart `file`.
  - Réponse : `{ legal, legalMissing, isVerified }`.
  - Erreurs : `422 INVALID_LEGAL_PROOF` (format ou taille), `403 OWNER_ONLY`.
- `DELETE secured/agency/legal/proof?agencyId&kind=…` : même réponse.
- Colonnes nullables `legalFormProofUrl`, `nineaProofUrl`, `rccmProofUrl` sur `agency`. Elles sont renvoyées par `GET secured/agency/info` et par le détail admin.

### Limite connue
Les URL Cloudinary sont publiques mais impossibles à deviner, comme les documents déjà joints à l'inscription. Une diffusion signée (URL à durée limitée) viendra dans un chantier à part, si besoin.

## Disposition de la page Agence
- **Profil public** : le logo dans un cadre carré (logo enregistré affiché, remplacement au clic), à côté du nom, de la description, de l'adresse et du téléphone.
- **Informations légales**, en quatre blocs :
  1. Identité de l'entreprise : raison sociale, forme juridique, NINEA, RCCM.
  2. Documents justificatifs, juste en dessous : une carte par pièce (fournie ou à joindre ; aperçu, remplacer, retirer).
  3. Facturation : adresse et e-mail.
  4. Coordonnées de paiement.
- **Documents de l'inscription** : inchangé.

## Tâches
- [x] P1 [web] Forme juridique enregistrée ; logo affiché sans recadrage (carré, image entière) et envoyé seulement s'il change ; l'image enregistrée n'est plus convertie en fichier par le composant d'envoi.
- [x] P2 [back] Migration 26, `legalMissing` avec les pièces, routes d'envoi et de retrait, tests (433 au total).
- [x] P3 [web] `LegalProofCard` : fournie (aperçu, remplacer, retirer) ou à joindre (bouton, glisser-déposer), confirmation sur une agence vérifiée, apparition douce coupée par « réduire les animations ». Section légale en blocs (identité, documents, facturation, paiement), note aux couleurs de la charte qui sépare informations et documents manquants. Tests 116, build OK, rendu vérifié en clair et sombre (owner et staff) sur une page de contrôle supprimée ensuite.
- [x] P4 Audit de sécurité (ci-dessous), commits locaux.

## Audit de sécurité
| Point | État |
|---|---|
| Droits | Envoi et retrait : owner seulement (`agencyAccessControl` puis `OWNER_ONLY`), vérifiés **avant** tout envoi à Cloudinary. `agencyId` contrôlé par l'appartenance à l'agence. |
| Entrée `kind` | `ParseEnumPipe` : seules `LEGAL_FORM`, `NINEA`, `RCCM` passent (400 sinon) ; la colonne vient d'une table fixe, jamais de la requête. |
| Fichier | Multer : 1 fichier, 5 Mo, aucun champ texte, types PDF/PNG/JPEG. Le service revérifie la taille et la **signature binaire** : HTML, SVG ou exécutable renommé refusés (test). Nom de fichier assaini et rendu unique par `UploadsService`. |
| Suppression | Seules les URL `res.cloudinary.com` (image ou brut) sont analysées ; l'identifiant vient de la base, jamais du client. Un échec est journalisé sans bloquer. |
| Exposition | Les URL ne sortent que par `secured/agency/info` (owner, staff) et le détail admin ; aucune réponse publique ne renvoie la ligne agence complète (recherche faite). |
| Vérification | Pièce manquante = agence non vérifiable ; remplacement ou retrait sur une agence vérifiée = vérification retirée (tests). |
| Front | Aperçu limité aux URL renvoyées par le backend ; contrôle du type et de la taille avant envoi (confort, le backend fait foi). |
| Limite | URL Cloudinary publiques mais non devinables, comme les documents de l'inscription. Diffusion signée (`authenticated` + URL à durée limitée, déjà utilisée par le chat) à prévoir si besoin. |

