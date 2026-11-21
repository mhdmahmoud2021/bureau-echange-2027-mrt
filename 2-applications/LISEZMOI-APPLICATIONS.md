# Applications Bureau d'Échange — Android, iPhone, PC, Mac

Les applications utilisent **exactement le même logiciel** que ton site
(`1-site-web/site`) et le **même compte Supabase** : un client peut travailler
sur son téléphone et son PC, ses données sont les mêmes partout.

Il y a deux façons d'avoir le logiciel sur un appareil.

---

## Façon 1 — tout de suite, sans rien fabriquer (recommandé pour commencer)

Une fois le dossier `site` en ligne (Netlify), ouvre le site puis :

| Appareil | Comment l'installer |
|---|---|
| **Android** (Chrome) | Mon compte → **Installer l'application** (ou menu ⋮ → *Installer l'application*) |
| **iPhone / iPad** (Safari) | Bouton **Partager** → *Sur l'écran d'accueil* |
| **PC Windows** (Chrome / Edge) | Icône ⊕ dans la barre d'adresse → *Installer* |
| **Mac** (Chrome / Edge, ou Safari 17+) | ⊕ dans la barre d'adresse, ou Safari → Fichier → *Ajouter au Dock* |

Le logiciel s'ouvre alors comme une vraie application (icône, plein écran),
et se met à jour tout seul chaque fois que tu changes le site.

---

## Façon 2 — de vrais fichiers d'installation (.apk, .exe, .dmg)

Ton ordinateur n'a besoin de rien : **GitHub les fabrique gratuitement pour toi.**

1. Crée un compte sur **github.com** (gratuit).
2. Crée un nouveau dépôt **privé** (Private !) nommé par ex. `bureau-echange`.
3. Mets dedans ces dossiers du paquet (bouton *Add file → Upload files*,
   glisse-les) :
   - `.github`  (dossier caché : sur Mac fais Cmd+Maj+. pour le voir,
     sur Windows : Affichage → Éléments masqués)
   - `1-site-web`
   - `2-applications`

   ⚠️ **Ne mets jamais** `3-mes-donnees` sur GitHub.
4. Avant d'envoyer : ouvre `1-site-web/site/config.js` et écris l'adresse
   de ton site dans `SITE_URL` (ex. `'https://bureau-echange.netlify.app/'`),
   pour que les liens des e-mails ouvrent le site.
5. Onglet **Actions** → *Applications Bureau d'Échange* → **Run workflow**.
6. Attends 10 à 15 minutes. En bas de la page du travail terminé tu trouves :
   - **Android-APK** → `Bureau-Echange.apk`
   - **Windows-PC** → `Bureau d'Echange Setup 1.3.0.exe`
   - **Mac** → `Bureau d'Echange-1.3.0-universal.dmg`

Chaque fois que tu modifies le site, refais l'étape 5 pour avoir les
applications à jour.

### Installer
- **Android** : envoie l'APK sur le téléphone (WhatsApp, câble…), ouvre-le,
  autorise *« Installer des applis inconnues »*.
- **Windows** : lance le `.exe`. Si « Windows a protégé votre ordinateur »
  s'affiche : *Informations complémentaires → Exécuter quand même*
  (normal : l'application n'est pas signée par Microsoft).
- **Mac** : ouvre le `.dmg`, glisse l'application dans *Applications*.
  La 1ʳᵉ fois : **clic droit → Ouvrir → Ouvrir** (non signée par Apple).

### iPhone en fichier (App Store)
Apple n'autorise pas l'installation d'un fichier comme sur Android.
Il faut un **Mac avec Xcode** :
```
cd 2-applications
npm install
npm run ios          (la 1ʳᵉ fois avant : npx cap add ios)
npx cap open ios
```
Dans Xcode : choisis ton Apple ID dans *Signing & Capabilities*, branche
l'iPhone, bouton ▶. Pour le **App Store** (ou TestFlight), il faut le compte
Apple Developer (99 $/an). Pour vendre au Google Play : compte Google Play
Console (25 $ une fois) et un APK/AAB signé.
**En attendant, la Façon 1 marche très bien sur iPhone.**

---

## Bon à savoir
- Connexion internet nécessaire pour se connecter et synchroniser
  (comme le site). Les opérations faites hors ligne partent dès le retour du réseau.
- Sur l'**APK Android**, le bouton « télécharger une sauvegarde / PDF »
  peut ne pas enregistrer le fichier : fais tes sauvegardes depuis le site
  ou l'application PC.
- La clé dans `config.js` est la clé **publique** : c'est normal qu'elle soit
  dans l'application. La clé secrète Supabase ne doit **jamais** y être.

## Pour un informaticien (fichiers)
- `scripts/prepare-www.js` : copie `../1-site-web/site` dans `www/`,
  met les bibliothèques en local, retire le service worker.
- `electron/main.js` : application PC/Mac (Electron), liens externes → navigateur.
- `capacitor.config.json` : Android / iOS (Capacitor 6), identifiant `app.bureauechange`.
- `npm run pc` : lancer l'application PC pour tester.
