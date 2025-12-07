# Excel-Duplikate-Skript

Das Skript [`excel_duplicate_tool.py`](./excel_duplicate_tool.py) sucht nach Duplikaten in einer Excel-Tabelle, markiert sie und erstellt auf Wunsch eine Grafik mit den häufigsten Duplikatgruppen.

## Voraussetzungen

Installiere die Python-Abhängigkeiten (am besten in einem virtuellen Environment):

```bash
pip install -r requirements.txt
```

## Nutzung

```bash
python excel_duplicate_tool.py <pfad/zur/datei.xlsx> \
  --sheet "Tabelle1" \
  --subset "SpalteA,SpalteB" \
  --output "annotiert.xlsx" \
  --summary-image "duplikate.png"
```

- **`--sheet`**: Name des Tabellenblatts. Fehlt die Angabe, wird das erste Blatt geladen.
- **`--subset`**: Kommagetrennte Liste von Spaltennamen, die für die Duplikatsuche verwendet werden sollen. Ohne Angabe werden alle Spalten herangezogen.
- **`--output`**: Zieldatei für die annotierte Excel-Datei. Standard ist `<input>_annotated.xlsx` neben der Quelldatei.
- **`--summary-image`**: Pfad für die PNG-Grafik mit der Top-10-Übersicht der Duplikate. Standard ist `<input>_duplicate_summary.png`.

Die Excel-Ausgabe enthält:

- Eine Spalte `duplicate_flag`, die angibt, ob die Zeile ein Duplikat ist.
- Eine Spalte `duplicate_key`, die den Vergleichsschlüssel darstellt.
- Farblich hervorgehobene Zeilen für gefundene Duplikate.
- Ein zweites Tabellenblatt `duplicate_summary` mit Gruppierungen und Häufigkeiten.

Die PNG-Grafik zeigt die häufigsten Duplikatgruppen als horizontales Balkendiagramm. Wenn keine Duplikate gefunden werden, enthält sie einen entsprechenden Hinweis.
