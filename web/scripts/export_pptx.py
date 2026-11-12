"""Export the web presentation deck to a .pptx (screenshots + speaker notes).

Usage (from web/):  python scripts/export_pptx.py
Requires: Google Chrome/Edge installed, python-pptx, Pillow.
"""
import json
import os
import socket
import subprocess
import sys
import time
from pathlib import Path

WEB = Path(__file__).resolve().parents[1]
OUT = WEB / "out"
SHOTS = WEB / ".export" / "screenshots"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not Path(CHROME).exists():
    CHROME = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

TOTAL = 29
PORT = 8765


def wait_port(port, timeout=20):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=1):
                return True
        except OSError:
            time.sleep(0.5)
    return False


def capture():
    SHOTS.mkdir(parents=True, exist_ok=True)
    # clean old
    for f in SHOTS.glob("slide_*.png"):
        f.unlink()
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT)],
        cwd=str(OUT),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        if not wait_port(PORT):
            raise RuntimeError("http server did not start")
        for i in range(1, TOTAL + 1):
            dest = SHOTS / f"slide_{i:02d}.png"
            url = f"http://localhost:{PORT}/presentation/?slide={i}"
            args = [
                CHROME,
                "--headless=new",
                "--disable-gpu",
                f"--window-size=1920,1080",
                "--virtual-time-budget=6000",
                "--hide-scrollbars",
                f"--screenshot={dest}",
                url,
            ]
            print(f"Capturing slide {i}/{TOTAL} ...")
            subprocess.run(args, check=True, timeout=60)
            # small pause to ensure file flush
            time.sleep(0.8)
    finally:
        server.terminate()
        try:
            server.wait(timeout=10)
        except subprocess.TimeoutExpired:
            server.kill()


def build_pptx():
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.enum.text import PP_ALIGN

    repo_notes = WEB / "scripts" / "notes.json"
    notes = json.loads(repo_notes.read_text(encoding="utf-8"))

    prs = Presentation()
    # 16:9
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank = prs.slide_layouts[6]
    for i in range(1, TOTAL + 1):
        slide = prs.slides.add_slide(blank)
        img = SHOTS / f"slide_{i:02d}.png"
        slide.shapes.add_picture(str(img), Inches(0), Inches(0), width=prs.slide_width, height=prs.slide_height)
        # notes
        if i - 1 < len(notes):
            tf = slide.notes_slide.notes_text_frame
            tf.text = notes[i - 1]

    out_path = OUT / "deep-aero-sn.pptx"
    prs.save(str(out_path))
    # also copy to public
    public = WEB / "public" / "deep-aero-sn.pptx"
    try:
        import shutil
        shutil.copy2(out_path, public)
    except Exception as e:
        print("copy to public failed:", e)
    print("Saved", out_path)


if __name__ == "__main__":
    capture()
    build_pptx()