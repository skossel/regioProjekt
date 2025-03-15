# Gym Workout Tracker

Gym Workout Tracker ist eine Desktop-Applikation zur Verwaltung von Gym Workouts, Übungen und Templates. Die Applikation basiert auf Electron, React, Material-UI und SQLite. Mit dieser Anwendung kannst du Workouts tracken, Übungen und Trainingsvorlagen (Templates) verwalten und anpassen.

## Features

- **Workout-Verwaltung:** Erstellen, Bearbeiten und Löschen von Workouts.
- **Übungs-Verwaltung:** Verwaltung von Übungen mit Details wie Name, Beschreibung und Typ.
- **Templates:** Erstellen von Trainingsvorlagen (z. B. Push, Pull, Leg Workout) mit einer definierten Reihenfolge von Übungen, inklusive Angabe von Sätzen und Wiederholungen.
- **Add/Edit Template Window:** Möglichkeit, Templates hinzuzufügen oder zu bearbeiten. Dabei werden mindestens ein Exercise, die Anzahl der Sätze und Wiederholungen benötigt. Jede Übung innerhalb eines Templates muss eindeutig sein.
- **Persistenz:** SQLite-Datenbank, die beim ersten Start aus den Ressourcen in ein beschreibbares Verzeichnis kopiert wird, sodass Daten auch nach Updates erhalten bleiben.

## Voraussetzungen

- Node.js (empfohlen Version 12 oder höher)
- npm

## Installation

1. Klone oder lade das Repository in ein Verzeichnis.
2. Gehe in den source Ordner und dann in den dist Ordner.
   a.) Dort kannst du die ausführbare .exe Datei finden.
