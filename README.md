# iobroker-sprinkling-gardena

Script zur Steuerung des 6-Fach Verteilers von Gardena ( https://amzn.to/3apYiGw ).
Das Script besteht aus 2 teilen, Beregnung_Planen.js ist für die automatische Bewässerung zuständig und Beregnung_Starten ist für die eigentliche Beregnung / das Starten und Stoppen der Beregnung zuständig.

Der Aufbau der Beregnungsanlage ist simpel, vor dem Zulauf des Verteilers wird ein Magnetventil geschalten. Dieses wird dann wiederrum per SmartPlug o.ä. ein- und ausgeschalten. Ich nutze dafür einen Sonoff Basic. Beim Magentventil sollte darauf geachtet werden, das dieses normal geschlossen ist ( NC ), so das im Falle eines Stromausfalls etc. der Zulauf geschlossen ist ( https://amzn.to/3Rlc9hO ).

# Konfiguration

###### Beregnung_starten.js

- ***const pfad*** = Der Pfad in dem die Objekte ( States ) angelegt werden.
- ***const device*** = Der zu schaltende State des Smart Plugs etc., vorgesehen ist eine Schaltung von true / false.
- ***const alive*** = Der Pfad zum Verbindungsstatus des Smart Plugs etc., vorgesehen ist Wert von true / false.

###### Beregnung_planen.js

- ***const pfad*** = Der Pfad in dem die Objekte ( States ) angelegt werden.
- ***const niederschlagsmenge*** = Bei Neiderschlag >= Wert, wird die Beregnung ausgesetzt / der Intervall zurückgesetzt.
- ***const niederschlag*** = Pfad zur Wettervorhersage bzgl. Niederschalgsmenge am jeweiligem Tag.

# Objekte und States

###### {PFAD}.Allgemein

- ***Aktiv:*** Gibt an, ob aktuell eine Beregnung aktiv ist.
- ***Automatik:*** Aktiviert und Deaktiviert die automatische Beregnung.
- ***Restlaufzeit:*** Gibt an, wie lange die aktuelle Beregnung noch läuft.

###### {PFAD}.Verteiler.1-6

- ***Bezeichnung:*** Eine Beschreibung des Kanals, z.B. zur Anzeige im VIS o.ä.
- ***Dauer:*** Dauer der Beregnung des jeweiligen Kanals
- ***Intervall:*** Anzahl der Tage nach denen die Beregnung starten soll.
- ***NaechsteBeregnung:*** Anzeige der noch zu wartenden Tage bis zur nächsten Beregnung.
- ***_Aktiv:*** Gibt an ob an dem Kanal etwas angeschlossen ist.
- ***_Warte:*** Gibt an ob eine Beregnung des jeweiligen Kanals aussteht.

###### {PFAD}.Verteiler.Allgemein

- ***Position:*** Der zuletzt angesteuerte Kanal.

# Features

- Unterschiedliche Laufzeiten für die einzelnen Kanäle.
- Automatische Beregnung nach x Tagen.
- Manuelles schalten der Beregnung.

# Support

Wenn euch meine Arbeit gefällt, würde ich mich über eine Spende auf Ko-Fi freuen. 
Vielen Dank.

https://ko-fi.com/tobstar27688
