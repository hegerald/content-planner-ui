#!/usr/bin/env python3
"""Prüft ein Open-Knowledge-Format-Bundle (OKF v0.2).

Mindestanforderungen laut Spezifikation:
  1. Jede Konzeptdatei (.md außer index.md/log.md) hat parsebares YAML-Frontmatter.
  2. Jedes Frontmatter hat ein nicht-leeres `type`.
  3. index.md/log.md folgen ihrer Struktur.
Zusätzlich (strenger als die Spezifikation, unsere Teamregel):
  4. Interne Links zeigen auf existierende Dateien.

Aufruf: python3 scripts/check-okf.py docs/downstream/content-planner-backend
"""
import re
import sys
from pathlib import Path

LINK = re.compile(r"\[[^\]]*\]\(([^)\s]+)\)")
INDEX_ENTRY = re.compile(r"^\* \[[^\]]+\]\([^)]+\) - .+")


def frontmatter(text):
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---\n", 4)
    if end < 0:
        return None
    fields = {}
    for line in text[4:end].splitlines():
        m = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", line)
        if m:
            fields[m.group(1)] = m.group(2).strip().strip('"')
    return fields


def check(root: Path):
    errors = []
    for f in sorted(root.rglob("*.md")):
        rel = f.relative_to(root)
        text = f.read_text(encoding="utf-8")
        fm = frontmatter(text)
        if f.name == "index.md":
            if fm is not None and (f.parent != root or set(fm) - {"okf_version"}):
                errors.append(f"{rel}: index.md darf kein Frontmatter haben (Ausnahme: okf_version im Root)")
            body = text if fm is None else text.split("\n---\n", 1)[1]
            for line in body.splitlines():
                if line.startswith("* ") and not INDEX_ENTRY.match(line):
                    errors.append(f"{rel}: Eintrag nicht im Format '* [Titel](url) - Beschreibung': {line}")
        elif f.name == "log.md":
            if fm is not None:
                errors.append(f"{rel}: log.md hat kein Frontmatter")
            for line in text.splitlines():
                if line.startswith("## ") and not re.match(r"^## \d{4}-\d{2}-\d{2}$", line):
                    errors.append(f"{rel}: Überschrift muss '## YYYY-MM-DD' sein: {line}")
        else:
            if fm is None:
                errors.append(f"{rel}: Frontmatter fehlt")
            elif not fm.get("type"):
                errors.append(f"{rel}: Pflichtfeld 'type' fehlt")
        for target in LINK.findall(text):
            if re.match(r"^[a-z]+://", target) or target.startswith("#"):
                continue
            path = target.split("#")[0]
            resolved = root / path.lstrip("/") if path.startswith("/") else f.parent / path
            if not resolved.exists():
                errors.append(f"{rel}: Link ins Leere: {target}")
    return errors


if __name__ == "__main__":
    bundle = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    problems = check(bundle)
    for p in problems:
        print(f"FEHLER {p}")
    count = len(list(bundle.rglob("*.md")))
    print(f"{count} Dateien geprüft, {len(problems)} Fehler")
    sys.exit(1 if problems else 0)
