#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import platform
import subprocess
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from enum import Enum
from pathlib import Path
from threading import Thread
from time import sleep

import requests

KOPIA_PASSWORD_FILE = Path("/home/emily/.config/polybar/auth/kopia-nixie-password")
CONFIG_FILE = Path("/home/emily/.config/kopia/Nixie/config.json")
MAX_AGE = timedelta(hours=1, minutes=5)

LOADING_FRAMES = ["󱥸 ", "󱗼", "󱗿", "󱗽", "󱗾"]
LOADING_FRAMES = ["", "", "", "", "", ""]
DISABLED_COLOR = "%{F#696969}"
WAITING_COLOR = "%{F#EED49F}"
FAILED_COLOR = "%{F#ED8796}"
ERROR_ICON = "󰦜  "

SUCCESS_COLOR = "%{F#A6DA95}"
SUCCESS_ICON = "  "


class BackupStatus(Enum):
    waiting = 1
    ok = 2
    error = 3
    disabled = 4


@dataclass
class BackupResult:
    status: BackupStatus
    message: str


class BackupChecker(Thread):
    def __init__(self):
        super().__init__()
        self.result = BackupResult(BackupStatus.waiting, "initializing")
        self.error = None

        self.env = os.environ.copy()
        self.env["KOPIA_PASSWORD"] = KOPIA_PASSWORD_FILE.read_text().strip("\n")
        self.env["KOPIA_CONFIG_PATH"] = str(CONFIG_FILE)

    def run_command(self, cmd):
        """Run a kopia command with proper environment."""

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env=self.env
        )

        return result.stdout.strip()

    def run(self):
        """Thread entry point - check backup status."""
        try:
            is_active = self.run_command(["systemctl", "is-active", "kopia-nixie"])
            if is_active == "inactive":
                self.result.status = BackupStatus.disabled
                return

            retries = 0
            while retries < 15:
                try:
                    it = requests.get("https://127.0.0.1:8385", verify=False)
                    break
                except Exception as e:
                    retries += 1
                    sleep(1)
            else:
                self.result.status = BackupStatus.error
                self.result.message = "Server is offline"
                return

            output = self.run_command(["kopia", "snapshot", "list", "--json", "--incomplete", ])
            hostname = platform.node().lower()

            snapshots = [it for it in json.loads(output) if it["source"]["host"] == hostname]
            if not snapshots:
                self.result = BackupResult(BackupStatus.error, "No snapshots found")
                return

            sources = {}
            for snapshot in snapshots:
                source = snapshot["source"]["path"]
                snapshot_time = datetime.fromisoformat(snapshot["startTime"])

                # Keep only the most recent snapshot per source
                if source not in sources or snapshot_time > sources[source]:
                    sources[source] = snapshot_time

            # Check if all sources are up to date
            num_outdated = 0
            now = datetime.now(timezone.utc)

            for source, last_backup in sources.items():
                age = now - last_backup
                if age > MAX_AGE:
                    num_outdated += 1

            if num_outdated:
                self.result.status = BackupStatus.error
                self.result.message = f"{num_outdated} / {len(sources)} outdated"
            else:
                self.result.status = BackupStatus.ok
                self.result.message = ""


        except Exception as e:
            self.result.status = BackupStatus.error
            self.result.message = f"Exception – {e}"


def main():
    checker = BackupChecker()
    checker.start()

    frame_idx = 0
    while checker.is_alive():
        print(f"{WAITING_COLOR}{SUCCESS_ICON}Backup {LOADING_FRAMES[frame_idx]}", flush=True)
        frame_idx = (frame_idx + 1) % len(LOADING_FRAMES)
        checker.join(timeout=0.15)

    match checker.result.status:
        case BackupStatus.ok:
            print(f"{SUCCESS_COLOR}{SUCCESS_ICON}Backup", end="")
        case BackupStatus.waiting:
            print("")  # Should never happen
        case BackupStatus.error:
            print(f"{FAILED_COLOR}{ERROR_ICON}Backup: {checker.result.message}", end="")
        case BackupStatus.disabled:
            print(f"{DISABLED_COLOR}{ERROR_ICON}Backup", end="")


if __name__ == "__main__":
    main()
