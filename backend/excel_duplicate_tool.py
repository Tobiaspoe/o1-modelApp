"""Utility to detect and visualize duplicate rows in an Excel sheet."""
import argparse
from pathlib import Path
from typing import Iterable, List, Optional, Sequence, Tuple

import matplotlib.pyplot as plt
import pandas as pd
from openpyxl.styles import PatternFill


DuplicateSummary = pd.DataFrame


def load_excel_table(path: Path, sheet: Optional[str] = None) -> pd.DataFrame:
    """Load an Excel sheet into a DataFrame.

    Args:
        path: Path to the Excel workbook.
        sheet: Sheet name to load. If None, the first sheet is used.

    Returns:
        DataFrame containing the sheet data.
    """
    return pd.read_excel(path, sheet_name=sheet)


def detect_duplicates(
    table: pd.DataFrame, subset: Optional[Sequence[str]] = None
) -> Tuple[pd.DataFrame, DuplicateSummary]:
    """Detect duplicate rows and build a summary table.

    Args:
        table: Source DataFrame.
        subset: Columns to consider for duplicate detection. If None, all columns are used.

    Returns:
        A tuple containing:
            * A DataFrame with duplicate markers and grouping keys.
            * A summary DataFrame describing duplicate groups and their counts.
    """
    duplicate_mask = table.duplicated(subset=subset, keep=False)
    subset_columns: List[str] = list(subset) if subset is not None else list(table.columns)
    group_key = (
        table[subset_columns]
        .astype(str)
        .agg(" | ".join, axis=1)
        .where(lambda s: s.str.strip() != "", other="<empty>")
    )

    annotated = table.copy()
    annotated.insert(0, "duplicate_flag", duplicate_mask)
    annotated.insert(1, "duplicate_key", group_key)

    summary = (
        annotated.loc[annotated["duplicate_flag"]]
        .groupby("duplicate_key")
        .size()
        .reset_index(name="occurrences")
        .sort_values("occurrences", ascending=False)
    )
    return annotated, summary


def _apply_row_highlights(sheet, duplicate_flags: Iterable[bool], num_columns: int) -> None:
    """Apply a highlight fill to rows marked as duplicates."""
    duplicate_fill = PatternFill(fill_type="solid", start_color="FFF8CBad", end_color="FFF8CBad")
    start_row = 2  # header occupies first row
    for offset, is_duplicate in enumerate(duplicate_flags):
        if not is_duplicate:
            continue
        row_index = start_row + offset
        for col_index in range(1, num_columns + 1):
            sheet.cell(row=row_index, column=col_index).fill = duplicate_fill


def export_results(
    annotated: pd.DataFrame,
    summary: DuplicateSummary,
    excel_path: Path,
    summary_image_path: Optional[Path] = None,
) -> None:
    """Save annotated data to Excel and optionally plot a summary image."""
    excel_path.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(excel_path, engine="openpyxl") as writer:
        annotated.to_excel(writer, sheet_name="data", index=False)
        summary.to_excel(writer, sheet_name="duplicate_summary", index=False)

        data_sheet = writer.sheets["data"]
        _apply_row_highlights(
            data_sheet,
            duplicate_flags=annotated["duplicate_flag"],
            num_columns=len(annotated.columns),
        )

    if summary_image_path is not None:
        if summary.empty:
            # Create an informative placeholder when no duplicates are present.
            plt.figure(figsize=(6, 4))
            plt.text(0.5, 0.5, "Keine Duplikate gefunden", ha="center", va="center", fontsize=14)
            plt.axis("off")
        else:
            plt.figure(figsize=(8, 4))
            top_summary = summary.head(10)
            plt.barh(top_summary["duplicate_key"], top_summary["occurrences"], color="#4C78A8")
            plt.xlabel("Anzahl der Vorkommen")
            plt.ylabel("Duplikatschlüssel")
            plt.title("Top 10 Duplikatgruppen")
            plt.tight_layout()
        summary_image_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(summary_image_path, dpi=200)
        plt.close()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Finde und visualisiere Duplikate in einer Excel-Datei."
    )
    parser.add_argument("input", type=Path, help="Pfad zur Excel-Datei (.xlsx).")
    parser.add_argument(
        "--sheet",
        type=str,
        default=None,
        help="Tabellenblatt, das untersucht werden soll. Standard: erstes Blatt.",
    )
    parser.add_argument(
        "--subset",
        type=str,
        default=None,
        help=(
            "Kommagetrennte Liste von Spaltennamen, die für die Duplikatsuche herangezogen werden. "
            "Standard: alle Spalten."
        ),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Zielpfad für die annotierte Excel-Datei. Standard: <input>_annotated.xlsx",
    )
    parser.add_argument(
        "--summary-image",
        type=Path,
        default=None,
        help="Pfad für eine PNG-Grafik mit der Duplikatsübersicht.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    subset_columns = args.subset.split(",") if args.subset else None

    annotated, summary = detect_duplicates(
        load_excel_table(args.input, sheet=args.sheet),
        subset=subset_columns,
    )

    output_excel = args.output or args.input.with_name(f"{args.input.stem}_annotated.xlsx")
    summary_image_path = args.summary_image or args.input.with_name(
        f"{args.input.stem}_duplicate_summary.png"
    )

    export_results(
        annotated=annotated,
        summary=summary,
        excel_path=output_excel,
        summary_image_path=summary_image_path,
    )

    print(f"Analysierte Zeilen: {len(annotated)}")
    print(f"Duplikatgruppen: {len(summary)}")
    print(f"Ergebnisdatei: {output_excel}")
    if summary_image_path:
        print(f"Übersichtsgrafik: {summary_image_path}")


if __name__ == "__main__":
    main()
